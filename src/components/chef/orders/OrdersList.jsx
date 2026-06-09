import OrderCard from "./OrderCard";

export default function OrdersList({ orders }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order._id || order.id || order.orderId}
          order={order}
        />
      ))}
    </div>
  );
}