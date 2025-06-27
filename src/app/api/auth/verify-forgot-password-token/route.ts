// verify-forgot-password-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const decoded: any = jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET_KEY!);
    const userId = decoded?.id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    return NextResponse.json({ message: "Valid token", userId }, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
