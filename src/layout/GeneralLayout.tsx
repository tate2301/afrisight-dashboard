import React, { ReactNode } from "react";
import Navbar from "../components/navigation/Navbar";
import Sidebar from "@/components/sidebar";

interface Props {
  children: ReactNode;
}

function GeneralLayout({ children }: Props) {
  return (
    <>
      <Sidebar />
      <div className="w-full">
        <header className="flex sticky top-0 h-[48px]">
          <Navbar />
        </header>
        {children}
      </div>
    </>
  );
}

export default GeneralLayout;
