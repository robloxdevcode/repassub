"use client";

import { useCallback, useRef } from "react";
import { claimEasterEgg } from "@/lib/actions/easter-eggs";
import { useToast } from "@/components/retro";
import type { EasterEggId } from "@/lib/easter-eggs";

type TriggerEvent = { preventDefault?: () => void };

export function useEasterEggTrigger(eggId: EasterEggId, requiredClicks: number) {
  const { toast } = useToast();
  const clicksRef = useRef(0);
  const claimedRef = useRef(false);

  const onTrigger = useCallback(
    async (event?: TriggerEvent) => {
      clicksRef.current += 1;
      if (clicksRef.current < requiredClicks) {
        event?.preventDefault?.();
        return;
      }
      if (claimedRef.current) return;

      claimedRef.current = true;
      const result = await claimEasterEgg(eggId);
      if (result.ok && !result.already) {
        toast(result.message, "success");
      } else if (result.ok && result.already) {
        toast(result.message, "info");
      } else {
        toast(result.message, "error");
        claimedRef.current = false;
        clicksRef.current = 0;
      }
    },
    [eggId, requiredClicks, toast]
  );

  return onTrigger;
}
