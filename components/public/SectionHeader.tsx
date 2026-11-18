import { cn } from "@/lib/utils";

export default function SectionHeader({
  tag,
  title,
  subtitle,
  align = "left",
  invert = false,
}: {
  tag?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl lg:max-w-4xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      {tag && (
        <div
          className={cn(
            "mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs lg:text-sm font-semibold uppercase tracking-[0.2em]",
            invert
              ? "border border-steel-accent/25 bg-steel-accent/10 text-steel-soft"
              : "border border-steel-accentink/20 bg-steel-accentink/[0.08] text-steel-accentink"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              invert ? "bg-steel-accent" : "bg-steel-accentink"
            )}
          />
          {tag}
        </div>
      )}
      <h2
        className={cn(
          "font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.18] tracking-tight",
          invert ? "text-steel-text" : "text-steel-ink"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg lg:text-xl",
            invert ? "text-steel-muted" : "text-steel-inkmuted"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
