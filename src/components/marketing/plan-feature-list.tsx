import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlanFeatureList({
  features,
  finePrint,
  className,
}: {
  features: readonly string[];
  finePrint?: string;
  className?: string;
}) {
  return (
    <>
      <ul className={cn("space-y-2.5 flex-1", className)}>
        {features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-sm leading-snug text-retro-text-dim">
            <Check size={16} className="text-retro-accent shrink-0 mt-0.5" strokeWidth={2.5} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {finePrint ? (
        <p className="mt-4 text-xs text-retro-text-muted leading-relaxed">{finePrint}</p>
      ) : null}
    </>
  );
}
