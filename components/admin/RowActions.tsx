"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function RowActions({
  editHref,
  onDelete,
}: {
  editHref?: string;
  onDelete?: () => Promise<{ error?: string } | void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-1.5">
      {editHref && (
        <Link
          href={editHref}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
          aria-label="Edit"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      )}
      {onDelete && (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm("Yakin ingin menghapus?")) return;
            startTransition(async () => {
              const res = await onDelete();
              if (res && "error" in res && res.error) {
                toast.error(res.error);
              } else {
                toast.success("Berhasil dihapus");
              }
            });
          }}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          aria-label="Hapus"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
