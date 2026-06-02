import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CustomerGroupLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="grow bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
}
