export type SubscriptionStatus = "active" | "cancelled";

export type SubscriptionItem = {
  id: number;
  serviceName: string;
  category: string;
  categoryColor: string;
  brandColorHex: string;
  cost: string;
  currency: string;
  billing: string;
  renewalDate: string;
  renewalHint?: string;
  status: SubscriptionStatus;
  nextRenewal: string;
  remindMeIn: number;
  paymentMethod: string;
  startDate?: string;
  notes?: string | null;
};

export type ApiSubscription = {
  id: number;
  serviceName: string;
  category: string;
  cost: number;
  status: "active" | "canceled";
  nextRenewal: string;
  remindMeIn: number;
  billingCycle: string;
  paymentMethod: string;
  brandColorHex: string;
  currency: string;
};

export type ApiPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  source: string;
  status: string;
  category: string;
  serviceName: string;
};

export type ApiSummary = {
  limit: number;
  totalActive: number;
  monthlyCost: string;
  currency: string;
};

export type ApiSubscriptionResponse = {
  subscriptions: ApiSubscription[];
  pagination: ApiPagination;
  summary: ApiSummary;
};

export type StatusFilter = "all" | SubscriptionStatus;

export type CreateSubscriptionPayload = {
  serviceName: string;
  category: string;
  cost: number;
  status: "active" | "canceled";
  nextRenewal: string;
  remindMeIn: number;
  billingCycle: string;
  paymentMethod: string;
  brandColorHex: string;
  currency: string;
  startDate: string;
  notes?: string;
};
