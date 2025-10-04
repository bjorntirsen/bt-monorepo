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
    <nav className="flex gap-6 p-4 border-b border-gray-200">
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
  );
}
