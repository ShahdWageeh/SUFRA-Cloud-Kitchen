const STORAGE_PREFIX = "Sufra_chef_notifications";
const SNAPSHOT_PREFIX = "Sufra_chef_order_snapshots";
const EVENT_NAME = "sufra:chef-notifications-updated";

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

const chefNotificationFallbackService = {
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

  syncOrderNotifications(ownerId, orders = []) {
    const snapshotKey = getSnapshotKey(ownerId);
    const previousOrderIds = readJson(snapshotKey, []);
    const currentOrderIds = orders.map(getOrderId).filter(Boolean);
    
    // Find completely new orders that we haven't seen before
    const newOrderIds = currentOrderIds.filter(id => !previousOrderIds.includes(id));
    
    if (newOrderIds.length === 0) {
      writeJson(snapshotKey, currentOrderIds);
      return [];
    }

    const newNotifications = newOrderIds.map(orderId => {
      const order = orders.find(o => getOrderId(o) === orderId);
      const orderNumber = String(orderId).slice(-8).toUpperCase();
      const totalAmount = order?.totalAmount || 0;

      return {
        _id: `local-chef-order-${orderId}-${Date.now()}`,
        local: true,
        type: "chef.order.placed",
        entityType: "order",
        entityId: orderId,
        metadata: { orderId },
        title: "New Order Received!",
        body: `Order #${orderNumber} has been placed. Total: EGP ${totalAmount}`,
        actionPath: `/chef/orders/${orderId}`, // Linking to specific order page
        createdAt: new Date().toISOString(),
        readAt: null,
        priority: "urgent",
      };
    });

    const notificationsKey = getNotificationsKey(ownerId);
    const currentNotifications = readJson(notificationsKey, []);
    
    writeJson(notificationsKey, [...newNotifications, ...currentNotifications].slice(0, 50));
    writeJson(snapshotKey, currentOrderIds);

    return newNotifications;
  },
};

export default chefNotificationFallbackService;
