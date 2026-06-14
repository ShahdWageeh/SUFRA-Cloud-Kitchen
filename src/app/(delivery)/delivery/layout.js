import RoleGuard from "@/guards/RoleGuard";
import DeliverySidebar from "@/components/delivery/DeliverySidebar";
import DeliveryTopbar from "@/components/delivery/DeliveryTopbar";

export default function DeliveryLayout({ children }) {
  return (
    <RoleGuard allowedRoles={["delivery"]}>
      <div className="flex min-h-screen">
        <DeliverySidebar />

        <div className="flex-1">
          <DeliveryTopbar />

          <main className="p-6">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
