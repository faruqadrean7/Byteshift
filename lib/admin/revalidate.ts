import { revalidatePath } from "next/cache";

const PATH_MAP: Record<string, string[]> = {
  services: ["/", "/portfolio"],
  portfolio: ["/", "/portfolio"],
  testimonials: ["/"],
  faqs: ["/"],
  packages: ["/"],
  team_members: ["/tentang"],
  blog_posts: ["/", "/blog"],
  site_settings: ["/", "/portfolio", "/blog", "/tentang", "/kontak"],
};

export function revalidateForTable(table: keyof typeof PATH_MAP) {
  PATH_MAP[table]?.forEach((p) => revalidatePath(p));
}
