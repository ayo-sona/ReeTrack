// import { apiClient } from '../../lib/apiClient'; // TODO: Uncomment when implementing real API
import { Payment, PaymentIntent } from '../../types/payment';
import { MOCK_PAYMENTS } from '../../lib/mockData';

export const paymentAPI = {
  async getHistory(): Promise<Payment[]> {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<Payment[]>('/payments/history');
    // return response.data!;
    
    // Mock for now
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PAYMENTS), 500);
    });
  },

  async createIntent(_intent: PaymentIntent): Promise<{ reference: string }> {
    // TODO: Replace with actual API call
    // const response = await apiClient.post<{ reference: string }>('/payments/intent', _intent);
    // return response.data!;
    
    // Mock for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ reference: `ref_${Date.now()}` });
      }, 500);
    });
  },

  async verifyPayment(_reference: string): Promise<boolean> {
    // TODO: Replace with actual API call
    // const response = await apiClient.post<{ verified: boolean }>('/payments/verify', { reference: _reference });
    // return response.data!.verified;
    
    // Mock for now
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  },

  async downloadInvoice(_paymentId: string): Promise<Blob> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/payments/${_paymentId}/invoice`);
    // return response.blob();
    
    // Mock PDF generation
    return new Promise((resolve) => {
      const blob = new Blob(['Mock PDF Invoice'], { type: 'application/pdf' });
      resolve(blob);
    });
  },

  async exportHistory(_format: 'csv' | 'pdf'): Promise<Blob> {
    // TODO: Replace with actual API call
    // Use _format parameter to determine export type when implementing
    
    // Mock CSV export
    const csvContent = [
      'Date,Description,Amount,Status,Gateway',
      ...MOCK_PAYMENTS.map(p => 
        `${p.createdAt},${p.description},${p.amount},${p.status},${p.gateway}`
      )
    ].join('\n');
    
    return new Promise((resolve) => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      resolve(blob);
    });
  },
};