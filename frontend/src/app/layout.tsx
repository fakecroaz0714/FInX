import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/lib/AuthContext";
import { ProposalProvider } from "@/lib/ProposalContext";
import { LanguageProvider } from "@/lib/LanguageContext";

import AuthGuard from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FINX - CSR Accountability Platform",
  description: "Connecting community petitions, NGOs, corporate CSR, and escrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 h-screen overflow-hidden`}>
        <LanguageProvider>
          <AuthProvider>
            <ProposalProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
            </ProposalProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
