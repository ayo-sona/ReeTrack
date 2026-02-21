# WebSocket Implementation for ReeTrack

This implementation provides real-time notifications for subscription and payment events using Socket.IO.

## Features

### Authentication

- JWT-based authentication on connection
- Automatic disconnection for invalid tokens
- User data attached to socket for event handling

### Room Management

- Organization-specific rooms: `org:${organizationId}`
- Subscription-specific rooms: `subscription:${subscriptionId}`
- Automatic room cleanup on disconnect

### Events

#### Plan Events

- `plan:upgraded` - When organization plan is upgraded
- `plan:downgraded` - When organization plan is downgraded
- `plan:expired` - When organization plan expires

#### Subscription Events

- `subscription:status_changed` - When subscription status changes
- `member_subscription:created` - When new member subscription is created
- `member_subscription:updated` - When member subscription is updated
- `member_subscription:cancelled` - When member subscription is cancelled
- `member_subscription:expired` - When member subscription expires

#### Payment Events

- `payment:success` - When payment is successful
- `payment:failed` - When payment fails
- `payment:reminder` - When payment reminder is sent

#### Invoice Events

- `invoice:created` - When new invoice is generated
- `invoice:paid` - When invoice is paid
- `invoice:overdue` - When invoice becomes overdue

#### Connection Events

- `connected` - When client successfully connects
- `error` - When an error occurs

## Usage

### Server-side (NestJS)

```typescript
// Inject the gateway in your service
constructor(
  private subscriptionGateway: SubscriptionGateway,
) {}

// Send notifications
this.subscriptionGateway.notifyPlanUpgrade(organizationId, 'PREMIUM');
this.subscriptionGateway.notifyPaymentEvent(organizationId, subscriptionId, 'success', data);
```

### Client-side (JavaScript/TypeScript)

```typescript
import { io, Socket } from 'socket.io-client';

// Connect with JWT token
const socket = io('http://localhost:3000/subscriptions', {
  auth: {
    token: 'your-jwt-token',
  },
});

// Listen for events
socket.on('plan:upgraded', (data) => {
  console.log('Plan upgraded to:', data.newPlan);
});

socket.on('payment:success', (data) => {
  console.log('Payment successful:', data);
});
```

## Environment Variables

Add to your `.env` file:

```
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

## Security

- JWT verification on every connection
- Token-based room access control
- Automatic cleanup on disconnect
- CORS configuration for frontend URL

## Scaling

- Uses Socket.IO adapter for horizontal scaling
- Room-based messaging for efficient delivery
- Connection state management

## Error Handling

- Invalid tokens are immediately disconnected
- Comprehensive error logging
- Graceful fallback handling
- Connection retry logic on client side
