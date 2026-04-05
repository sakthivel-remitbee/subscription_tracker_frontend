"use client";

import { SubscriptionItem } from "@/types/subscription";

export default function SubscriptionMobileRow({
  onEdit,
  subscription,
}: {
  onEdit: () => void;
  subscription: SubscriptionItem;
}) {
  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between gap-3 py-1">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: subscription.brandColorHex }}
          >
            {subscription.serviceName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[1rem] font-semibold text-white">
              {subscription.serviceName}
            </p>
            <p className="text-[0.85rem] text-[#707995]">
              {subscription.cost}/{subscription.billing === "Monthly" ? "mo" : "yr"}
              <span className="mx-2">•</span>
              <span
                className={
                  subscription.status === "active" ? "text-emerald-400" : "text-red-400"
                }
              >
                {subscription.status === "active" ? "Active" : "Cancelled"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-[#737c96]">
          <button
            className="transition hover:text-white"
            aria-label="Edit subscription"
            onClick={onEdit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button className="transition hover:text-white" aria-label="Delete subscription">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
