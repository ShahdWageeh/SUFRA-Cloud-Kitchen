"use client";

import { GuestGuard } from "@/guards";

export default function AuthLayout({ children }) {
  return <GuestGuard>{children}</GuestGuard>;
}
