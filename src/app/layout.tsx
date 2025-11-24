// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rồng Linh Thạch – Mini App",
  description: "Idle Dragon Mining • Neon Blue Cyber MiniApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#070b18] text-cyan-200 
                       bg-gradient-to-b from-[#030712] to-[#0a0f25]">
        {children}
      </body>
    </html>
  );
}
