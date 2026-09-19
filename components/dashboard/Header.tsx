import * as React from "react";
import { Search, MessageSquare, Bell, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10 transition-colors">
      <div className="flex-1 max-w-2xl mx-auto flex items-center justify-center">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 border-none rounded-full text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <ThemeToggle />
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <MessageSquare className="h-5 w-5" />
        </button>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 overflow-hidden flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        </div>
      </div>
    </header>
  );
}
