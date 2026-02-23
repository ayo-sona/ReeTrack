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
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsAuthGuard } from './guards/ws-auth.guard';

@WebSocketGateway({
  // cors: {
  //   // origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  //   origin: 'http://localhost:3000',
  //   // origin: this.configService.get('frontend.url') || 'http://localhost:3000',
  //   // origin: "https://www.reetrack.com",
  //   credentials: true,
  // },
  // transports: ['websocket', 'pooling'],
  namespace: '/subscriptions',
})
@Injectable()
export class SubscriptionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SubscriptionGateway.name);

  constructor(private configService: ConfigService) {}

  // NestJs calls this function when a client connects to the subscriptions namespace
  async handleConnection(client: Socket) {
    // Allow all connections initially - authentication will be handled by guards on specific events
    this.logger.log(`Client ${client.id} connected to subscriptions namespace`);
    // console.log(process.env.FRONTEND_URL)
    // Send welcome message
    client.emit('connected', {
      message: 'Connected to subscription updates namespace',
      namespace: '/subscriptions',
    });
  }

  // NestJs calls this function when a client disconnects from the subscriptions namespace
  handleDisconnect(client: Socket) {
    const { userId, organizationId } = client.data || {};
    this.logger.log(
      `Client ${client.id} disconnected (User: ${userId}, Org: ${organizationId})`,
    );
    // Socket.io handles room cleanup automatically
  }

  // Handle client subscribing to specific events
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('subscribe:subscription')
  async handleSubscriptionSubscribe(
    @MessageBody() data: { subscriptionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { organizationId } = client.data;

    // Join organization-specific room first
    const orgRoom = `org:${organizationId}`;
    client.join(orgRoom);

    // Join subscription-specific room
    const subscriptionRoom = `subscription:${data.subscriptionId}`;
    client.join(subscriptionRoom);

    this.logger.log(`Client ${client.id} subscribed to ${subscriptionRoom}`);
    client.emit('subscribed', {
      room: data.subscriptionId,
      organizationId,
    });
  }

  // Handle client unsubscribing from events
  @UseGuards(WsAuthGuard)
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
