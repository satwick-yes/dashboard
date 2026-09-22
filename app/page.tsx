"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  MoreVertical,
  MessageSquare,
  CircleDashed,
  Paperclip,
  Smile,
  Mic,
  Send,
  Check,
  CheckCheck,
} from "lucide-react";
import { WhatsAppOrder } from "@/lib/types";

const Avatar = ({ src, fallback, className = "" }: { src?: string; fallback: string; className?: string }) => {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-300 ${className}`}>
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600 uppercase">
          {fallback}
        </span>
      )}
    </div>
  );
};

export default function WhatsAppWebClone() {
  const [selectedChatPhone, setSelectedChatPhone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [orders, setOrders] = useState<WhatsAppOrder[]>([]);
  const [loading, setLoading] = useState(true);

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
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Group orders into chats by customerPhone
  const chats = useMemo(() => {
    const chatMap = new Map<string, WhatsAppOrder[]>();
    
    // Sort oldest to newest for chronological order inside chats
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    sortedOrders.forEach(order => {
      if (!chatMap.has(order.customerPhone)) {
        chatMap.set(order.customerPhone, []);
      }
      chatMap.get(order.customerPhone)!.push(order);
    });

    return Array.from(chatMap.entries()).map(([phone, messages]) => {
      const lastMessage = messages[messages.length - 1];
      const name = messages.find(m => m.customerName && m.customerName !== "Agent")?.customerName || "Unknown Contact";
      
      let lastMsgText = lastMessage.notes || "Sent an order";
      if (lastMsgText.startsWith("Agent: ")) {
        lastMsgText = lastMsgText.substring(7);
      } else if (lastMsgText.startsWith("Message: \"")) {
        lastMsgText = lastMsgText.substring(10, lastMsgText.length - 1);
      }

      return {
        phone,
        name,
        lastMessage: lastMsgText,
        timestamp: new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: messages,
        unread: 0, // Mocking unread as 0 for real data for now
        avatar: "",
      };
    }).sort((a, b) => {
      const lastA = a.messages[a.messages.length - 1];
      const lastB = b.messages[b.messages.length - 1];
      return new Date(lastB.createdAt).getTime() - new Date(lastA.createdAt).getTime();
    });
  }, [orders]);

  const filteredChats = chats.filter((chat) =>
    chat.phone.includes(searchQuery) || chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChat = chats.find((c) => c.phone === selectedChatPhone);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChatPhone) return;

    const textToSend = messageInput;
    setMessageInput("");

    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          customerPhone: selectedChatPhone,
          text: textToSend,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Fetch fresh data
        fetchOrders();
      } else {
        console.error("Failed to send:", data.error);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white font-sans text-[#111B21]">
      {/* Left Sidebar (Customer List) */}
      <div
        className={`${
          selectedChatPhone ? "hidden md:flex" : "flex"
        } w-full md:w-[400px] flex-col border-r border-gray-200 bg-white`}
      >
        {/* Top Header */}
        <div className="bg-[#F0F2F5] h-[60px] flex items-center justify-between px-4 py-2 flex-shrink-0">
          <Avatar className="cursor-pointer" src="https://github.com/shadcn.png" fallback="ME" />
          <div className="flex items-center gap-4 text-[#54656F]">
            <button className="hover:bg-black/5 p-2 rounded-full transition-colors"><CircleDashed size={20} /></button>
            <button className="hover:bg-black/5 p-2 rounded-full transition-colors"><MessageSquare size={20} /></button>
            <button className="hover:bg-black/5 p-2 rounded-full transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2 bg-white border-b border-gray-200">
          <div className="flex items-center bg-[#F0F2F5] rounded-lg px-3 py-1.5 h-9">
            <Search size={18} className="text-[#54656F] mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent border-none outline-none w-full text-sm text-[#111B21] placeholder:text-[#54656F]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto bg-white">
          {loading && chats.length === 0 ? (
             <div className="p-4 text-center text-sm text-gray-500">Loading chats...</div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No chats found.</div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.phone}
                onClick={() => setSelectedChatPhone(chat.phone)}
                className={`flex items-center px-3 py-3 cursor-pointer transition-colors group ${
                  selectedChatPhone === chat.phone ? "bg-[#F0F2F5]" : "hover:bg-[#F5F6F6]"
                }`}
              >
                <Avatar className="h-12 w-12 mr-3" fallback={chat.name.substring(0, 2) || chat.phone.substring(0, 2)} />
                
                <div className="flex-1 min-w-0 border-b border-gray-100 pb-3 group-last:border-none h-full flex flex-col justify-center">
                  <div className="flex justify-between items-baseline mb-1">
                    <h2 className="font-semibold text-[17px] truncate text-[#111B21]">
                      {chat.phone}
                    </h2>
                    <span className={`text-xs flex-shrink-0 ml-2 ${chat.unread ? 'text-[#25D366] font-medium' : 'text-[#667781]'}`}>
                      {chat.timestamp}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#667781] truncate pr-2">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-[#25D366] text-white text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Main Area (Active Chat Dashboard) */}
      <div className={`${
        !selectedChatPhone ? "hidden md:flex" : "flex"
      } flex-1 flex-col bg-[#F0F2F5]`}
      >
        {!selectedChat ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center bg-[#F0F2F5] border-b-[6px] border-[#25D366]">
            <div className="bg-white p-8 rounded-full shadow-sm mb-8">
               <MessageSquare size={64} className="text-[#8696A0] font-light" strokeWidth={1} />
            </div>
            <h1 className="text-[32px] font-light text-[#41525D] mb-4">WhatsApp Web</h1>
            <p className="text-[#667781] text-sm max-w-md text-center">
              Send and receive messages without keeping your phone online.
              <br />
              Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
            </p>
          </div>
        ) : (
          /* Active Chat */
          <>
            {/* Chat Header */}
            <div className="bg-[#F0F2F5] h-[60px] flex items-center justify-between px-4 py-2 flex-shrink-0 border-l border-gray-200">
              <div className="flex items-center cursor-pointer">
                <button 
                  className="md:hidden mr-2 p-1 text-[#54656F]" 
                  onClick={() => setSelectedChatPhone(null)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <Avatar className="mr-3" fallback={selectedChat.name.substring(0, 2) || selectedChat.phone.substring(0, 2)} />
                <div>
                  <h2 className="font-semibold text-[#111B21] text-[16px]">{selectedChat.phone}</h2>
                  <p className="text-xs text-[#667781]">online</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[#54656F]">
                <button className="hover:bg-black/5 p-2 rounded-full transition-colors"><Search size={20} /></button>
                <button className="hover:bg-black/5 p-2 rounded-full transition-colors"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#EFEAE2] flex flex-col gap-2 relative">
              <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'url("https://static.whatsapp.net/rsrc.php/v3/yl/r/r_QZ3O9xZ8H.png")', backgroundSize: 'contain' }}></div>
              
              <div className="text-center my-2 relative z-10">
                <span className="bg-[#FFF3C4] text-[#54656F] text-xs px-3 py-1.5 rounded-lg shadow-sm">
                  Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
                </span>
              </div>

              {selectedChat.messages.map((msg) => {
                let text = msg.notes || "Sent an order";
                const isAgent = text.startsWith("Agent: ") || msg.customerName === "Agent";
                
                if (text.startsWith("Agent: ")) {
                  text = text.substring(7);
                } else if (text.startsWith("Message: \"")) {
                  text = text.substring(10, text.length - 1);
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAgent ? "justify-end" : "justify-start"} relative z-10 mb-1`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[65%] rounded-lg px-2 pt-2 pb-1 relative shadow-sm ${
                        isAgent ? "bg-[#D9FDD3] rounded-tr-none" : "bg-white rounded-tl-none"
                      }`}
                    >
                      <div className="text-[14.2px] leading-[19px] text-[#111B21] whitespace-pre-wrap pb-[10px] pr-2">
                        {text}
                      </div>
                      <div className="float-right -mt-3 ml-2 flex items-center h-[15px] pt-1">
                        <span className="text-[11px] text-[#667781] mr-1 leading-none">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isAgent && (
                          <span className="text-[#53BDEB] leading-none">
                            <CheckCheck size={14} strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input Container */}
            <div className="bg-[#F0F2F5] min-h-[62px] px-4 py-2.5 flex items-end gap-3 flex-shrink-0 z-20">
              <button className="text-[#54656F] hover:text-[#111B21] p-2 mb-1 transition-colors">
                <Smile size={24} />
              </button>
              <button className="text-[#54656F] hover:text-[#111B21] p-2 mb-1 transition-colors">
                <Paperclip size={24} />
              </button>
              
              <form onSubmit={handleSendMessage} className="flex-1 flex bg-white rounded-lg items-center border-none focus-within:ring-0">
                <input
                  type="text"
                  placeholder="Type a message"
                  className="w-full bg-transparent border-none outline-none px-4 py-2.5 text-[15px] text-[#111B21] placeholder:text-[#8696A0]"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
              </form>
              
              {messageInput.trim() ? (
                <button 
                  onClick={handleSendMessage}
                  className="text-[#54656F] hover:text-[#111B21] p-2 mb-1 transition-colors"
                >
                  <Send size={24} />
                </button>
              ) : (
                <button className="text-[#54656F] hover:text-[#111B21] p-2 mb-1 transition-colors">
                  <Mic size={24} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
