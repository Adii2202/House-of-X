import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

interface Log {
  id: number;
  message: string;
  type: string;
  timestamp: string;
}

const fetchLogs = async (query: string) => {
  const { data } = await axios.get(`/api/logs/search?query=${query}`);
  return data;
};

const SearchLogs: React.FC = () => {
  const [query, setQuery] = useState("");
  const {
    data: logs,
    isLoading,
    error,
  } = useQuery<Log[], Error>(
    ["searchLogs", query],
    () => fetchLogs(query),
    { enabled: query.length > 0 }
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <h2>Search Logs</h2>
      <input
        type="text"
        placeholder="Enter search query"
        value={query}
        onChange={handleChange}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading logs: {error.message}</p>}
      <div>
        {logs && logs.length > 0 ? (
          <ul>
            {logs.map((log) => (
              <li key={log.id}>
                <strong>{log.type}</strong> - {log.message} -{" "}
                <em>{log.timestamp}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p>No logs found</p>
        )}
      </div>
    </div>
  );
};

export default SearchLogs;
