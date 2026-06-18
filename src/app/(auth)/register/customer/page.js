import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register - Sufra",
};

export default function CustomerRegisterPage() {
  return <RegisterForm accountType="customer" />;
}
