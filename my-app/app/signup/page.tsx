"use client";

import SignupForm from "@/components/molecules/SignupForm";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const { success } = useSelector((state: RootState) => state.user);


  useEffect(() => {
    if (success) {
      router.push("/login");
    }
  }, [success, router]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#05061a] text-white">
      
      <div className="w-[448px]">
     <p onClick={() => router.push("/")} className="text-xs text-gray-400 mb-4 cursor-pointer">
          ← Back to home
      </p>
      </div>

      <div className="w-[448px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-white"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-semibold">SubTrack</span>
        </div>

      
        <h2 className="text-2xl font-semibold">
          Create your account
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Start tracking your subscriptions today
        </p>

      
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs border border-white/10 px-3 py-1 rounded-full">
           <span className="text-[rgb(21,192,150)]">✔</span>  Free forever plan
          </span>
          <span className="text-xs border border-white/10 px-3 py-1 rounded-full">
            <span className="text-[rgb(21,192,150)]">✔</span> No credit card
          </span>
          <span className="text-xs border border-white/10 px-3 py-1 rounded-full">
            <span className="text-[rgb(21,192,150)]">✔</span>Instant setup
          </span>
        </div>

        {/* Form */}
        <SignupForm />

       
        <p className="text-xs text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-purple-400 cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}