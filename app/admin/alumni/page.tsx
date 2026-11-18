"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAlumniRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/ex-panel");
  }, [router]);
  return null;
}
