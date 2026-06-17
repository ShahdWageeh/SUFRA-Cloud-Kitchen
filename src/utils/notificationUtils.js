export function extractNotificationList(payload) {
  const data = payload?.data ?? payload;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.notifications)) return data.notifications;
  if (Array.isArray(data?.items)) return data.items;

  return [];
}

export function extractUnreadCount(payload) {
  const data = payload?.data ?? payload;
  const count =
    data?.count ??
    data?.unreadCount ??
    data?.totalUnread ??
    data?.total ??
    0;

  return Number.isFinite(Number(count)) ? Number(count) : 0;
}

function withNotificationQuery(path, notification, entityId) {
  const params = new URLSearchParams();

  if (notification?._id) params.set("notification", notification._id);
  if (entityId) params.set("entity", entityId);

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function getKnownCustomerPath(actionPath) {
  if (!actionPath || actionPath === "#") return null;

  try {
    const url = actionPath.startsWith("http")
      ? new URL(actionPath)
      : new URL(actionPath, "http://localhost");
    const path = url.pathname;
    const destination = `${url.pathname}${url.search}`;

    if (path === "/customer/orders" || path.startsWith("/customer/orders/")) {
      return destination;
    }

    if (path === "/customer/notification") return destination;
  } catch (error) {
    return null;
  }

  return null;
}

export function getCustomerNotificationDestination(notification) {
  const entityType = (notification?.entityType || "").toLowerCase();
  const orderId =
    notification?.metadata?.orderId ||
    notification?.metadata?.entityId ||
    notification?.entityId;

  if (orderId && (entityType.includes("order") || notification?.type?.includes("order"))) {
    return withNotificationQuery(`/customer/orders/${orderId}`, notification, orderId);
  }

  return getKnownCustomerPath(notification?.actionPath) || "/customer/notification";
}

export function getChefNotificationDestination(notification) {
  const entityType = (notification?.entityType || "").toLowerCase();
  const orderId =
    notification?.metadata?.orderId ||
    notification?.metadata?.entityId ||
    notification?.entityId;

  if (
    orderId &&
    (entityType.includes("order") || (notification?.type || "").includes("order"))
  ) {
    return `/chef/orders?highlight=${orderId}`;
  }

  // Handle other types
  if ((notification?.type || "").includes("withdrawal")) return "/chef/revenue";
  if ((notification?.type || "").includes("verification")) return "/chef/profile";
  if ((notification?.type || "").includes("review")) return "/chef/profile";

  return notification?.actionPath || "/chef/notification";
}

export function getTimeAgo(date) {
  if (!date) return "Just now";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Just now";

  const seconds = Math.floor((Date.now() - parsed.getTime()) / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
