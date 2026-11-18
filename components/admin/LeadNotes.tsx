"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { NotebookPen, Check, X } from "lucide-react";
import { updateLead } from "@/app/admin/leads/actions";

export default function LeadNotes({
  id,
  notes,
}: {
  id: string;
  notes: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(notes ?? "");
  const [saved, setSaved] = useState(notes ?? "");
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      const res = await updateLead(id, { notes: value });
      if (res?.error) {
        toast.error(res.error);
      } else {
        setSaved(value);
        setEditing(false);
        toast.success("Catatan disimpan");
      }
    });
  }

  function cancel() {
    setValue(saved);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="group mt-1 flex max-w-md items-start gap-1.5 text-left text-xs text-slate-400 hover:text-slate-200 transition-colors"
        title="Edit catatan internal"
      >
        <NotebookPen className="mt-0.5 h-3 w-3 shrink-0 text-slate-500 group-hover:text-blue-400" />
        {saved ? (
          <span className="line-clamp-2 italic">{saved}</span>
        ) : (
          <span className="italic text-slate-500">Tambah catatan…</span>
        )}
      </button>
    );
  }

  return (
    <div className="mt-1.5 max-w-md">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        autoFocus
        disabled={pending}
        placeholder="Catatan internal tim (follow-up, hasil call, dll.)"
        className="w-full rounded-lg border border-slate-700 bg-[#0F1A30] p-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
      />
      <div className="mt-1.5 flex items-center gap-1.5">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex h-7 items-center gap-1 rounded-md bg-blue-500 px-2.5 text-xs font-semibold text-slate-100 hover:bg-blue-500 disabled:opacity-60"
        >
          <Check className="h-3 w-3" />
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={pending}
          className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-700 px-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
        >
          <X className="h-3 w-3" />
          Batal
        </button>
      </div>
    </div>
  );
}
