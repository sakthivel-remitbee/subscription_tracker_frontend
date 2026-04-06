"use client";

import SubscriptionStatusBadge from "@/components/atoms/SubscriptionStatusBadge";
import SubscriptionRowActions from "@/components/molecules/SubscriptionRowActions";
import { SubscriptionItem } from "@/types/subscription";

type Props = {
  isMenuOpen: boolean;
  onCloseMenu: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onToggleMenu: () => void;
  subscription: SubscriptionItem;
};

export default function SubscriptionDesktopRow({
  isMenuOpen,
  onCloseMenu,
  onEdit,
  onToggleStatus,
  onToggleMenu,
  subscription,
}: Props) {
  return (
    <div className="hidden grid-cols-[2.3fr_1.2fr_1.2fr_1.2fr_1fr_0.8fr] items-center gap-4 md:grid">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: subscription.brandColorHex }}
        >
          {subscription.serviceName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{subscription.serviceName}</p>
          <p className="flex items-center gap-1.5 text-xs text-[#707995]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: subscription.categoryColor }}
            />
            {subscription.category}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-white">{subscription.cost}</p>
        <p className="text-xs text-[#707995]">{subscription.currency}</p>
      </div>

      <p className="text-sm text-[#d7def0]">{subscription.billing}</p>

      <div>
        <p className="text-sm text-[#d7def0]">{subscription.renewalDate}</p>
        {subscription.renewalHint ? (
          <p
            className={`text-xs ${
              subscription.renewalHint === "Today!"
                ? "text-[#ff7b7b]"
                : "text-[#ffb84d]"
            }`}
          >
            {subscription.renewalHint}
          </p>
        ) : null}
      </div>

      <SubscriptionStatusBadge status={subscription.status} />

      <SubscriptionRowActions
        isOpen={isMenuOpen}
        onClose={onCloseMenu}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
        onToggle={onToggleMenu}
        subscription={subscription}
      />
    </div>
  );
}
