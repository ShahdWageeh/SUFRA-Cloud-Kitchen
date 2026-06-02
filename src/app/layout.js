import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";
import { AuthProvider } from "@/context/AuthContext";
import { Plus_Jakarta_Sans } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

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
      <body className={`flex flex-col min-h-screen ${jakarta.className}`}>
        <AuthProvider>
          <AppChrome>{children}</AppChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
