"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faPhone,
  faShieldHalved,
  faUser,
  faUserCheck,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { registerSchema } from "@/schemas/authSchemas";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthInput from "@/components/auth/AuthInput";
import SocialButton from "@/components/auth/SocialButton";

export default function RegisterForm({ accountType, endpoint }) {
  const [formMessage, setFormMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
      role: accountType,
    };

    try {
      setFormMessage("");
      // TODO: Replace with the real API call: POST ${endpoint}
      await new Promise((resolve) => setTimeout(resolve, 700));
      console.info("Register payload ready", endpoint, payload);
      // TODO: Show success toast and redirect after API integration.
      setFormMessage("Account details are ready to submit.");
    } catch (error) {
      console.error("Registration failed", error);
      // TODO: Show error toast from API response.
      setFormMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative min-h-dvh overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-[url('/registerBackground.jpg')] bg-cover bg-center"
        aria-hidden="true"
      />
      <div className="absolute top-4 left-4 right-4 bottom-4 bg-white/50 backdrop-blur-[1px]" aria-hidden="true" />
      <div className="relative flex min-h-dvh flex-col px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-7">
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Matbakhna
            </Link>
            <p className="mt-2 text-xs text-text-secondary">
              Join our community of authentic home chefs.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-[430px] rounded-lg bg-white/88 px-7 py-8 shadow-[0_14px_35px_rgba(27,28,28,0.13)] ring-1 ring-primary/10 sm:px-9"
          >
            <h1 className="mb-6 text-center text-xl font-bold text-text-primary">
              Create your account
            </h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AuthInput
                label="First Name"
                placeholder="John"
                icon={faUser}
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <AuthInput
                label="Last Name"
                placeholder="Doe"
                icon={faUser}
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

            <div className="mt-4 space-y-4">
              <AuthInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={faEnvelope}
                error={errors.email?.message}
                {...register("email")}
              />
              <AuthInput
                label="Phone Number"
                type="tel"
                placeholder="+20 100 000 0000"
                icon={faPhone}
                error={errors.phoneNumber?.message}
                {...register("phoneNumber")}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AuthInput
                label="Password"
                type="password"
                icon={faLock}
                error={errors.password?.message}
                {...register("password")}
              />
              <AuthInput
                label="Confirm Password"
                type="password"
                icon={faLock}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>

            <label className="mt-5 flex items-start gap-2 text-[11px] text-text-secondary">
              <input
                type="checkbox"
                className="mt-0.5 h-3.5 w-3.5 rounded border-primary/25 accent-primary"
              />
              <span>
                I agree to the{" "}
                <Link href="/" className="font-semibold text-primary">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/" className="font-semibold text-primary">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 h-14 w-full rounded-full bg-primary px-6 text-base font-bold text-white shadow-[0_10px_20px_rgba(150,67,38,0.24)] transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>

            {formMessage && (
              <p className="mt-3 text-center text-xs font-medium text-text-secondary">
                {formMessage}
              </p>
            )}

            <div className="my-6">
              <AuthDivider>Or continue with</AuthDivider>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SocialButton icon={faGoogle}>Google</SocialButton>
              <SocialButton icon={faFacebook}>Facebook</SocialButton>
            </div>

            <p className="mt-8 text-center text-xs text-text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary">
                Sign In
              </Link>
            </p>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] text-text-secondary">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faShieldHalved} className="text-teal-600" />
              Secure Payment
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUserCheck} className="text-teal-600" />
              Verified Chefs
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUtensils} className="text-teal-600" />
              Home Cooked
            </span>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] text-text-secondary/70">
          © 2026 Matbakhna - Celebrating home-cooked heritage.
        </p>
      </div>
    </section>
  );
}
