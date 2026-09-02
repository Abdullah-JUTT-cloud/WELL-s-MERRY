import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiBars3,
  HiXMark,
  HiOutlineTruck,
} from "react-icons/hi2";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { DropIcon } from "./apocalypse/icons.jsx";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Outlets", to: "/outlets" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const { itemCount } = useCart();
  const { user, isAuthenticated, authLoading, logout } = useAuth();
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const headerRef = useRef(null);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Publish the header's real height as a CSS variable so hero pages can tuck
  // themselves underneath by exactly the right amount. Each page used to
  // hardcode `-mt-[90px] sm:-mt-[105px]`, which never matched the true height
  // at every breakpoint (the logo scales h-9 → h-11 → h-14) and left a visible
  // seam. Measuring removes the guesswork and survives the announcement bar
  // wrapping to two lines on a narrow screen.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const publishHeight = () => {
      document.documentElement.style.setProperty(
        "--wm-header-h",
        `${el.offsetHeight}px`
      );
    };

    publishHeight();

    // ResizeObserver is missing on some older mobile browsers; the static
    // fallback value declared in index.css covers those.
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(publishHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close the mobile drawer on navigation, otherwise it stays open over the
  // new page after tapping a link.
  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

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
    `relative py-1 font-grotesk text-[11.5px] tracking-[0.16em] uppercase font-extrabold transition-colors
     after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[3px] after:bg-apoc-ember
     after:transition-all after:duration-200
     ${isActive
       ? "text-apoc-flame after:w-full"
       : "text-apoc-bone hover:text-apoc-flame after:w-0 hover:after:w-full"}`;

  const iconTextClass = "text-apoc-bone hover:text-apoc-flame";

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full">
      {/* Announcement bar */}
      <div className="bg-apoc-ember text-apoc-soot text-[10px] sm:text-[11px] font-black tracking-[0.14em] uppercase py-1.5 overflow-hidden border-b-2 border-apoc-soot select-none whitespace-nowrap">
        <div className="flex w-max animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center">
              <Link to="/shop" className="hover:underline flex items-center px-3 sm:px-4">
                <span>YOUR SIGNATURE ORGANIC CARE — NOW IN 200ML.</span>
                <span className="ml-1.5 underline font-black">SHOP NOW</span>
              </Link>
              <span className="px-2.5">☠</span>
              <span className="px-3 sm:px-4">FREE SHIPPING ON ORDERS OVER RS. 3000</span>
              <span className="px-2.5">☠</span>
              <span className="px-3 sm:px-4 font-black">100% ORGANIC &amp; CHEMICAL FREE</span>
              <span className="px-2.5">☠</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main navbar.
          Vertical padding stays constant across scroll states on purpose — it
          used to shrink from py-2.5 to py-2, changing the header's height and
          shifting every hero offset by a few pixels mid-scroll. Only the
          background and shadow react to scrolling now. */}
      <div
        className={`py-2.5 bg-apoc-soot border-b-4 border-apoc-ember transition-shadow duration-300 ${
          scrolled ? "shadow-[0_6px_0_rgba(15,12,9,0.45)]" : "shadow-none"
        }`}
      >
        <div className="container-content flex items-center justify-between gap-2 px-4 sm:px-6">
          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center flex-1">
            <button
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className={`${iconTextClass} transition-colors p-1.5 -ml-1`}
            >
              <HiBars3 className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop nav — left */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-start">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === "/"}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Logo — center */}
          <div className="flex justify-center items-center shrink-0">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 group"
              aria-label="Well's Merry — home"
            >
              <span className="w-9 h-9 sm:w-11 sm:h-11 bg-apoc-ember border-[3px] border-apoc-bone flex items-center justify-center shadow-hard-ember group-hover:rotate-[-6deg] transition-transform">
                <DropIcon className="w-5 h-5 sm:w-6 sm:h-6 text-apoc-soot" />
              </span>
              <span className="leading-none text-left">
                <span className="block font-apoc uppercase text-apoc-bone text-sm sm:text-lg tracking-tight">
                  Well&apos;s Merry
                </span>
                <span className="block font-grotesk font-bold text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-apoc-flame mt-0.5">
                  End of bad haircare
                </span>
              </span>
            </Link>
          </div>

          {/* Action icons — right */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
            {/* Track Order — desktop only */}
            <Link
              to="/account/orders"
              className={`hidden lg:flex items-center gap-1.5 transition-colors text-[11px] tracking-[0.12em] uppercase font-semibold ${iconTextClass}`}
            >
              <HiOutlineTruck className="w-4 h-4" />
              Track Order
            </Link>

            {/* Account dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                aria-label="Account"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((v) => !v)}
                className={`flex items-center transition-colors p-1.5 ${iconTextClass}`}
              >
                <HiOutlineUser className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-apoc-bone border-4 border-apoc-soot shadow-hard-ember py-2 animate-[fadeIn_0.15s_ease-out] z-50">
                  {authLoading ? (
                    <div className="px-4 py-3 text-sm text-apoc-soot/50">Loading…</div>
                  ) : isAuthenticated ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-apoc-soot/20">
                        <p className="text-sm font-semibold text-apoc-soot truncate">{user.name}</p>
                        <p className="text-xs text-apoc-soot/50 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account/orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-apoc-soot/80 hover:bg-apoc-paper hover:text-apoc-soot font-medium"
                      >
                        <HiOutlineTruck className="w-4 h-4 text-apoc-rust" />
                        My Orders / Track
                      </Link>
                      <button
                        onClick={() => { logout(); setAccountOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-apoc-soot/80 hover:bg-apoc-paper hover:text-apoc-soot font-medium"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-apoc-soot/80 hover:bg-apoc-paper hover:text-apoc-soot font-medium"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-apoc-soot/80 hover:bg-apoc-paper hover:text-apoc-soot font-medium"
                      >
                        Create Account
                      </Link>
                      <div className="border-t border-apoc-soot/20 mt-1 pt-1">
                        <Link
                          to="/account/orders"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-apoc-soot/80 hover:bg-apoc-paper hover:text-apoc-soot font-medium"
                        >
                          <HiOutlineTruck className="w-4 h-4 text-apoc-rust" />
                          Track Order
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Cart (${itemCount} items)`}
              className={`relative flex items-center transition-colors p-1.5 ${iconTextClass}`}
            >
              <HiOutlineShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-[18px] h-[18px] rounded-full bg-apoc-ember text-apoc-soot text-[10px] font-black flex items-center justify-center border border-apoc-soot">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-[visibility] duration-300 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-[82%] max-w-xs bg-apoc-coal border-r-4 border-apoc-ember
                      transition-transform duration-300 ease-out flex flex-col z-10
                      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-apoc-bone/15 bg-apoc-soot">
            <span className="font-apoc uppercase text-apoc-bone text-base tracking-tight">Well&apos;s Merry</span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-apoc-bone p-1">
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col px-5 py-2 overflow-y-auto flex-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `py-3.5 border-b border-apoc-bone/10 font-grotesk text-[13px] tracking-[0.14em] uppercase font-extrabold ${
                    isActive ? "text-apoc-flame" : "text-apoc-bone/85 hover:text-apoc-flame"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {/* Track Order in mobile */}
            <Link
              to="/account/orders"
              onClick={() => setMobileOpen(false)}
              className="py-3.5 border-b border-apoc-bone/10 text-[13px] tracking-[0.14em] uppercase font-extrabold text-apoc-bone/85 hover:text-apoc-flame flex items-center gap-2"
            >
              <HiOutlineTruck className="w-4 h-4 text-apoc-ember" />
              Track Order
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="py-3.5 border-b border-apoc-bone/10 text-[13px] tracking-[0.14em] uppercase font-extrabold text-apoc-bone/85 hover:text-apoc-flame flex items-center gap-2"
            >
              <HiOutlineShoppingBag className="w-4 h-4 text-apoc-ember" />
              Cart {itemCount > 0 && <span className="ml-1 bg-apoc-ember text-apoc-soot text-[10px] font-black px-1.5 py-0.5 rounded-full">{itemCount}</span>}
            </Link>
            <Link
              to="/shipping"
              onClick={() => setMobileOpen(false)}
              className="py-3.5 border-b border-apoc-bone/10 text-[13px] tracking-[0.14em] uppercase font-extrabold text-apoc-bone/85 hover:text-apoc-flame"
            >
              Shipping &amp; Returns
            </Link>
          </nav>

          <div className="px-5 py-6 border-t border-apoc-bone/15 bg-apoc-soot">
            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-xs text-apoc-bone/50 truncate">{user?.email}</p>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full border-2 border-apoc-ember text-apoc-flame font-black uppercase text-xs tracking-wider py-3 hover:bg-apoc-ember hover:text-apoc-soot transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full bg-apoc-ember text-apoc-soot font-black uppercase text-xs tracking-wider py-3 text-center border-2 border-apoc-soot shadow-hard-ink hover:bg-apoc-flame transition"
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
