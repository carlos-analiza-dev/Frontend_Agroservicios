"use client";

import { useAuthStore } from "@/providers/store/useAuthStore";
import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const veterinariaAPI = axios.create({
  baseURL: API_URL,
});

veterinariaAPI.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
