"use client";

import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const veterinariaAPI = axios.create({
  baseURL: API_URL,
});

veterinariaAPI.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
