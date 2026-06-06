import LogoConceptCard from "@/components/chef/branding/LogoConceptCard";


export default function BrandCard({ data }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-300">

      <div className="relative h-72">
        <img
          src="https://images.unsplash.com/photo-1547592180-85f173990554"
          alt="food"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-8 text-white">
          <h2 className="text-4xl font-bold">
            {data.brandName}
          </h2>

          <p className="text-xl mt-2 italic">
            {data.slogan}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 p-8">

        <div>
          <h3 className="text-xs tracking-widest text-gray-500 uppercase mb-3">
            Brand Bio
          </h3>

          <p className="text-gray-600 leading-relaxed">
            {data.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <LogoConceptCard />
      </div>
    </div>
  );
}