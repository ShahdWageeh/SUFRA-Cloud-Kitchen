"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { authService, verificationService, tokenService } from "@/services";
import { getSafeRedirectPath } from "@/utils/authRedirects";
import { isBanMessage, isCustomerBlocked } from "@/utils/userStatus";

export const AuthContext = createContext(null);

function getResponseData(response) {
  return response?.data?.data || response?.data || response;
}

function getVerificationStatus(response) {
  return getResponseData(response)?.status;
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(tokenService.get());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;
  const isChef = user?.role === "chef";
  const isCustomer = user?.role === "customer";
  const isAdmin = user?.role === "admin";

  const redirectChefByVerification = useCallback(async () => {
    try {
      const verification = await verificationService.getVerificationStatus();
      const status = getVerificationStatus(verification);

      switch (status) {
        case "approved":
          router.replace("/chef/dashboard");
          break;
        case "pending":
          router.replace("/chef/waitingVerify");
          break;
        case "failed":
        default:
          router.replace("/chef/onboarding");
          break;
      }
    } catch (error) {
      router.replace("/chef/onboarding");
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.me();
      const restoredUser = getResponseData(currentUser);
      setUser(restoredUser);
      return restoredUser;
    } catch (error) {
      const message = error?.response?.data?.message || "";

      if (isBanMessage(message)) {
        const blockedProfile = {
          role: "customer",
          isBlocked: 1,
          status: "blocked",
        };
        setUser(blockedProfile);
        return blockedProfile;
      }

      tokenService.remove();
      setToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedToken = tokenService.get();
        if (!storedToken) {
          setLoading(false);
          return;
        }
        setToken(storedToken);
        await refreshUser();
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [refreshUser]);

  const register = useCallback(
    async (data) => {
      setLoading(true);

      try {
        const response = await authService.register(data);
        const authData = getResponseData(response);
        const registeredUser = authData.user;
        const accessToken = authData.token;

        if (accessToken) {
          tokenService.save(accessToken);
        }

        setToken(accessToken || null);
        setUser(registeredUser);

        if (registeredUser.role === "customer") {
          const profile = (await refreshUser()) || registeredUser;

          if (isCustomerBlocked(profile)) {
            router.replace("/banned");
            return {
              success: true,
              user: profile,
            };
          }

          router.push("/customer/dashboard");
          return {
            success: true,
            user: profile,
          };
        }

        if (registeredUser.role === "chef") {
          router.push("/chef/onboarding");
        } else if (registeredUser.role === "admin") {
          router.push("/admin/dashboard");
        }

        return {
          success: true,
          user: registeredUser,
        };
      } catch (error) {
        return {
          success: false,
          message: error?.response?.data?.message || "Registration failed.",
        };
      } finally {
        setLoading(false);
      }
    },
    [router, refreshUser],
  );

  const login = useCallback(
    async (credentials) => {
      setLoading(true);

      try {
        const { redirect, ...loginCredentials } = credentials;
        const response = await authService.login(loginCredentials);
        const safeRedirect = getSafeRedirectPath(redirect);

        if (response?.success === false) {
          const message = response.message || "Login failed.";

          if (isBanMessage(message)) {
            router.replace("/banned");
            return { success: false, banned: true, message };
          }

          return { success: false, message };
        }

        const authData = getResponseData(response);
        const loggedUser = authData.user;
        const accessToken = authData.token;

        if (accessToken) {
          tokenService.save(accessToken);
        }

        setToken(accessToken || null);
        setUser(loggedUser);

        if (loggedUser?.role === "customer") {
          const profile = (await refreshUser()) || loggedUser;

          if (isCustomerBlocked(profile)) {
            router.replace("/banned");
            return {
              success: true,
              banned: true,
              user: profile,
            };
          }

          router.push(safeRedirect || "/customer/dashboard");
          return {
            success: true,
            user: profile,
          };
        }

        if (loggedUser?.role === "chef") {
          await redirectChefByVerification();
        } else if (loggedUser?.role === "admin") {
          router.push(safeRedirect || "/admin/dashboard");
        }

        return {
          success: true,
          user: loggedUser,
        };
      } catch (error) {
        const message =
          error?.response?.data?.message || "Invalid email or password.";

        if (isBanMessage(message)) {
          router.replace("/banned");
          return { success: false, banned: true, message };
        }

        return {
          success: false,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    [redirectChefByVerification, router, refreshUser],
  );

  const logout = useCallback(() => {
    tokenService.remove();
    setUser(null);
    setToken(null);

    router.replace("/login");
  }, [router]);

  const clearSession = useCallback(() => {
    tokenService.remove();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      isChef,
      isCustomer,
      isAdmin,
      register,
      login,
      logout,
      clearSession,
      refreshUser,
      redirectChefByVerification,
    }),
    [
      user,
      token,
      loading,
      isAuthenticated,
      isChef,
      isCustomer,
      isAdmin,
      register,
      login,
      logout,
      clearSession,
      refreshUser,
      redirectChefByVerification,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
