import React, { ReactNode } from "react";
import Navbar from "./navbar";
import Sidebar from "@/layout/sidebar";
import Separator from "@/components/design-sytem/separator";
import { GeneralLayoutProvider } from "./context";

interface Props {
  children: ReactNode;
}

function GeneralLayout({ children }: Props) {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="flex sticky top-0 h-[48px]">
          <Navbar />
        </header>
        <Separator />
        {children}
      </div>
    </main>
  );
}

export default GeneralLayout;
