"use client";

import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User, Bell, Key, Shield, Smartphone } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account, preferences, and API connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          {[
            { name: "Profile", icon: User, active: true },
            { name: "Appearance", icon: Smartphone, active: false },
            { name: "Notifications", icon: Bell, active: false },
            { name: "API Keys", icon: Key, active: false },
            { name: "Security", icon: Shield, active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                item.active 
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your personal details and business info.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0">
                  <User className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                </div>
                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors shadow-sm">
                  Change Avatar
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
                  <input type="text" defaultValue="Gustosa Food Wholesale" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize how the dashboard looks on your device.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Toggle between light and dark themes.</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
