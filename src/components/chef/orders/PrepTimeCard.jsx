import { Timer } from "lucide-react";

export default function PrepTimeCard() {
  return (
    <div className="bg-[#EAE6DE] rounded-card p-6">
      <div className="flex justify-between">
        <span>AVG. PREP TIME</span>
        <Timer />
      </div>

      <h3 className="text-4xl font-bold mt-4">
        18 Mins
      </h3>

      <p className="mt-4 text-sm text-text-tertiary">
        ↑ 2 mins from yesterday
      </p>
    </div>
  );
}