"use client";

import React from "react";
import { Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight, Phone, Mail } from "lucide-react";

export default function SalesPage() {
  const leads: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage B2B leads, wholesale accounts, and active deals.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          Add New Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Pipeline Value", value: "₹0", change: "0%", icon: ArrowUpRight, positive: true },
          { title: "Avg. Deal Size", value: "₹0", change: "0%", icon: ArrowDownRight, positive: false },
          { title: "Win Rate (30d)", value: "0%", change: "0%", icon: ArrowUpRight, positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
            <div className="flex items-baseline gap-3 mt-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <span className={`flex items-center text-sm font-medium ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change}
                <stat.icon className="w-4 h-4 ml-0.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-gray-800/30">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead / Account</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Est. Value</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Win Prob.</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{lead.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lead.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{lead.contact}</div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Phone className="w-3 h-3 mr-1" /> {lead.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 'Closed Won' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      lead.status === 'Negotiating' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      lead.status === 'Proposal Sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{lead.value}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full" 
                          style={{ width: lead.probability }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 w-8">{lead.probability}</span>
                    </div>
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
