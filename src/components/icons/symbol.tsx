"use client"

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Symbol({ className, children }: { className?: string, children: ReactNode }) {
    return (
        <span className={cn('material-symbols-rounded', className)}>
            {children}
        </span>
    )
}