"use client";

import React from "react";
import { Calculator, Save, Tag, Percent } from "lucide-react";

export default function RateManagementPage() {
  const products: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rate Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure base prices, margins, and bulk discounts.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Percent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Global Markup Settings</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Set standard margins that apply across product categories unless overridden.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Raw Materials (B2B)</span>
              <div className="flex items-center">
                <input type="number" defaultValue={25} className="w-16 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-colors" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Roasted/Flavored (B2B)</span>
              <div className="flex items-center">
                <input type="number" defaultValue={35} className="w-16 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-colors" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Bulk Discount Tiers</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Automatically apply volume-based discounts for large wholesale orders.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Orders {'>'} 50 kg</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">5% Discount</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Orders {'>'} 100 kg</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">8% Discount</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Orders {'>'} 500 kg</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">12% Discount</span>
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              + Add New Tier
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Product Rate Card (Per KG)</h3>
          <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center">
            <Calculator className="w-4 h-4 mr-1" /> Recalculate All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-gray-800/30">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base Cost (₹)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Margin (%)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Selling Price (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <input type="number" defaultValue={product.baseCost} className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-colors" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="number" defaultValue={product.margin} className="w-16 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-colors" />
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white text-lg">
                    ₹{product.currentPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
