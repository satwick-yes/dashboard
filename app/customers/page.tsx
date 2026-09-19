"use client";

import React from "react";
import { Search, Filter, MoreHorizontal, Download, Mail, Phone, MapPin } from "lucide-react";

export default function CustomersPage() {
  const customers: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage wholesale buyers, order history, and lifetime value.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone, or ID..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-gray-800/30">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Business Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lifetime Value</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{cust.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cust.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{cust.contact}</div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="w-3 h-3 mr-1" /> {cust.phone}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="w-3 h-3 mr-1" /> {cust.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {cust.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                    {cust.orders}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {cust.ltv}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cust.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      cust.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {cust.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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
