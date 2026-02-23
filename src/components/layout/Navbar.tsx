"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/work", label: "work" },
  { href: "/blog", label: "blog" },
  { href: "/links", label: "links" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop: vertical sidebar */}
      <aside className="hidden md:flex flex-col justify-between h-full py-8 px-6 font-sans">
        <nav>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block text-sm transition-colors hover:text-text-primary ${
                    isActive(link.href)
                      ? "text-text-primary font-medium"
                      : "text-text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-xs text-text-muted">
          <p>jay sahni</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </aside>

      {/* Mobile: horizontal header */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 font-sans border-b border-border">
        <Link href="/" className="text-sm font-medium text-text-primary">
          jay sahni
        </Link>
        <nav>
          <ul className="flex gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm transition-colors hover:text-text-primary ${
                    isActive(link.href)
                      ? "text-text-primary font-medium"
                      : "text-text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
