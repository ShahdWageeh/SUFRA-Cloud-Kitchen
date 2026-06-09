"use client";

import { Toaster } from "react-hot-toast";

export default function AppProviders({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#2D2D2D",
          },

          success: {
            iconTheme: {
              primary: "#8A9A5B",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}
