
"use client";

import * as React from "react";
import {
  WhatsAppOrder,
  OrderStatus,
  OrderAnalytics,
  MetaApiStatus,
} from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { OrderDetailsDialog } from "@/components/order-details-dialog";
import { CreateOrderDialog } from "@/components/create-order-dialog";
import { ApiConfigModal } from "@/components/api-config-modal";
import { format } from "date-fns";
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
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen selection:bg-primary selection:text-on-primary">
      <header className="sticky top-0 z-50 flex items-center justify-between px-margin-desktop w-full h-16 border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-space-xl">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined" data-icon="forum" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
            </div>
            <div>
              <span className="text-headline-sm font-headline-sm font-bold text-primary tracking-tight">Gustosa Wholesale B2B</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block w-2 h-2 rounded-full ${metaStatus.isConfigured ? 'bg-primary status-pulse' : 'bg-amber-400'}`}></span>
                <span className="text-[10px] font-label-sm text-secondary uppercase tracking-wider">
                  {metaStatus.isConfigured ? 'Live WhatsApp API' : 'Mock Mode'}
                </span>
              </div>
            </div>
          </div>
          <div className="relative w-80 hidden lg:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-label-md font-label-md bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150" 
              placeholder="Order ID / Buyer Company / Phone..." type="text"/>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-space-lg">
          <a className="text-primary font-semibold border-b-2 border-primary pb-1 text-label-lg font-label-lg transition-colors" href="#">Orders</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors text-label-lg font-label-lg" href="#">Inventory</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors text-label-lg font-label-lg" href="#">Customers</a>
        </nav>

        <div className="flex items-center gap-space-md">
          <button onClick={() => setIsConfigOpen(true)} className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all duration-150 active:scale-95">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            {!metaStatus.isConfigured && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-surface-container-lowest"></span>}
          </button>
          <div className="h-6 w-px bg-outline-variant/30 mx-1"></div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="fixed left-0 top-16 bottom-0 w-[280px] z-40 flex flex-col justify-between p-space-base border-r border-outline-variant/30 bg-surface-container-low">
          <div className="space-y-space-md">
            <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              </div>
              <div className="overflow-hidden">
                <h4 className="text-headline-sm font-headline-sm font-bold text-on-surface truncate text-sm">Gustosa Food Corp</h4>
                <div className="flex items-center gap-1 text-[11px] font-label-sm text-secondary">
                  <span className="material-symbols-outlined text-[13px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span>Verified Enterprise Route</span>
                </div>
              </div>
            </div>

            <button onClick={() => setIsCreateOpen(true)} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container text-on-primary font-semibold text-label-md font-label-md shadow-md hover:brightness-110 active:scale-[0.98] transition-all duration-150">
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>Simulate New PO</span>
            </button>

            <nav className="space-y-1 pt-1">
              <a className="flex items-center gap-space-md px-space-base py-space-md rounded-lg bg-surface-container text-primary font-semibold border-l-2 border-primary text-label-md font-label-md transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                <span>Order Orchestration</span>
              </a>
            </nav>
          </div>
        </aside>

        <main className="ml-[280px] flex-1 p-space-2xl bg-surface-dim overflow-y-auto max-w-[1720px]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-space-2xl">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-headline-xl font-headline-xl text-on-surface tracking-tight">Wholesale Order Management</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary border border-primary/20 text-label-sm font-label-sm">
                  Live B2B Engine
                </span>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant mt-1">
                Real-time synchronization across WhatsApp Business Cloud API & ERP Master Node
              </p>
            </div>
            <div className="flex items-center gap-space-sm flex-wrap">
              <button onClick={() => fetchOrders(true)} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface text-label-md font-label-md transition-colors active:scale-95">
                <span className={`material-symbols-outlined text-[18px] text-on-surface-variant ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
                <span>Refresh Sync</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-lg mb-space-2xl">
            <div className="glass-panel p-space-lg rounded-xl border border-outline-variant/30 relative overflow-hidden group hover:border-primary/40 transition-all duration-200">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/20 transition-all duration-300"></div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="text-label-md font-label-md text-on-surface-variant">Total B2B Revenue</span>
              </div>
              <div className="text-headline-xl font-headline-xl font-bold text-on-surface mb-2 tracking-tight">₹{(analytics?.totalRevenue || 0).toFixed(2)}</div>
              <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pt-2 border-t border-outline-variant/20">
                <span>Avg Ticket: <strong className="text-on-surface font-medium">₹{(analytics?.averageOrderValue || 0).toFixed(2)}</strong></span>
              </div>
            </div>

            <div className="glass-panel p-space-lg rounded-xl border border-outline-variant/30 relative overflow-hidden group hover:border-secondary/40 transition-all duration-200">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-secondary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-secondary/20 transition-all duration-300"></div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="text-label-md font-label-md text-on-surface-variant">Total Orders</span>
              </div>
              <div className="text-headline-xl font-headline-xl font-bold text-on-surface mb-2 tracking-tight">{analytics?.totalOrders || 0} <span className="text-headline-sm font-normal text-on-surface-variant">Orders</span></div>
            </div>

            <div className="glass-panel p-space-lg rounded-xl border border-outline-variant/30 relative overflow-hidden group hover:border-amber-400/40 transition-all duration-200">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-300"></div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="text-label-md font-label-md text-on-surface-variant">Pending Confirmation</span>
              </div>
              <div className="text-headline-xl font-headline-xl font-bold text-on-surface mb-2 tracking-tight">{analytics?.pendingOrders || 0}</div>
            </div>

            <div className="glass-panel p-space-lg rounded-xl border border-outline-variant/30 relative overflow-hidden group hover:border-purple-400/40 transition-all duration-200">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-300"></div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="text-label-md font-label-md text-on-surface-variant">Packing & Staging</span>
              </div>
              <div className="text-headline-xl font-headline-xl font-bold text-on-surface mb-2 tracking-tight">{analytics?.preparingOrders || 0}</div>
            </div>
          </div>

          <div className="glass-panel p-space-base rounded-xl border border-outline-variant/30 mb-space-lg space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-outline-variant/20 pb-space-base">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                <button onClick={() => setStatusFilter("all")} className={`px-3.5 py-1.5 rounded-lg ${statusFilter === "all" ? 'bg-surface-container-high text-primary border border-primary/30 shadow-xs' : 'text-on-surface-variant hover:bg-surface-container'} font-semibold text-label-md font-label-md whitespace-nowrap`}>
                  All Orders
                </button>
                <button onClick={() => setStatusFilter("pending")} className={`px-3.5 py-1.5 rounded-lg ${statusFilter === "pending" ? 'bg-surface-container-high text-primary border border-primary/30 shadow-xs' : 'text-on-surface-variant hover:bg-surface-container'} font-semibold text-label-md font-label-md whitespace-nowrap`}>
                  Pending
                </button>
                <button onClick={() => setStatusFilter("kitchen")} className={`px-3.5 py-1.5 rounded-lg ${statusFilter === "kitchen" ? 'bg-surface-container-high text-primary border border-primary/30 shadow-xs' : 'text-on-surface-variant hover:bg-surface-container'} font-semibold text-label-md font-label-md whitespace-nowrap`}>
                  Warehouse
                </button>
                <button onClick={() => setStatusFilter("delivery")} className={`px-3.5 py-1.5 rounded-lg ${statusFilter === "delivery" ? 'bg-surface-container-high text-primary border border-primary/30 shadow-xs' : 'text-on-surface-variant hover:bg-surface-container'} font-semibold text-label-md font-label-md whitespace-nowrap`}>
                  Delivery
                </button>
                <button onClick={() => setStatusFilter("completed")} className={`px-3.5 py-1.5 rounded-lg ${statusFilter === "completed" ? 'bg-surface-container-high text-primary border border-primary/30 shadow-xs' : 'text-on-surface-variant hover:bg-surface-container'} font-semibold text-label-md font-label-md whitespace-nowrap`}>
                  Completed
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl border border-outline-variant/30 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant/30 text-[11px] font-label-sm text-on-surface-variant uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Order ID & PO</th>
                    <th className="py-3.5 px-4 font-semibold">Buyer Details</th>
                    <th className="py-3.5 px-4 font-semibold">Items</th>
                    <th className="py-3.5 px-4 font-semibold">Fulfillment Status</th>
                    <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Total</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-body-md font-body-md">
                  {loading && orders.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant">Loading pipeline...</td></tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant">No orders found.</td></tr>
                  ) : filteredOrders.map((order) => {
                    const totalQty = order.items.reduce((acc, i) => acc + i.quantity, 0);
                    const itemsSummary = order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
                    const st = statusConfig[order.status] || statusConfig.pending;

                    return (
                      <tr key={order.id} className="hover:bg-surface-container-high/30 transition-colors group cursor-pointer" onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-primary-container/15 text-primary flex items-center justify-center">
                              <span className="material-symbols-outlined text-[15px]">receipt</span>
                            </div>
                            <div>
                              <div className="font-data-tabular text-data-tabular font-bold text-on-surface group-hover:text-primary transition-colors">{order.orderNumber}</div>
                              {order.isMock && <div className="text-label-sm font-label-sm text-on-surface-variant font-mono">MOCK ORDER</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-surface-container-highest border border-outline-variant/40 flex items-center justify-center font-bold text-secondary text-sm">
                              {order.customerName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-headline-sm text-headline-sm font-semibold text-on-surface">{order.customerName}</div>
                              <div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-2">
                                <span className="font-mono text-secondary/80">{order.customerPhone}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="max-w-xs">
                            <div className="text-on-surface font-medium truncate text-body-sm font-body-sm">{itemsSummary}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-label-sm">{totalQty} Items</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-label-sm font-label-sm font-semibold ${st.classes}`}>
                            <span className="material-symbols-outlined text-[14px]">{st.icon}</span>
                            {st.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-body-sm font-body-sm text-on-surface flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                            <span>{format(new Date(order.createdAt), "h:mm a")}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="font-data-tabular text-data-tabular font-bold text-on-surface text-base">₹{order.totalAmount.toFixed(2)}</div>
                        </td>
                        <td className="py-4 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }} className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <OrderDetailsDialog order={selectedOrder} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} onUpdateStatus={handleUpdateStatus} />
      <CreateOrderDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onOrderCreated={() => fetchOrders(true)} />
      <ApiConfigModal open={isConfigOpen} onOpenChange={setIsConfigOpen} metaStatus={metaStatus} />
    </div>
  );
}
