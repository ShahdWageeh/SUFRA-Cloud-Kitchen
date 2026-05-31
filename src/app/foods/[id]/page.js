import Button from '@/components/ui/Button';

export default function FoodDetailsPage({ params }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="h-[400px] bg-gray-200 rounded-xl"></div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Delicious Food Item {params.id}</h1>
          <p className="text-2xl text-orange-600 font-bold">$19.99</p>
          <div className="prose text-gray-600">
            <p>This is a placeholder description for the food item. It would include ingredients, nutritional info, and vendor details.</p>
          </div>
          <div className="flex gap-4">
            <input type="number" defaultValue="1" className="w-20 border rounded-md px-3" />
            <Button className="flex-1">Add to Cart</Button>
          </div>
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Vendor Information</h3>
            <p className="text-gray-600">Chef Joe's Cloud Kitchen</p>
            <p className="text-sm text-gray-500">4.8 ★ (120 reviews)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
