import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();
  try {
    await sendWelcomeEmail(email, name);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
