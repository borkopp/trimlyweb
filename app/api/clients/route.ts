import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/database.types";

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search");

    if (!searchQuery || searchQuery.trim().length === 0) {
      return NextResponse.json([]);
    }

    // Search for clients in the profiles table
    // Search across full_name, email, and phone fields
    const { data: clients, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, avatar_url, updated_at")
      .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
      .order("full_name", { ascending: true })
      .limit(50); // Limit results for performance

    if (error) {
      console.error("Error searching clients:", error);
      return NextResponse.json(
        { error: "Failed to search clients" },
        { status: 500 }
      );
    }

    return NextResponse.json(clients || []);
  } catch (error) {
    console.error("Unexpected error in clients API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 