import { Request, Response } from 'express';
import { sseService } from '../services/sse.service';

export const sseEvents = (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseService.addClient(res);

  req.on('close', () => {
    sseService.removeClient(res);
  });
};