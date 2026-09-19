
"use client";

import * as React from "react";
import {
  WhatsAppOrder,
  OrderStatus,
  OrderAnalytics,
  MetaApiStatus,
} from "@/lib/types";
import { OrderDetailsDialog } from "@/components/order-details-dialog";
import { CreateOrderDialog } from "@/components/create-order-dialog";
import { ApiConfigModal } from "@/components/api-config-modal";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { MiddleWidgets } from "@/components/dashboard/MiddleWidgets";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PipelineTable } from "@/components/dashboard/PipelineTable";
import { toast } from "sonner";

export default function WhatsAppOrdersDashboard() {
  const [orders, setOrders] = React.useState<WhatsAppOrder[]>([]);
  const [analytics, setAnalytics] = React.useState<OrderAnalytics>({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    currency: "INR",
  });
  const [metaStatus, setMetaStatus] = React.useState<MetaApiStatus>({
    isConfigured: false,
    phoneNumberId: null,
    graphVersion: "v21.0",
  });
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedOrder, setSelectedOrder] = React.useState<WhatsAppOrder | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [autoRefresh, setAutoRefresh] = React.useState(true);

  // Fetch orders from API
  const fetchOrders = React.useCallback(async (showIndicator = false) => {
    if (showIndicator) setRefreshing(true);
    try {
      const res = await fetch("/api/whatsapp", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (data.analytics) setAnalytics(data.analytics);
        if (data.metaStatus) setMetaStatus(data.metaStatus);
      }
    } catch (err) {
      console.error("Failed to fetch WhatsApp orders:", err);
      toast.error("Failed to fetch latest orders");
    } finally {
      setLoading(false);
      if (showIndicator) setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh polling every 12 seconds
  React.useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 12000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchOrders]);

  // Handle status update
  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    notifyCustomer: boolean
  ) => {
    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          orderId,
          newStatus,
          notifyCustomer,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        fetchOrders(false);
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (err: any) {
      throw err;
    }
  };

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      if (statusFilter === "all") return true;
      if (statusFilter === "pending") return order.status === "pending";
      if (statusFilter === "kitchen")
        return order.status === "confirmed" || order.status === "preparing";
      if (statusFilter === "delivery") return order.status === "out_for_delivery";
      if (statusFilter === "completed") return order.status === "delivered";
      if (statusFilter === "cancelled") return order.status === "cancelled";

      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  const statusConfig: Record<string, { label: string, classes: string, dot: string, icon: string }> = {
    pending: { label: "Pending Review", classes: "bg-amber-500/10 border-amber-500/30 text-amber-400", dot: "bg-amber-400", icon: "pending" },
    confirmed: { label: "Confirmed", classes: "bg-blue-500/10 border-blue-500/30 text-blue-400", dot: "bg-blue-400", icon: "check_circle" },
    preparing: { label: "Packing & Staging", classes: "bg-purple-500/10 border-purple-500/30 text-purple-300", dot: "bg-purple-400", icon: "inventory_2" },
    out_for_delivery: { label: "Out for Delivery", classes: "bg-sky-500/10 border-sky-500/30 text-sky-400", dot: "bg-sky-400", icon: "local_shipping" },
    delivered: { label: "Delivered", classes: "bg-primary/10 border-primary/30 text-primary", dot: "bg-primary", icon: "check_circle" },
    cancelled: { label: "Cancelled", classes: "bg-error/10 border-error/30 text-error", dot: "bg-error", icon: "cancel" }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans antialiased overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            <MetricCards analytics={analytics} />
            <MiddleWidgets />
            <RevenueChart />
            <PipelineTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} loading={loading} />
          </div>
        </main>
      </div>

      <OrderDetailsDialog order={selectedOrder} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} onUpdateStatus={handleUpdateStatus} />
      <CreateOrderDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onOrderCreated={() => fetchOrders(true)} />
      <ApiConfigModal open={isConfigOpen} onOpenChange={setIsConfigOpen} metaStatus={metaStatus} />
    </div>
  );
}
