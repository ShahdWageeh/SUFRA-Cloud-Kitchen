import KitchenLoadCard from "./KitchenLoadCard";
import PrepTimeCard from "./PrepTimeCard";
import RevenueCard from "./RevenueCard";

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <KitchenLoadCard />
      <PrepTimeCard />
      <RevenueCard />
    </div>
  );
}