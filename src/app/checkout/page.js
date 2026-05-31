import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <Input label="Street Address" placeholder="123 Street" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="City" />
                <Input label="Postal Code" placeholder="00000" />
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" defaultChecked />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center gap-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </section>
        </div>
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Confirm Order</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>2</span>
              </div>
              <div className="flex justify-between font-bold text-xl">
                <span>Payable Amount</span>
                <span>$27.98</span>
              </div>
            </div>
            <Button className="w-full">Place Order</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
