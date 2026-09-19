"use client";

import React from "react";
import { Server, Activity, Database, Globe, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ControlTowerPage() {
  const systems: any[] = [];
  const alerts: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Control Tower</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time system health and infrastructure monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systems.map((sys, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <sys.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              {sys.status === "operational" ? (
                <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Healthy
                </span>
              ) : (
                <span className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Degraded
                </span>
              )}
            </div>
            <h3 className="text-gray-900 dark:text-white font-semibold text-base">{sys.name}</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{sys.uptime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Latency</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{sys.latency}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm transition-colors">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Recent System Alerts</h3>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
              <div className="mt-0.5 shrink-0">
                {alert.type === "error" && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {alert.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {alert.type === "info" && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
