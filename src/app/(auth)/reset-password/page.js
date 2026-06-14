import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const email = params?.email || "";
  const role = params?.role || "customer";

  return <ResetPasswordForm email={email} role={role} />;
}
