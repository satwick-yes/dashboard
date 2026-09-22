import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

// Basic hashing for passwords (in production you'd use bcrypt or similar, but sticking to built-in for simplicity here)
const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export async function GET() {
  const { data, error } = await supabase.from("staff_accounts").select("id, username, created_at").order("created_at", { ascending: false });
  
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, staff: data });
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 });
    }

    const { data: existing } = await supabase.from("staff_accounts").select("id").eq("username", username).single();
    if (existing) {
      return NextResponse.json({ success: false, error: "Username already exists" }, { status: 400 });
    }

    const newStaff = {
      id: crypto.randomUUID(),
      username,
      password: hashPassword(password),
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from("staff_accounts").insert(newStaff);
    if (error) throw error;

    return NextResponse.json({ success: true, staff: { id: newStaff.id, username: newStaff.username, created_at: newStaff.created_at } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("staff_accounts").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Server Error" }, { status: 500 });
  }
}
