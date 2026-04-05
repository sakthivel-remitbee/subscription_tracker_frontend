"use client";

import SubscriptionDesktopRow from "@/components/molecules/SubscriptionDesktopRow";
import SubscriptionMobileRow from "@/components/molecules/SubscriptionMobileRow";
import { SubscriptionItem } from "@/types/subscription";

type Props = {
  onCloseMenu: () => void;
  onEdit: (subscription: SubscriptionItem) => void;
  onToggleStatus: (subscription: SubscriptionItem) => void;
  onToggleMenu: (id: number) => void;
  openMenuId: number | null;
  subscriptions: SubscriptionItem[];
};

export default function SubscriptionsTable({
  onCloseMenu,
  onEdit,
  onToggleStatus,
  onToggleMenu,
  openMenuId,
  subscriptions,
}: Props) {
  return (
    <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/6 bg-[#0f111d]">
      <div className="hidden grid-cols-[2.3fr_1.2fr_1.2fr_1.2fr_1fr_0.8fr] gap-4 border-b border-white/6 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5d6682] md:grid">
        <div>Subscription</div>
        <div>Cost</div>
        <div>Billing</div>
        <div>Next Renewal</div>
        <div>Status</div>
        <div className="text-right">Actions</div>
      </div>

      <div className="divide-y divide-white/6">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="px-4 py-4 transition hover:bg-white/[0.02]">
            <SubscriptionDesktopRow
              isMenuOpen={openMenuId === subscription.id}
              onCloseMenu={onCloseMenu}
              onEdit={() => onEdit(subscription)}
              onToggleStatus={() => onToggleStatus(subscription)}
              onToggleMenu={() => onToggleMenu(subscription.id)}
              subscription={subscription}
            />
            <SubscriptionMobileRow
              onEdit={() => onEdit(subscription)}
              subscription={subscription}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
