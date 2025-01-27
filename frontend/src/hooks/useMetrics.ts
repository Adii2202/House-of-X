import { useQuery } from '@tanstack/react-query';
import { fetchMetrics } from '../api/logApi';

export const useMetrics = () => {
  return useQuery({
    queryKey: ['metrics'], 
    queryFn: fetchMetrics});
};
