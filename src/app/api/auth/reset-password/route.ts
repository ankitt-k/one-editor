import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    await connectDB();

    const decoded: any = jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET_KEY!);
    const userId = decoded?.id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
