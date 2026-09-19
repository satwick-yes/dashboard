"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppOrder, OrderStatus } from "@/lib/types";
import {
  Clock,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Package,
  Bike,
  PackageCheck,
  Send,
  Loader2,
  Receipt,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface OrderDetailsDialogProps {
  order: WhatsAppOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus, notifyCustomer: boolean) => Promise<void>;
}

const STATUS_PROGRESSION: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "pending", label: "Pending", icon: <Clock className="w-3.5 h-3.5" /> },
  { status: "confirmed", label: "Confirmed", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { status: "preparing", label: "Warehouse Packing", icon: <Package className="w-3.5 h-3.5" /> },
  { status: "out_for_delivery", label: "Out for Delivery", icon: <Bike className="w-3.5 h-3.5" /> },
  { status: "delivered", label: "Delivered", icon: <PackageCheck className="w-3.5 h-3.5" /> },
];

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
}: OrderDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [notifyCustomer, setNotifyCustomer] = React.useState(true);

  if (!order) return null;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setIsUpdating(true);
      await onUpdateStatus(order.id, newStatus, notifyCustomer);
      toast.success(`Order ${order.orderNumber} updated to ${newStatus.replace(/_/g, " ")}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case "pending":
        return "confirmed";
      case "confirmed":
        return "preparing";
      case "preparing":
        return "out_for_delivery";
      case "out_for_delivery":
        return "delivered";
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border/80 bg-background/95 backdrop-blur-xl">
        {/* Header with Order Number and Status */}
        <div className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xl font-bold tracking-tight text-foreground">
                  {order.orderNumber}
                </span>
                <Badge variant={order.status} className="capitalize px-2.5 py-0.5">
                  {order.status.replace(/_/g, " ")}
                </Badge>
                {order.isMock && (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Simulated
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Placed {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>

            {/* Quick Status Action Button */}
            {nextStatus && (
              <Button
                size="sm"
                onClick={() => handleStatusChange(nextStatus)}
                disabled={isUpdating}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm gap-1.5"
              >
                {isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Mark as {nextStatus.replace(/_/g, " ")}
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer & Delivery Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 p-4 bg-card/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-primary" />
                Customer Details
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-mono">
                  <Phone className="w-3 h-3 text-[#25D366]" />
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-primary"
                  >
                    {order.customerPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 p-4 bg-card/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Delivery Address
              </div>
              <p className="text-sm text-foreground leading-relaxed">{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Customer Notes if available */}
          {order.notes && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold">Customer WhatsApp Note:</span> {order.notes}
              </div>
            </div>
          )}

          {/* Order Items List */}
          <div className="rounded-xl border border-border/60 overflow-hidden bg-card/30">
            <div className="px-4 py-3 bg-muted/40 border-b border-border/60 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-primary" />
                Ordered Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
              <span className="text-xs font-mono text-muted-foreground">Price</span>
            </div>
            <div className="divide-y divide-border/40">
              {order.items.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
                    </div>
                  </div>
                  <span className="font-mono text-sm font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="p-4 bg-muted/20 border-t border-border/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="font-mono">₹{order.deliveryFee.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border/60">
                <span>Total Amount</span>
                <span className="font-mono text-base text-primary">
                  ₹{order.totalAmount.toFixed(2)} {order.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Workflow Status Controls */}
          <div className="rounded-xl border border-border/60 p-4 space-y-3 bg-card/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Change Pipeline Status
              </span>
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyCustomer}
                  onChange={(e) => setNotifyCustomer(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 accent-[#25D366]"
                />
                Auto-notify customer on WhatsApp
              </label>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {STATUS_PROGRESSION.map((step) => {
                const isActive = order.status === step.status;
                return (
                  <Button
                    key={step.status}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(step.status)}
                    className="text-xs gap-1.5"
                  >
                    {step.icon}
                    {step.label}
                  </Button>
                );
              })}
              {order.status !== "cancelled" && (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange("cancelled")}
                  className="text-xs gap-1.5 ml-auto"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
