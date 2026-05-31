import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function FoodsPage() {
  // Mock data for listing
  const foods = [
    { id: 1, name: 'Gourmet Burger', price: '$12.99', vendor: 'Burger King Cloud' },
    { id: 2, name: 'Margherita Pizza', price: '$15.50', vendor: 'Pizza Hut Express' },
    { id: 3, name: 'Dragon Roll', price: '$18.00', vendor: 'Sushi Master' },
    { id: 4, name: 'Caesar Salad', price: '$9.99', vendor: 'Healthy Greens' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Browse Our Food</h1>
        <div className="flex gap-4">
          <select className="border rounded-md px-3 py-2">
            <option>All Categories</option>
            <option>Burgers</option>
            <option>Pizza</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {foods.map((food) => (
          <Card key={food.id} className="group">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{food.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{food.vendor}</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-600 font-bold">{food.price}</span>
                <Link href={`/foods/${food.id}`}>
                  <Button variant="outline" className="text-sm py-1">Details</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
