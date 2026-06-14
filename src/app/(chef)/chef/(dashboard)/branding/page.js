"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Star } from "lucide-react";
import { brandingService } from "@/services";
import useAuth from "@/hooks/useAuth";
import { Loader } from "@/components/ui";

const unwrapBrandingResponse = (response) => response?.data ?? response;

export default function BrandingPage() {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }

    if (!loading && user && user.role !== "chef") {
      router.replace("/");
    }
  }, [loading, user, router]);

  const cookingStyles = [
    "Levantine",
    "Mediterranean",
    "South Asian",
    "Traditional Home",
    "Fusion",
    "+ Other",
  ];

  const [selectedStyles, setSelectedStyles] = useState([]);
  const [signatureDish, setSignatureDish] = useState("");
  const [audience, setAudience] = useState("");
  const [story, setStory] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F7]">
        <Loader />
      </div>
    );
  }

  function toggleStyle(style) {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  }

  async function handleContinue() {
    setError("");

    if (selectedStyles.length === 0) {
      setError("Please select at least one cooking style.");
      return;
    }

    if (!signatureDish.trim()) {
      setError("Please enter your signature dish.");
      return;
    }

    if (story.trim().length < 60) {
      setError("Please provide a story of at least 60 characters.");
      return;
    }

    const payload = {
      cookingStyles: selectedStyles,
      signatureDish,
      audience,
      story,
    };

    try {
      setLoadingSubmit(true);

      const result = await brandingService.generateKitchenBranding(payload);
      const brandingResponse = unwrapBrandingResponse(result);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "brandingResponse",
          JSON.stringify(brandingResponse),
        );
        sessionStorage.setItem("brandingForm", JSON.stringify(payload));
      }

      router.push("/chef/branding/reveal");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate branding.");
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F7] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-primary">Sufra</h1>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">Chef Onboarding</span>

            <span className="text-xs bg-orange-100 text-primary px-2 py-1 rounded-full">
              Step 1 of 3
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
            <div className="h-full w-1/3 bg-primary rounded-full"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">
              Describe your kitchen
            </h2>

            <p className="text-gray-500 mb-8">
              Tell us about the flavors that define your craft and the people
              you love to feed.
            </p>

            {/* Cooking Style */}
            <div className="mb-8">
              <label className="block text-sm mb-3 font-semibold text-text-secondary">
                Cooking Style
              </label>

              <div className="flex flex-wrap gap-3">
                {cookingStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-2 rounded-lg border text-sm transition ${
                      selectedStyles.includes(style)
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 hover:bg-[#FFDBD0]"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Dish */}
            <div className="mb-6">
              <label className="block text-sm mb-2 font-semibold text-text-secondary">
                Your Signature Dish
              </label>

              <input
                value={signatureDish}
                onChange={(e) => setSignatureDish(e.target.value)}
                type="text"
                placeholder="e.g. Grandma's Slow-Cooked Lamb Maqluba"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
              />
            </div>

            {/* Audience */}
            <div className="mb-6">
              <label className="block text-sm mb-2 font-semibold text-text-secondary">
                Who is your food for?
              </label>

              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="">Select your target audience</option>
                <option>Families</option>
                <option>Students</option>
                <option>Professionals</option>
                <option>Fitness Enthusiasts</option>
              </select>
            </div>

            {/* Story */}
            <div>
              <label className="block text-sm mb-2 font-semibold text-text-secondary">
                The Story Behind Your Food
              </label>

              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={5}
                maxLength={500}
                placeholder="Share the heritage, the secret spices, or the memories that make your cooking special."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-orange-300"
              />

              <div className="text-right text-xs text-gray-400 mt-1">
                Min 60 characters
              </div>
            </div>

            {error && <div className="text-sm text-red-500 mt-3">{error}</div>}

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={handleContinue}
                disabled={loadingSubmit}
                className="bg-primary text-white px-6 py-3 rounded-full hover:opacity-90"
              >
                {loadingSubmit ? "Generating..." : "Continue to Kitchen Setup"}
              </button>

              <button type="button" className="text-gray-500">
                Save as Draft
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Hero Card */}
            <div className="relative rounded-2xl overflow-hidden h-72">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554"
                alt="food"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-5 text-white">
                <h3 className="text-xl font-semibold">
                  Your passion, our platform.
                </h3>

                <p className="text-sm mt-2">
                  Every great meal starts with a story. We help you tell yours
                  to the community.
                </p>
              </div>
            </div>

            {/* Tip Card */}
            <div className="bg-teal-600 text-white rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={18} />
                <span className="font-medium">Chef Tip</span>
              </div>

              <p className="text-sm leading-relaxed">
                Be descriptive! Mentioning specific ingredients like
                &quot;hand-pressed Palestinian olive oil&quot; or
                &quot;Slow-roasted za&apos;atar&quot; helps foodies find exactly
                what they&apos;re craving.
              </p>
            </div>

            {/* Testimonial */}
            <div className="border border-gray-300 rounded-2xl p-5 bg-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Star size={18} className="text-primary" />
                </div>

                <div>
                  <p className="text-sm text-gray-600 italic">
                    Joining Sufra allowed me to turn my Sunday tradition into a
                    thriving local business.
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    — Chef Amira, Mediterranean Specialist
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
