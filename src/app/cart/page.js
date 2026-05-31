import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Cart Items Placeholder */}
          {[1, 2].map((item) => (
            <Card key={item} className="p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <h3 className="font-bold">Food Item {item}</h3>
                <p className="text-sm text-gray-500">Vendor Name</p>
              </div>
              <div className="flex items-center gap-4">
                <input type="number" defaultValue="1" className="w-16 border rounded px-2" />
                <span className="font-bold">$12.99</span>
                <button className="text-red-500 hover:text-red-700">Remove</button>
              </div>
            </Card>
          ))}
        </div>
        <div>
          <Card className="p-6 space-y-4">
            <h3 className="text-xl font-bold border-b pb-4">Order Summary</h3>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$25.98</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>$2.00</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>$27.98</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full mt-4">Proceed to Checkout</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
