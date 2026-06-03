export default function BrandPaletteCard({ colors }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-300 p-6">

      <h3 className="text-xl font-semibold mb-6">
        Brand Palette
      </h3>

      <div className="grid grid-cols-2 gap-4">

        {colors.map((color) => (
          <div key={color.name}>
            <div
              className="h-16 rounded-xl"
              style={{
                backgroundColor: color.value,
              }}
            />

            <p className="text-sm mt-2 font-medium text-center">
              {color.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}