import { useState, useEffect } from "react";
import { useAuthStore } from "@/providers/store/useAuthStore";

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const useSessionExpired = () => {
  const [showModal, setShowModal] = useState(false);
  const { logout, token } = useAuthStore();

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      setShowModal(true);
    }
  }, [token, logout]);

  const handleCloseModal = () => {
    setShowModal(false);
    logout();
  };

  return {
    showModal,
    setShowModal,
    handleCloseModal,
  };
};
