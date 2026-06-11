"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandCard from "@/components/chef/branding/BrandCard";
import BrandPaletteCard from "@/components/chef/branding/BrandPaletteCard";
import MarketEdgeCard from "@/components/chef/branding/MarketEdgeCard";
import { RefreshCw } from "lucide-react";
import { brandingService } from "@/services";

export default function BrandRevealPage() {
    const router = useRouter();
    const [brandData, setBrandData] = useState(null);
    const [isUsingFallback, setIsUsingFallback] = useState(false);
    const [brandingForm, setBrandingForm] = useState(null);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;

        const resp = sessionStorage.getItem("brandingResponse");
        const form = sessionStorage.getItem("brandingForm");

        if (resp) {
            try {
                const parsed = JSON.parse(resp);
                const parsedForm = form ? JSON.parse(form) : null;

                setBrandingForm(parsedForm);

                const mapped = {
                    brandName: parsed.kitchenName || "Your Kitchen",
                    slogan: parsed.slogan || "",
                    description: parsed.description || "",
                    tags: parsedForm?.cookingStyles || [],
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

                setBrandData(mapped);
                return;
            } catch (e) {
                // fallthrough to defaults
            }
        }

        // default static data fallback
        setIsUsingFallback(true);
        setBrandData({
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
        });
    }, []);

    if (!brandData) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {isUsingFallback && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                        ⚠️ <strong>Debug Info:</strong> Using fallback data. Backend response was not found in sessionStorage. Check the console logs (F12) for details on the backend response structure.
                    </p>
                </div>
            )}

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
                <h1 className="text-5xl font-bold text-[#1F1F1F]">AI Brand Generation</h1>

                <p className="mt-4 text-gray-500 max-w-xl">
                    Based on your culinary heritage and kitchen style, our AI has crafted a bespoke brand identity for your business.
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
                <button
                    type="button"
                    disabled={!brandingForm || isRegenerating}
                    onClick={async () => {
                        if (!brandingForm) return;

                        setIsRegenerating(true);
                        setError("");

                        try {
                            const result = await brandingService.generateKitchenBranding(brandingForm);
                            const responsePayload = result?.data ?? result;
                            const brandingResponse = responsePayload?.data ?? responsePayload;

                            if (typeof window !== "undefined") {
                                window.sessionStorage.setItem(
                                    "brandingResponse",
                                    JSON.stringify(brandingResponse),
                                );
                            }

                            const updatedData = {
                                brandName: brandingResponse?.kitchenName || "Your Kitchen",
                                slogan: brandingResponse?.slogan || "",
                                description: brandingResponse?.description || "",
                                tags: brandingForm?.cookingStyles || [],
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

                            setBrandData(updatedData);
                        } catch (err) {
                            setError(
                                err?.response?.data?.message ||
                                    "Unable to regenerate branding. Please try again.",
                            );
                        } finally {
                            setIsRegenerating(false);
                        }
                    }}
                    className="px-6 py-3 rounded-full border border-gray-300 hover:bg-[#FFDBD0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center gap-2">
                        <RefreshCw /> {isRegenerating ? "Regenerating..." : "Regenerate Options"}
                    </span>
                </button>

                <button
                    onClick={() => {
                        if (typeof window !== "undefined") {
                            window.sessionStorage.setItem(
                                "brandIdentityDraft",
                                JSON.stringify({
                                    name: brandData.brandName,
                                    slogan: brandData.slogan,
                                    bio: brandData.description,
                                }),
                            );
                        }
                        router.push("/chef/profile");
                    }}
                    className="px-8 py-3 rounded-full bg-primary text-white hover:opacity-90"
                >
                    Confirm & Continue
                </button>
            </div>
            {error && (
                <div className="mt-4 text-sm text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
}