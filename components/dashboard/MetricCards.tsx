import * as React from "react";
import { OrderAnalytics } from "@/lib/types";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  IndianRupee, 
  TrendingUp, 
  PieChart 
} from "lucide-react";

export function MetricCards({ analytics }: { analytics: OrderAnalytics }) {
  const topMetrics = [
    { 
      label: "Total Orders", 
      value: analytics.totalOrders || 0, 
      icon: ShoppingBag, 
      color: "text-blue-500 dark:text-blue-400", 
      bg: "bg-blue-500/10 border-blue-500/20",
      glow: "from-blue-500/20"
    },
    { 
      label: "Pending Review", 
      value: analytics.pendingOrders || 0, 
      icon: Clock, 
      color: "text-amber-500 dark:text-amber-400", 
      bg: "bg-amber-500/10 border-amber-500/20",
      glow: "from-amber-500/20"
    },
    { 
      label: "Actioned / Packed", 
      value: analytics.preparingOrders || 0, 
      icon: CheckCircle2, 
      color: "text-emerald-500 dark:text-emerald-400", 
      bg: "bg-emerald-500/10 border-emerald-500/20",
      glow: "from-emerald-500/20"
    },
    { 
      label: "SLA Breached", 
      value: 0, 
      icon: AlertOctagon, 
      color: "text-rose-500 dark:text-rose-400", 
      bg: "bg-rose-500/10 border-rose-500/20",
      glow: "from-rose-500/20"
    },
  ];

  const revTotal = analytics.totalRevenue || 0;
  
  const revenueMetrics = [
    { 
      label: "Total Revenue", 
      value: revTotal, 
      icon: IndianRupee, 
      color: "text-indigo-500 dark:text-indigo-400", 
      bg: "bg-indigo-500/10 border-indigo-500/20" 
    },
    { 
      label: "Revenue from Sales", 
      value: revTotal * 0.8, 
      icon: TrendingUp, 
      color: "text-violet-500 dark:text-violet-400", 
      bg: "bg-violet-500/10 border-violet-500/20" 
    },
    { 
      label: "Commission Revenue", 
      value: revTotal * 0.2, 
      icon: PieChart, 
      color: "text-fuchsia-500 dark:text-fuchsia-400", 
      bg: "bg-fuchsia-500/10 border-fuchsia-500/20" 
    },
  ];

  return (
    <div className="space-y-6 mb-8 relative z-10">
      {/* Top Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topMetrics.map((m, i) => (
          <div 
            key={i} 
            className="group relative overflow-hidden p-6 rounded-2xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Subtle glow effect */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${m.glow} to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{m.label}</p>
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {m.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${m.bg} ${m.color} transition-transform duration-300 group-hover:scale-110`}>
                <m.icon className="w-6 h-6" strokeWidth={2} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {revenueMetrics.map((m, i) => (
          <div 
            key={i} 
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/40 dark:bg-gray-900/20 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors"
          >
            <div className={`p-3.5 rounded-full ${m.bg} ${m.color}`}>
              <m.icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{m.label}</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                ₹{m.value.toLocaleString()}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
