"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import SubscriptionsTable from "@/components/organisms/SubscriptionsTable";
import SubscriptionFilters from "@/components/molecules/SubscriptionFilters";
import AddSubscriptionForm from "@/components/organisms/AddSubscriptionForm";
import {
  fetchSubscriptionsRequest,
  updateSubscriptionStatusRequest,
} from "@/service/subscriptionService";
import {
  ApiPagination,
  ApiSummary,
  StatusFilter,
  SubscriptionItem,
} from "@/types/subscription";

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

  return "Unable to load subscriptions right now.";
};

export default function SubscriptionsPage() {
  const [isAddingSubscription, setIsAddingSubscription] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<SubscriptionItem | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("All");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ApiPagination>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    source: "all",
    status: "all",
    category: "all",
    serviceName: "all",
  });
  const [summary, setSummary] = useState<ApiSummary>({
    limit: 10,
    totalActive: 0,
    monthlyCost: "$0.00",
    currency: "USD",
  });
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSubscriptions = async () => {
      try {
        setLoadError(null);
        const response = await fetchSubscriptionsRequest({
          page,
          limit: 10,
          status,
          category,
          query,
        });

        if (!isMounted) return;

        setSubscriptions(response.subscriptions);
        setPagination(response.pagination);
        setSummary(response.summary);
      } catch (error) {
        if (!isMounted) return;

        setLoadError(getRequestErrorMessage(error));
        console.error("Failed to fetch subscriptions:", error);
      }
    };

    loadSubscriptions();

    return () => {
      isMounted = false;
    };
  }, [category, page, query, reloadKey, status]);

  const currentPage = pagination.page || page;
  const totalPages = Math.max(pagination.totalPages || 1, 1);

  return (
      <DashboardLayout title="Subscriptions">
      {isAddingSubscription || editingSubscription ? (
        <AddSubscriptionForm
          onBack={() => {
            setIsAddingSubscription(false);
            setEditingSubscription(null);
          }}
          onCreated={() => {
            setIsAddingSubscription(false);
            setEditingSubscription(null);
            setPage(1);
            setReloadKey((current) => current + 1);
          }}
          subscription={editingSubscription}
        />
      ) : (
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,22,37,0.98),rgba(13,14,27,0.98))] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-5">
            <SubscriptionFilters
              category={category}
              monthlyCost={summary.monthlyCost}
              onAdd={() => {
                setEditingSubscription(null);
                setIsAddingSubscription(true);
              }}
              onCategoryChange={(value) => {
                setCategory(value);
                setPage(1);
              }}
              onQueryChange={(value) => {
                setQuery(value);
                setPage(1);
              }}
              onStatusChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              query={query}
              status={status}
              totalActive={summary.totalActive}
            />

            {loadError && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-300">{loadError}</p>
              </div>
            )}

            <SubscriptionsTable
              onCloseMenu={() => setOpenMenuId(null)}
              onEdit={(subscription) => {
                setOpenMenuId(null);
                setIsAddingSubscription(false);
                setEditingSubscription(subscription);
              }}
              onToggleStatus={async (subscription) => {
                try {
                  await updateSubscriptionStatusRequest(
                    subscription.id,
                    subscription.status === "active" ? "canceled" : "active"
                  );
                  setOpenMenuId(null);
                  setReloadKey((current) => current + 1);
                } catch (error) {
                  console.error("Failed to update subscription status:", error);
                }
              }}
              onToggleMenu={(id) =>
                setOpenMenuId((current) => (current === id ? null : id))
              }
              openMenuId={openMenuId}
              subscriptions={subscriptions}
            />

            <div className="mt-4 flex flex-col gap-3 text-xs text-[#6d7591] sm:flex-row sm:items-center sm:justify-between">
              <p>
                {subscriptions.length} of {pagination.totalItems} records
              </p>

              <div className="flex items-center gap-2">
                {pagination.hasPrevPage && (
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="rounded-lg border border-white/10 bg-[#161827] px-3 py-1.5 text-[#c8d0e4] transition hover:border-white/20 hover:text-white"
                  >
                    Prev
                  </button>
                )}
                <span className="min-w-[90px] text-center text-[#c8d0e4]">
                  Page {currentPage} of {totalPages}
                </span>
                {pagination.hasNextPage && (
                  <button
                    type="button"
                    onClick={() => setPage((prev) => prev + 1)}
                    className="rounded-lg border border-white/10 bg-[#161827] px-3 py-1.5 text-[#c8d0e4] transition hover:border-white/20 hover:text-white"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
