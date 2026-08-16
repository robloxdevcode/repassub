"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/retro";

export function DashboardStatusBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const upgraded = searchParams.get("upgraded") === "1";
    const billing = searchParams.get("billing") === "updated";

    if (upgraded) {
      toast("You're on Pro — thanks for upgrading!", "success");
      router.replace("/dashboard");
    } else if (billing) {
      toast("Billing updated.", "success");
      router.replace("/dashboard");
    }
  }, [searchParams, router, toast]);

  return null;
}
