"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/useAuthStore";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, checkAuth, loading } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push("/login");
      }
    };
    verifyAuth();
  }, [checkAuth, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
} 