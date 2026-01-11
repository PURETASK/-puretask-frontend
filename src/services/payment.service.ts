import { apiClient } from '@/lib/api';
import type { PaymentIntent, PaymentMethod } from '@/types/api';

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (amount: number): Promise<PaymentIntent> => {
    return apiClient.post('/payments/create-intent', { amount });
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId: string): Promise<{ message: string }> => {
    return apiClient.post('/payments/confirm', { payment_intent_id: paymentIntentId });
  },

  // Get payment methods
  getPaymentMethods: async (): Promise<{ payment_methods: PaymentMethod[] }> => {
    return apiClient.get('/payments/methods');
  },

  // Add payment method
  addPaymentMethod: async (paymentMethodId: string): Promise<{ message: string }> => {
    return apiClient.post('/payments/methods', { payment_method_id: paymentMethodId });
  },

  // Remove payment method
  removePaymentMethod: async (paymentMethodId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/payments/methods/${paymentMethodId}`);
  },

  // Set default payment method
  setDefaultPaymentMethod: async (paymentMethodId: string): Promise<{ message: string }> => {
    return apiClient.patch('/payments/methods/default', { payment_method_id: paymentMethodId });
  },

  // Get payment history
  getPaymentHistory: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<any> => {
    return apiClient.get('/payments/history', { params });
  },
};

