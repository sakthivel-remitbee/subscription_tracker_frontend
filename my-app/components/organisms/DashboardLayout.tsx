"use client";

import Sidebar from "../molecules/Sidebar";
import DashboardHeader from "../molecules/DashboardHeader";
import ProtectedRoute from "../molecules/ProtectedRoute";

type Props = { children: React.ReactNode; title: string };

export default function DashboardLayout({ children, title }: Props) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#05061a] text-white">
        {/* Desktop sidebar — hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader title={title} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}