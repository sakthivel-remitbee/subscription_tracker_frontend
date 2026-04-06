"use client";

import { SubscriptionStatus } from "@/types/subscription";

export default function SubscriptionStatusBadge({
  status,
}: {
  status: SubscriptionStatus;
}) {
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex w-[100px] items-center justify-center gap-1.5 rounded-full border px-0 py-1 text-[11px] font-medium ${
        isActive
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/20 bg-red-500/10 text-red-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-400" : "bg-red-400"
        }`}
      />
      {isActive ? "Active" : "Cancelled"}
    </span>
  );
}
