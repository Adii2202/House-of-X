import { useQuery } from '@tanstack/react-query';
import { fetchSummary } from '../api/logApi';

export const useSummary = () => {
  return useQuery({
    queryKey: ['summary'], 
    queryFn: fetchSummary});
};
