import { Response } from 'express';

class SseService {
  private clients: Set<Response> = new Set();

  addClient(res: Response) {
    this.clients.add(res);
  }

  removeClient(res: Response) {
    this.clients.delete(res);
  }

  notifyAll(data: object) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach(client => client.write(payload));
  }
}

export const sseService = new SseService();