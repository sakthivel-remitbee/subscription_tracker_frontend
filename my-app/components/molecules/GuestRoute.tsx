"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useIsClient from "@/hooks/useIsClient";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, accessToken } = useSelector((state: RootState) => state.user);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient && user && accessToken) {
      router.replace("/subscriptions");
    }
  }, [isClient, user, accessToken, router]);

  if (!isClient) return null;
  if (user && accessToken) return null;

  return <>{children}</>;
}
