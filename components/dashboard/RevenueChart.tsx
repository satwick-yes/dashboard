"use client";

import * as React from "react";
import { TrendingUp, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Jan', value: 1.5 },
  { name: 'Feb', value: 1.2 },
  { name: 'Mar', value: 1.7 },
  { name: 'Apr', value: 2.0 },
  { name: 'May', value: 2.2 },
  { name: 'Jun', value: 2.3 },
  { name: 'Jul', value: 1.7 },
  { name: 'Aug', value: 1.9 },
  { name: 'Sep', value: 1.6 },
  { name: 'Oct', value: 2.0 },
  { name: 'Nov', value: 2.3 },
  { name: 'Dec', value: 2.5 },
];

export function RevenueChart() {
  const renderTrend = (value: string) => (
    <span className="inline-flex items-center text-xs font-semibold ml-2 text-green-500">
      {value}
      <TrendingUp className="w-3 h-3 ml-0.5" />
    </span>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Left Column: Chart */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-gray-900 font-semibold text-sm">Revenue Run Rate</h3>
          <select className="bg-transparent border border-gray-200 rounded-md px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none">
            <option>Annual Run Rate</option>
          </select>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6b7280' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                tickFormatter={(val) => `${val}M`}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Column: Rate Coverage */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
        <h3 className="text-gray-900 font-semibold text-sm mb-6">Rate Coverage</h3>
        <div className="flex flex-col gap-3 flex-1">
          <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4">
            <div className="text-gray-500 text-xs mb-1">Active Ports</div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-gray-900">23</span>
              {renderTrend("4%")}
            </div>
          </div>
          <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4">
            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
              Rate Density
              <Info className="w-3 h-3 text-gray-400" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-gray-900">659</span>
              {renderTrend("10%")}
            </div>
          </div>
          <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4">
            <div className="text-gray-500 text-xs mb-1">Conversion Ratio</div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-gray-900">54</span>
              {renderTrend("13%")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
