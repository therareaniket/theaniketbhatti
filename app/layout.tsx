import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Add the font variable class to <body> */}
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}