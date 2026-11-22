import SectorForm from "@/components/admin/SectorForm";
import { saveSector } from "../actions";

export default function NewSectorPage() {
  return <SectorForm action={saveSector} />;
}
