import type { Metadata } from "next";
import "./globals.css"; // ดึง Tailwind CSS มาใช้

export const metadata: Metadata = {
  title: "Haekpak Karaoke",
  description: "ระบบจองห้องคาราโอเกะออนไลน์",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}