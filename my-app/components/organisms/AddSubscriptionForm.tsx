"use client";

import { useState } from "react";
import {
  createSubscriptionRequest,
  updateSubscriptionRequest,
} from "@/service/subscriptionService";
import {
  CreateSubscriptionPayload,
  SubscriptionItem,
} from "@/types/subscription";

type Props = {
  onBack: () => void;
  onCreated: () => void;
  subscription?: SubscriptionItem | null;
};

const CATEGORY_OPTIONS = [
  "Entertainment",
  "Development",
  "Design",
  "Productivity",
  "Communication",
];

const CURRENCY_OPTIONS = ["USD", "INR", "EUR", "GBP", "AED"];
const BILLING_CYCLE_OPTIONS = ["Monthly", "Yearly"] as const;
const PAYMENT_METHOD_OPTIONS = [
  "Credit Card",
  "Debit Card",
  "PayPal",
  "UPI",
  "Bank Transfer",
];
const REMINDER_OPTIONS = [1, 3, 7, 14, 30];
const STATUS_OPTIONS = ["Active", "Cancelled"] as const;
const BRAND_COLORS = [
  "#6C72FF",
  "#7B5EF5",
  "#D653A0",
  "#E85A56",
  "#F2A93C",
  "#63C18C",
  "#62C7D6",
  "#4E88F0",
  "#F26B3A",
  "#62C25D",
  "#E33C2F",
  "#F7A83B",
  "#552060",
  "#4B8AF3",
  "#6778D8",
];

const pad = (value: number) => String(value).padStart(2, "0");

const toInputDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addMonths = (value: string, months: number) => {
  const baseDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(baseDate.getTime())) {
    return value;
  }

  const nextDate = new Date(baseDate);
  nextDate.setMonth(nextDate.getMonth() + months);
  return toInputDate(nextDate);
};

const formatAmount = (value: string) => {
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) {
    return "0";
  }

  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
};

type FormErrors = Partial<Record<
  | "serviceName"
  | "category"
  | "cost"
  | "currency"
  | "billingCycle"
  | "paymentMethod"
  | "startDate"
  | "nextRenewalDate"
  | "remindMeDays"
  | "status"
  | "brandColor",
  string
>>;

export default function AddSubscriptionForm({
  onBack,
  onCreated,
  subscription,
}: Props) {
  const today = toInputDate(new Date());
  const isEditMode = Boolean(subscription);
  const initialCost = subscription?.cost.replace(/[^0-9.]/g, "") || "0";
  const [serviceName, setServiceName] = useState(subscription?.serviceName ?? "");
  const [category, setCategory] = useState(subscription?.category ?? "Entertainment");
  const [cost, setCost] = useState(initialCost);
  const [currency, setCurrency] = useState(subscription?.currency ?? "USD");
  const [billingCycle, setBillingCycle] =
    useState<(typeof BILLING_CYCLE_OPTIONS)[number]>(
      subscription?.billing === "Yearly" ? "Yearly" : "Monthly"
    );
  const [paymentMethod, setPaymentMethod] = useState(
    subscription?.paymentMethod ?? "Credit Card"
  );
  const [startDate, setStartDate] = useState(subscription?.startDate ?? today);
  const [nextRenewalDate, setNextRenewalDate] = useState(
    subscription?.nextRenewal ?? addMonths(today, 1)
  );
  const [remindMeDays, setRemindMeDays] = useState(subscription?.remindMeIn ?? 3);
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>(
    subscription?.status === "cancelled" ? "Cancelled" : "Active"
  );
  const [brandColor, setBrandColor] = useState(
    subscription?.brandColorHex ?? BRAND_COLORS[0]
  );
  const [notes, setNotes] = useState(subscription?.notes ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const parsedCost = Number.parseFloat(cost);

    if (!serviceName.trim()) nextErrors.serviceName = "Service name is required";
    if (!category) nextErrors.category = "Category is required";
    if (!cost.trim()) {
      nextErrors.cost = "Cost is required";
    } else if (Number.isNaN(parsedCost) || parsedCost <= 0) {
      nextErrors.cost = "Enter a valid cost greater than 0";
    }
    if (!currency) nextErrors.currency = "Currency is required";
    if (!billingCycle) nextErrors.billingCycle = "Billing cycle is required";
    if (!paymentMethod) nextErrors.paymentMethod = "Payment method is required";
    if (!startDate) nextErrors.startDate = "Start date is required";
    if (!nextRenewalDate) nextErrors.nextRenewalDate = "Next renewal date is required";
    if (!remindMeDays) nextErrors.remindMeDays = "Reminder is required";
    if (!status) nextErrors.status = "Status is required";
    if (!brandColor) nextErrors.brandColor = "Brand color is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload: CreateSubscriptionPayload = {
        serviceName: serviceName.trim(),
        category,
        cost: Number.parseFloat(cost),
        status: status === "Active" ? "active" : "canceled",
        nextRenewal: nextRenewalDate,
        remindMeIn: remindMeDays,
        billingCycle,
        paymentMethod,
        brandColorHex: brandColor,
        currency,
        startDate,
        notes: notes.trim() || undefined,
      };

      if (subscription?.id) {
        await updateSubscriptionRequest(subscription.id, payload);
      } else {
        await createSubscriptionRequest(payload);
      }

      onCreated();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: unknown } } }).response?.data
          ?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : "Unable to add subscription";

      setSubmitError(message ?? "Unable to add subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[760px] pb-8 pt-1">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8f97b3] transition hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Subscriptions
      </button>

      <form
        onSubmit={handleSubmit}
        className="rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(15,16,27,0.98),rgba(10,11,20,0.98))] px-4 py-5 shadow-[0_22px_80px_rgba(0,0,0,0.34)] sm:px-5 sm:py-5"
      >
        <div className="mb-7">
          <h2 className="text-[2rem] font-semibold tracking-[-0.04em] text-white">
            {isEditMode ? "Edit Subscription" : "Add New Subscription"}
          </h2>
          <p className="mt-1 text-sm text-[#7f87a1]">
            {isEditMode
              ? "Update the details of your subscription"
              : "Fill in the details to track a new subscription"}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">
              Service Name <span className="text-[#f26d78]">*</span>
            </label>
            <input
              value={serviceName}
              onChange={(e) => {
                setServiceName(e.target.value);
                setErrors((current) => ({ ...current, serviceName: undefined }));
              }}
              placeholder="e.g. Netflix, AWS"
              className={`h-14 w-full rounded-2xl border bg-[#171823] px-4 text-sm text-white outline-none transition placeholder:text-[#5e6681] focus:border-[#5d5fef] ${
                errors.serviceName ? "border-red-500/70" : "border-white/8"
              }`}
            />
            {errors.serviceName ? (
              <p className="mt-2 text-xs text-[#f26d78]">{errors.serviceName}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setErrors((current) => ({ ...current, category: undefined }));
                }}
                className={`h-14 w-full appearance-none rounded-2xl border bg-[#111320] px-4 text-sm text-white outline-none transition focus:border-[#5d5fef] ${
                  errors.category ? "border-red-500/70" : "border-white/8"
                }`}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-[#111320]">
                    {option}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7a829c]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
            {errors.category ? (
              <p className="mt-2 text-xs text-[#f26d78]">{errors.category}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">
              Cost <span className="text-[#f26d78]">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#6f7894]">
                $
              </span>
              <input
                value={cost}
                onChange={(e) => {
                  setCost(e.target.value);
                  setErrors((current) => ({ ...current, cost: undefined }));
                }}
                placeholder="0.00"
                inputMode="decimal"
                className={`h-14 w-full rounded-2xl border bg-[#171823] pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-[#5e6681] focus:border-[#5d5fef] ${
                  errors.cost ? "border-red-500/70" : "border-white/8"
                }`}
              />
            </div>
            {errors.cost ? <p className="mt-2 text-xs text-[#f26d78]">{errors.cost}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">Currency</label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  setErrors((current) => ({ ...current, currency: undefined }));
                }}
                className={`h-14 w-full appearance-none rounded-2xl border bg-[#111320] px-4 text-sm text-white outline-none transition focus:border-[#5d5fef] ${
                  errors.currency ? "border-red-500/70" : "border-white/8"
                }`}
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-[#111320]">
                    {option}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7a829c]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
            {errors.currency ? (
              <p className="mt-2 text-xs text-[#f26d78]">{errors.currency}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">Billing Cycle</label>
            <div className="grid grid-cols-2 gap-2">
              {BILLING_CYCLE_OPTIONS.map((option) => {
                const isSelected = billingCycle === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setBillingCycle(option);
                      setNextRenewalDate(addMonths(startDate, option === "Monthly" ? 1 : 12));
                      setErrors((current) => ({ ...current, billingCycle: undefined }));
                    }}
                    className={`h-14 rounded-2xl border text-sm font-semibold transition ${
                      isSelected
                        ? "border-[#4d4ddb] bg-[#262061] text-[#8e95ff]"
                        : "border-white/8 bg-[#171823] text-[#8a93ad] hover:border-white/12 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {errors.billingCycle ? (
              <p className="mt-2 text-xs text-[#f26d78]">{errors.billingCycle}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">Payment Method</label>
            <div className="relative">
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setErrors((current) => ({ ...current, paymentMethod: undefined }));
                }}
                className={`h-14 w-full appearance-none rounded-2xl border bg-[#111320] px-4 text-sm text-white outline-none transition focus:border-[#5d5fef] ${
                  errors.paymentMethod ? "border-red-500/70" : "border-white/8"
                }`}
              >
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-[#111320]">
                    {option}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7a829c]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
            {errors.paymentMethod ? (
              <p className="mt-2 text-xs text-[#f26d78]">{errors.paymentMethod}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">
              Start Date <span className="text-[#f26d78]">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setNextRenewalDate(
                  addMonths(e.target.value, billingCycle === "Monthly" ? 1 : 12)
                );
                setErrors((current) => ({
                  ...current,
                  startDate: undefined,
                  nextRenewalDate: undefined,
                }));
              }}
              className={`h-14 w-full rounded-2xl border bg-[#171823] px-4 text-sm text-white outline-none transition focus:border-[#5d5fef] [color-scheme:dark] ${
                errors.startDate ? "border-red-500/70" : "border-white/8"
              }`}
            />
            {errors.startDate ? (
              <p className="mt-2 text-xs text-[#f26d78]">{errors.startDate}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">
              Next Renewal Date <span className="text-[#f26d78]">*</span>
            </label>
            <input
              type="date"
              value={nextRenewalDate}
              onChange={(e) => {
                setNextRenewalDate(e.target.value);
                setErrors((current) => ({ ...current, nextRenewalDate: undefined }));
              }}
              className={`h-14 w-full rounded-2xl border bg-[#171823] px-4 text-sm text-white outline-none transition focus:border-[#5d5fef] [color-scheme:dark] ${
                errors.nextRenewalDate ? "border-red-500/70" : "border-white/8"
              }`}
            />
            {errors.nextRenewalDate ? (
              <p className="mt-2 text-xs text-[#f26d78]">{errors.nextRenewalDate}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">
              Remind me (days before)
            </label>
            <div className="flex flex-wrap gap-2">
              {REMINDER_OPTIONS.map((option) => {
                const isSelected = remindMeDays === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setRemindMeDays(option);
                      setErrors((current) => ({ ...current, remindMeDays: undefined }));
                    }}
                    className={`min-w-[46px] rounded-[14px] border px-4 py-2.5 text-sm font-semibold transition ${
                      isSelected
                        ? "border-[#4d4ddb] bg-[#262061] text-[#8e95ff]"
                        : "border-white/8 bg-[#171823] text-[#8a93ad] hover:border-white/12 hover:text-white"
                    }`}
                  >
                    {option}d
                  </button>
                );
              })}
            </div>
            {errors.remindMeDays ? (
              <p className="mt-2 text-xs text-[#f26d78]">{errors.remindMeDays}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((option) => {
                const isSelected = status === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setStatus(option);
                      setErrors((current) => ({ ...current, status: undefined }));
                    }}
                    className={`h-14 rounded-2xl border text-sm font-semibold transition ${
                      isSelected
                        ? option === "Active"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                          : "border-red-500/20 bg-red-500/10 text-red-300"
                        : "border-white/8 bg-[#171823] text-[#8a93ad] hover:border-white/12 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {errors.status ? (
              <p className="mt-2 text-xs text-[#f26d78]">{errors.status}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-3 block text-sm font-medium text-[#d2d7e7]">Brand Color</label>
          <div className="flex flex-wrap gap-3">
            {BRAND_COLORS.map((color) => {
              const isSelected = brandColor === color;

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setBrandColor(color);
                    setErrors((current) => ({ ...current, brandColor: undefined }));
                  }}
                  className={`h-8 w-8 rounded-[10px] transition ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-[#0b0c16]" : ""}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select brand color ${color}`}
                />
              );
            })}
          </div>
          {errors.brandColor ? (
            <p className="mt-2 text-xs text-[#f26d78]">{errors.brandColor}</p>
          ) : null}
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-[#d2d7e7]">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            rows={4}
            className="w-full rounded-2xl border border-white/8 bg-[#171823] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#5e6681] focus:border-[#5d5fef]"
          />
        </div>

        <div className="mt-6 rounded-[1.35rem] border border-white/8 bg-[#141621] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: brandColor }}
              >
                {(serviceName.trim() || "S").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {serviceName.trim() || "Subscription name"}
                </p>
                <p className="truncate text-xs text-[#8b93ae]">
                  {category} · {currency} {formatAmount(cost)} /{" "}
                  {billingCycle === "Monthly" ? "Monthly" : "Yearly"}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                status === "Active"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/10 text-red-300"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 items-center justify-center rounded-[14px] border border-white/8 bg-[#1a1c28] text-sm font-semibold text-white transition hover:border-white/15 hover:bg-[#202332]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#4b4ded] to-[#7d3df0] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(94,76,255,0.38)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M16 3v8" />
              <path d="M8 3v8" />
              <path d="M3 11h18" />
            </svg>
            {loading
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
                ? "Update Subscription"
                : "Add Subscription"}
          </button>
        </div>
        {submitError ? (
          <p className="mt-4 text-sm text-[#f26d78]">{submitError}</p>
        ) : null}
      </form>
    </div>
  );
}
