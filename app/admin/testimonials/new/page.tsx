import TestimonialForm from "@/components/admin/TestimonialForm";
import { saveTestimonial } from "../actions";

export default function NewTestimonialPage() {
  return <TestimonialForm action={saveTestimonial} />;
}
