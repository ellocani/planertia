import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
      <footer className="text-center text-sm text-gray-500 py-4">
        © 2025 Planertia. All rights reserved.
      </footer>
    </div>
  );
}