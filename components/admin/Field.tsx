import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
  hint,
  error,
  textarea,
  rows = 4,
  className,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
  className?: string;
  maxLength?: number;
}) {
  return (
    <div className={cn(className)}>
      <Label htmlFor={name} className="flex items-center justify-between">
        <span>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
      </Label>
      {textarea ? (
        <Textarea
          id={name}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          defaultValue={defaultValue ?? undefined}
          aria-invalid={!!error}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          defaultValue={defaultValue ?? undefined}
          aria-invalid={!!error}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      )}
      {error ? (
        <p className="mt-1 text-xs font-semibold text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700/80 bg-slate-900/60 p-3.5 transition-colors hover:border-slate-600 hover:bg-slate-800/60">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        value="true"
        className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
      />
      <span>
        <span className="block font-semibold text-slate-200">{label}</span>
        {hint && (
          <span className="block text-xs text-slate-400 mt-0.5">{hint}</span>
        )}
      </span>
    </label>
  );
}

export function ArrayField({
  label,
  name,
  defaultValue,
  hint,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string[] | null;
  hint?: string;
  placeholder?: string;
}) {
  const value = (defaultValue ?? []).join(", ");
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <div className="mt-1.5">
        <Input
          id={name}
          name={name}
          defaultValue={value}
          placeholder={placeholder ?? "Pisahkan dengan koma"}
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {hint ?? "Pisahkan dengan koma. Contoh: Next.js, Tailwind, Supabase"}
      </p>
    </div>
  );
}

export function FieldGrid({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
}
