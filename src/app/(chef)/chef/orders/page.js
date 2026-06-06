import OrdersTabs from "@/components/chef/orders/OrdersTabs";
import OrdersList from "@/components/chef/orders/OrdersList";
import StatsSection from "@/components/chef/orders/StatsSection";

export default function OrdersPage() {
  // TODO: Replace with backend data

  const orders = [
    {
      id: "#ORD-8821",
      priority: "new",
      amount: 145,
      timeAgo: "12 mins ago",
      customer: "Sarah Jamila",
      items: "2x Grilled Chicken Mandi, 1x Fattoush",
      note: "Please extra spicy sauce on the side.",
      type: "delivery",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuZHklMjBmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "#ORD-8825",
      priority: "high",
      amount: 210,
      timeAgo: "5 mins ago",
      customer: "Ahmed Al-Sayed",
      items: "1x Lamb Kabsa Family, 4x Soft Drinks",
      note: "",
      type: "pickup",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuZHklMjBmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "#ORD-8826",
      priority: "new",
      amount: 65,
      timeAgo: "2 mins ago",
      customer: "Layla K.",
      items: "3x Falafel Wrap Platter",
      note: "",
      type: "delivery",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuZHklMjBmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <div className="p-8">
      <OrdersTabs />

      <div className="mt-6">
        <OrdersList orders={orders} />
      </div>

      <div className="mt-16">
        <StatsSection />
      </div>
    </div>
  );
}