const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CloudKitchen</h3>
            <p className="text-gray-400">The best cloud kitchen marketplace for foodies and vendors.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/foods">Browse Food</a></li>
              <li><a href="/dashboard/vendor">Vendor Dashboard</a></li>
              <li><a href="/dashboard/admin">Admin Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <div className="flex">
              <input type="email" placeholder="Email" className="bg-gray-800 text-white px-3 py-2 rounded-l-md focus:outline-none" />
              <button className="bg-orange-600 px-4 py-2 rounded-r-md">Join</button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2026 CloudKitchen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
