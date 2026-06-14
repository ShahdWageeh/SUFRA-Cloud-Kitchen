"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronRight,
  faEnvelope,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import AuthInput from "@/components/auth/AuthInput";
import { forgotPasswordSchema } from "@/schemas/authSchemas";
import { authService } from "@/services";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [sentAccount, setSentAccount] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      role: "customer",
    },
  });

  const onSubmit = async (values) => {
    try {
      const result = await authService.forgotPassword({
        email: values.email,
        role: values.role,
      });

      setSentAccount(values);
      toast.success(result.message || "OTP sent successfully.");
      router.push(
        `/reset-password?email=${encodeURIComponent(values.email)}&role=${encodeURIComponent(values.role)}`,
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "We could not send an OTP. Please check your details and try again.",
      );
    }
  };

  return (
    <section className="relative min-h-dvh bg-background">
      <Link
        href="/"
        className="absolute right-2.5 top-0 z-10 mt-6 rounded-full px-6 py-3 text-xs font-bold text-primary hover:text-primary-container"
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
              Get back to your kitchen, cart, and favorite home-cooked meals.
            </p>
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

            <Link
              href="/login"
              className="mb-7 inline-flex items-center gap-2 text-xs font-bold text-primary"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
              Back to sign in
            </Link>

            <h1 className="text-3xl font-bold text-text-primary">
              Forgot password
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Enter your account email and role. We will send a 6-digit OTP to
              verify your password reset.
            </p>

            {sentAccount && (
              <div className="mt-7 rounded-md border border-primary/20 bg-secondary-container px-4 py-3 text-sm text-text-secondary">
                OTP sent for <strong>{sentAccount.email}</strong>. Check your
                inbox and enter the code on the reset screen.
              </div>
            )}

            <div className="mt-7 space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="role"
                  className="block text-[11px] font-medium text-text-secondary"
                >
                  Account Type
                </label>
                <select
                  id="role"
                  className={`h-11 w-full rounded-md border bg-white/80 px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                    errors.role ? "border-red-400" : "border-primary/25"
                  }`}
                  {...register("role")}
                >
                  <option value="customer">Customer</option>
                  <option value="chef">Chef</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-[11px] font-medium text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <AuthInput
                label="Email Address"
                type="email"
                placeholder="chef@sufra.com"
                icon={faEnvelope}
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-65"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="h-3.5 w-3.5" />
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
