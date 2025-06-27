import UserModel from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/config/resendemail";
import { ForgotPasswordEmail } from "@/components/template/ForgotPasswordEmail";
import { connectDB } from "@/config/connectDB";
import { renderAsync } from "@react-email/render";

export async function POST(request: NextRequest) {
  const host = request.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const DOMAIN = `${protocol}://${host}`;

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const payload = { id: existingUser._id.toString() };

    const token = jwt.sign(payload, process.env.FORGOT_PASSWORD_SECRET_KEY!, {
      expiresIn: "1h",
    });

    const resetUrl = `${DOMAIN}/reset-password?token=${token}`;

    const emailHtml = await renderAsync(
      ForgotPasswordEmail({ name: existingUser.name, url: resetUrl })
    );

    await sendEmail(
      existingUser.email,
      "Reset your password - One Editor",
      emailHtml
    );

    return NextResponse.json({ message: "Password reset link sent to email." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
