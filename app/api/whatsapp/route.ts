import { NextRequest, NextResponse } from "next/server";
import { INITIAL_MOCK_ORDERS } from "@/lib/mock-data";
import { WhatsAppOrder, WhatsAppWebhookPayload } from "@/lib/types";

// In-memory store for orders during session / local runtime
let inMemoryOrders: WhatsAppOrder[] = [];

/**
 * Helper to check if live Meta WhatsApp credentials are configured
 */
function getMetaConfig() {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "gustosa_secret_webhook_verify_token_2026";
  const version = process.env.META_GRAPH_API_VERSION || "v21.0";

  const isConfigured = Boolean(token && phoneNumberId && token.length > 10 && phoneNumberId.length > 5);
  return { token, phoneNumberId, verifyToken, version, isConfigured };
}

/**
 * GET Handler:
 * 1. Webhook Verification for Meta Developers (hub.mode, hub.verify_token, hub.challenge)
 * 2. Fetch Orders List for Dashboard (when queried by frontend)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // 1. Meta Webhook Verification challenge
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const config = getMetaConfig();

  if (mode && token) {
    if (mode === "subscribe" && token === config.verifyToken) {
      console.log("[WhatsApp Webhook] Verification challenge passed successfully.");
      return new NextResponse(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      console.warn("[WhatsApp Webhook] Verification challenge failed. Invalid verify token.");
      return new NextResponse("Forbidden - Invalid Verify Token", { status: 403 });
    }
  }

  // 2. Dashboard query: Return current orders & API connection status
  const filter = searchParams.get("status");
  let filtered = [...inMemoryOrders];
  if (filter && filter !== "all") {
    filtered = filtered.filter((o) => o.status === filter);
  }

  return NextResponse.json({
    success: true,
    orders: filtered,
    metaStatus: {
      isConfigured: config.isConfigured,
      phoneNumberId: config.phoneNumberId ? `${config.phoneNumberId.slice(0, 4)}***` : null,
      graphVersion: config.version,
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST Handler:
 * 1. Incoming Meta Webhook events (incoming customer messages & order triggers)
 * 2. Dispatching outbound WhatsApp messages/updates to customers
 * 3. Updating order statuses from the dashboard UI
 */
export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    console.log('[Webhook Debug Payload]:', bodyText);
    const body = JSON.parse(bodyText);
    const config = getMetaConfig();

    // Action A: Frontend Dashboard updating an order status or triggering customer message
    if (body.action === "update_status") {
      const { orderId, newStatus, notifyCustomer } = body;
      const orderIndex = inMemoryOrders.findIndex((o) => o.id === orderId);

      if (orderIndex === -1) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      inMemoryOrders[orderIndex] = {
        ...inMemoryOrders[orderIndex],
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      const updatedOrder = inMemoryOrders[orderIndex];

      // If user enabled notify customer via WhatsApp
      let whatsappResult = { sent: false, note: "Mock mode - simulated notification" };
      if (notifyCustomer) {
        const messageText = `Hello ${updatedOrder.customerName}! Your Gustosa Food wholesale order *${updatedOrder.orderNumber}* status has been updated to: *${newStatus.toUpperCase().replace(/_/g, " ")}*. Thank you! 📦`;

        if (config.isConfigured && config.token && config.phoneNumberId) {
          try {
            const metaRes = await fetch(
              `https://graph.facebook.com/${config.version}/${config.phoneNumberId}/messages`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${config.token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  to: updatedOrder.customerPhone.replace(/[^0-9]/g, ""),
                  type: "text",
                  text: { body: messageText },
                }),
              }
            );
            const metaJson = await metaRes.json();
            whatsappResult = { sent: metaRes.ok, note: metaRes.ok ? "Sent via Meta API" : metaJson.error?.message || "Failed" };
          } catch (err: any) {
            whatsappResult = { sent: false, note: `Error contacting Meta API: ${err.message}` };
          }
        }
      }

      return NextResponse.json({
        success: true,
        order: updatedOrder,
        whatsappResult,
      });
    }

    // Action B: Creating a new simulated or incoming order
    if (body.action === "create_order") {
      const newOrder: WhatsAppOrder = {
        id: `ord_gf_${Date.now().toString().slice(-4)}`,
        orderNumber: `GF-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: body.customerName || "WhatsApp Customer",
        customerPhone: body.customerPhone || "+1 (555) 019-2834",
        status: "pending",
        paymentStatus: body.paymentStatus || "pending",
        items: body.items || [
          { id: "itm_new_1", name: "Premium Raw Phool Makhana (5kg)", quantity: 1, price: 85.0 },
          { id: "itm_new_2", name: "Classic Salted Roasted Makhana (1kg)", quantity: 1, price: 22.0 },
        ],
        subtotal: body.subtotal || 107.0,
        deliveryFee: 5.0,
        discount: 0,
        totalAmount: (body.subtotal || 107.0) + 5.0,
        currency: "INR",
        deliveryAddress: body.deliveryAddress || "45 Broadway, New York, NY",
        notes: body.notes || "Order received directly via WhatsApp conversation",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isMock: !config.isConfigured,
      };

      inMemoryOrders = [newOrder, ...inMemoryOrders];

      return NextResponse.json({
        success: true,
        order: newOrder,
        message: "New WhatsApp order recorded successfully",
      });
    }

    // Action C: Incoming Meta WhatsApp Webhook Payload
    const webhookData = body as WhatsAppWebhookPayload;

    if (webhookData.object === "whatsapp_business_account" && webhookData.entry) {
      for (const entry of webhookData.entry) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (value.messages && value.messages.length > 0) {
            for (const msg of value.messages) {
              const contact = value.contacts?.find((c) => c.wa_id === msg.from);
              const senderName = contact?.profile?.name || "WhatsApp User";
              const senderPhone = `+${msg.from}`;

              console.log(`[WhatsApp Incoming Msg] From: ${senderName} (${senderPhone}):`, msg);

              // Check if it's an order or contains text
              if (msg.type === "order" && msg.order) {
                const newOrder: WhatsAppOrder = {
                  id: `ord_wa_${msg.id.slice(-6)}`,
                  orderNumber: `GF-${Math.floor(1000 + Math.random() * 9000)}`,
                  customerName: senderName,
                  customerPhone: senderPhone,
                  status: "pending",
                  paymentStatus: "pending",
                  items: msg.order.product_items.map((prod, idx) => ({
                    id: `itm_wa_${idx}`,
                    name: `Catalog Item #${prod.product_retailer_id}`,
                    quantity: prod.quantity,
                    price: prod.item_price,
                  })),
                  subtotal: msg.order.product_items.reduce((acc, p) => acc + p.item_price * p.quantity, 0),
                  deliveryFee: 5.0,
                  discount: 0,
                  totalAmount: msg.order.product_items.reduce((acc, p) => acc + p.item_price * p.quantity, 0) + 5.0,
                  currency: msg.order.product_items[0]?.currency || "INR",
                  deliveryAddress: "Shared via WhatsApp Message",
                  notes: msg.order.text || "Direct WhatsApp Catalog Order",
                  createdAt: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
                  updatedAt: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
                  whatsappMessageId: msg.id,
                  isMock: false,
                };
                inMemoryOrders = [newOrder, ...inMemoryOrders];
              } else if (msg.type === "text") {
                // For testing: Create a dummy order when any text message is received
                const newOrder: WhatsAppOrder = {
                  id: `ord_wa_${msg.id.slice(-6)}`,
                  orderNumber: `GF-${Math.floor(1000 + Math.random() * 9000)}`,
                  customerName: senderName,
                  customerPhone: senderPhone,
                  status: "pending",
                  paymentStatus: "pending",
                  items: [
                    { id: "test_1", name: "Text Message Order", quantity: 1, price: 0 }
                  ],
                  subtotal: 0,
                  deliveryFee: 0,
                  discount: 0,
                  totalAmount: 0,
                  currency: "INR",
                  deliveryAddress: "Testing Address",
                  notes: `Message: "${msg.text?.body}"`,
                  createdAt: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
                  updatedAt: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
                  whatsappMessageId: msg.id,
                  isMock: false,
                };
                inMemoryOrders = [newOrder, ...inMemoryOrders];
              }
            }
          }
        }
      }

      return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
    }

    // Default fallback
    return NextResponse.json({ success: true, message: "Webhook ping processed" });
  } catch (error: any) {
    console.error("[WhatsApp API Route Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
