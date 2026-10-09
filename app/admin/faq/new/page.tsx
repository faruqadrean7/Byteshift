import FaqForm from "@/components/admin/FaqForm";
import { saveFaq } from "../actions";
export default function Page() {
  return <FaqForm action={saveFaq} />;
}
