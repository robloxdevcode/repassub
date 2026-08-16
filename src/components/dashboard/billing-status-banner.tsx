"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/retro";

export function BillingStatusBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("checkout") === "canceled") {
      toast("Checkout canceled — no charge was made.", "info");
      router.replace("/billing");
    }
  }, [searchParams, router, toast]);

  return null;
}
