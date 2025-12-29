"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    if (!auth) {
      router.replace("/profile");
      return;
    }

    const role = auth.user.role;

    if (role === "admin") router.replace("/admin");
    else if (role === "staff") router.replace("/staff");
    else router.replace("/user");
  }, [router]);

  return null; // no UI
}
