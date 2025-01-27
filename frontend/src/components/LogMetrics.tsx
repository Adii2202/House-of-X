import { useState } from "react";
import { useLogs } from "../hooks/useLogs";

const LogList = ({
  startTime,
  endTime,
}: {
  startTime: Date;
  endTime: Date;
}) => {
  const [logType, setLogType] = useState<string>("all");
  const { data, isLoading, error } = useLogs(startTime, endTime);

  const filteredLogs =
    logType === "all" ? data : data.filter((log: any) => log.type === logType);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLogType(e.target.value);
  };

  if (isLoading)
    return <p className="text-center text-gray-600">Loading logs...</p>;
  if (error instanceof Error)
    return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="logType" className="text-lg font-semibold">
          Filter by Type:
        </label>
        <select
          id="logType"
          onChange={handleTypeChange}
          value={logType}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="error">Error</option>
          <option value="info">Info</option>
          <option value="verbose">Verbose</option>
        </select>
      </div>

      <ul className="space-y-2">
        {filteredLogs.map((log: any) => (
          <li
            key={log.id}
            className="flex justify-between items-center p-4 border rounded-md shadow-sm"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">{log.timestamp}</span>
              <span className="text-md font-medium text-gray-900">
                {log.message}
              </span>
              <span
                className={`text-xs font-bold ${
                  log.type === "error"
                    ? "text-red-500"
                    : log.type === "info"
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {log.type}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogList;
