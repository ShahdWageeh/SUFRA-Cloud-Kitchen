import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="p-6 text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-gray-500 mb-6">john@example.com</p>
            <Button variant="outline" className="w-full">Change Photo</Button>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Personal Details</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="John" />
                <Input label="Last Name" defaultValue="Doe" />
              </div>
              <Input label="Email" defaultValue="john@example.com" disabled />
              <Input label="Phone Number" defaultValue="+1 234 567 890" />
              <Button>Save Changes</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
