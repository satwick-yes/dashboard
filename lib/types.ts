export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "paid" | "pending" | "cod";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface WhatsAppOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  currency: string;
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  whatsappMessageId?: string;
  isMock?: boolean;
}

export interface DashboardMetrics {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  revenueToday: number;
  ordersToday: number;
}

export interface OrderAnalytics {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  currency: string;
}

export interface MetaApiStatus {
  isConfigured: boolean;
  phoneNumberId: string | null;
  graphVersion: string;
}

// Meta WhatsApp Cloud API Webhook payload types
export interface WhatsAppWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: "whatsapp";
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      };
      contacts?: Array<{
        profile: {
          name: string;
        };
        wa_id: string;
      }>;
      messages?: Array<{
        from: string;
        id: string;
        timestamp: string;
        type: "text" | "interactive" | "order" | "location";
        text?: {
          body: string;
        };
        interactive?: {
          type: string;
          button_reply?: { id: string; title: string };
          list_reply?: { id: string; title: string; description?: string };
        };
        order?: {
          catalog_id: string;
          text?: string;
          product_items: Array<{
            product_retailer_id: string;
            quantity: number;
            item_price: number;
            currency: string;
          }>;
        };
      }>;
      statuses?: Array<{
        id: string;
        status: "sent" | "delivered" | "read" | "failed";
        timestamp: string;
        recipient_id: string;
      }>;
    };
    field: string;
  }>;
}

export interface WhatsAppWebhookPayload {
  object: "whatsapp_business_account";
  entry: WhatsAppWebhookEntry[];
}
