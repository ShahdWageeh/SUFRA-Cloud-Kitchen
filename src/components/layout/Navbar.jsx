import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              CloudKitchen
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/foods" className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                Browse Food
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                Cart
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md font-medium">
                Login
              </Link>
              <Link href="/dashboard/vendor" className="bg-orange-600 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-700">
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
