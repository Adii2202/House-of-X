import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLog } from "../api/logApi";

interface LogData {
  message: string;
  type: "error" | "info" | "verbose";
}

const LogForm = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"error" | "info" | "verbose">("error");
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, LogData>({
    mutationFn: createLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ message, type });
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-8 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a Log</h2>

      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="message"
        >
          Log Message
        </label>
        <input
          type="text"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter log message"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="type"
        >
          Log Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) =>
            setType(e.target.value as "error" | "info" | "verbose")
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="error">Error</option>
          <option value="info">Info</option>
          <option value="verbose">Verbose</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={mutation.status === "pending"}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {mutation.status === "pending" ? "Creating Log..." : "Create Log"}
      </button>

      {mutation.isError && (
        <p className="text-red-500 text-sm mt-2">{mutation.error?.message}</p>
      )}
    </form>
  );
};

export default LogForm;
