import { Request, Response } from 'express';
import { LogModel } from '../models/log_model';
import { logSchema, timeRangeSchema } from '../validators/log_validator';
import WebSocket from 'ws';
import PdfPrinter from 'pdfmake';
import { LogMetrics, LogSummary } from '../types/index';

export class LogController {
  private wss: WebSocket.Server;

  constructor(wss: WebSocket.Server) {
    this.wss = wss;
  }

  generateReport = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch logs, metrics, and summary
      const logs = await LogModel.findInTimeRange(new Date("2023-01-01"), new Date()); // You can pass params here
      const metrics = await LogModel.getMetrics();
      const summary: LogSummary = await LogModel.getSummary();

      // Prepare PDF content
      const docDefinition = this.getPdfDocDefinition(logs, metrics, summary);

      // Create PDF with pdfmake
      const printer = new PdfPrinter({});
      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      // Set up correct response headers for the PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=log_report.pdf');

      // Pipe the PDF output to the response
      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  private getPdfDocDefinition(logs: any[], metrics: LogMetrics[], summary: LogSummary) {
    const logRows = logs.map(log => [log.timestamp, log.type, log.message]);
    const metricsRows = metrics.map(metric => [metric.type, metric.count]);

    return {
      content: [
        { text: 'Logs Report', style: 'header' },
        { text: `Generated on: ${new Date().toLocaleString()}`, style: 'subheader' },

        { text: 'Logs', style: 'sectionHeader' },
        {
          table: {
            body: [
              ['Timestamp', 'Type', 'Message'],
              ...logRows,
            ],
          },
        },

        { text: 'Metrics', style: 'sectionHeader' },
        {
          table: {
            body: [
              ['Log Type', 'Count'],
              ...metricsRows,
            ],
          },
        },

        { text: 'Summary', style: 'sectionHeader' },
        {
          table: {
            body: [
              ['Total Logs', 'Error Logs', 'Info Logs', 'Verbose Logs', 'Last Log'],
              [summary.totalLogs, summary.errorCount, summary.infoCount, summary.verboseCount, summary.lastLogTimestamp],
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, marginBottom: 10 },
        subheader: { fontSize: 12, marginBottom: 15 },
        sectionHeader: { fontSize: 14, bold: true, marginTop: 20, marginBottom: 10 },
      },
    };
  }

  createLog = async (req: Request, res: Response): Promise<any> => {
    try {
      const { error, value } = logSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const result = await LogModel.create(value);

      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'NEW_LOG', data: value }));
        }
      });

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getLogs = async (req: Request, res: Response): Promise<any> => {
    try {
      const { error, value } = timeRangeSchema.validate(req.query);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const logs = await LogModel.findInTimeRange(value.startTime, value.endTime);
      res.json(logs.reverse());
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  searchLogs = async (req: Request, res: Response): Promise<any> => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Invalid query parameter' });
      }

      const logs = await LogModel.search(query);
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getMetrics = async (req: Request, res: Response) => {
    try {
      const metrics = await LogModel.getMetrics();
      res.json(metrics);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getSummary = async (req: Request, res: Response) => {
    try {
      const summary = await LogModel.getSummary();
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

