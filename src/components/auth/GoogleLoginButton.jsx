"use client";

import { GoogleLogin } from "@react-oauth/google";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export default function GoogleLoginButton({ role }) {
  const { googleLogin } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    const result = await googleLogin({
      token: credentialResponse.credential,
      role,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(`Welcome ${result.user.firstName}`);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error("Google Login Failed")}
    />
  );
}
