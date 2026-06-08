"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const storedToken = localStorage.getItem("token");

        if (
          !storedToken ||
          storedToken === "null" ||
          storedToken === "undefined"
        ) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${baseUrl}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setToken(storedToken);
          setUser(result.data);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Session restoration failed:", err);
      } finally {
        setLoading(false);
      }
    }

    checkExistingSession();
  }, [baseUrl]);

  const login = async (credentials) => {
    try {
      setLoading(true);

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const userToken = result.data.token;
        const userData = result.data.user;

        localStorage.setItem("token", userToken);

        setToken(userToken);
        setUser(userData);

        if (userData.role === "chef") {
          router.push("/chef/dashboard");
        } else {
          router.push("/");
        }

        return { success: true };
      } else {
        return {
          success: false,
          message: result.message || "Login credentials invalid.",
        };
      }
    } catch (err) {
      console.error("Auth Login Network Exception:", err);
      return {
        success: false,
        message: "Server unreachable. Please check your network connection.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be wrapped inside an AuthProvider element inside your layout tree.",
    );
  }
  return context;
};
