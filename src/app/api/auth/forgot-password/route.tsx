// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderAsync } from "@react-email/render";
import { ForgotPasswordEmail } from "@/emails/forgot-password-email"; // Adjust path
import { sendEmail } from "@/lib/mail"; // Adjust path
import { db } from "@/lib/db"; // Your DB instance
import { v4 as uuidv4 } from "uuid";


export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const token = uuidv4();

  // Store token in DB or your preferred token storage
  await db.resetToken.upsert({
    where: { userId: existingUser.id },
    update: { token, expiresAt: new Date(Date.now() + 3600 * 1000) },
    create: {
      userId: existingUser.id,
      token,
      expiresAt: new Date(Date.now() + 3600 * 1000),
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const emailHtml = await renderAsync(
    <ForgotPasswordEmail name={existingUser.name} url={resetUrl} />
  );

  await sendEmail(
  existingUser.email,
  "Reset your password - One Editor",
  emailHtml // Make sure this is a valid HTML string
);

  return NextResponse.json(
    { message: "Password reset link sent to email." },
    { status: 200 }
  );
}
