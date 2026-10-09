import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export default function AdminTable({
  columns,
  rows,
  empty = "Belum ada data.",
  caption,
  toolbar,
  footer,
}: {
  columns: { key: string; label: string; className?: string }[];
  rows: React.ReactNode[][];
  empty?: string;
  caption?: string;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <Card>
        {toolbar && (
          <div className="border-b border-slate-800 bg-[#0F1B38]/40 p-4">{toolbar}</div>
        )}
        <CardContent className="py-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">{empty}</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      {toolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#0F1B38]/40 p-4">
          {toolbar}
        </div>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {caption && (
              <caption className="px-4 pt-3 text-left text-xs text-slate-400">
                {caption}
              </caption>
            )}
            <thead className="border-b border-slate-800 bg-[#0F1B38]/80 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={`px-4 py-3.5 font-bold ${c.className ?? ""}`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="transition-colors hover:bg-slate-800/40 text-slate-200"
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-4 py-3.5 align-middle ${columns[j]?.className ?? ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footer && (
          <div className="border-t border-slate-800 bg-[#0F1B38]/30 px-4 py-3 text-xs text-slate-400">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
