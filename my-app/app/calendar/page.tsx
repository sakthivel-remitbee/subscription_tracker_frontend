"use client";

import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import CalendarGrid from "@/components/organisms/CalendarGrid";
import CalendarSidebar from "@/components/organisms/CalendarSidebar";
import CalendarMonthHeader from "@/components/molecules/CalendarMonthHeader";
import api from "@/utils/api";
import { ApiSubscription, SubscriptionItem } from "@/types/subscription";

const getMonthStart = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

const formatShortDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseApiDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const getMonthGrid = (month: Date) => {
  const firstDay = getMonthStart(month);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();

  return Array.from({ length: 35 }, (_, index) => {
    const dayNumber = index - firstWeekday + 1;

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null;
    }

    return new Date(month.getFullYear(), month.getMonth(), dayNumber);
  });
};

const getRequestErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (typeof error.response?.data?.message === "string") {
      return error.response.data.message;
    }

    if (error.code === "ERR_NETWORK") {
      return "Unable to reach the API. Check that the backend is running and that NEXT_PUBLIC_API_BASE_URL points to the correct server.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load calendar data right now.";
};

const getCostValue = (formattedCost: string) =>
  Number(formattedCost.replace(/[^0-9.]/g, "")) || 0;

const getCurrencyPrefix = (formattedCost: string) => {
  const match = formattedCost.match(/^[^0-9]+/);
  return match?.[0]?.trim() || "$";
};

const MONTH_INDEX_BY_KEY: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

type ApiCalendarRecord = {
  year: number;
  month: string;
  monthlyCost?: string;
  userCurrency?: string;
  data: ApiSubscription[];
};

type ApiCalendarResponse = {
  loaded?: boolean;
  message?: string;
  records?: ApiCalendarRecord[];
  pagination?: {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

const getCurrencySymbol = (currency: string) => {
  if (currency === "INR") return "₹";
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  if (currency === "GBP") return "£";
  return `${currency} `;
};

const formatCost = (amount: number, currency: string) => {
  const symbol = getCurrencySymbol(currency);
  const normalized = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `${symbol}${normalized}`;
};

const mapApiToUi = (item: ApiSubscription): SubscriptionItem => ({
  id: item.id,
  serviceName: item.serviceName,
  category: item.category || "Other",
  categoryColor: item.brandColorHex,
  brandColorHex: item.brandColorHex,
  cost: formatCost(item.cost, item.currency),
  currency: item.currency,
  billing: item.billingCycle || "Monthly",
  renewalDate: formatShortDate(parseApiDate(item.nextRenewal)),
  status: item.status === "canceled" ? "cancelled" : "active",
  nextRenewal: item.nextRenewal,
  remindMeIn: item.remindMeIn,
  paymentMethod: item.paymentMethod,
});

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => getMonthStart(new Date()));
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [serverMonthlyCost, setServerMonthlyCost] = useState("$0.00");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const requestYear = currentMonth.getFullYear();

  useEffect(() => {
    let isMounted = true;

    const loadSubscriptions = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const { data } = await api.get<ApiCalendarResponse>(
          `/subscription/calendar?year=${requestYear}&page=${currentPage}`
        );
        const firstRecord = data.records?.[0];
        const mappedSubscriptions = (firstRecord?.data ?? []).map(mapApiToUi);
        const monthKey = firstRecord?.month?.toLowerCase().slice(0, 3);
        const monthIndex =
          monthKey !== undefined ? MONTH_INDEX_BY_KEY[monthKey] : undefined;

        if (!isMounted) return;

        if (data.loaded === false || !firstRecord) {
          setSubscriptions([]);
          setLoadError(null);
          setServerMonthlyCost("$0.00");
          setHasNextPage(data.pagination?.hasNextPage ?? false);
          setHasPrevPage(data.pagination?.hasPrevPage ?? currentPage > 1);
          return;
        }

        setSubscriptions(mappedSubscriptions);
        setHasNextPage(data.pagination?.hasNextPage ?? false);
        setHasPrevPage(data.pagination?.hasPrevPage ?? false);
        setCurrentMonth(
          monthIndex !== undefined
            ? new Date(firstRecord.year, monthIndex, 1)
            : getMonthStart(new Date())
        );
        setServerMonthlyCost(
          firstRecord.monthlyCost ??
            formatCost(
              firstRecord.data.reduce((sum, item) => sum + item.cost, 0),
              firstRecord.userCurrency ?? firstRecord.data[0]?.currency ?? "USD"
            )
        );
      } catch (error) {
        if (!isMounted) return;

        setLoadError(getRequestErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSubscriptions();

    return () => {
      isMounted = false;
    };
  }, [currentPage, requestYear]);

  const renewalsByDate = useMemo(() => {
    return subscriptions.reduce<Record<string, SubscriptionItem[]>>(
      (acc, subscription) => {
        const key = subscription.nextRenewal;
        acc[key] = acc[key] ? [...acc[key], subscription] : [subscription];
        return acc;
      },
      {}
    );
  }, [subscriptions]);

  const monthDays = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);
  const monthKeyPrefix = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}-`;

  const monthRenewals = useMemo(
    () =>
      subscriptions
        .filter((item) => item.nextRenewal.startsWith(monthKeyPrefix))
        .sort((a, b) => a.nextRenewal.localeCompare(b.nextRenewal)),
    [monthKeyPrefix, subscriptions]
  );

  const selectedDateItems = useMemo(() => {
    if (!selectedDateKey) return [];
    return renewalsByDate[selectedDateKey] ?? [];
  }, [renewalsByDate, selectedDateKey]);

  const todayKey = toDateKey(new Date());
  const selectedLabel = selectedDateKey
    ? formatShortDate(parseApiDate(selectedDateKey))
    : null;

  const totalMonthCost = monthRenewals.reduce(
    (sum, item) => sum + getCostValue(item.cost),
    0
  );
  const currencyPrefix = monthRenewals[0]
    ? getCurrencyPrefix(monthRenewals[0].cost)
    : "$";

  const daysWithRenewals = new Set(monthRenewals.map((item) => item.nextRenewal));

  useEffect(() => {
    const firstRenewalForMonth = monthRenewals[0]?.nextRenewal ?? null;
    const todayInMonth = todayKey.startsWith(monthKeyPrefix) ? todayKey : null;

    setSelectedDateKey((current) => {
      if (current && current.startsWith(monthKeyPrefix)) {
        return current;
      }

      return firstRenewalForMonth ?? todayInMonth;
    });
  }, [monthKeyPrefix, monthRenewals, todayKey]);

  return (
    <DashboardLayout title="Calendar">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4">
          <CalendarMonthHeader
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            monthLabel={formatMonthLabel(currentMonth)}
            monthTotal={
              monthRenewals.length > 0
                ? `${currencyPrefix}${totalMonthCost.toFixed(2)}`
                : serverMonthlyCost
            }
            onNext={() => setCurrentPage((page) => page + 1)}
            onPrev={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            renewalDaysCount={daysWithRenewals.size}
          />

          <CalendarGrid
            monthDays={monthDays}
            renewalsByDate={renewalsByDate}
            selectedDateKey={selectedDateKey}
            todayKey={todayKey}
            toDateKey={toDateKey}
            onSelectDate={setSelectedDateKey}
          />
        </section>

        <CalendarSidebar
          currentMonthLabel={currentMonth.toLocaleDateString("en-US", {
            month: "long",
          })}
          isLoading={isLoading}
          loadError={loadError}
          monthRenewals={monthRenewals}
          selectedDateItems={selectedDateItems}
          selectedDateCount={selectedDateItems.length}
          selectedDateKey={selectedDateKey}
          selectedLabel={selectedLabel}
          formatShortDate={formatShortDate}
          onSelectDate={setSelectedDateKey}
          parseApiDate={parseApiDate}
        />
      </div>
    </DashboardLayout>
  );
}
