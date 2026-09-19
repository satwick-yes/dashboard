import * as React from "react";
import { OrderAnalytics } from "@/lib/types";

export function MetricCards({ analytics }: { analytics: OrderAnalytics }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Left Block: Sales Enquires (Using our Orders Data) */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-900 transition-colors rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-base mb-6">Sales Enquires (Orders)</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Enquires</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.totalOrders || 0}</span>
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Pending Enquires</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.pendingOrders || 0}</span>
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Enquires Actioned</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.preparingOrders || 0}</span>
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">SLA Breached</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Block: Revenue Summary */}
      <div className="flex flex-col gap-3">
        <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex-1">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Revenue</div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">₹{(analytics.totalRevenue || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex-1">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Revenue from sales</div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">₹{((analytics.totalRevenue || 0) * 0.8).toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex-1">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Revenue from commission</div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">₹{((analytics.totalRevenue || 0) * 0.2).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
