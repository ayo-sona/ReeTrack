// // Client-side WebSocket usage example
// // This would be used in your frontend application

// import { io, Socket } from 'socket.io-client';

// interface SubscriptionEvents {
//   'plan:upgraded': (data: { newPlan: string; timestamp: string }) => void;
//   'plan:downgraded': (data: { newPlan: string; timestamp: string }) => void;
//   'plan:expired': (data: { fallbackPlan: string; timestamp: string }) => void;
//   'subscription:status_changed': (data: {
//     subscriptionId: string;
//     status: string;
//     metadata?: any;
//     timestamp: string;
//   }) => void;
//   'payment:success': (data: {
//     subscriptionId: string;
//     amount: number;
//     currency: string;
//     timestamp: string;
//   }) => void;
//   'payment:failed': (data: {
//     subscriptionId: string;
//     amount: number;
//     currency: string;
//     reason: string;
//     timestamp: string;
//   }) => void;
//   'payment:reminder': (data: {
//     subscriptionId: string;
//     amount: number;
//     currency: string;
//     dueDate: string;
//     timestamp: string;
//   }) => void;
//   'member_subscription:created': (data: {
//     subscription: any;
//     invoice: any;
//     member: any;
//     plan: any;
//     timestamp: string;
//   }) => void;
//   'member_subscription:updated': (data: any) => void;
//   'member_subscription:cancelled': (data: any) => void;
//   'member_subscription:expired': (data: any) => void;
//   'invoice:created': (data: {
//     invoice: any;
//     subscription: any;
//     plan: any;
//     timestamp: string;
//   }) => void;
//   'invoice:paid': (data: any) => void;
//   'invoice:overdue': (data: any) => void;
//   connected: (data: { message: string; organizationId: string }) => void;
//   error: (data: { message: string }) => void;
// }

// class ReeTrackWebSocket {
//   private socket: Socket<SubscriptionEvents> | null = null;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;

//   constructor(private token: string) {}

//   connect(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.socket = io(
//         process.env.REACT_APP_API_URL || 'http://localhost:3000',
//         {
//           namespace: '/subscriptions',
//           auth: {
//             token: this.token,
//           },
//           transports: ['websocket'],
//           upgrade: false,
//         },
//       );

//       this.socket.on('connect', () => {
//         console.log('Connected to ReeTrack WebSocket');
//         this.reconnectAttempts = 0;
//         resolve();
//       });

//       this.socket.on('disconnect', (reason) => {
//         console.log('Disconnected from WebSocket:', reason);
//         if (reason === 'io server disconnect') {
//           // Server disconnected, reconnect manually
//           this.socket?.connect();
//         }
//       });

//       this.socket.on('connect_error', (error) => {
//         console.error('WebSocket connection error:', error);
//         this.reconnectAttempts++;

//         if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//           reject(error);
//         }
//       });

//       // Set up event listeners
//       this.setupEventListeners();
//     });
//   }

//   private setupEventListeners() {
//     if (!this.socket) return;

//     // Plan events
//     this.socket.on('plan:upgraded', (data) => {
//       console.log('Plan upgraded:', data);
//       // Show notification to user
//       this.showNotification('success', `Plan upgraded to ${data.newPlan}`);
//       // Update UI state
//       this.updatePlanInUI(data.newPlan);
//     });

//     this.socket.on('plan:downgraded', (data) => {
//       console.log('Plan downgraded:', data);
//       this.showNotification('warning', `Plan downgraded to ${data.newPlan}`);
//       this.updatePlanInUI(data.newPlan);
//     });

//     this.socket.on('plan:expired', (data) => {
//       console.log('Plan expired:', data);
//       this.showNotification('error', 'Your plan has expired');
//       this.updatePlanInUI(data.fallbackPlan);
//     });

//     // Subscription events
//     this.socket.on('subscription:status_changed', (data) => {
//       console.log('Subscription status changed:', data);
//       this.showNotification('info', `Subscription status: ${data.status}`);
//       this.updateSubscriptionInUI(data.subscriptionId, data.status);
//     });

//     // Payment events
//     this.socket.on('payment:success', (data) => {
//       console.log('Payment successful:', data);
//       this.showNotification(
//         'success',
//         `Payment of ${data.currency} ${data.amount} successful`,
//       );
//       this.refreshPaymentHistory();
//     });

//     this.socket.on('payment:failed', (data) => {
//       console.log('Payment failed:', data);
//       this.showNotification('error', `Payment failed: ${data.reason}`);
//       this.refreshPaymentHistory();
//     });

//     this.socket.on('payment:reminder', (data) => {
//       console.log('Payment reminder:', data);
//       this.showNotification(
//         'warning',
//         `Payment of ${data.currency} ${data.amount} due on ${data.dueDate}`,
//       );
//     });

//     // Member subscription events
//     this.socket.on('member_subscription:created', (data) => {
//       console.log('Member subscription created:', data);
//       this.showNotification(
//         'success',
//         `New subscription created for ${data.member.firstName}`,
//       );
//       this.refreshMemberSubscriptions();
//     });

//     // Invoice events
//     this.socket.on('invoice:created', (data) => {
//       console.log('Invoice created:', data);
//       this.showNotification(
//         'info',
//         `New invoice ${data.invoice.invoice_number} created`,
//       );
//       this.refreshInvoices();
//     });

//     this.socket.on('invoice:paid', (data) => {
//       console.log('Invoice paid:', data);
//       this.showNotification('success', 'Invoice paid successfully');
//       this.refreshInvoices();
//     });

//     // Connection events
//     this.socket.on('connected', (data) => {
//       console.log('Successfully connected:', data);
//     });

//     this.socket.on('error', (data) => {
//       console.error('WebSocket error:', data);
//       this.showNotification('error', data.message);
//     });
//   }

//   // Helper methods for UI updates
//   private showNotification(
//     type: 'success' | 'error' | 'warning' | 'info',
//     message: string,
//   ) {
//     // Implement your notification system here
//     // Example: toast, snackbar, etc.
//     console.log(`[${type.toUpperCase()}] ${message}`);
//   }

//   private updatePlanInUI(newPlan: string) {
//     // Update the plan display in your UI
//     // This could trigger a state update in React, Vue, etc.
//     console.log('Updating plan in UI to:', newPlan);
//   }

//   private updateSubscriptionInUI(subscriptionId: string, status: string) {
//     // Update subscription status in UI
//     console.log(`Updating subscription ${subscriptionId} to status: ${status}`);
//   }

//   private refreshPaymentHistory() {
//     // Refresh payment history in UI
//     console.log('Refreshing payment history');
//   }

//   private refreshMemberSubscriptions() {
//     // Refresh member subscriptions in UI
//     console.log('Refreshing member subscriptions');
//   }

//   private refreshInvoices() {
//     // Refresh invoices in UI
//     console.log('Refreshing invoices');
//   }

//   // Public methods
//   subscribeToSubscription(subscriptionId: string) {
//     this.socket?.emit('subscribe:subscription', { subscriptionId });
//   }

//   unsubscribeFromSubscription(subscriptionId: string) {
//     this.socket?.emit('unsubscribe:subscription', { subscriptionId });
//   }

//   disconnect() {
//     this.socket?.disconnect();
//     this.socket = null;
//   }

//   isConnected(): boolean {
//     return this.socket?.connected || false;
//   }
// }

// // Usage example:
// /*
// const token = localStorage.getItem('auth_token');
// const wsClient = new ReeTrackWebSocket(token);

// // Connect to WebSocket
// wsClient.connect()
//   .then(() => {
//     console.log('WebSocket connected successfully');

//     // Subscribe to specific subscription updates
//     wsClient.subscribeToSubscription('subscription-id-here');
//   })
//   .catch((error) => {
//     console.error('Failed to connect to WebSocket:', error);
//   });

// // Clean up on component unmount
// // useEffect(() => {
// //   return () => {
// //     wsClient.disconnect();
// //   };
// // }, []);
// */

// export { ReeTrackWebSocket };
