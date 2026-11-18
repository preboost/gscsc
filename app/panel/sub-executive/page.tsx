"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubExecutivePanelPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/panel/executive");
  }, [router]);

  return null;
}
