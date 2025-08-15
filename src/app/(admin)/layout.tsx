"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { toast } from "react-toastify";
import SidebarAdmin from "@/components/generics/SidebarAdmin";
import ShetContentComp from "@/components/generics/ShetContentComp";
import NavBar from "@/components/generics/NavBar";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setMobileSidebarOpen(false);

      await logout();
      <FullScreenLoader />;
      router.push("/");

      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      toast.error("Ocurrió un error al cerrar la sesión");
    }
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin handleLogout={handleLogout} />

      <ShetContentComp
        setMobileSidebarOpen={setMobileSidebarOpen}
        handleLogout={handleLogout}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <NavBar
          setMobileSidebarOpen={setMobileSidebarOpen}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
