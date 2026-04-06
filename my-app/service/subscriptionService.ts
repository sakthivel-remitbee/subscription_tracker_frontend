import api from "@/utils/api";
import {
  ApiPagination,
  ApiSubscription,
  ApiSubscriptionResponse,
  ApiSummary,
  CreateSubscriptionPayload,
  StatusFilter,
  SubscriptionItem,
} from "@/types/subscription";

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

const formatRenewalDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getRenewalHint = (date: string) => {
  const renewal = new Date(`${date}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.ceil(
    (renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today!";
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays}d`;
  return undefined;
};

const mapApiToUi = (item: ApiSubscription): SubscriptionItem => {
  const category = item.category || "Other";

  return {
    id: item.id,
    serviceName: item.serviceName,
    category,
    categoryColor: item.brandColorHex,
    brandColorHex: item.brandColorHex,
    cost: formatCost(item.cost, item.currency),
    currency: item.currency,
    billing: item.billingCycle || "Monthly",
    renewalDate: formatRenewalDate(item.nextRenewal),
    renewalHint: getRenewalHint(item.nextRenewal),
    status: item.status === "canceled" ? "cancelled" : "active",
    nextRenewal: item.nextRenewal,
    remindMeIn: item.remindMeIn,
    paymentMethod: item.paymentMethod,
  };
};

export const fetchSubscriptionsRequest = async ({
  page,
  limit,
  status,
  category,
  query,
}: {
  page: number;
  limit: number;
  status: StatusFilter;
  category: string;
  query: string;
}): Promise<{
  subscriptions: SubscriptionItem[];
  pagination: ApiPagination;
  summary: ApiSummary;
}> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status !== "all") {
    params.set("status", status === "cancelled" ? "canceled" : status);
  }

  if (category !== "All") {
    params.set("category", category);
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    params.set("serviceName", trimmedQuery);
  }

  const { data } = await api.get<ApiSubscriptionResponse>(
    `/subscription/all?${params.toString()}`
  );

  return {
    subscriptions: (data.subscriptions ?? []).map(mapApiToUi),
    pagination: data.pagination,
    summary: data.summary,
  };
};

export const createSubscriptionRequest = async (
  payload: CreateSubscriptionPayload
) => {
  const { data } = await api.post("/subscription/create", payload);
  return data;
};

export const updateSubscriptionRequest = async (
  id: number,
  payload: CreateSubscriptionPayload
) => {
  const { data } = await api.put(`/subscription/update/${id}`, payload);
  return data;
};

export const updateSubscriptionStatusRequest = async (
  id: number,
  status: "active" | "canceled"
) => {
  const { data } = await api.put(`/subscription/status/${id}`, { status });
  return data;
};
