import PortfolioForm from "@/components/admin/PortfolioForm";
import { savePortfolio } from "../actions";
export default function Page() {
  return <PortfolioForm action={savePortfolio} />;
}
