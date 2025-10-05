import * as React from "react";
import { NavBar } from "./header-with-nav";

type Link = { href: string; label: string };

type AppLayoutProps = {
  links: Link[];
  currentPath?: string;
  children: React.ReactNode;
};

export function AppLayout({ links, currentPath, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar links={links} currentPath={currentPath} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
