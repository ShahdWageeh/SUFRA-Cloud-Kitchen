import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Chef Registration - Matbakhna",
};

export default function ChefRegisterPage() {
  return <RegisterForm accountType="chef" endpoint="/api/chefs/register" />;
}
