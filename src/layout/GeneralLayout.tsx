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
      <div className="flex-1 h-screen overflow-y-auto">
        <header className="flex sticky top-0 h-[48px] z-50">
          <Navbar />
        </header>
        <Separator className="sticky top-[48px] z-50" />
        {children}
      </div>
    </main>
  );
}

export default GeneralLayout;
