import BlogForm from "@/components/admin/BlogForm";
import { saveBlogPost } from "../actions";
export default function Page() {
  return <BlogForm action={saveBlogPost} />;
}
