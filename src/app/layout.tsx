import type { Metadata } from "next";
import "./globals.css";
import TanStackProvider from "@/providers/TanStackProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { Raleway } from "next/font/google";

const poppins = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "El Sembrador",
  description:
    "En este sitio se te brindara una diversidad de agroservicios para tu mejora continua.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={poppins.className}>
      <body>
        <TanStackProvider>
          <AuthProvider>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
