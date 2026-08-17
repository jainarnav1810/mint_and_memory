export type OrderType = 'fixed' | 'auction';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  order_type: OrderType;
  amount: number;
  currency: string;
  stripe_payment_intent_id?: string | null;
  payment_status: PaymentStatus;
  shipping_address?: ShippingAddress | null;
  order_status: OrderStatus;
  created_at: string;
  listing_title?: string;
}
