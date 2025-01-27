export interface Log {
    id: number;
    message: string;
    type: 'error' | 'info' | 'verbose';
    timestamp: Date;
  }
  
  export interface LogMetrics {
    type: string;
    count: number;
  }
  
  export interface LogSummary {
    totalLogs: number;
    errorCount: number;
    infoCount: number;
    verboseCount: number;
    lastLogTimestamp: Date;
  }
  