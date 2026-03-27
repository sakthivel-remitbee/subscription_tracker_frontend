"use client";

import ProtectedRoute from "@/components/molecules/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#05061a] text-white flex items-center justify-center">
        <p>Dashboard 🎉</p>
      </div>
    </ProtectedRoute>
  );
}