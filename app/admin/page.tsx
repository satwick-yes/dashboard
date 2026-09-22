"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WhatsAppOrder } from "@/lib/types";
import { LogOut, Users, MessageSquare, Clock, Search, UserPlus, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"interactions" | "staff">("interactions");
  
  const [orders, setOrders] = useState<WhatsAppOrder[]>([]);
  const [staffAccounts, setStaffAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newStaffUsername, setNewStaffUsername] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [staffError, setStaffError] = useState("");
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);

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
      if (activeTab === "interactions") setLoading(false);
    }
  }, [activeTab]);
  
  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch("/api/staff", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setStaffAccounts(data.staff || []);
      }
    } catch (err) {
      console.error("Failed to fetch staff accounts:", err);
    } finally {
      if (activeTab === "staff") setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "interactions") {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    } else {
      fetchStaff();
    }
  }, [activeTab, fetchOrders, fetchStaff]);

  const handleLogout = () => {
    localStorage.removeItem("gustosa_user");
    router.push("/");
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError("");
    
    if (!newStaffUsername.trim() || !newStaffPassword.trim()) {
      setStaffError("Both username and password are required");
      return;
    }
    
    setIsCreatingStaff(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newStaffUsername, password: newStaffPassword })
      });
      const data = await res.json();
      if (data.success) {
        setNewStaffUsername("");
        setNewStaffPassword("");
        fetchStaff();
      } else {
        setStaffError(data.error || "Failed to create account");
      }
    } catch (err) {
      setStaffError("Network error occurred");
    } finally {
      setIsCreatingStaff(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff account?")) return;
    
    try {
      const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchStaff();
      } else {
        alert("Failed to delete account: " + data.error);
      }
    } catch (err) {
      alert("Network error occurred");
    }
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
        
        <div className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</div>
          <button 
            onClick={() => setActiveTab("interactions")}
            className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition-colors ${activeTab === 'interactions' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <MessageSquare size={18} />
            All Interactions
          </button>
          <button 
            onClick={() => setActiveTab("staff")}
            className={`flex items-center gap-3 w-full p-3 rounded-lg font-medium transition-colors ${activeTab === 'staff' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <UserPlus size={18} />
            Staff Management
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
          <h2 className="text-lg font-semibold text-gray-800">
            {activeTab === 'interactions' ? 'Customer Interactions' : 'Manage Staff Accounts'}
          </h2>
          {activeTab === 'interactions' && (
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
          )}
        </header>

        {/* Dashboard Body */}
        {activeTab === "interactions" ? (
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
        ) : (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto flex gap-8 flex-col md:flex-row">
              {/* Create Staff Form */}
              <div className="w-full md:w-1/3">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Staff</h3>
                  <form onSubmit={handleCreateStaff} className="space-y-4">
                    {staffError && (
                      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {staffError}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username (Staff ID)</label>
                      <input 
                        type="text" 
                        value={newStaffUsername}
                        onChange={e => setNewStaffUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                        placeholder="e.g. john_doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input 
                        type="password" 
                        value={newStaffPassword}
                        onChange={e => setNewStaffPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                        placeholder="••••••••"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isCreatingStaff}
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isCreatingStaff ? "Creating..." : "Create Account"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Staff List */}
              <div className="w-full md:w-2/3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                        <th className="p-4 font-medium">Staff Username</th>
                        <th className="p-4 font-medium">Date Created</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffAccounts.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-gray-500">No staff accounts found.</td>
                        </tr>
                      ) : (
                        staffAccounts.map(account => (
                          <tr key={account.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">{account.username}</td>
                            <td className="p-4 text-sm text-gray-500">{new Date(account.created_at).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => handleDeleteStaff(account.id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center"
                                title="Delete Staff Account"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
