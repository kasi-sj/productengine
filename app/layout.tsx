"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { MenubarComponent } from "@/components/MenuBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <MenubarComponent />
          <div className="">{children}</div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
