import { useSummary } from "../hooks/useSummary";

const LogSummary = () => {
  const { data, isLoading, error } = useSummary();

  if (isLoading)
    return <p className="text-center text-gray-600 mt-4">Loading summary...</p>;
  if (error instanceof Error)
    return <p className="text-center text-red-500 mt-4">{error.message}</p>;

  return (
    <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Log Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">Total Logs:</span>
          <span className="text-lg font-bold text-gray-900">
            {data.totalLogs}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">Error Logs:</span>
          <span className="text-lg font-bold text-red-600">
            {data.errorCount}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">Info Logs:</span>
          <span className="text-lg font-bold text-blue-600">
            {data.infoCount}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">Verbose Logs:</span>
          <span className="text-lg font-bold text-green-600">
            {data.verboseCount}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span className="font-medium">Last Log Timestamp:</span>
          <span className="text-lg font-bold text-gray-900">
            {data.lastLogTimestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogSummary;
