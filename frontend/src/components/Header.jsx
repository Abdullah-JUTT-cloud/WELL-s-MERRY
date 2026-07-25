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
import logo from "../assets/upnav.jpg";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
    `relative py-1 text-[12px] lg:text-[12.5px] tracking-[0.16em] lg:tracking-[0.18em] uppercase font-semibold transition-colors
     after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-gold-2
     after:transition-all after:duration-300
     ${isActive
       ? "text-gold-3 after:w-full"
       : "text-cream/90 hover:text-gold-3 after:w-0 hover:after:w-full"}`;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Always Moving / Circulating Top Announcement Marquee Bar */}
      <div className="bg-white text-black text-[10px] sm:text-[11px] font-bold tracking-[0.14em] sm:tracking-[0.16em] uppercase py-1.5 overflow-hidden border-b border-white/20 select-none whitespace-nowrap">
        <div className="flex w-max animate-marquee">
          {[...Array(6)].map((_, dupIdx) => (
            <div key={dupIdx} className="flex shrink-0 items-center">
              <Link to="/shop" className="hover:underline flex items-center px-3 sm:px-4">
                <span>YOUR SIGNATURE ORGANIC CARE — NOW IN 200ML.</span>
                <span className="ml-1.5 underline font-black">CLICK HERE</span>
              </Link>
              <span className="text-gold-1 px-2.5 sm:px-3">▪</span>
              <span className="px-3 sm:px-4">FREE SHIPPING ON ORDERS OVER RS. 3000</span>
              <span className="text-gold-1 px-2.5 sm:px-3">▪</span>
              <span className="px-3 sm:px-4 font-black">100% ORGANIC &amp; CHEMICAL FREE</span>
              <span className="text-gold-1 px-2.5 sm:px-3">▪</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Overlay Navbar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-ink/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)] py-2 sm:py-2.5 border-b border-gold-2/15"
            : "bg-gradient-to-b from-black/90 via-black/55 to-transparent py-2.5 sm:py-3 border-b border-white/10"
        }`}
      >
        <div className="container-content flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6">
          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center flex-1">
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
              className="text-cream hover:text-gold-3 transition-colors p-1.5 -ml-1"
            >
              <HiBars3 className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-start">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === "/"}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Centered Brand Logo */}
          <div className="flex justify-center items-center shrink-0">
            <Link to="/" className="flex items-center justify-center py-0.5" onClick={() => setMobileOpen(false)}>
              <img
                src={logo}
                alt="Well's Merry"
                className="h-9 sm:h-12 lg:h-15 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1 text-cream">
            <button
              aria-label="Search"
              className="hidden sm:flex text-cream/90 hover:text-gold-3 transition-colors p-1"
            >
              <HiOutlineMagnifyingGlass className="w-5 h-5" />
            </button>

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                aria-label="Account"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center text-cream/90 hover:text-gold-3 transition-colors p-1.5"
              >
                <HiOutlineUser className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-ivory border border-cream-dim rounded-lg shadow-soft py-2 animate-[fadeIn_0.15s_ease-out] z-50">
                  {authLoading ? (
                    <div className="px-4 py-3 text-sm text-ink/50">Loading…</div>
                  ) : isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-cream-dim">
                        <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                        <p className="text-xs text-ink/50 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink font-medium"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setAccountOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink font-medium"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink font-medium"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink font-medium"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative flex items-center text-cream/90 hover:text-gold-3 transition-colors p-1.5"
            >
              <HiOutlineShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-gold-2 text-ink text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-[visibility] duration-300 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-[85%] max-w-xs bg-ink border-r border-gold-2/20
                      transition-transform duration-300 ease-out flex flex-col z-10
                      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gold-2/15 bg-black/40">
            <img src={logo} alt="Well's Merry" className="h-9 w-auto object-contain" />
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-cream p-1">
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col px-5 py-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `py-3.5 border-b border-gold-2/10 text-[13.5px] tracking-[0.14em] uppercase font-semibold ${
                    isActive ? "text-gold-3" : "text-cream/90 hover:text-gold-3"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-5 py-6 border-t border-gold-2/15 bg-black/40">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full border border-gold-2/40 text-gold-3 font-semibold uppercase text-xs tracking-wider py-3 rounded-lg hover:bg-gold-2 hover:text-ink transition"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full bg-gold-2 text-ink font-bold uppercase text-xs tracking-wider py-3 rounded-lg text-center shadow-md hover:bg-gold-3 transition"
              >
                Log In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;