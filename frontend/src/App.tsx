import { useState } from "react";
import axios from "axios";
import LogForm from "./components/LogFrom";
import LogMetrics from "./components/LogMetrics";
import LogSummary from "./components/LogSummary";

const App = () => {
  const [startTime, setStartTime] = useState(new Date("2023-01-01"));
  const [endTime, setEndTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState<any[]>([]);

  const downloadReport = async () => {
    try {
      const response = await axios.get("/api/logs/report", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "log_report.pdf";
      link.click();
    } catch (error) {
      console.error("Error downloading the report:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/logs/search",
        {
          params: { query: searchQuery },
        }
      );
      setLogs(data);
    } catch (error) {
      console.error("Error searching logs", error);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full px-8 py-8">
        <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-12">
          Log Management Dashboard
        </h1>

        <div className="mb-10">
          <LogForm />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
          <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">
            Search Logs
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="px-4 py-3 w-full md:w-3/4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-all"
            >
              Search
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
          <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">
            Search Results
          </h2>
          {logs.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log, index) => (
                <li
                  key={index}
                  className="px-6 py-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition-all"
                >
                  <span className="font-medium text-gray-800">
                    {log.message}
                  </span>{" "}
                  - <span className="text-gray-600">{log.type}</span> -{" "}
                  <span className="text-gray-500">{log.timestamp}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">No results found.</p>
          )}
        </div>

        <LogMetrics startTime={startTime} endTime={endTime} />
        <LogSummary />

        <div className="text-center">
          <button
            onClick={downloadReport}
            className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
