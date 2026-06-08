"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { authService, verificationService, tokenService } from "@/services";

export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(tokenService.get());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;
  const isChef = user?.role === "chef";
  const isCustomer = user?.role === "customer";
  const isAdmin = user?.role === "admin";

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.me();
      setUser(currentUser.data);
      return currentUser.data;
    } catch (error) {
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
        const user = response.data.user;
        const token = response.data.token;
        tokenService.save(token);
        setToken(token);
        setUser(user);
        if (user.role === "chef") {
          router.push("/chef/onboarding");
        } else {
          router.push("/customer/dashboard");
        }

        return {
          success: true,
          user,
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
    [router],
  );

  const login = useCallback(
    async (credentials) => {
      setLoading(true);

      try {
        const response = await authService.login(credentials);

        const loggedUser = response.data.user;
        const accessToken = response.data.token;

        tokenService.save(accessToken);

        setToken(accessToken);
        setUser(loggedUser);

        if (loggedUser.role === "chef") {
          try {
            const verification =
              await verificationService.getVerificationStatus();

            const status = verification.data.status;

            switch (status) {
              case "approved":
                router.push("/chef/dashboard");
                break;

              case "pending":
                router.push("/chef/onboarding");
                break;

              case "failed":
                router.push("/chef/onboarding");
                break;

              default:
                router.push("/chef/onboarding");
            }
          } catch (error) {
            router.push("/chef/onboarding");
          }
        } else if (loggedUser.role === "customer") {
          router.push("/customer/dashboard");
        } else if (loggedUser.role === "admin") {
          router.push("/admin/dashboard");
        }

        return {
          success: true,
          user: loggedUser,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error?.response?.data?.message || "Invalid email or password.",
        };
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(() => {
    tokenService.remove();
    setUser(null);
    setToken(null);

    router.replace("/login");
  }, [router]);

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
      refreshUser,
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
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
