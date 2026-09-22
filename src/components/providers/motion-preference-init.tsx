"use client";

import { useEffect } from "react";
import { applyReduceMotionClass } from "@/lib/motion-preference";

/** Applies stored reduce-motion preference to `html` on every route. */
export function MotionPreferenceInit() {
  useEffect(() => {
    applyReduceMotionClass();
  }, []);
  return null;
}
