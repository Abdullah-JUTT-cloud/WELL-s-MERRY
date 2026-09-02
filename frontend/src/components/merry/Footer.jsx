import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowRight } from "react-icons/hi2";
import { LeafIcon } from "./icons.jsx";

/* =====================================================================
   Footer — chunky, full-width, blocky. Three stacked bands:
     1. Terracotta newsletter band with a heavy input + submit button
     2. Forest-green link grid + brand column
     3. Oversized ghost wordmark + legal bottom bar
   ===================================================================== */

const LINK_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Hair Care Oil", to: "/shop" },
      { label: "All Products", to: "/shop" },
      { label: "Track Order", to: "/orders" },
      { label: "Cart", to: "/cart" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Outlets", to: "/outlets" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Shipping & Delivery", to: "/shipping" },
      { label: "Cash on Delivery", to: "/shipping" },
      { label: "Account", to: "/login" },
      { label: "Register", to: "/register" },
    ],
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Wire to a real endpoint later; the UX contract is instant feedback.
    toast.success("You're on the list. Welcome to the grove.");
    setEmail("");
  };

  return (
    <footer className="border-t-4 border-merry-forest bg-merry-forest text-merry-cream">
      {/* 1 — Newsletter band */}
      <div className="border-b-4 border-merry-forest bg-merry-clay text-merry-cream">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-14 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-xl">
            <h2 className="text-4xl uppercase leading-[0.98] sm:text-5xl">Join the grove.</h2>
            <p className="mt-3 text-sm font-medium text-merry-cream/85 sm:text-base">
              Hair rituals, harvest updates and early access to new batches.
              One email a month — cold-pressed, never spammy.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full flex-col gap-4 sm:flex-row lg:w-[46%]"
          >
            <label className="sr-only" htmlFor="merry-newsletter-email">
              Email address
            </label>
            <input
              id="merry-newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="min-w-0 flex-1 border-4 border-merry-forest bg-merry-cream px-5 py-4 font-medium text-merry-forest placeholder-merry-forest/40 focus:outline-none focus:ring-4 focus:ring-merry-forest/25"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 border-4 border-merry-forest bg-merry-forest px-8 py-4 font-slab text-base uppercase tracking-wide text-merry-cream shadow-hard-merry-cream transition-[transform,box-shadow] duration-150 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
            >
              Sign up
              <HiArrowRight className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </form>
        </div>
      </div>

      {/* 2 — Brand + link grid */}
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3" aria-label="Well's Merry — home">
            <span className="grid h-11 w-11 place-items-center border-4 border-merry-cream/30 bg-merry-clay text-merry-cream">
              <LeafIcon className="h-5 w-5" />
            </span>
            <span className="font-slab text-xl uppercase">Well&rsquo;s Merry</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-merry-sage">
            Eight cold-pressed organic oils in one honest bottle. Made in small
            batches, delivered to your door, paid for when it arrives.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["100% Organic", "Cold-Pressed", "Cash on Delivery"].map((tag) => (
              <span
                key={tag}
                className="border-2 border-merry-cream/25 px-3 py-1.5 font-slab text-[10px] uppercase tracking-widest2 text-merry-cream/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {LINK_COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h3 className="flex items-center gap-2 font-slab text-sm uppercase tracking-widest2 text-merry-clay">
              <LeafIcon className="h-3.5 w-3.5" />
              {col.heading}
            </h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-merry-cream/75 transition-colors hover:text-merry-clay"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* 3 — Ghost wordmark + bottom bar */}
      <div aria-hidden="true" className="select-none overflow-hidden border-t-4 border-merry-cream/10">
        <p className="whitespace-nowrap text-center font-slab text-[15vw] uppercase leading-[0.82] text-merry-cream/[0.06]">
          Well&rsquo;s Merry
        </p>
      </div>

      <div className="border-t-4 border-merry-cream/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-5 text-[11px] uppercase tracking-widest2 text-merry-sage sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span>&copy; {new Date().getFullYear()} Well&rsquo;s Merry. All roots reserved.</span>
          <span className="flex items-center gap-2">
            Grown with patience
            <LeafIcon className="h-3.5 w-3.5 text-merry-clay" />
            Bottled with care
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
