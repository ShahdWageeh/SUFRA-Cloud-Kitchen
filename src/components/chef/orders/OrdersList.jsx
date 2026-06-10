import OrderCard from "./OrderCard";

export default function OrdersList({ orders }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {orders.map((order, index) => (
        <OrderCard
          key={order._id}
          order={order}
          orderNumber={index + 1}
        />
      ))}
    </div>
  );
}