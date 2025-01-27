import { useQuery } from '@tanstack/react-query';
import { fetchLogs } from '../api/logApi';

export const useLogs = (startTime: Date, endTime: Date) => {
  return useQuery({
    queryKey: ['logs', startTime, endTime], 
    queryFn: () => fetchLogs(startTime, endTime)});
};
