import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "../lib/env";

export const metadata = {
  title: "EcoChamps - The Futue of Education",
  description: "Forming the Champs of tomorrow",
};

export default function RootLayout({ children }) {
  const publishableKey = env.clerkPublishableKey;
  return (
    <html lang="en">
      <body>
        {publishableKey ? (
          <ClerkProvider publishableKey={publishableKey}>
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
