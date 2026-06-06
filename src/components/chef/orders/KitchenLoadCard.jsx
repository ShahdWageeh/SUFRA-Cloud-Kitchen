import { Utensils } from "lucide-react";

export default function KitchenLoadCard() {
  return (
    <div className="bg-teal-600 rounded-card p-6 text-white">
      <div className="flex justify-between">
        <span>KITCHEN LOAD</span>
        <Utensils />
      </div>

      <h3 className="text-4xl font-bold mt-4">
        Moderate
      </h3>

      <div className="h-3 bg-white/20 rounded-full mt-4">
        <div className="h-full w-2/3 bg-white rounded-full" />
      </div>

      <p className="mt-4 text-sm">
        8 active burners in use
      </p>
    </div>
  );
}