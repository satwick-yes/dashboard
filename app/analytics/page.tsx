"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, ShoppingBag, CreditCard } from "lucide-react";

const revenueData: any[] = [];
const statusData: any[] = [];

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your wholesale performance and revenue trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", value: "₹0", change: "0%", icon: CreditCard },
          { title: "Active Orders", value: "0", change: "0%", icon: ShoppingBag },
          { title: "New B2B Clients", value: "0", change: "0%", icon: Users },
          { title: "Avg. Order Value", value: "₹0", change: "0%", icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
                <stat.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm transition-colors">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Revenue Trend (7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col transition-colors">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Order Status Distribution</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#374151', fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {statusData.map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{stat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
