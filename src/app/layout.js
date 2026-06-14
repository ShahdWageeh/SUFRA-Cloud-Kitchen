import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AppProviders from "@/providers/AppProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ArabicLocalizationProvider from "@/providers/ArabicLocalizationProvider";

config.autoAddCss = false;

export const metadata = {
  title: "Sufra | سفرة",
  description: "Home-cooked food marketplace | سوق الأكل البيتي",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar-EG" dir="rtl">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <ThemeProvider>
            <AppProviders>
              <ArabicLocalizationProvider>
                <AuthProvider>
                  <CartProvider>{children}</CartProvider>
                </AuthProvider>
              </ArabicLocalizationProvider>
            </AppProviders>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
