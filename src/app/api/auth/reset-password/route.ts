import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify token
    const decoded: any = jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET_KEY!);
    const userId = decoded?.id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
