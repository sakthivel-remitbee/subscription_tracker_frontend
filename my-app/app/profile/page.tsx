"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Select from "@/components/atoms/Select";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { fetchUserProfile, logout } from "@/redux/userSlice";
import {
    deleteUserRequest,
    updatePasswordRequest,
    updateProfileRequest,
    uploadProfileImageRequest,
} from "@/service/userService";
const TIMEZONES = ["America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Kolkata", "Asia/Tokyo"];
const CURRENCIES = ["USD", "INR", "EUR", "GBP", "AED"];

export default function ProfilePage() {
    
    const { user, accessToken } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const router = useRouter();
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const memberSinceYear = user?.createdAt
        ? new Date(user.createdAt).getFullYear()
        : new Date().getFullYear();

    useEffect(() => {
        // Pull the latest profile once auth is available instead of trusting stale local data.
        if (accessToken) {
            dispatch(fetchUserProfile());
        }
    }, [accessToken, dispatch]);

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure? This cannot be undone.")) return;
        setDeleteLoading(true);
        try {
            await deleteUserRequest();
            dispatch(logout());
            router.push("/signup");
        } finally {
            setDeleteLoading(false);
        }
    };

    const profileFormik = useFormik({
        // The form should follow backend profile updates after save/upload refreshes.
        enableReinitialize: true,
        initialValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            timezone: user?.timezone ?? "Asia/Kolkata",
            currency: user?.currency ?? "USD",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            email: Yup.string().email("Invalid email").required("Required"),
        }),
        onSubmit: async (values) => {
            setProfileLoading(true);
            try {
                await updateProfileRequest({
                    name: values.name,
                    email: values.email,
                    timezone: values.timezone,
                    currency: values.currency,
                });
                await dispatch(fetchUserProfile()).unwrap();
                setProfileSuccess(true);
            } finally {
                setProfileLoading(false);
            }
        },
    });

    const passwordFormik = useFormik({
        initialValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required("Required"),
            newPassword: Yup.string().min(6, "Min 6 characters").required("Required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Passwords must match")
                .required("Required"),
        }),
        onSubmit: async (values) => {
            setPasswordLoading(true);
            setPasswordError("");
            try {
                await updatePasswordRequest({
                    oldPassword: values.currentPassword,
                    newPassword: values.newPassword,
                });
                setPasswordSuccess(true);
                passwordFormik.resetForm();
            } catch (error: unknown) {
                const message =
                    typeof error === "object" &&
                    error !== null &&
                    "response" in error &&
                    typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === "string"
                        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                        : "Unable to update password";
                setPasswordError(message ?? "Unable to update password");
            } finally {
                setPasswordLoading(false);
            }
        },
    });

    return (
        <DashboardLayout title="Profile">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="w-full rounded-[1.75rem] border border-white/10 bg-[#0b0c18] px-6 pb-6 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-10 sm:py-7">
                    <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
                        <div className="relative group w-fit">
                            <Avatar name={user?.name ?? "U"} img={user?.img} size="xl" />
                            <label
                                htmlFor="avatar-upload"
                                className="absolute -bottom-3 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#4d5074] bg-[#1a1d33] text-[#d7def0] shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition hover:border-[#6a6fff] hover:text-white sm:-bottom-2 sm:h-10 sm:w-10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px] sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append("image", file);
                                    await uploadProfileImageRequest(formData);
                                    await dispatch(fetchUserProfile()).unwrap();
                                }}
                            />
                        </div>

                        <div className="min-w-0 flex-1 pt-5 sm:pt-0">
                            <div className="mx-auto max-w-[320px] sm:mx-0 sm:max-w-none">
                                <h2 className="text-[2.1rem] font-semibold tracking-[-0.04em] leading-none text-white sm:text-2xl">
                                    {user?.name ?? "User"}
                                </h2>
                                <p className="mt-3 text-[1.1rem] leading-none text-[#95a1bb] sm:mt-1 sm:text-base">
                                    {user?.email ?? "user@example.com"}
                                </p>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-5 sm:justify-start sm:gap-3">
                                <span className="rounded-full border border-[#31365a] bg-[#16182a] px-4 py-1.5 text-sm font-medium text-[#7f88ff] sm:px-4 sm:py-1.5 sm:text-xs">
                                    Pro Plan
                                </span>
                                <span className="rounded-full border border-[#31365a] bg-[#191b28] px-4 py-1.5 text-sm font-medium text-[#a7b2c8] sm:px-4 sm:py-1.5 sm:text-xs">
                                    {user?.currency ?? profileFormik.values.currency}
                                </span>
                                <span className="rounded-full border border-[#31365a] bg-[#191b28] px-4 py-1.5 text-sm font-medium text-[#a7b2c8] sm:px-4 sm:py-1.5 sm:text-xs">
                                    Member since {memberSinceYear}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-base font-semibold mb-1">Profile Information</h3>
                    <p className="text-xs text-gray-400 mb-5">Update your personal details and preferences</p>

                    <form onSubmit={profileFormik.handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                Full Name
                            </label>
                            <Input
                                name="name"
                                placeholder="Alex Johnson"
                                value={profileFormik.values.name}
                                onChange={profileFormik.handleChange}
                                onBlur={profileFormik.handleBlur}
                                error={!!(profileFormik.touched.name && profileFormik.errors.name)}
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                Email Address
                            </label>
                            <Input
                                name="email"
                                placeholder="alex@example.com"
                                value={profileFormik.values.email}
                                onChange={profileFormik.handleChange}
                                onBlur={profileFormik.handleBlur}
                                error={!!(profileFormik.touched.email && profileFormik.errors.email)}
                            />
                            <p className="text-[10px] text-gray-600 mt-1">Email changes coming soon</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                    Currency
                                </label>
                                <Select
                                    value={profileFormik.values.currency}
                                    onChange={(e) => profileFormik.setFieldValue("currency", e.target.value)}
                                    options={CURRENCIES}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    Timezone
                                </label>
                                <Select
                                    value={profileFormik.values.timezone}
                                    onChange={(e) => profileFormik.setFieldValue("timezone", e.target.value)}
                                    options={TIMEZONES}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            {profileSuccess && <p className="text-xs text-green-400 mr-4 self-center">✓ Saved successfully</p>}
                            <Button text="Save Changes" loading={profileLoading} />
                        </div>
                    </form>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-base font-semibold mb-1">Change Password</h3>
                    <p className="text-xs text-gray-400 mb-5">Use a strong password to keep your account secure</p>

                    <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                Current Password
                            </label>
                            <Input
                                name="currentPassword"
                                type="password"
                                placeholder="Enter current password"
                                value={passwordFormik.values.currentPassword}
                                onChange={passwordFormik.handleChange}
                                onBlur={passwordFormik.handleBlur}
                                error={!!(passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword)}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                New Password
                            </label>
                            <Input
                                name="newPassword"
                                type="password"
                                placeholder="Min. 6 characters"
                                value={passwordFormik.values.newPassword}
                                onChange={passwordFormik.handleChange}
                                onBlur={passwordFormik.handleBlur}
                                error={!!(passwordFormik.touched.newPassword && passwordFormik.errors.newPassword)}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                Confirm New Password
                            </label>
                            <Input
                                name="confirmPassword"
                                type="password"
                                placeholder="Repeat new password"
                                value={passwordFormik.values.confirmPassword}
                                onChange={passwordFormik.handleChange}
                                onBlur={passwordFormik.handleBlur}
                                error={!!(passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword)}
                            />
                        </div>

                        {passwordError && (
                            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                                <p className="text-xs text-red-400">{passwordError}</p>
                            </div>
                        )}

                        <div className="flex justify-end">
                            {passwordSuccess && <p className="text-xs text-green-400 mr-4 self-center">✓ Password updated</p>}
                            <Button text="Update Password" loading={passwordLoading} />
                        </div>
                    </form>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                    <h3 className="text-base font-semibold text-red-400 mb-1">Danger Zone</h3>
                    <p className="text-xs text-gray-400 mb-4">
                        Permanently delete your account and all your data. This cannot be undone.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                        className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {deleteLoading ? (
                            <>
                                <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            "Delete Account"
                        )}
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
}
