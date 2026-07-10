import type { ReactNode } from "react";
import BottomNav from "../../components/user/BottomNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* pb para que el contenido no quede tapado por la barra inferior */}
      <div className="pb-20">{children}</div>
      <BottomNav />
    </div>
  );
}
