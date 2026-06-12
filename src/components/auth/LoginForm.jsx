"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
  faChevronRight,
  faEnvelope,
  faLock,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import { loginSchema } from "@/schemas/authSchemas";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthInput from "@/components/auth/AuthInput";
import SocialButton from "@/components/auth/SocialButton";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const { login, loading } = useAuth();
  const roleParam = searchParams.get("role");
  const redirectParam = searchParams.get("redirect");
  const isChefOnlyLogin = roleParam === "chef";
  const [selectedRole, setSelectedRole] = useState(
    isChefOnlyLogin ? "chef" : "customer",
  );
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
      role: selectedRole,
      redirect: redirectParam || undefined,
    });

    if (!result.success) {
      toast.error(result.message);

      return;
    }

    toast.success(`Welcome back, ${result.user?.firstName || "again"}`);
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
            alt="Fresh kitchen ingredients"
            fill
            priority
            sizes="46vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/5 to-black/55" />
          <div className="absolute left-14 top-16 max-w-xs text-white">
            <Link href="/" className="text-2xl font-bold">
              Sufra
            </Link>
            <p className="mt-3 text-sm leading-5 text-white/90">
              Welcome back to the heart of the home. Your community kitchen is
              waiting.
            </p>
          </div>
          <div className="absolute bottom-12 left-14 right-14 max-w-md rounded-lg bg-white/88 p-5 shadow-2xl backdrop-blur">
            <FontAwesomeIcon icon={faQuoteLeft} className="mb-2 text-primary" />
            <p className="text-sm italic leading-5 text-text-primary">
              The best meals aren&apos;t made in restaurants. They&apos;re made
              in the homes of people who love what they do.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                M
              </span>
              Chef Maria, Sufra Partner
            </div>
          </div>
        </aside>

        <div className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-107.5"
          >
            <div className="mb-9 lg:hidden">
              <Link href="/" className="text-2xl font-bold text-primary">
                Sufra
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-text-primary">Sign in</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Continue your culinary journey with your local home chefs.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => {
                  if (!isChefOnlyLogin) {
                    setSelectedRole("customer");
                  }
                }}
                disabled={isChefOnlyLogin}
                className={`rounded-md border py-2 text-sm transition ${
                  selectedRole === "customer"
                    ? "bg-primary text-white border-primary"
                    : "border-primary/30"
                } disabled:cursor-not-allowed disabled:opacity-45`}
              >
                Customer
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("chef")}
                className={`rounded-md border py-2 text-sm transition ${
                  selectedRole === "chef"
                    ? "bg-primary text-white border-primary"
                    : "border-primary/30"
                }`}
              >
                Chef
              </button>
            </div>
            {isChefOnlyLogin && (
              <p className="-mt-2 mb-5 text-xs font-medium text-primary">
                Chef sign in is required to continue becoming a chef.
              </p>
            )}
            <div className="mt-7 space-y-5">
              <AuthInput
                label="Email Address"
                type="email"
                placeholder="chef@matbakhna.com"
                icon={faEnvelope}
                error={errors.email?.message}
                {...register("email")}
              />
              <AuthInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={faLock}
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-xs">
              <label className="flex items-center gap-2 text-text-secondary">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-primary/25 accent-primary"
                />
                Remember Me
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-primary"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="mt-6 h-12 w-full rounded-full bg-primary px-6 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-65"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="my-8">
              <AuthDivider>or continue with</AuthDivider>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <GoogleLoginButton role={selectedRole} />
              <SocialButton icon={faApple}>Apple</SocialButton>
            </div>

            <div className="mt-10 border-t border-primary/18 pt-6 text-center text-xs text-text-secondary">
              New to our community?{" "}
              <Link
                href="/register/customer"
                className="font-bold text-primary"
              >
                Create Customer Account
              </Link>
              <span className="mx-2 text-outline/50">|</span>
              <Link href="/register/chef" className="font-bold text-primary">
                Become a Chef
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
