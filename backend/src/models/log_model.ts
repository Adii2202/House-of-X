import db from '../knex';
import { Log, LogMetrics, LogSummary } from '../types/index';

export const LogModel = {
  async create(log: Omit<Log, 'id'>) {
    return db('logs').insert(log);
  },

  async findInTimeRange(startTime: Date, endTime: Date) {
    return db('logs')
      .whereBetween('timestamp', [startTime, endTime])
      .orderBy('timestamp', 'desc');
  },

  async search(query: string) {
    return db('logs')
      .where('message', 'like', `%${query}%`)
      .orderBy('timestamp', 'desc');
  },

  async getMetrics(): Promise<LogMetrics[]> {
    return db('logs')
      .select('type')
      .count('* as count')
      .groupBy('type');
  },

  async getSummary(): Promise<LogSummary> {
    const metrics = await db('logs')
      .select(
        db.raw('COUNT(*) as totalLogs'),
        db.raw("SUM(CASE WHEN type = 'error' THEN 1 ELSE 0 END) as errorCount"),
        db.raw("SUM(CASE WHEN type = 'info' THEN 1 ELSE 0 END) as infoCount"),
        db.raw("SUM(CASE WHEN type = 'verbose' THEN 1 ELSE 0 END) as verboseCount"),
        db.raw('MAX(timestamp) as lastLogTimestamp')
      )
      .first();
    return metrics;
  }
};