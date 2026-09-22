"use client";

import React, { useState } from "react";
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

// Mock data
const mockChats = [
  {
    id: 1,
    phone: "+1 (555) 123-4567",
    lastMessage: "Is my order ready for pickup?",
    timestamp: "10:42 AM",
    unread: 2,
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    phone: "+1 (555) 987-6543",
    lastMessage: "Thanks for the quick delivery!",
    timestamp: "Yesterday",
    unread: 0,
    avatar: "",
  },
  {
    id: 3,
    phone: "+44 7700 900077",
    lastMessage: "Can I add extra sauce to my order?",
    timestamp: "Monday",
    unread: 1,
    avatar: "",
  },
  {
    id: 4,
    phone: "+91 98765 43210",
    lastMessage: "I received the wrong item.",
    timestamp: "Sunday",
    unread: 0,
    avatar: "",
  },
];

const mockMessages = [
  { id: 1, text: "Hi, I placed an order 30 mins ago.", sender: "customer", timestamp: "10:30 AM" },
  { id: 2, text: "Hello! Let me check the status for you.", sender: "agent", timestamp: "10:32 AM", status: "read" },
  { id: 3, text: "Your order is currently being prepared and will be out for delivery in 10 minutes.", sender: "agent", timestamp: "10:34 AM", status: "read" },
  { id: 4, text: "Great, thank you!", sender: "customer", timestamp: "10:35 AM" },
  { id: 5, text: "Is my order ready for pickup?", sender: "customer", timestamp: "10:42 AM" },
];

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
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const selectedChat = mockChats.find((c) => c.id === selectedChatId);

  const filteredChats = mockChats.filter((chat) =>
    chat.phone.includes(searchQuery)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: messageInput,
      sender: "agent",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white font-sans text-[#111B21]">
      {/* Left Sidebar (Customer List) */}
      <div
        className={`${
          selectedChatId ? "hidden md:flex" : "flex"
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
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`flex items-center px-3 py-3 cursor-pointer transition-colors group ${
                selectedChatId === chat.id ? "bg-[#F0F2F5]" : "hover:bg-[#F5F6F6]"
              }`}
            >
              <Avatar className="h-12 w-12 mr-3" src={chat.avatar} fallback={chat.phone.substring(0, 2)} />
              
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
          ))}
        </div>
      </div>

      {/* Right Main Area (Active Chat Dashboard) */}
      <div className={`${
        !selectedChatId ? "hidden md:flex" : "flex"
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
                  onClick={() => setSelectedChatId(null)}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <Avatar className="mr-3" src={selectedChat.avatar} fallback={selectedChat.phone.substring(0, 2)} />
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

              {messages.map((msg) => {
                const isAgent = msg.sender === "agent";
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
                        {msg.text}
                      </div>
                      <div className="float-right -mt-3 ml-2 flex items-center h-[15px] pt-1">
                        <span className="text-[11px] text-[#667781] mr-1 leading-none">{msg.timestamp}</span>
                        {isAgent && (
                          <span className="text-[#53BDEB] leading-none">
                            {msg.status === "read" ? (
                              <CheckCheck size={14} strokeWidth={2.5} />
                            ) : (
                              <Check size={14} strokeWidth={2.5} className="text-[#667781]" />
                            )}
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
