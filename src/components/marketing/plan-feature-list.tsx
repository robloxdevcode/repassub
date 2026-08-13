import { cn } from "@/lib/utils";

export function PlanFeatureList({
  features,
  finePrint,
  className,
  bulletClassName,
}: {
  features: readonly string[];
  finePrint?: string;
  className?: string;
  bulletClassName?: string;
}) {
  return (
    <>
      <ul className={cn("space-y-3 flex-1", className)}>
        {features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-sm leading-relaxed">
            <span className={cn("text-retro-accent shrink-0 font-semibold", bulletClassName)} aria-hidden>
              ✦
            </span>
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
