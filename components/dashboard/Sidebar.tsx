"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  Wallet, 
  ShoppingCart, 
  Calculator, 
  Users, 
  Settings,
  Server
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Control Tower", href: "/control-tower", icon: Server },
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Sales", href: "/sales", icon: Wallet },
    { name: "Procurement", href: "/procurement", icon: ShoppingCart },
    { name: "Rate Management", href: "/rate-management", icon: Calculator },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
      <div className="p-6">
        <div className="h-8"></div>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? "text-indigo-700 bg-indigo-50/50 border-l-4 border-indigo-600" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
