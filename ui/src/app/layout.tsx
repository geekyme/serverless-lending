import React from "react";
import "./globals.css";
import { Toast } from "./components/Toast";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <Link
              href="/"
              className="text-2xl font-bold hover:text-blue-200 transition-colors"
            >
              Finloan
            </Link>
          </div>
        </nav>
        <main className="container mx-auto py-8 px-4">{children}</main>
        <Toast />
      </body>
    </html>
  );
}
