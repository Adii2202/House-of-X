import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/logs',
});

export const fetchLogs = async (startTime: Date, endTime: Date) => {
  const { data } = await api.get('/', {
    params: { startTime, endTime },
  });
  return data;
};

export const searchLogs = async (query: string) => {
  const { data } = await api.get('/search', { params: { query } });
  return data;
};

export const createLog = async (log: { message: string; type: string }): Promise<void> => {
  const { data } = await api.post('/', log);
  return data;
};

export const fetchMetrics = async () => {
  const { data } = await api.get('/metrics');
  return data;
};

export const fetchSummary = async () => {
  const { data } = await api.get('/summary');
  return data;
};
