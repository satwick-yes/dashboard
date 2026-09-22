import { NextRequest, NextResponse } from "next/server";
import { WhatsAppOrder, WhatsAppWebhookPayload } from "@/lib/types";
import { supabase } from "@/lib/supabase";

function getMetaConfig() {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "gustosa_secret_webhook_verify_token_2026";
  const version = process.env.META_GRAPH_API_VERSION || "v21.0";

  const isConfigured = Boolean(token && phoneNumberId && token.length > 10 && phoneNumberId.length > 5);
  return { token, phoneNumberId, verifyToken, version, isConfigured };
}

function mapToRow(order: WhatsAppOrder) {
  return {
    id: order.id,
    order_number: order.orderNumber,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    status: order.status,
    payment_status: order.paymentStatus,
    items: order.items,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    discount: order.discount,
    total_amount: order.totalAmount,
    currency: order.currency,
    delivery_address: order.deliveryAddress,
    notes: order.notes,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
    whatsapp_message_id: order.whatsappMessageId,
    is_mock: order.isMock
  };
}

function mapToOrder(row: any): WhatsAppOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    status: row.status,
    paymentStatus: row.payment_status,
    items: row.items,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    discount: row.discount,
    totalAmount: row.total_amount,
    currency: row.currency,
    deliveryAddress: row.delivery_address,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    whatsappMessageId: row.whatsapp_message_id,
    isMock: row.is_mock
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

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

  const filter = searchParams.get("status");
  
  // Fetch from Supabase
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (filter && filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Supabase fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const orders = data.map(mapToOrder);

  // Compute analytics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const preparingOrders = orders.filter(o => o.status === "preparing").length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return NextResponse.json({
    success: true,
    orders,
    analytics: {
      totalOrders,
      pendingOrders,
      preparingOrders,
      deliveredOrders,
      totalRevenue,
      averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
      currency: "INR"
    },
    metaStatus: {
      isConfigured: config.isConfigured,
      phoneNumberId: config.phoneNumberId ? `${config.phoneNumberId.slice(0, 4)}***` : null,
      graphVersion: config.version,
    },
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);
    const config = getMetaConfig();

    if (body.action === "update_status") {
      const { orderId, newStatus, notifyCustomer } = body;
      
      const { data: fetchResult, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();
        
      if (fetchError || !fetchResult) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      const updatedOrderRow = {
        ...fetchResult,
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      const { data: updateResult, error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: updatedOrderRow.updated_at })
        .eq("id", orderId)
        .select()
        .single();

      if (updateError) throw updateError;
      
      const updatedOrder = mapToOrder(updateResult);

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

      const { error: insertError } = await supabase.from("orders").insert(mapToRow(newOrder));
      if (insertError) throw insertError;

      return NextResponse.json({
        success: true,
        order: newOrder,
        message: "New WhatsApp order recorded successfully",
      });
    }

    if (body.action === "send_message") {
      const { customerPhone, text } = body;
      
      let whatsappResult = { sent: false, note: "Mock mode - simulated message" };
      
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
                to: customerPhone.replace(/[^0-9]/g, ""),
                type: "text",
                text: { body: text },
              }),
            }
          );
          const metaJson = await metaRes.json();
          whatsappResult = { sent: metaRes.ok, note: metaRes.ok ? "Sent via Meta API" : metaJson.error?.message || "Failed" };
        } catch (err: any) {
          whatsappResult = { sent: false, note: `Error contacting Meta API: ${err.message}` };
        }
      }

      // Record agent message in DB for chat history
      const newMessageRecord: WhatsAppOrder = {
        id: `msg_agt_${Date.now().toString().slice(-6)}`,
        orderNumber: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: "Agent",
        customerPhone: customerPhone,
        status: "delivered", // Mark as delivered to differentiate
        paymentStatus: "paid",
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        totalAmount: 0,
        currency: "INR",
        deliveryAddress: "Agent Reply",
        notes: `Agent: ${text}`, // Prefix to easily identify
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isMock: !config.isConfigured,
      };

      await supabase.from("orders").insert(mapToRow(newMessageRecord));

      return NextResponse.json({
        success: true,
        messageRecord: newMessageRecord,
        whatsappResult,
      });
    }

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
                await supabase.from("orders").insert(mapToRow(newOrder));
              } else if (msg.type === "text") {
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
                await supabase.from("orders").insert(mapToRow(newOrder));
              }
            }
          }
        }
      }

      return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
    }

    return NextResponse.json({ success: true, message: "Webhook ping processed" });
  } catch (error: any) {
    console.error("[WhatsApp API Route Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
