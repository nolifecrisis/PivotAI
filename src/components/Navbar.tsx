// src/components/Navbar.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const links = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Match", path: "/match" }, // if you added the match page
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-indigo-700 tracking-tight">
          PivotAI
        </Link>
        <div className="hidden md:flex space-x-8">
          {links.map((link) => {
            const active = router.pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-base font-medium transition ${
                  active
                    ? "text-indigo-700 border-b-2 border-indigo-700 pb-1"
                    : "text-gray-600 hover:text-indigo-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
