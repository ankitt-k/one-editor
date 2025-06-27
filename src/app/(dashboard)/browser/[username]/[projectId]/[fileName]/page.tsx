"use client";
import { useParams } from "next/navigation";
import React from "react";

const BrowserPage = () => {
  const params = useParams();

  const username = params?.username as string | undefined;
  const projectId = params?.projectId as string | undefined;
  const fileName = params?.fileName as string | undefined;

  const isReady = projectId && fileName;

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        Cannot load file. Missing project or file name.
      </div>
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // fallback for dev

  return (
    <iframe
      className="w-full h-full min-h-screen min-w-screen border-none"
      src={`${baseUrl}/api/file/${projectId}/${fileName}`}
    />
  );
};

export default BrowserPage;
