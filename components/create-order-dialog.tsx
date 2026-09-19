"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MessageSquare, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated: () => void;
}

const POPULAR_MENU_ITEMS = [
  { name: "Premium Raw Phool Makhana (5kg)", price: 85.0 },
  { name: "Classic Salted Roasted Makhana (1kg)", price: 22.0 },
  { name: "Peri Peri Spiced Makhana (500g)", price: 12.5 },
  { name: "Cheese & Herbs Makhana (500g)", price: 12.5 },
  { name: "Caramel Crunch Makhana (250g)", price: 8.0 },
  { name: "Mint Pudina Roasted Makhana (250g)", price: 8.0 },
];

export function CreateOrderDialog({
  open,
  onOpenChange,
  onOrderCreated,
}: CreateOrderDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [customerName, setCustomerName] = React.useState("Elena Rossi");
  const [customerPhone, setCustomerPhone] = React.useState("+1 (555) 382-9912");
  const [deliveryAddress, setDeliveryAddress] = React.useState("124 Mulberry St, New York, NY 10013");
  const [notes, setNotes] = React.useState("Please pack in moisture-proof bulk bags.");
  const [items, setItems] = React.useState([
    { id: "1", name: "Premium Raw Phool Makhana (5kg)", quantity: 2, price: 85.0 },
    { id: "2", name: "Classic Salted Roasted Makhana (1kg)", quantity: 5, price: 22.0 },
  ]);

  const addItem = (preset?: { name: string; price: number }) => {
    const defaultItem = preset || POPULAR_MENU_ITEMS[0];
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: defaultItem.name,
        quantity: 1,
        price: defaultItem.price,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setItems(items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_order",
          customerName,
          customerPhone,
          deliveryAddress,
          notes,
          items,
          subtotal,
          paymentStatus: "pending",
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`WhatsApp Order ${data.order.orderNumber} simulated successfully!`);
        onOrderCreated();
        onOpenChange(false);
      } else {
        toast.error(data.error || "Failed to create order");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto border-border/80 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
            <DialogTitle>Simulate Incoming Wholesale/Retail Order</DialogTitle>
          </div>
          <DialogDescription>
            Simulate a customer placing an interactive wholesale order through WhatsApp Business API.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Customer Name</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Marco Vieri"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">WhatsApp Phone Number</label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Delivery Address</label>
            <Input
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="e.g. 72 Carmine Street, Apt 4B, New York, NY"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Customer Message / Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ring bell for unit 4B"
            />
          </div>

          {/* Items Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Order Items
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem()}
                className="h-7 text-xs gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-muted/20"
                >
                  <select
                    value={item.name}
                    onChange={(e) => {
                      const selected = POPULAR_MENU_ITEMS.find((p) => p.name === e.target.value);
                      if (selected) {
                        setItems(
                          items.map((i) =>
                            i.id === item.id ? { ...i, name: selected.name, price: selected.price } : i
                          )
                        );
                      }
                    }}
                    className="flex-1 bg-background/80 border border-input rounded-lg px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {POPULAR_MENU_ITEMS.map((menu) => (
                      <option key={menu.name} value={menu.name}>
                        {menu.name} (₹{menu.price.toFixed(2)})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center text-xs font-semibold font-mono">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>

                  <span className="font-mono text-xs font-semibold w-16 text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-muted/40 rounded-xl flex justify-between items-center text-sm font-semibold">
              <span>Estimated Total (incl. ₹5 delivery)</span>
              <span className="font-mono text-primary">₹{(subtotal + 5.0).toFixed(2)} INR</span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Send Mock WhatsApp Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
