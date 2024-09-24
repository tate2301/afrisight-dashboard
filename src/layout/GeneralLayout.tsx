import React, { ReactNode } from "react";
import Navbar from "../components/navigation/Navbar";
import Sidebar from "@/components/sidebar";

interface Props {
  children: ReactNode;
}

function GeneralLayout({ children }: Props) {
  return (
    <div className="bg-white w-full flex-1 flex" >
      <Sidebar />
      <div className="w-full overflow-y-auto h-screen">
        <header className="flex sticky top-0 h-[48px]">
          <Navbar />
        </header>
        <div style={{
          minHeight: "calc(100vh - 48px)"
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default GeneralLayout;
