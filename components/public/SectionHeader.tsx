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
              ? "border border-blue-500/30 bg-blue-950/60 text-blue-300"
              : "border border-blue-600/20 bg-blue-50 text-blue-700"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          {tag}
        </div>
      )}
      <h2
        className={cn(
          "font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.18] tracking-tight",
          invert ? "text-slate-100" : "text-slate-900"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg lg:text-xl",
            invert ? "text-slate-300" : "text-slate-600"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
