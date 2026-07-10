'use client';

import type { ReactNode } from "react";
import BottomNav from "../../components/navigation/BottomNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <div className="pb-20">{children}</div>
      <BottomNav />
    </div>
  );
}
