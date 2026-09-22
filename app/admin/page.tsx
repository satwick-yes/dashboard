"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WhatsAppOrder } from "@/lib/types";
import { LogOut, Users, MessageSquare, Clock, Search } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<WhatsAppOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("gustosa_user");
    if (user !== "admin") {
      router.push("/");
    }
  }, [router]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch WhatsApp orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleLogout = () => {
    localStorage.removeItem("gustosa_user");
    router.push("/");
  };

  const parseMessage = (msg: WhatsAppOrder) => {
    let text = msg.notes || "Sent an order";
    let staffName = null;
    let isAgent = false;

    if (text.startsWith("Agent (")) {
      const endIdx = text.indexOf("): ");
      if (endIdx > -1) {
        staffName = text.substring(7, endIdx);
        text = text.substring(endIdx + 3);
        isAgent = true;
      }
    } else if (text.startsWith("Agent: ")) {
      staffName = "Unknown Staff";
      text = text.substring(7);
      isAgent = true;
    } else if (msg.customerName === "Agent") {
      staffName = "Unknown Staff";
      isAgent = true;
    } else if (text.startsWith("Message: \"")) {
      text = text.substring(10, text.length - 1);
    }
    
    return { text, staffName, isAgent, timestamp: new Date(msg.createdAt) };
  };

  const customerInteractions = useMemo(() => {
    const map = new Map<string, { phone: string, name: string, messages: any[], staffInvolved: Set<string>, lastActivity: Date }>();
    
    orders.forEach(order => {
      if (!map.has(order.customerPhone)) {
        map.set(order.customerPhone, {
          phone: order.customerPhone,
          name: order.customerName && order.customerName !== "Agent" ? order.customerName : "Unknown Contact",
          messages: [],
          staffInvolved: new Set(),
          lastActivity: new Date(order.createdAt)
        });
      }
      
      const session = map.get(order.customerPhone)!;
      const parsed = parseMessage(order);
      session.messages.push({ ...order, parsed });
      
      if (parsed.staffName) {
        session.staffInvolved.add(parsed.staffName);
      }
      
      const orderDate = new Date(order.createdAt);
      if (orderDate > session.lastActivity) {
        session.lastActivity = orderDate;
      }
    });

    return Array.from(map.values())
      .map(session => ({
        ...session,
        messages: session.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }))
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }, [orders]);

  const filteredInteractions = customerInteractions.filter(i => 
    i.phone.includes(searchQuery) || 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    Array.from(i.staffInvolved).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedInteraction = customerInteractions.find(i => i.phone === selectedCustomer);

  return (
    <div className="h-screen w-full flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="bg-[#25D366] text-white p-2 rounded-lg">
            <Users size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Admin Portal</h1>
            <p className="text-xs text-gray-500">Gustosa Web</p>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</div>
          <button className="flex items-center gap-3 w-full p-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <MessageSquare size={18} />
            All Interactions
          </button>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Customer Interactions</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search staff, customer, or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] w-64"
            />
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Interaction List */}
          <div className="w-1/2 md:w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
            {loading && customerInteractions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Loading data...</div>
            ) : filteredInteractions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No interactions found.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredInteractions.map(interaction => (
                  <div 
                    key={interaction.phone}
                    onClick={() => setSelectedCustomer(interaction.phone)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedCustomer === interaction.phone ? 'bg-blue-50/50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{interaction.phone}</h3>
                        <p className="text-sm text-gray-500">{interaction.name}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {interaction.lastActivity.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="text-xs font-medium text-gray-500">Staff Involved:</span>
                      {interaction.staffInvolved.size === 0 ? (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">None yet</span>
                      ) : (
                        Array.from(interaction.staffInvolved).map(staff => (
                          <span key={staff} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            {staff}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History View */}
          <div className="flex-1 bg-gray-50 flex flex-col">
            {selectedInteraction ? (
              <>
                <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
                  <div>
                    <h3 className="font-semibold text-gray-900">History: {selectedInteraction.phone}</h3>
                    <p className="text-sm text-gray-500">{selectedInteraction.name} • {selectedInteraction.messages.length} messages</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedInteraction.messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.parsed.isAgent ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-baseline gap-2 mb-1 px-1">
                        <span className="text-xs font-medium text-gray-600">
                          {msg.parsed.isAgent ? (msg.parsed.staffName || 'Unknown Agent') : (msg.customerName !== 'Agent' ? msg.customerName : 'Customer')}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {msg.parsed.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${msg.parsed.isAgent ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.parsed.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p>Select a customer to view history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
