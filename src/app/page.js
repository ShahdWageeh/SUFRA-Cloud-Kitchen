import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000')" }}
        ></div>
        <div className="relative z-20 max-w-3xl px-4">
          <h1 className="text-5xl font-extrabold mb-6">Delicious Food From Cloud Kitchens To Your Door</h1>
          <p className="text-xl mb-8">Support local vendors and enjoy premium meals prepared with love.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/foods">
              <Button className="px-8 py-3 text-lg">Order Now</Button>
            </Link>
            <Link href="/dashboard/vendor">
              <Button variant="secondary" className="px-8 py-3 text-lg">Sell on CloudKitchen</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Sections Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Burgers', 'Pizza', 'Sushi', 'Salads'].map((cat) => (
            <div key={cat} className="bg-white p-8 rounded-lg shadow-sm text-center border hover:border-orange-500 cursor-pointer transition-colors">
              <span className="text-lg font-semibold">{cat}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
