"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { toast } from "react-toastify";
import SidebarAdmin from "@/components/generics/SidebarAdmin";
import ShetContentComp from "@/components/generics/ShetContentComp";
import NavBar from "@/components/generics/NavBar";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";

export default function VeterinarioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { logout, user } = useAuthStore();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setMobileSidebarOpen(false);
      setLoading(true);

      await logout();
      router.push("/");

      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      toast.error("Ocurrió un error al cerrar la sesión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      if (!user || user.role.name !== "Veterinario") {
        await logout();
        router.push("/");
      }
    };

    checkUser();
  }, [user, logout, router]);

  if (loading) {
    return <FullScreenLoader />;
  }

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
