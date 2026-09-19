import * as React from "react";
import { OrderAnalytics } from "@/lib/types";
import { TrendingUp, TrendingDown } from "lucide-react";

export function MetricCards({ analytics }: { analytics: OrderAnalytics }) {
  // Helpers for trending percentages (mocking trends for UI accuracy)
  const renderTrend = (value: string, isPositive: boolean) => (
    <span className={`inline-flex items-center text-sm font-semibold ml-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {value}
      {isPositive ? <TrendingUp className="w-3 h-3 ml-0.5" /> : <TrendingDown className="w-3 h-3 ml-0.5" />}
    </span>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Left Block: Sales Enquires (Using our Orders Data) */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
        <h3 className="text-gray-900 font-semibold text-base mb-6">Sales Enquires (Orders)</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-gray-500 text-sm mb-1">Total Enquires</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">{analytics.totalOrders || 0}</span>
              {renderTrend("21%", true)}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Pending Enquires</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">{analytics.pendingOrders || 0}</span>
              {renderTrend("4%", false)}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Enquires Actioned</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">{analytics.preparingOrders || 0}</span>
              {renderTrend("3%", true)}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">SLA Breached</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">06</span>
              {renderTrend("6%", false)}
            </div>
          </div>
        </div>
      </div>

      {/* Right Block: Revenue Summary */}
      <div className="flex flex-col gap-3">
        <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4 flex-1">
          <div className="text-gray-500 text-sm mb-1">Total Revenue</div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900">₹{(analytics.totalRevenue || 0).toLocaleString()}</span>
            {renderTrend("11%", true)}
          </div>
        </div>
        <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4 flex-1">
          <div className="text-gray-500 text-sm mb-1">Revenue from sales</div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900">₹{((analytics.totalRevenue || 0) * 0.8).toLocaleString()}</span>
            {renderTrend("7%", true)}
          </div>
        </div>
        <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4 flex-1">
          <div className="text-gray-500 text-sm mb-1">Revenue from commission</div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900">₹{((analytics.totalRevenue || 0) * 0.2).toLocaleString()}</span>
            {renderTrend("6%", true)}
          </div>
        </div>
      </div>
    </div>
  );
}
