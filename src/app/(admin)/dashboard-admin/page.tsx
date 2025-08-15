"use client";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React from "react";

const DashboardPage = () => {
  const { user } = useAuthStore();
  console.log("USER", user);

  return <div>DashboardPage</div>;
};

export default DashboardPage;
