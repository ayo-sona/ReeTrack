import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { INestApplication } from '@nestjs/common';

export class SocketIoAdapter extends IoAdapter {
  constructor(private appRef: INestApplication) {
    super(appRef);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: ['http://localhost:3000', 'https://www.reetrack.com'],
        credentials: true,
      },
      allowEIO3: false, // ✅ EIO4 only (matches your client's EIO=4)
      transports: ['polling', 'websocket'],
      path: '/socket.io', // ✅ Explicit path
    });

    return server;
  }
}
