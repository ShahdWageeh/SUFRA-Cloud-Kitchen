import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register - Matbakhna",
};

export default function CustomerRegisterPage() {
  return <RegisterForm accountType="customer" endpoint="/api/customers/register" />;
}
