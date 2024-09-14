import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AdminDropdown from "@/components/AdminDropdown";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loan Application System",
  description: "Apply for loans or manage applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Loan System
            </Link>
            <ul className="flex space-x-4 items-center">
              <li>
                <Link href="/apply" className="hover:text-gray-300">
                  Apply for Loan
                </Link>
              </li>
              <li>
                <AdminDropdown />
              </li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
