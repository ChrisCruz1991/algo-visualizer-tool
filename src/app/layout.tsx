import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

export const metadata: Metadata = {
  title: "Algorithm Visualizer",
  description: "Interactive visualizations for sorting and searching algorithms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <Navbar />
        <div className="flex h-[calc(100vh-56px)]">
          <SidebarWrapper />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
