"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  faChevronRight,
  faEnvelope,
  faLock,
  faQuoteLeft,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loginSchema } from "@/schemas/authSchemas";
import AuthInput from "@/components/auth/AuthInput";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export default function AdminLoginForm() {
  const { login, loading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const result = await login({
      email: values.email,
      password: values.password,
      role: "admin",
      redirect: "/admin/dashboard",
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(`Welcome back to control center, ${result.user?.firstName || "Admin"}`);
  };

  return (
    <section className="min-h-dvh relative bg-background">
      <Link
        href="/"
        className="mt-6 z-10 cursor-pointer hover:text-primary-container absolute top-0 right-2.5 rounded-full text-primary px-6 py-3 text-xs font-bold"
      >
        Back to Home <FontAwesomeIcon icon={faChevronRight} /> 
      </Link>
      <div className="mx-auto grid min-h-dvh max-w-7xl grid-cols-1 lg:grid-cols-[0.92fr_1fr]">
        <aside className="relative hidden min-h-dvh overflow-hidden lg:block">
          <Image
            src="/loginImg.jpg"
            alt="Admin Control"
            fill
            priority
            sizes="46vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/5 to-black/55" />
          <div className="absolute left-14 top-16 max-w-xs text-white">
            <Link href="/" className="text-2xl font-bold">
              Sufra Admin
            </Link>
            <p className="mt-3 text-sm leading-5 text-white/90">
              Administrative Control Center. Manage your community of chefs and customers.
            </p>
          </div>
          <div className="absolute bottom-12 left-14 right-14 max-w-md rounded-lg bg-white/88 p-5 shadow-2xl backdrop-blur">
            <FontAwesomeIcon icon={faQuoteLeft} className="mb-2 text-primary" />
            <p className="text-sm italic leading-5 text-text-primary">
              With great power comes great responsibility. Ensure the community thrives through fair moderation.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                <FontAwesomeIcon icon={faShieldHalved} />
              </span>
              Sufra System Administrator
            </div>
          </div>
        </aside>

        <div className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-107.5"
          >
            <div className="mb-9 lg:hidden text-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                Sufra Admin
              </Link>
            </div>

            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faShieldHalved} className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Admin Access</h1>
                <p className="text-sm text-text-secondary">Authorized personnel only.</p>
              </div>
            </div>

            <div className="space-y-5">
              <AuthInput
                label="Administrator Email"
                type="email"
                placeholder="admin@sufra.com"
                icon={faEnvelope}
                error={errors.email?.message}
                {...register("email")}
              />
              <AuthInput
                label="Secure Password"
                type="password"
                placeholder="••••••••"
                icon={faLock}
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="mt-8 h-12 w-full rounded-full bg-primary px-6 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-65"
            >
              {loading ? "Authenticating..." : "Login to Control Center"}
            </button>

            <div className="mt-10 border-t border-primary/18 pt-6 text-center text-[10px] text-text-secondary uppercase tracking-widest">
              Secure Environment • Sufra Platform
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
