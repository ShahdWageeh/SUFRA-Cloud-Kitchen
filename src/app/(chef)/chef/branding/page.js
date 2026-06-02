import {
  MessageCircle,
  Star,
} from "lucide-react";

export default function BrandingPage() {
  const cookingStyles = [
    "Levantine",
    "Mediterranean",
    "South Asian",
    "Traditional Home",
    "Fusion",
    "+ Other",
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F7] py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#B64B1D]">
            Matbakhna
          </h1>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">
              Chef Onboarding
            </span>

            <span className="text-xs bg-orange-100 text-[#B64B1D] px-2 py-1 rounded-full">
              Step 1 of 3
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
            <div className="h-full w-1/3 bg-[#B64B1D] rounded-full"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border p-8 shadow-sm">

            <h2 className="text-2xl font-semibold mb-2">
              Describe your kitchen
            </h2>

            <p className="text-gray-500 mb-8">
              Tell us about the flavors that define your craft and the people
              you love to feed.
            </p>

            {/* Cooking Style */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">
                Cooking Style
              </label>

              <div className="flex flex-wrap gap-3">
                {cookingStyles.map((style) => (
                  <button
                    key={style}
                    className={`px-4 py-2 rounded-lg border text-sm transition`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Dish */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Your Signature Dish
              </label>

              <input
                type="text"
                placeholder="e.g. Grandma's Slow-Cooked Lamb Maqluba"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Audience */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Who is your food for?
              </label>

              <select className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-300">
                <option>Select your target audience</option>
                <option>Families</option>
                <option>Students</option>
                <option>Professionals</option>
                <option>Fitness Enthusiasts</option>
              </select>
            </div>

            {/* Story */}
            <div>
              <label className="block text-sm font-medium mb-2">
                The Story Behind Your Food
              </label>

              <textarea
                rows={5}
                maxLength={500}
                placeholder="Share the heritage, the secret spices, or the memories that make your cooking special."
                className="w-full border rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-orange-300"
              />

              <div className="text-right text-xs text-gray-400 mt-1">
                Min 60 characters
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="bg-[#B64B1D] text-white px-6 py-3 rounded-full hover:opacity-90">
                Continue to Kitchen Setup
              </button>

              <button className="text-gray-500">
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
                <span className="font-medium">
                  Chef Tip
                </span>
              </div>

              <p className="text-sm leading-relaxed">
                Be descriptive! Mentioning specific ingredients like
                "hand-pressed Palestinian olive oil" or
                "Slow-roasted za'atar" helps foodies find exactly what
                they’re craving.
              </p>
            </div>

            {/* Testimonial */}
            <div className="border rounded-2xl p-5 bg-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Star size={18} className="text-[#B64B1D]" />
                </div>

                <div>
                  <p className="text-sm text-gray-600 italic">
                    Joining Matbakhna allowed me to turn my Sunday
                    tradition into a thriving local business.
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