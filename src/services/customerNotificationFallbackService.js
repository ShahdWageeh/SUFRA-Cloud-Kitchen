const STORAGE_PREFIX = "Sufra_customer_notifications";
const SNAPSHOT_PREFIX = "Sufra_customer_order_statuses";
const EVENT_NAME = "sufra:customer-notifications-updated";

const STATUS_LABELS = {
  awaiting_payment: "Awaiting payment",
  preparing: "Preparing",
  ready: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  completed: "Completed",
};

function getStorage() {
  return typeof window !== "undefined" ? window.localStorage : null;
}

function getOwnerKey(ownerId) {
  return ownerId || "guest";
}

function getNotificationsKey(ownerId) {
  return `${STORAGE_PREFIX}:${getOwnerKey(ownerId)}`;
}

function getSnapshotKey(ownerId) {
  return `${SNAPSHOT_PREFIX}:${getOwnerKey(ownerId)}`;
}

function readJson(key, fallback) {
  const storage = getStorage();
  if (!storage) return fallback;

  try {
    return JSON.parse(storage.getItem(key) || "null") ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

function getOrderId(order) {
  return order?._id || order?.id;
}

function getItemId(item, index) {
  return item?.mealId?._id || item?.mealId || item?._id || item?.id || index;
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status || "Updated";
}

function getOrderSnapshot(order) {
  const orderId = getOrderId(order);
  const itemStatuses = (order?.items || []).map((item, index) => ({
    id: getItemId(item, index),
    name: item?.name || "Meal",
    status: item?.status || order?.status || "preparing",
  }));

  return {
    orderId,
    orderStatus: order?.status || "preparing",
    itemStatuses,
    signature: JSON.stringify({
      orderStatus: order?.status || "preparing",
      itemStatuses,
    }),
  };
}

function createNotificationFromChange(order, currentSnapshot, previousSnapshot) {
  const orderId = currentSnapshot.orderId;
  const previousItems = new Map(
    (previousSnapshot?.itemStatuses || []).map((item) => [item.id, item]),
  );
  const changedItem = currentSnapshot.itemStatuses.find((item) => {
    const previousItem = previousItems.get(item.id);
    return previousItem && previousItem.status !== item.status;
  });

  const newStatus = changedItem?.status || currentSnapshot.orderStatus;
  const oldStatus = changedItem
    ? previousItems.get(changedItem.id)?.status
    : previousSnapshot?.orderStatus;
  const orderNumber = String(orderId || "").slice(-8).toUpperCase();
  const mealText = changedItem ? `${changedItem.name} is now` : "Your order is now";

  return {
    _id: `local-order-status-${orderId}-${Date.now()}`,
    local: true,
    type: "order.status.updated",
    entityType: "order",
    entityId: orderId,
    metadata: {
      orderId,
      oldStatus,
      newStatus,
    },
    title: "Order status updated",
    body: `${mealText} ${getStatusLabel(newStatus)}.`,
    actionPath: `/customer/orders/${orderId}`,
    createdAt: new Date().toISOString(),
    readAt: null,
    priority: "normal",
    orderNumber,
  };
}

function addNotifications(ownerId, newNotifications) {
  if (newNotifications.length === 0) return;

  const key = getNotificationsKey(ownerId);
  const current = readJson(key, []);
  writeJson(key, [...newNotifications, ...current].slice(0, 50));
}

const customerNotificationFallbackService = {
  eventName: EVENT_NAME,

  getNotifications(ownerId) {
    return readJson(getNotificationsKey(ownerId), []);
  },

  getUnreadCount(ownerId) {
    return this.getNotifications(ownerId).filter((notification) => !notification.readAt)
      .length;
  },

  markAsRead(ownerId, notificationId) {
    const key = getNotificationsKey(ownerId);
    const notifications = readJson(key, []);

    writeJson(
      key,
      notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, readAt: new Date().toISOString() }
          : notification,
      ),
    );
  },

  markAllAsRead(ownerId) {
    const key = getNotificationsKey(ownerId);
    const notifications = readJson(key, []);

    writeJson(
      key,
      notifications.map((notification) => ({
        ...notification,
        readAt: notification.readAt || new Date().toISOString(),
      })),
    );
  },

  deleteNotification(ownerId, notificationId) {
    const key = getNotificationsKey(ownerId);
    const notifications = readJson(key, []);

    writeJson(
      key,
      notifications.filter((notification) => notification._id !== notificationId),
    );
  },

  syncOrderStatusNotifications(ownerId, orders = []) {
    const snapshotKey = getSnapshotKey(ownerId);
    const previousSnapshots = readJson(snapshotKey, {});
    const nextSnapshots = {};
    const createdNotifications = [];

    orders.forEach((order) => {
      const snapshot = getOrderSnapshot(order);
      if (!snapshot.orderId) return;

      const previousSnapshot = previousSnapshots[snapshot.orderId];
      nextSnapshots[snapshot.orderId] = snapshot;

      if (!previousSnapshot || previousSnapshot.signature === snapshot.signature) {
        return;
      }

      createdNotifications.push(
        createNotificationFromChange(order, snapshot, previousSnapshot),
      );
    });

    writeJson(snapshotKey, nextSnapshots);
    addNotifications(ownerId, createdNotifications);

    return createdNotifications;
  },
};

export default customerNotificationFallbackService;
