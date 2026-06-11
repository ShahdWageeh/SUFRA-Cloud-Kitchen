export function isBanMessage(message = "") {
  return /ban(ned|ned)?|blocked|suspended/i.test(String(message));
}

export function isCustomerBlocked(user) {
  if (!user || user.role !== "customer") return false;

  const blockedFlag =
    user.isBlocked === 1 ||
    user.isBlocked === true ||
    user.isBlocked === "1";

  const blockedStatus =
    typeof user.status === "string" &&
    user.status.toLowerCase() === "blocked";

  return blockedFlag || blockedStatus;
}

export function hasBlockStatusFields(user) {
  if (!user) return false;

  return user.isBlocked !== undefined || user.status !== undefined;
}
