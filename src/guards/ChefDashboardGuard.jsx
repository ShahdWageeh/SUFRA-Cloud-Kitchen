"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { verificationService } from "@/services";
import { buildLoginUrl } from "@/utils/authRedirects";

function getVerificationStatus(response) {
  return response?.data?.data?.status || response?.data?.status || response?.status;
}

export default function ChefDashboardGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, user, isAuthenticated } = useAuth();
  const [checkingVerification, setCheckingVerification] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      router.replace(buildLoginUrl(pathname));
      return;
    }

    if (user.role !== "chef") {
      router.replace("/");
      return;
    }

    let isMounted = true;

    async function verifyChefAccess() {
      setCheckingVerification(true);

      try {
        if (user.isVerified === true) {
          if (isMounted) {
            setIsApproved(true);
            setCheckingVerification(false);
          }
          return;
        }

        const verification = await verificationService.getVerificationStatus();
        const status = getVerificationStatus(verification);

        if (!isMounted) return;

        if (status === "approved") {
          setIsApproved(true);
          return;
        }

        if (status === "pending") {
          router.replace("/chef/waitingVerify");
          return;
        }

        router.replace("/chef/onboarding");
      } catch {
        if (isMounted) {
          router.replace("/chef/onboarding");
        }
      } finally {
        if (isMounted) {
          setCheckingVerification(false);
        }
      }
    }

    verifyChefAccess();

    return () => {
      isMounted = false;
    };
  }, [loading, isAuthenticated, user, router, pathname]);

  if (loading || checkingVerification) return null;

  if (!isApproved) return null;

  return children;
}
