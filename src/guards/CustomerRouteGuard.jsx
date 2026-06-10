"use client";

import ProtectedRoute from "@/guards/ProtectedRoute";
import RoleGuard from "@/guards/RoleGuard";

export default function CustomerRouteGuard({ children }) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["customer"]}>{children}</RoleGuard>
    </ProtectedRoute>
  );
}
