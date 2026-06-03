import BrandCard from "@/components/chef/BrandCard";
import BrandPaletteCard from "@/components/chef/BrandPaletteCard";
import MarketEdgeCard from "@/components/chef/MarketEdgeCard";
import { RefreshCw } from 'lucide-react';

export default function BrandRevealPage() {
    // TODO: Replace with backend response later
    const brandData = {
        brandName: "Amina's Authentic Bites",
        slogan: "Heritage in every handful",
        description:
            "Born from generations of Levantine tradition, Amina's Authentic Bites brings soulful warmth of a home kitchen to your modern lifestyle.",
        tags: ["Authentic", "Heritage", "Levantine"],
        colors: [
            { name: "Terracotta Red", value: "#964326" },
            { name: "Sage Green", value: "#0F766E" },
            { name: "Creamy Linen", value: "#F5EBDD" },
            { name: "Charcoal Ash", value: "#4A4A4A" },
        ],
        marketEdge: [
            "Appeals to urban professionals",
            "Strong local identity",
            "High social media potential",
        ],
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-12">
                <div className="flex gap-6">
                    <div className="relative w-24 flex flex-col items-center pt-3">
                        <div className="absolute top-0 w-full h-2 bg-primary rounded-full" />
                        <span className="text-primary font-medium">Identity</span>
                    </div>

                    <div className="relative w-24 flex flex-col items-center pt-3">
                        <div className="absolute top-0 w-full h-2 bg-primary rounded-full" />
                        <span className="text-primary font-medium">Branding</span>
                    </div>

                    <div className="relative w-24 flex flex-col items-center pt-3">
                        <div className="absolute top-0 w-full h-2 bg-gray-300 rounded-full" />
                        <span className="text-gray-400">Listings</span>
                    </div>

                    <div className="relative w-24 flex flex-col items-center pt-3">
                        <div className="absolute top-0 w-full h-2 bg-gray-300 rounded-full" />
                        <span className="text-gray-400">Payouts</span>
                    </div>
                </div>
            </div>
            <div className="mb-10">
                <h1 className="text-5xl font-bold text-[#1F1F1F]">
                    AI Brand Generation
                </h1>

                <p className="mt-4 text-gray-500 max-w-xl">
                    Based on your culinary heritage and kitchen style,
                    our AI has crafted a bespoke brand identity for your business.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2">
                    <BrandCard data={brandData} />
                </div>

                <div className="space-y-6">
                    <BrandPaletteCard colors={brandData.colors} />
                    <MarketEdgeCard items={brandData.marketEdge} />
                </div>
            </div>

            <div className="mt-10 border-t border-gray-300 pt-8 flex flex-wrap gap-4 justify-end">
                <button className="px-6 py-3 rounded-full border border-gray-300  hover:bg-[#FFDBD0]">
                    <span className="flex items-center gap-2">
                        <RefreshCw /> Regenerate Options
                    </span>
                </button>

                <button className="px-8 py-3 rounded-full bg-primary text-white hover:opacity-90">
                    Confirm & Continue
                </button>
            </div>
        </div>
    );
}