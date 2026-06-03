import { UtensilsCrossed } from "lucide-react";

export default function LogoConceptCard() {
  return (
    <div className="bg-secondary-container rounded-2xl p-6 text-center">

      <h3 className="text-xs uppercase text-gray-500 tracking-wider mb-4">
        Logo Concept
      </h3>

      <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center">
        <UtensilsCrossed
          size={36}
          className="text-white"
        />
      </div>

      <p className="text-sm text-gray-500 mt-5">
        Abstract Mortar & Pestle Symbol
      </p>
    </div>
  );
}