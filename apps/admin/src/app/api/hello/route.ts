import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello API from Next.js App Router" });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({
    message: "Received POST",
    data: body,
  });
}
