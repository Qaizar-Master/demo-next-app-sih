
import { Lato } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata = {
  title: "EcoChamps - The Future of Education",
  description: "Forming the Champs of tomorrow",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={lato.variable}>
        <body className={lato.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
