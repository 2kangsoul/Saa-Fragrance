import { useState, useEffect } from "react";

export const useBlogAuth = (isOpen: boolean) => {
  const [userRole, setUserRole] = useState<string>("user");

  useEffect(() => {
    if (isOpen) {
      try {
        const userStr = localStorage.getItem("user");
        const authStr = localStorage.getItem("auth-storage");

        if (userStr) {
          setUserRole(JSON.parse(userStr)?.role || "user");
        } else if (authStr) {
          setUserRole(JSON.parse(authStr)?.state?.user?.role || "user");
        }
      } catch (error) {
        console.error("Gagal membaca role user", error);
      }
    }
  }, [isOpen]);

  const isAdminOrOwner = userRole === "owner" || userRole === "admin";

  return { userRole, isAdminOrOwner };
};