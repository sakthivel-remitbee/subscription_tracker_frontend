"use client";

import { StatusFilter } from "@/types/subscription";

const STATUS_TABS: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Cancelled", value: "cancelled" },
];

const CATEGORY_OPTIONS = [
  "All",
  "Entertainment",
  "Development",
  "Design",
  "Productivity",
  "Communication",
];

type Props = {
  category: string;
  monthlyCost: string;
  onAdd: () => void;
  onCategoryChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  query: string;
  status: StatusFilter;
  totalActive: number;
};

export default function SubscriptionFilters({
  category,
  monthlyCost,
  onAdd,
  onCategoryChange,
  onQueryChange,
  onStatusChange,
  query,
  status,
  totalActive,
}: Props) {
  return (
    <>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <div className="rounded-2xl border border-white/8 bg-[#151826] px-4 py-3">
            <p className="text-xs text-[#8d96b2]">Total Active</p>
            <p className="mt-1 text-2xl font-semibold leading-none text-white">{totalActive}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#151826] px-4 py-3">
            <p className="text-xs text-[#8d96b2]">Monthly Cost</p>
            <p className="mt-1 text-2xl font-semibold leading-none text-white">{monthlyCost}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 w-[169px] items-center justify-center self-start rounded-[14px] border border-[#5d5fef]/35 bg-[#5b5cf0] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(91,92,240,0.28)] transition hover:bg-[#6869ff] lg:self-auto"
        >
          <span className="mr-2 text-[18px] leading-none">+</span>
          Add Subscription
        </button>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#59627d]"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search subscriptions..."
            className="h-12 w-full rounded-2xl border border-white/8 bg-[#141624] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#59627d] focus:border-[#5d5fef]"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => {
              const isActive = status === tab.value;

              return (
                <button
                  key={tab.value}
                  onClick={() => onStatusChange(tab.value)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#4e4fe4] bg-[#2b2763] text-[#9c9cff]"
                      : "border-white/8 bg-[#161827] text-[#9aa3bd] hover:border-white/12 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-11 rounded-xl border border-white/8 bg-[#161827] px-4 text-sm text-[#c8d0e4] outline-none transition focus:border-[#5d5fef]"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option} className="bg-[#161827]">
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
