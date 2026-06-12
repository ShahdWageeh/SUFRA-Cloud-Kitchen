import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Plus_Jakarta_Sans } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AppProviders from "@/providers/AppProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";

config.autoAddCss = false;

export const metadata = {
  title: "CloudKitchen - Marketplace",
  description: "Best cloud kitchen marketplace",
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <AppProviders>
            <AuthProvider>
              <CartProvider>{children}</CartProvider>
            </AuthProvider>
          </AppProviders>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
