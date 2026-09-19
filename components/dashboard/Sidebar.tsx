import * as React from "react";
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
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
      <div className="p-6">
        {/* Placeholder for Logo if any, otherwise empty space similar to image top-left */}
        <div className="h-8"></div>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
          <Server className="w-4 h-4 text-indigo-600" />
          Control Tower
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50/50 rounded-md border-l-4 border-indigo-600">
          <LayoutDashboard className="w-4 h-4 text-indigo-600" />
          Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
          <BarChart3 className="w-4 h-4 text-gray-400" />
          Analytics
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
          <Wallet className="w-4 h-4 text-gray-400" />
          Sales
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
          <ShoppingCart className="w-4 h-4 text-gray-400" />
          Procurement
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
          <Calculator className="w-4 h-4 text-gray-400" />
          Rate Management
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
          <Users className="w-4 h-4 text-gray-400" />
          Customers
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md">
          <Settings className="w-4 h-4 text-gray-400" />
          Settings
        </a>
      </nav>
    </aside>
  );
}
