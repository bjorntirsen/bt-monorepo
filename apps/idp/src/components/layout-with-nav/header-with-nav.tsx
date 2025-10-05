import ThemeToggle from "./theme-toggle";

type Link = {
  href: string;
  label: string;
};

type NavBarProps = {
  links: Link[];
  currentPath?: string;
};

export function NavBar({ links, currentPath }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[var(--accent-a5)] backdrop-blur-sm supports-backdrop-filter:bg-[var(--accent-3)]/60">
      <div className="container mx-auto flex h-14 w-full items-center justify-between px-4">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {links.map((link) => {
            const active = currentPath === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`${
                  active ? "font-semibold text-blue-600" : "text-gray-700"
                } hover:text-blue-500 transition-colors`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
