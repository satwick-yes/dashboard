"use client";

import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Smartphone } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your dashboard preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize how the dashboard looks on your device.</p>
            </div>
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
  );
}
