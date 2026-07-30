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
import logo from "../assets/upnav.jpg";

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

  const transparentNav = pathname === "/" && !scrolled;

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
    `relative py-1 text-[11.5px] tracking-[0.16em] uppercase font-semibold transition-colors
     after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:bg-gold-2
     after:transition-all after:duration-300
     ${isActive
       ? "text-gold-3 after:w-full"
       : "text-cream/90 hover:text-gold-3 after:w-0 hover:after:w-full [text-shadow:0_1px_10px_rgba(0,0,0,0.75)]"}`;

  const iconTextClass =
    "text-cream/90 hover:text-gold-3 [filter:drop-shadow(0_1px_6px_rgba(0,0,0,0.85))]";

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full">
      {/* Announcement bar */}
      <div className="bg-white text-black text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase py-1.5 overflow-hidden border-b border-white/20 select-none whitespace-nowrap">
        <div className="flex w-max animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center">
              <Link to="/shop" className="hover:underline flex items-center px-3 sm:px-4">
                <span>YOUR SIGNATURE ORGANIC CARE — NOW IN 200ML.</span>
                <span className="ml-1.5 underline font-black">SHOP NOW</span>
              </Link>
              <span className="text-gold-1 px-2.5">▪</span>
              <span className="px-3 sm:px-4">FREE SHIPPING ON ORDERS OVER RS. 3000</span>
              <span className="text-gold-1 px-2.5">▪</span>
              <span className="px-3 sm:px-4 font-black">100% ORGANIC &amp; CHEMICAL FREE</span>
              <span className="text-gold-1 px-2.5">▪</span>
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
        className={`py-2.5 shadow-none transition-colors duration-300 ${
          transparentNav ? "bg-transparent" : "bg-ink"
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
            <Link to="/" onClick={() => setMobileOpen(false)}>
              <img
                src={logo}
                alt="Well's Merry"
                className="h-9 sm:h-11 lg:h-14 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] transition-transform duration-300 hover:scale-105"
              />
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
                <div className="absolute right-0 mt-3 w-52 bg-ivory border border-cream-dim rounded-lg shadow-soft py-2 animate-[fadeIn_0.15s_ease-out] z-50">
                  {authLoading ? (
                    <div className="px-4 py-3 text-sm text-ink/50">Loading…</div>
                  ) : isAuthenticated ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-cream-dim">
                        <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                        <p className="text-xs text-ink/50 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account/orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink font-medium"
                      >
                        <HiOutlineTruck className="w-4 h-4 text-gold-1" />
                        My Orders / Track
                      </Link>
                      <button
                        onClick={() => { logout(); setAccountOpen(false); }}
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
                      <div className="border-t border-cream-dim mt-1 pt-1">
                        <Link
                          to="/account/orders"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink/80 hover:bg-cream hover:text-ink font-medium"
                        >
                          <HiOutlineTruck className="w-4 h-4 text-gold-1" />
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
                <span className="absolute -top-1 -right-1.5 w-[18px] h-[18px] rounded-full bg-gold-2 text-ink text-[10px] font-bold flex items-center justify-center shadow-sm">
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
          className={`absolute left-0 top-0 h-full w-[82%] max-w-xs bg-ink border-r border-gold-2/20
                      transition-transform duration-300 ease-out flex flex-col z-10
                      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gold-2/15 bg-black/40">
            <img src={logo} alt="Well's Merry" className="h-9 w-auto object-contain" />
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-cream p-1">
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
                  `py-3.5 border-b border-gold-2/10 text-[13px] tracking-[0.14em] uppercase font-semibold ${
                    isActive ? "text-gold-3" : "text-cream/85 hover:text-gold-3"
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
              className="py-3.5 border-b border-gold-2/10 text-[13px] tracking-[0.14em] uppercase font-semibold text-cream/85 hover:text-gold-3 flex items-center gap-2"
            >
              <HiOutlineTruck className="w-4 h-4 text-gold-2" />
              Track Order
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="py-3.5 border-b border-gold-2/10 text-[13px] tracking-[0.14em] uppercase font-semibold text-cream/85 hover:text-gold-3 flex items-center gap-2"
            >
              <HiOutlineShoppingBag className="w-4 h-4 text-gold-2" />
              Cart {itemCount > 0 && <span className="ml-1 bg-gold-2 text-ink text-[10px] font-bold px-1.5 py-0.5 rounded-full">{itemCount}</span>}
            </Link>
            <Link
              to="/shipping"
              onClick={() => setMobileOpen(false)}
              className="py-3.5 border-b border-gold-2/10 text-[13px] tracking-[0.14em] uppercase font-semibold text-cream/85 hover:text-gold-3"
            >
              Shipping &amp; Returns
            </Link>
          </nav>

          <div className="px-5 py-6 border-t border-gold-2/15 bg-black/40">
            {isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-xs text-cream/50 truncate">{user?.email}</p>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full border border-gold-2/40 text-gold-3 font-semibold uppercase text-xs tracking-wider py-3 rounded-lg hover:bg-gold-2 hover:text-ink transition"
                >
                  Log Out
                </button>
              </div>
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
