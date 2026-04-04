"use client";

import LoginForm from "@/components/molecules/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GuestRoute from "@/components/molecules/GuestRoute";
import { clearStatus } from "@/redux/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { success } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (success) {
      dispatch(clearStatus());
      router.push("/dashboard");
    }
  }, [success, dispatch, router]);

  return (
    <GuestRoute>
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#05061a] text-white px-4">

        <div className="w-full max-w-[448px]">
          <p
            onClick={() => router.push("/")}
            className="text-xs text-gray-400 mb-4 cursor-pointer hover:text-gray-300 transition-colors"
          >
            ← Back to home
          </p>
        </div>

        <div className="w-full max-w-[448px] rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-semibold">SubTrack</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">
            Sign in to your account to continue
          </p>
          <LoginForm />
          <p className="text-xs text-gray-400 text-center mt-6">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors"
            >
              Create one
            </span>
          </p>
        </div>

      </div>
    </GuestRoute>
  );
}
