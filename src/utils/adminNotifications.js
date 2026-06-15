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

const ADMIN_ROUTES = [
  "/admin/analytics",
  "/admin/categories",
  "/admin/chefs",
  "/admin/contacts",
  "/admin/dashboard",
  "/admin/deliveries",
  "/admin/delivery-users",
  "/admin/notifications",
  "/admin/orders",
  "/admin/users",
  "/admin/verifications",
];

function withNotificationQuery(path, notification, entityId) {
  const params = new URLSearchParams();

  if (notification?._id) params.set("notification", notification._id);
  if (entityId) params.set("entity", entityId);

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function getKnownAdminPath(actionPath) {
  if (!actionPath || actionPath === "#") return null;

  const path = actionPath.startsWith("http")
    ? new URL(actionPath).pathname
    : actionPath.split("?")[0];

  return ADMIN_ROUTES.find((route) => path === route || path.startsWith(`${route}/`)) || null;
}

export function getNotificationDestination(notification) {
  const type = notification?.type || "";
  const entityType = (notification?.entityType || "").toLowerCase();
  const entityId =
    notification?.entityId ||
    notification?.metadata?.entityId ||
    notification?.metadata?.contactId ||
    notification?.metadata?.requestId ||
    notification?.metadata?.orderId ||
    notification?.metadata?.chefId;

  if (type.includes("verification") || entityType.includes("verification")) {
    return withNotificationQuery("/admin/verifications", notification, entityId);
  }

  if (type.includes("contact") || type.includes("complaint") || entityType.includes("contact")) {
    return withNotificationQuery("/admin/contacts", notification, entityId);
  }

  if (type.includes("withdrawal") || entityType.includes("withdrawal")) {
    return withNotificationQuery("/admin/chefs", notification, entityId);
  }

  if (type.includes("order") || entityType.includes("order")) {
    return withNotificationQuery("/admin/orders", notification, entityId);
  }

  return getKnownAdminPath(notification?.actionPath) || "/admin/notifications";
}
