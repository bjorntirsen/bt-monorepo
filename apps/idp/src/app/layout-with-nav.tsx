"use client";

import { AppLayout } from "@/components/layout";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/verify", label: "Verify" },
  { href: "/logout", label: "Logout" },
];

export function LayoutWithNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AppLayout links={links} currentPath={pathname}>
      {children}
    </AppLayout>
  );
}
