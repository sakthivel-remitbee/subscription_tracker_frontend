"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchSubscriptionsRequest } from "@/service/subscriptionService";
import { SubscriptionItem } from "@/types/subscription";

type NotificationItem = {
  id: number;
  accentColor: string;
  amount: string;
  initials: string;
  subtitle: string;
  title: string;
};

const formatShortDate = (value: string) => {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const buildNotification = (item: SubscriptionItem): NotificationItem => ({
  id: item.id,
  accentColor: item.brandColorHex || "#6f78ff",
  amount: item.cost,
  initials: item.serviceName.charAt(0).toUpperCase(),
  subtitle: `Your ${item.serviceName} subscription will renew on ${formatShortDate(
    item.nextRenewal
  )} for ${item.cost}`,
  title: `${item.serviceName} ${item.renewalHint ?? ""}`.trim(),
});

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadIds, setUnreadIds] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await fetchSubscriptionsRequest({
          page: 1,
          limit: 10,
          status: "all",
          category: "All",
          query: "",
        });

        const items = response.subscriptions
          .filter((item) => item.status === "active" && Boolean(item.renewalHint))
          .sort((a, b) => a.nextRenewal.localeCompare(b.nextRenewal))
          .slice(0, 4)
          .map(buildNotification);

        setNotifications(items);
        setUnreadIds(items.map((item) => item.id));
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = unreadIds.length;
  const hasNotifications = notifications.length > 0;

  const panelContent = useMemo(() => {
    if (isLoading) {
      return (
        <p className="px-1 py-6 text-sm text-[#6f7895]">Loading notifications...</p>
      );
    }

    if (!hasNotifications) {
      return (
        <p className="px-1 py-6 text-sm text-[#6f7895]">
          No reminder notifications on page 1.
        </p>
      );
    }

    return (
      <div className="mt-3 space-y-2">
        {notifications.map((item) => {
          const isUnread = unreadIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-3"
            >
              <div
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-semibold text-white"
                style={{ backgroundColor: item.accentColor }}
              >
                {item.initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  {isUnread && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#6c63ff]" />
                  )}
                </div>
                <p className="mt-1 text-xs leading-5 text-[#7d84a0]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [hasNotifications, isLoading, notifications, unreadIds]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-colors hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#6c63ff]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[360px] rounded-[1.5rem] border border-white/8 bg-[#101320] p-4 shadow-[0_22px_70px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">Notifications</p>
            <button
              type="button"
              onClick={() => setUnreadIds([])}
              className="text-xs font-medium text-[#8d91ff] transition hover:text-white"
            >
              Mark all read
            </button>
          </div>
          {panelContent}
        </div>
      )}
    </div>
  );
}
