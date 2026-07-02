import AuthLayout from "@/modules/auth/layouts/AuthLayout";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  const illustration = (
    <img
      src="/register-image.png"
      alt="Estudiante con libros"
      style={{ width: "100%" }}
    />
  );

  return (
    <AuthLayout illustration={illustration}>
      <RegisterForm />
    </AuthLayout>
  );
}