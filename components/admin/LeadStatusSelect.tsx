"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateLead } from "@/app/admin/leads/actions";

const options = [
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "converted", label: "Closed/Win" },
  { value: "dropped", label: "Drop" },
];

export default function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        start(async () => {
          const res = await updateLead(id, { status: e.target.value });
          if (res?.error) toast.error(res.error);
          else toast.success("Status diperbarui");
        })
      }
      className="rounded-lg border border-slate-700 bg-[#0F1A30] px-2.5 py-1.5 text-xs text-slate-200 font-medium focus:border-blue-500 focus:outline-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-slate-900 text-slate-200">
          {o.label}
        </option>
      ))}
    </select>
  );
}
