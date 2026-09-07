export type SubscriptionPlan = 'Trial 7 Días' | 'Bronze Decanter' | 'Silver Collector' | 'VIP Gold Perfumer';

export type Subscription = {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  plan: SubscriptionPlan;
  status: 'Active' | 'Paused' | 'Cancelled';
  price: number;
  startDate: string;
  nextRenewal: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
};

export type Pago = {
  id: string;
  suscripcionId: string;
  monto: number;
  fechaPago: string;
  metodo: 'Card' | 'Transfer' | 'Cash' | 'Other';
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  comprobanteUrl?: string;
  referencia?: string;
  createdAt: string;
};
