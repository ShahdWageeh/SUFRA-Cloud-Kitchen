import Card from '@/components/ui/Card';

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="space-y-6">
        {[1, 2].map((order) => (
          <Card key={order} className="p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <div>
                <p className="font-bold">Order #CK-100{order}</p>
                <p className="text-sm text-gray-500">Placed on May 31, 2026</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Delivered</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
              </div>
              <p className="font-bold">$27.98</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
