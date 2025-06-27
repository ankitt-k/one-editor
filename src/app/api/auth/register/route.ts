import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import { connectDB } from "@/config/connectDB";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, Email, and Password are required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    await UserModel.create({ name, email, password });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
