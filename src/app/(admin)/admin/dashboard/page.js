
import { statsCards } from "@/data/dashboard";
import AcquisitionChart from "@/components/admin/charts/AcquisitionChart";
import StatsCard from "@/components/admin/ui/StatsCard";
import OrdersChart from "@/components/admin/charts/OrdersChart";
import TopChefsCard from "@/components/admin/sections/TopChefsCard";
import Footer from "@/components/admin/layout/Footer";

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Platform Overview</h1>
        <p className="text-sm mt-1" style={{ color: "#8A8A8A" }}>
          Real-time insights into your culinary community.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {statsCards.map((card) => (
          <StatsCard key={card.id} {...card} />
        ))}
      </div>

      {/* Orders Overview + Top Chefs */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 mb-6">
        <OrdersChart />
        <TopChefsCard />
      </div>

      {/* User Acquisition Growth */}
      <div className="mb-6">
        <AcquisitionChart />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
