"use client";

import { SubscriptionItem } from "@/types/subscription";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onToggle: () => void;
  subscription: SubscriptionItem;
};

export default function SubscriptionRowActions({
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
  onToggle,
  subscription,
}: Props) {
  return (
    <div className="relative flex items-center justify-end gap-3 text-[#737c96]">
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

      <button
        className="transition hover:text-white"
        aria-label="More actions"
        onClick={onToggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
        >
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
        </svg>
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close actions menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={onClose}
          />
          <div className="absolute right-0 top-9 z-20 w-[174px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#171823] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              onClick={onEdit}
              className="flex h-9 w-full items-center gap-3 px-5 text-left text-[0.9rem] font-semibold text-[#dce4f7] transition hover:bg-white/[0.03]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5 text-[#b7c0d8]"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit
            </button>

            <button
              type="button"
              onClick={onToggleStatus}
              className="flex h-9 w-full items-center gap-3 px-5 text-left text-[0.9rem] font-semibold text-[#dce4f7] transition hover:bg-white/[0.03]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`h-5 w-5 ${
                  subscription.status === "active" ? "text-[#94561C]" : "text-emerald-400"
                }`}
              >
                <circle cx="12" cy="12" r="10" />
                {subscription.status === "active" ? (
                  <>
                    <path d="m9 9 6 6" />
                    <path d="m15 9-6 6" />
                  </>
                ) : (
                  <path d="m8 12 2.5 2.5L16 9" />
                )}
              </svg>
              {subscription.status === "active" ? "Cancel" : "Reactivate"}
            </button>

            <div className="border-t border-white/8">
              <button
                type="button"
                className="flex h-[45px] w-full items-center gap-3 px-5 text-left text-[0.9rem] font-semibold text-[#ff646e] transition hover:bg-red-500/[0.04]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
