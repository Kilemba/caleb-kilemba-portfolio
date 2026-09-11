import { TechIcon } from "@/components/public/TechIcon";

/**
 * A single tool, shown with its brand mark.
 *
 * Used everywhere the stack appears — service cards, project pages, the services list —
 * so the tools look the same wherever a visitor meets them.
 */
export function TechBadge({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const small = size === "sm";
  return (
    <span className={small ? "tech-badge tech-badge-sm" : "tech-badge"}>
      <TechIcon name={name} className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {name}
    </span>
  );
}
