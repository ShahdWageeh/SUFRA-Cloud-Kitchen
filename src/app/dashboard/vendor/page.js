import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function VendorDashboard() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <Button>Add New Food Item</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="p-6 bg-orange-50">
          <h3 className="text-gray-500 font-medium">Total Orders</h3>
          <p className="text-3xl font-bold">124</p>
        </Card>
        <Card className="p-6 bg-green-50">
          <h3 className="text-gray-500 font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold">$2,450</p>
        </Card>
        <Card className="p-6 bg-blue-50">
          <h3 className="text-gray-500 font-medium">Active Menu Items</h3>
          <p className="text-3xl font-bold">12</p>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b">Order ID</th>
              <th className="p-4 border-b">Customer</th>
              <th className="p-4 border-b">Items</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4 border-b">#CK-100{i}</td>
                <td className="p-4 border-b">Customer {i}</td>
                <td className="p-4 border-b">2 items</td>
                <td className="p-4 border-b">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Preparing</span>
                </td>
                <td className="p-4 border-b">
                  <Button variant="outline" className="text-xs py-1">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
