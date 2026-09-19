"use client";

import * as React from "react";
import {
  WhatsAppOrder,
  OrderStatus,
  OrderAnalytics,
  MetaApiStatus,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { OrderDetailsDialog } from "@/components/order-details-dialog";
import { CreateOrderDialog } from "@/components/create-order-dialog";
import { ApiConfigModal } from "@/components/api-config-modal";
import {
  ShoppingBag,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  RefreshCw,
  Plus,
  Settings2,
  ExternalLink,
  ChevronDown,
  Phone,
  Package,
  Bike,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  UtensilsCrossed,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from "lucide-react";
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
        // Update local state smoothly
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        // Refetch fresh analytics
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
      // Search matching
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      // Status filtering
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

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col selection:bg-[#25D366]/20 selection:text-[#25D366]">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/20 ring-1 ring-white/20">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-foreground">
                  Gustosa Food
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-[#25D366]/10 px-2 py-0.5 text-[11px] font-semibold text-[#25D366] ring-1 ring-inset ring-[#25D366]/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  WhatsApp Suite
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Meta Cloud API Retail &amp; Wholesale Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Meta API Status Indicator */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfigOpen(true)}
              className="h-9 gap-1.5 text-xs font-medium border-border/80 bg-background/50 hover:bg-muted/50"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  metaStatus.isConfigured
                    ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                    : "bg-amber-500"
                }`}
              />
              <span className="hidden md:inline">
                {metaStatus.isConfigured ? "Live Meta API" : "Mock / Local API"}
              </span>
              <Settings2 className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
            </Button>

            {/* Quick Simulate Button */}
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="h-9 gap-1.5 text-xs font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md shadow-[#25D366]/20 active:scale-[0.985] transition-transform"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Simulate Order</span>
            </Button>

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              title="Refresh Orders"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner: Meta Live Connection status */}
        {!metaStatus.isConfigured && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Operating in Interactive Simulation Mode
                </p>
                <p className="text-amber-700/90 dark:text-amber-300/80 mt-0.5">
                  Orders are simulated locally with full pipeline updates. Add your Meta WhatsApp Cloud API credentials in <code className="font-mono font-semibold">.env.local</code> to connect live customer WhatsApp numbers.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfigOpen(true)}
              className="h-8 text-xs font-semibold shrink-0 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200"
            >
              View API Setup Guide <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )}

        {/* Analytics KPI Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <Card className="border-border/80 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Revenue
              </CardTitle>
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                ₹{(analytics?.totalRevenue || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-[#25D366]" />
                <span>Avg. ₹{(analytics?.averageOrderValue || 0).toFixed(2)} / order</span>
              </p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="border-border/80 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Orders
              </CardTitle>
              <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {analytics?.totalOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics?.deliveredOrders || 0} orders fulfilled &amp; delivered
              </p>
            </CardContent>
          </Card>

          {/* Pending Verification */}
          <Card className="border-border/80 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Confirmation
              </CardTitle>
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {analytics?.pendingOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting warehouse accept or dispatch
              </p>
            </CardContent>
          </Card>

          {/* Kitchen In-Prep */}
          <Card className="border-border/80 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Warehouse Packing
              </CardTitle>
              <div className="h-8 w-8 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                <Package className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {analytics?.preparingOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently packing &amp; processing
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Filter Bar & Search Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Status Tabs */}
          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-9 p-1 bg-muted/50 border border-border/80 rounded-xl">
              <TabsTrigger value="all" className="text-xs font-medium">
                All ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs font-medium">
                Pending ({orders.filter((o) => o.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="kitchen" className="text-xs font-medium">
                Warehouse (
                {
                  orders.filter(
                    (o) => o.status === "confirmed" || o.status === "preparing"
                  ).length
                }
                )
              </TabsTrigger>
              <TabsTrigger value="delivery" className="text-xs font-medium">
                Delivery (
                {orders.filter((o) => o.status === "out_for_delivery").length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs font-medium">
                Delivered (
                {orders.filter((o) => o.status === "delivered").length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-xs font-medium">
                Cancelled (
                {orders.filter((o) => o.status === "cancelled").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, client, phone..."
              className="pl-9 h-9 text-xs rounded-xl bg-card/60 border-border/80 focus:bg-background"
            />
          </div>
        </div>

        {/* Orders Table & List */}
        <div className="rounded-2xl border border-border/80 bg-card/40 backdrop-blur-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm font-medium text-muted-foreground">
                Connecting to WhatsApp order pipeline...
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  No WhatsApp orders found
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search criteria or clear active status filters."
                    : "No orders matching this category yet. Click 'Simulate Order' to generate one."}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Simulate WhatsApp Order
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4 sm:px-6">Order ID</th>
                    <th className="py-3 px-4">Customer &amp; Phone</th>
                    <th className="py-3 px-4 hidden md:table-cell">Ordered Items</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Placed</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {filteredOrders.map((order) => {
                    const totalQty = order.items.reduce(
                      (acc, i) => acc + i.quantity,
                      0
                    );
                    const itemsSummary = order.items
                      .map((i) => `${i.quantity}x ${i.name}`)
                      .join(", ");

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-muted/40 transition-colors group cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsOpen(true);
                        }}
                      >
                        {/* Order ID */}
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-foreground">
                          <div className="flex items-center gap-1.5">
                            <span>{order.orderNumber}</span>
                            {order.isMock && (
                              <span className="text-[10px] text-muted-foreground font-normal bg-muted/60 px-1.5 py-0.5 rounded">
                                Mock
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Customer Details */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground">
                            {order.customerName}
                          </div>
                          <div
                            className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono mt-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="w-3 h-3 text-[#25D366]" />
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(
                                /[^0-9]/g,
                                ""
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline hover:text-primary transition-colors inline-flex items-center gap-0.5"
                            >
                              {order.customerPhone}
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          </div>
                        </td>

                        {/* Items Summary */}
                        <td className="py-3.5 px-4 hidden md:table-cell max-w-xs">
                          <span className="inline-flex items-center gap-1 font-medium text-foreground">
                            <span className="h-5 px-1.5 rounded-md bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">
                              {totalQty} items
                            </span>
                            <span className="truncate block max-w-[200px] text-muted-foreground text-xs">
                              {itemsSummary}
                            </span>
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={order.status}
                            className="capitalize font-semibold text-[11px] px-2 py-0.5"
                          >
                            {order.status.replace(/_/g, " ")}
                          </Badge>
                        </td>

                        {/* Order Placed Time */}
                        <td className="py-3.5 px-4 hidden sm:table-cell text-muted-foreground">
                          {format(new Date(order.createdAt), "h:mm a")}
                          <span className="block text-[11px] text-muted-foreground/80">
                            {format(new Date(order.createdAt), "MMM d")}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                          ${order.totalAmount.toFixed(2)}
                        </td>

                        {/* Action Menu */}
                        <td
                          className="py-3.5 px-4 sm:px-6 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailsOpen(true);
                              }}
                              className="h-7 text-xs px-2.5 hidden sm:inline-flex"
                            >
                              Details
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 text-xs border-border/80 bg-background/95 backdrop-blur-xl"
                              >
                                <DropdownMenuLabel>
                                  Update Order Pipeline
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      order.id,
                                      "confirmed",
                                      true
                                    )
                                  }
                                  className="gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                  Confirm Order
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      order.id,
                                      "preparing",
                                      true
                                    )
                                  }
                                  className="gap-2"
                                >
                                  <Package className="w-3.5 h-3.5 text-amber-500" />
                                  Warehouse Packing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      order.id,
                                      "out_for_delivery",
                                      true
                                    )
                                  }
                                  className="gap-2"
                                >
                                  <Bike className="w-3.5 h-3.5 text-purple-500" />
                                  Out for Delivery
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      order.id,
                                      "delivered",
                                      true
                                    )
                                  }
                                  className="gap-2"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  Mark as Delivered
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      order.id,
                                      "cancelled",
                                      true
                                    )
                                  }
                                  className="gap-2 text-destructive focus:text-destructive"
                                >
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/20 py-4 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Gustosa Food Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
              Meta Cloud API Graph v21.0
            </span>
          </div>
        </div>
      </footer>

      {/* Feature Dialogs */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onUpdateStatus={handleUpdateStatus}
      />

      <CreateOrderDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onOrderCreated={() => fetchOrders(true)}
      />

      <ApiConfigModal
        open={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        metaStatus={metaStatus}
      />
    </div>
  );
}
