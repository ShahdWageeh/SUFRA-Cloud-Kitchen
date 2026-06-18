import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Chef Registration - Sufra",
};

export default function ChefRegisterPage() {
  return <RegisterForm accountType="chef" />;
}
