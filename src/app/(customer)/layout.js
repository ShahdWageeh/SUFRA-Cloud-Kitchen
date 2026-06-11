import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CustomerRouteGuard } from "@/guards";
import BannedGuard from "@/guards/BannedGuard";

export default function CustomerGroupLayout({ children }) {
  return (
    <CustomerRouteGuard>
      <BannedGuard>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="grow bg-gray-50">{children}</main>
          <Footer />
        </div>
      </BannedGuard>
    </CustomerRouteGuard>
  );
}
