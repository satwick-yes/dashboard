import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 });
    }

    // Verify against DB
    const { data: account, error } = await supabase
      .from("staff_accounts")
      .select("id, username, password")
      .eq("username", username)
      .single();

    if (error || !account) {
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 });
    }

    const hashedInput = hashPassword(password);
    if (account.password !== hashedInput) {
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: { id: account.id, username: account.username } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Server Error" }, { status: 500 });
  }
}
