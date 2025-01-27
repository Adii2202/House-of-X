import { Router } from 'express';
import { LogController } from '../controllers/log_controller';
import WebSocket from 'ws';

export function createLogRouter(wss: WebSocket.Server) {
  const router = Router();
  const logController = new LogController(wss);

  router.post('/', logController.createLog);
  router.get('/', logController.getLogs);
  router.get('/search', logController.searchLogs);
  router.get('/metrics', logController.getMetrics);
  router.get('/summary', logController.getSummary);
  router.get('/report', logController.generateReport);
  return router;
}