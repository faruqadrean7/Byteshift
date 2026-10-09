/**
 * Render Tiptap JSON content to HTML on the server (no client JS needed).
 * Handles common nodes: doc, paragraph, heading, bulletList, orderedList,
 * listItem, blockquote, codeBlock, image, hardBreak, horizontalRule, text + marks.
 */

import { publicMediaUrl } from "@/lib/storage";

type Mark = { type: string; attrs?: Record<string, unknown> };
type Node = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Mark[];
  content?: Node[];
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderText(node: Node): string {
  let html = escapeHtml(node.text ?? "");
  (node.marks ?? []).forEach((m) => {
    switch (m.type) {
      case "bold":
        html = `<strong>${html}</strong>`;
        break;
      case "italic":
        html = `<em>${html}</em>`;
        break;
      case "underline":
        html = `<u>${html}</u>`;
        break;
      case "strike":
        html = `<s>${html}</s>`;
        break;
      case "code":
        html = `<code>${html}</code>`;
        break;
      case "link": {
        const href = String(m.attrs?.href ?? "#");
        const target = m.attrs?.target ? ` target="${m.attrs.target}"` : "";
        html = `<a href="${escapeHtml(href)}"${target} rel="noreferrer" class="text-brand underline">${html}</a>`;
        break;
      }
    }
  });
  return html;
}

function renderNode(node: Node): string {
  if (node.type === "text") return renderText(node);
  const children = (node.content ?? []).map(renderNode).join("");
  switch (node.type) {
    case "doc":
      return children;
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading": {
      const level = Math.min(Math.max(Number(node.attrs?.level ?? 2), 1), 6);
      return `<h${level}>${children}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${children}</code></pre>`;
    case "hardBreak":
      return "<br/>";
    case "horizontalRule":
      return "<hr/>";
    case "image": {
      const src = publicMediaUrl(String(node.attrs?.src ?? ""));
      const alt = escapeHtml(String(node.attrs?.alt ?? ""));
      return `<img src="${escapeHtml(src)}" alt="${alt}" class="rounded-xl my-6" />`;
    }
    default:
      return children;
  }
}

export default function TiptapRenderer({
  content,
  className,
}: {
  content: unknown;
  className?: string;
}) {
  if (!content) return null;
  const html = renderNode(content as Node);
  return (
    <div
      className={
        className ??
        "prose prose-tiptap max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-brand prose-img:rounded-xl"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
