"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // If already logged in, redirect
    const user = localStorage.getItem("gustosa_user");
    if (user) {
      if (user === "admin") {
        router.push("/admin");
      } else {
        router.push("/chat");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (username.trim().toLowerCase() === "admin") {
      if (password === "admin123") {
        localStorage.setItem("gustosa_user", "admin");
        router.push("/admin");
      } else {
        setError("Invalid admin credentials.");
      }
    } else {
      if (!password.trim()) {
        setError("Password is required.");
        return;
      }
      // For staff, we just accept any password for now as per simple auth
      localStorage.setItem("gustosa_user", username.trim());
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#25D366] p-8 text-center text-white">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Coffee size={32} className="text-[#25D366]" />
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Gustosa Web</h1>
          <p className="text-[#D9FDD3]">Sign in to access the dashboard</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username / Staff ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] shadow-sm"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Gustosa Food. All rights reserved.
      </p>
    </div>
  );
}
