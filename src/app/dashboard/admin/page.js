import Card from '@/components/ui/Card';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="p-4 text-center">
          <h4 className="text-gray-500">Total Users</h4>
          <p className="text-2xl font-bold">1,200</p>
        </Card>
        <Card className="p-4 text-center">
          <h4 className="text-gray-500">Total Vendors</h4>
          <p className="text-2xl font-bold">85</p>
        </Card>
        <Card className="p-4 text-center">
          <h4 className="text-gray-500">Global Revenue</h4>
          <p className="text-2xl font-bold">$45,000</p>
        </Card>
        <Card className="p-4 text-center">
          <h4 className="text-gray-500">Disputes</h4>
          <p className="text-2xl font-bold">3</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Pending Vendor Approvals</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>New Cloud Kitchen {i}</span>
                <div className="flex gap-2">
                  <button className="text-green-600 hover:font-bold">Approve</button>
                  <button className="text-red-600 hover:font-bold">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold mb-4">System Health</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>API Server</span>
              <span className="text-green-600 font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between">
              <span>Database</span>
              <span className="text-green-600 font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between">
              <span>Storage</span>
              <span className="text-green-600 font-bold">ONLINE</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
