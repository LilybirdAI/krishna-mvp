"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/discover", label: "Discover" },
  { href: "/messages", label: "Messages" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Krishna MVP
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "font-semibold text-gray-900"
                  : "text-gray-500"
              }
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}