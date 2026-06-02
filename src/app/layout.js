import "./globals.css";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "CloudKitchen - Marketplace",
  description: "Best cloud kitchen marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* <AuthProvider> */}
          {/* <Navbar /> */}
          <main className="flex-grow bg-gray-50">{children}</main>
          {/* <Footer /> */}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
