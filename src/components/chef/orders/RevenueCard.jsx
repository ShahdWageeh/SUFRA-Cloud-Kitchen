import { Banknote } from "lucide-react";

export default function RevenueCard() {
  return (
    <div className="bg-white rounded-card border border-[#EAD3CB] p-6">
      <div className="flex justify-between">
        <span>TODAY'S REVENUE</span>
        <Banknote className="text-primary" />
      </div>

      <h3 className="text-4xl font-bold mt-4">
        SAR 1,420
      </h3>

      <p className="mt-4 text-sm text-teal-600 font-medium">
        14 orders completed today
      </p>
    </div>
  );
}