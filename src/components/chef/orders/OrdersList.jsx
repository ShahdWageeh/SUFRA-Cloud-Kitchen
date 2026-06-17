import OrderCard from "./OrderCard";

export default function OrdersList({ orders, onStatusChange, highlightedOrderId }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {orders.map((order, index) => {
        const id = order._id || order.id;
        return (
          <OrderCard
            key={id}
            order={order}
            orderNumber={index + 1}
            onStatusChange={onStatusChange}
            isHighlighted={id === highlightedOrderId}
          />
        );
      })}
    </div>
  );
}