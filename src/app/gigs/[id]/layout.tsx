import Sidebar from "@/layout/sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <main className="flex relative">
            <Sidebar />
            {children}
        </main>
    )
}