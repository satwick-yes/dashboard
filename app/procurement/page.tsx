"use client";

import React from "react";
import { Package, Truck, AlertCircle, ShoppingCart } from "lucide-react";

export default function ProcurementPage() {
  const inventory: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Procurement & Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage raw material supplies, vendors, and re-order levels.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Create PO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Value of Inventory", value: "₹0", alert: false, icon: Package },
          { title: "Items Low on Stock", value: "0 Items", alert: false, icon: AlertCircle },
          { title: "Active Purchase Orders", value: "0 Orders", alert: false, icon: Truck },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
                <p className={`text-3xl font-bold mt-2 ${stat.alert ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.alert ? 'bg-red-50 dark:bg-red-900/30' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}>
                <stat.icon className={`w-6 h-6 ${stat.alert ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Raw Material Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-gray-800/30">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Min Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Primary Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{item.item}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.id}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{item.stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.minStock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Low Stock' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
