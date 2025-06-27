import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Provider from "@/Provider/Provider";

export const metadata: Metadata = {
  title: "Code Craft",
  description: "Build space your team, your idea and your editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Provider>
          {children}
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
