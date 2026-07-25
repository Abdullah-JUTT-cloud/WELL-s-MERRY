import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiBars3,
  HiXMark,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.jpg";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Outlets", to: "/outlets" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const { itemCount } = useCart();
  const { user, isAuthenticated, authLoading, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  // Adds a subtle shadow/border once the page scrolls — a static header
  // looks flat against busy hero imagery; this gives it depth once content
  // starts passing underneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open — without this,
  // the page behind the drawer scrolls too, which feels broken on touch devices
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close the account dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative py-1 text-[13px] tracking-[0.14em] uppercase font-medium transition-colors
     after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-gold-2
     after:transition-all after:duration-300
     ${isActive
       ? "text-gold-3 after:w-full"
       : "text-cream hover:text-gold-3 after:w-0 hover:after:w-full"}`;

  return (
    <header className="sticky top-0 z-50 bg-ink">
      <div
        className={`transition-shadow duration-300 border-b border-gold-2/10 ${
          scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.35)]" : ""
        }`}
      >
        <div className="container-content flex items-center justify-between gap-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
            <img src={logo} alt="Well's Merry" className="h-11 w-auto rounded-md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === "/"}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              aria-label="Search"
              className="hidden sm:flex text-cream hover:text-gold-3 transition-colors"
            >
              <HiOutlineMagnifyingGlass className="w-5 h-5" />
            </button>

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                aria-label="Account"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center text-cream hover:text-gold-3 transition-colors"
              >
                <HiOutlineUser className="w-5 h-5" />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-4 w-52 bg-ivory border border-cream-dim rounded-sm shadow-soft py-2 animate-[fadeIn_0.15s_ease-out]">
                  {authLoading ? (
                    <div className="px-4 py-3 text-sm text-ink/50">Loading…</div>
                  ) : isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-cream-dim">
                        <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                        <p className="text-xs text-ink/50 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setAccountOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" aria-label="Cart" className="relative flex items-center text-cream hover:text-gold-3 transition-colors">
              <HiOutlineShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gold-2 text-ink text-[10px] font-bold flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-cream hover:text-gold-3 transition-colors"
            >
              <HiBars3 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-[visibility] duration-300 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-[82%] max-w-sm bg-ink border-l border-gold-2/10
                      transition-transform duration-300 ease-out flex flex-col
                      ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gold-2/10">
            <img src={logo} alt="Well's Merry" className="h-9 w-auto rounded-md" />
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-cream">
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col px-6 py-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `py-4 border-b border-gold-2/10 text-[14px] tracking-[0.1em] uppercase ${
                    isActive ? "text-gold-3" : "text-cream"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-6 py-6 border-t border-gold-2/10">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="btn btn-outline-light w-full"
              >
                Log Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-gold w-full">
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;