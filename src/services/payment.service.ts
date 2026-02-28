import { apiClient } from '@/lib/api';
import { generateIdempotencyKey, IDEMPOTENCY_HEADER } from '@/lib/idempotency';
import type { PaymentIntent, PaymentMethod } from '@/types/api';

export const paymentService = {
  // Create payment intent (idempotency key prevents double charge on retry)
  createPaymentIntent: async (
    amount: number,
    idempotencyKey?: string
  ): Promise<PaymentIntent> => {
    const key = idempotencyKey ?? generateIdempotencyKey();
    return apiClient.post('/payments/create-intent', { amount }, {
      headers: { [IDEMPOTENCY_HEADER]: key },
    });
  },

  // Confirm payment (idempotency key prevents double charge on retry)
  confirmPayment: async (
    paymentIntentId: string,
    idempotencyKey?: string
  ): Promise<{ message: string }> => {
    const key = idempotencyKey ?? generateIdempotencyKey();
    return apiClient.post('/payments/confirm', { payment_intent_id: paymentIntentId }, {
      headers: { [IDEMPOTENCY_HEADER]: key },
    });
  },

  // Get payment methods
  getPaymentMethods: async (): Promise<{ payment_methods: PaymentMethod[] }> => {
    return apiClient.get('/payments/methods');
  },

  // Add payment method (idempotency key prevents duplicate attach on retry)
  addPaymentMethod: async (
    paymentMethodId: string,
    idempotencyKey?: string
  ): Promise<{ message: string }> => {
    const key = idempotencyKey ?? generateIdempotencyKey();
    return apiClient.post('/payments/methods', { payment_method_id: paymentMethodId }, {
      headers: { [IDEMPOTENCY_HEADER]: key },
    });
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

