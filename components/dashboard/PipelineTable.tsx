"use client";

import * as React from "react";
import { WhatsAppOrder, OrderStatus, OrderItem } from "@/lib/types";
import { ArrowUpDown, RefreshCw, Phone, Clock, PlayCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface PipelineTableProps {
  orders: WhatsAppOrder[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus, notifyCustomer: boolean) => Promise<void>;
  onSelectOrder: (order: WhatsAppOrder) => void;
  loading: boolean;
}

export function PipelineTable({ orders, onUpdateStatus, onSelectOrder, loading }: PipelineTableProps) {
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-600"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
      case "confirmed":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">Confirmed</span>;
      case "preparing":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-600"><PlayCircle className="w-3 h-3 mr-1" /> Packing</span>;
      case "out_for_delivery":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">Dispatched</span>;
      case "delivered":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-600">Delivered</span>;
      case "cancelled":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600">Cancelled</span>;
      default:
        return <span className="text-gray-500 dark:text-gray-400 text-sm">{status}</span>;
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl transition-colors rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6 shadow-sm overflow-hidden relative z-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-base">B2B Orders Pipeline</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50/50 rounded-lg">
              <th className="px-4 py-3 text-xs font-semibold text-indigo-900 uppercase tracking-wider rounded-l-lg">
                <div className="flex items-center gap-1">Order ID <ArrowUpDown className="w-3 h-3 text-indigo-300" /></div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                <div className="flex items-center gap-1">Buyer <ArrowUpDown className="w-3 h-3 text-indigo-300" /></div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-indigo-900 uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                <div className="flex items-center gap-1">Total <ArrowUpDown className="w-3 h-3 text-indigo-300" /></div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-indigo-900 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-indigo-900 uppercase tracking-wider rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                  <p className="text-sm">Loading pipeline...</p>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <p className="text-base font-medium">No orders found.</p>
                  <p className="text-sm">Incoming WhatsApp orders will appear here.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} onClick={() => onSelectOrder(order)} className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{order.orderNumber}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(order.createdAt), "MMM d, HH:mm")}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">{order.customerName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                      <Phone className="w-3 h-3 mr-1" /> {order.customerPhone}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                    {order.items.map((i: OrderItem) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-base font-bold text-gray-900 dark:text-gray-100">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {order.status === "pending" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, "preparing", true); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-sm flex items-center"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Confirm & Pack
                      </button>
                    )}
                    {order.status === "preparing" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, "out_for_delivery", true); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-sm flex items-center"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
