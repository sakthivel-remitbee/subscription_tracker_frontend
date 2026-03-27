"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, accessToken } = useSelector((state: RootState) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!user || !accessToken)) {
      router.replace("/login");
    }
  }, [mounted, user, accessToken, router]);

  if (!mounted) return null;
  if (!user || !accessToken) return null;

  return <>{children}</>;
}