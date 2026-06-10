import OrderCard from "./OrderCard";

export default function OrdersList({ orders, onStatusChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map((order, index) => (
        <OrderCard
          key={order._id || order.id}
          order={order}
          orderNumber={index + 1}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}