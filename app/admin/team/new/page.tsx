import TeamForm from "@/components/admin/TeamForm";
import { saveTeamMember } from "../actions";
export default function Page() {
  return <TeamForm action={saveTeamMember} />;
}
