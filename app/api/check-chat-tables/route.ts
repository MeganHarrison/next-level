import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    await supabase.from("conversations").select("id").limit(1)
    await supabase.from("messages").select("id").limit(1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("check-chat-tables error", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
