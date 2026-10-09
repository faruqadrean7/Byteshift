import ServiceForm from "@/components/admin/ServiceForm";
import { saveService } from "../actions";

export default function NewServicePage() {
  return <ServiceForm action={saveService} />;
}
