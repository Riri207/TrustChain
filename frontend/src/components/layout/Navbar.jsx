import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

  const links = [
    { name: "Home", to: "/" },
    { name: "Campaigns", to: "/campaigns" },
    { name: "Donate", to: "/#donate" },
    { name: "Our Impact", to: "/impact" },
    { name: "How it Works", to: "/#how-it-works" },
    { name: "About", to: "/#about" },
  ];

  const isActive = (to) => {
    if (to === "/") return pathname === "/" && !hash;
    if (to.startsWith("/#")) return pathname === "/" && hash === to.slice(1);
    return pathname === to;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3 sm:px-8 lg:px-12">

        {/* Logo and tagline */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-3xl sm:h-14 sm:w-14">
            🌿
          </div>

          <div translate="no">
            <h1 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-2xl lg:text-3xl">
              TrustChain
            </h1>
            <p className="text-xs font-medium text-emerald-700 sm:text-sm">
              Giving with Trust
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`border-b-2 py-2 text-sm font-medium transition xl:text-base ${
                isActive(link.to)
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-gray-700 hover:border-emerald-500 hover:text-emerald-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side: Login + Language + Mobile button */}
        <div className="flex items-center gap-3">
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-full bg-green-100 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-200"
            >
              ♙ Login
            </Link>
          </div>

          <LanguageSelector />

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="rounded-lg border border-emerald-200 p-2 text-emerald-900 md:hidden"
          >
            {menuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </nav>

      {/* Tablet navigation */}
      <div className="hidden items-center justify-center gap-5 border-t border-gray-100 px-4 py-3 md:flex lg:hidden">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className={`text-sm font-medium hover:text-emerald-700 ${
              isActive(link.to) ? "text-emerald-700" : "text-gray-700"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute left-0 top-full w-full border-t border-gray-100 bg-white p-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-full bg-emerald-700 px-4 py-3 text-center font-semibold text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}