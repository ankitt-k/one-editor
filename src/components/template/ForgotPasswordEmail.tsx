// components/template/ForgotPasswordEmail.tsx
import * as React from "react";

interface ForgotPasswordEmailProps {
  name: string;
  url: string;
}

export const ForgotPasswordEmail: React.FC<ForgotPasswordEmailProps> = ({ name, url }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <h2>Hi {name},</h2>
      <p>You requested to reset your password for your One Editor account.</p>
      <p>
        Click the link below to reset your password:
        <br />
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      </p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks,<br />The One Editor Team</p>
    </div>
  );
};
