import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsAuthGuard } from './guards/ws-auth.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/subscriptions',
})
@Injectable()
export class SubscriptionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SubscriptionGateway.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Get token from handshake auth or query params
      const token = client.handshake.auth.token || client.handshake.query.token;

      if (!token) {
        this.logger.warn(
          `Client ${client.id} connected without token, disconnecting...`,
        );
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Join organization-specific room
      const room = `org:${payload.organizationId}`;
      client.join(room);

      // Store user data on client
      client.data = {
        userId: payload.sub,
        organizationId: payload.organizationId,
        email: payload.email,
      };

      this.logger.log(`Client ${client.id} connected to room ${room}`);

      // Send welcome message to client
      client.emit('connected', {
        message: 'Connected to subscription updates',
        organizationId: payload.organizationId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to authenticate client ${client.id}:`,
        error.message,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const { userId, organizationId } = client.data || {};
    this.logger.log(
      `Client ${client.id} disconnected (User: ${userId}, Org: ${organizationId})`,
    );
    // Socket.io handles room cleanup automatically
  }

  // Handle client subscribing to specific events
  @SubscribeMessage('subscribe:subscription')
  async handleSubscriptionSubscribe(
    @MessageBody() data: { subscriptionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { organizationId } = client.data || {};
    if (!organizationId) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    // Join subscription-specific room
    const room = `subscription:${data.subscriptionId}`;
    client.join(room);

    this.logger.log(`Client ${client.id} subscribed to ${room}`);
    client.emit('subscribed', { room: data.subscriptionId });
  }

  // Handle client unsubscribing from events
  @SubscribeMessage('unsubscribe:subscription')
  async handleSubscriptionUnsubscribe(
    @MessageBody() data: { subscriptionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `subscription:${data.subscriptionId}`;
    client.leave(room);

    this.logger.log(`Client ${client.id} unsubscribed from ${room}`);
    client.emit('unsubscribed', { room: data.subscriptionId });
  }

  // Notification methods called by services

  /**
   * Notify organization about plan upgrade
   */
  notifyPlanUpgrade(organizationId: string, newPlan: string) {
    this.server.to(`org:${organizationId}`).emit('plan:upgraded', {
      newPlan,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Notified org ${organizationId} about plan upgrade to ${newPlan}`,
    );
  }

  /**
   * Notify organization about plan downgrade
   */
  notifyPlanDowngrade(organizationId: string, newPlan: string) {
    this.server.to(`org:${organizationId}`).emit('plan:downgraded', {
      newPlan,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Notified org ${organizationId} about plan downgrade to ${newPlan}`,
    );
  }

  /**
   * Notify organization about plan expiration
   */
  notifyPlanExpired(organizationId: string, fallbackPlan?: string) {
    this.server.to(`org:${organizationId}`).emit('plan:expired', {
      fallbackPlan: fallbackPlan || 'BASIC',
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Notified org ${organizationId} about plan expiration`);
  }

  /**
   * Notify about subscription status change
   */
  notifySubscriptionStatusChange(
    organizationId: string,
    subscriptionId: string,
    status: string,
    metadata?: any,
  ) {
    // Notify organization room
    this.server
      .to(`org:${organizationId}`)
      .emit('subscription:status_changed', {
        subscriptionId,
        status,
        metadata,
        timestamp: new Date().toISOString(),
      });

    // Notify specific subscription room if anyone is subscribed
    this.server
      .to(`subscription:${subscriptionId}`)
      .emit('subscription:status_changed', {
        subscriptionId,
        status,
        metadata,
        timestamp: new Date().toISOString(),
      });

    this.logger.log(
      `Notified org ${organizationId} about subscription ${subscriptionId} status change to ${status}`,
    );
  }

  /**
   * Notify about payment events
   */
  notifyPaymentEvent(
    organizationId: string,
    subscriptionId: string,
    eventType: 'success' | 'failed' | 'reminder',
    data: any,
  ) {
    this.server.to(`org:${organizationId}`).emit(`payment:${eventType}`, {
      subscriptionId,
      ...data,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Notified org ${organizationId} about payment ${eventType} for subscription ${subscriptionId}`,
    );
  }

  /**
   * Notify about member subscription events
   */
  notifyMemberSubscriptionEvent(
    organizationId: string,
    eventType: 'created' | 'updated' | 'cancelled' | 'expired',
    data: any,
  ) {
    this.server
      .to(`org:${organizationId}`)
      .emit(`member_subscription:${eventType}`, {
        ...data,
        timestamp: new Date().toISOString(),
      });

    this.logger.log(
      `Notified org ${organizationId} about member subscription ${eventType}`,
    );
  }

  /**
   * Notify about invoice events
   */
  notifyInvoiceEvent(
    organizationId: string,
    eventType: 'created' | 'paid' | 'overdue',
    data: any,
  ) {
    this.server.to(`org:${organizationId}`).emit(`invoice:${eventType}`, {
      ...data,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Notified org ${organizationId} about invoice ${eventType}`,
    );
  }

  /**
   * Get connected clients count for an organization
   */
  getConnectedClientsCount(organizationId: string): number {
    const room = this.server.sockets.adapter.rooms.get(`org:${organizationId}`);
    return room ? room.size : 0;
  }

  /**
   * Broadcast message to all connected clients in an organization
   */
  broadcastToOrganization(organizationId: string, event: string, data: any) {
    this.server.to(`org:${organizationId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Broadcasted event ${event} to org ${organizationId}`);
  }
}
