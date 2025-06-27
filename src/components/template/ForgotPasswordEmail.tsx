// components/emails/forgot-password-email.tsx
import * as React from "react";

export const ForgotPasswordEmail = ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => {
  return (
    <div>
      <h1>Hi {name},</h1>
      <p>You requested a password reset. Click the link below:</p>
      <a href={url}>Reset Password</a>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>
  );
};
