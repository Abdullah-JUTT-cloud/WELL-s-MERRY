import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineChatBubbleLeftRight,
  HiArrowRight,
} from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { siteConfig, buildWhatsAppLink } from "../config/siteConfig.js";
import { DropIcon } from "./apocalypse/icons.jsx";

const SOCIAL_ICONS = [
  { key: "facebook", Icon: FaFacebookF, label: "Facebook" },
  { key: "instagram", Icon: FaInstagram, label: "Instagram" },
  { key: "tiktok", Icon: FaTiktok, label: "TikTok" },
  { key: "youtube", Icon: FaYoutube, label: "YouTube" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Newsletter has no backend endpoint yet — front-end only for now.
  // Swap this handler for a real api.post("/newsletter") call once
  // that route exists; the form/UI won't need to change.
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500)); // simulated latency for realistic feel
    toast.success("Thanks for subscribing!");
    setEmail("");
    setSubmitting(false);
  };

  return (
    <footer className="bg-apoc-soot text-apoc-bone border-t-4 border-apoc-ember">
      <div className="container-content pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-11 h-11 bg-apoc-ember border-[3px] border-apoc-bone flex items-center justify-center shadow-hard-ember -rotate-3">
                <DropIcon className="w-6 h-6 text-apoc-soot" />
              </span>
              <span className="font-apoc uppercase text-apoc-bone text-xl tracking-tight">
                {siteConfig.brandName}
              </span>
            </div>
            <p className="font-grotesk font-semibold text-sm text-apoc-bone/60 max-w-[260px] leading-relaxed">
              100% organic hair care, deeply moisturizing for softness &amp; shine —
              made with care, rooted in nature.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL_ICONS.map(({ key, Icon, label }) => {
                const href = siteConfig.social[key];
                return (
                  <a
                    key={key}
                    href={href || "#"}
                    aria-label={label}
                    target={href ? "_blank" : undefined}
                    rel={href ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (!href) {
                        e.preventDefault();
                        toast("Coming soon", { icon: "✨" });
                      }
                    }}
                    className="w-9 h-9 border-2 border-apoc-bone/30 flex items-center justify-center
                               hover:border-apoc-ember hover:text-apoc-flame hover:bg-apoc-ember/10 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="font-apoc text-[12px] tracking-[0.16em] uppercase text-apoc-flame mb-5">
              Quick Links
            </h5>
            <ul className="space-y-3 font-grotesk font-semibold text-sm text-apoc-bone/70">
              <li><Link to="/outlets" className="hover:text-apoc-flame transition-colors">Our Outlets</Link></li>
              <li><Link to="/contact" className="hover:text-apoc-flame transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-apoc-flame transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-apoc-flame transition-colors">The Journal</Link></li>
              <li><Link to="/terms" className="hover:text-apoc-flame transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-apoc-flame transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-apoc-flame transition-colors">Shipping &amp; Returns</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h5 className="font-apoc text-[12px] tracking-[0.16em] uppercase text-apoc-flame mb-5">
              Shop
            </h5>
            <ul className="space-y-3 font-grotesk font-semibold text-sm text-apoc-bone/70">
              <li><Link to="/shop" className="hover:text-apoc-flame transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=hair-care" className="hover:text-apoc-flame transition-colors">Hair Care</Link></li>
              <li><Link to="/account/orders" className="hover:text-apoc-flame transition-colors">Track Order</Link></li>
              <li><Link to="/cart" className="hover:text-apoc-flame transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-apoc text-[12px] tracking-[0.16em] uppercase text-apoc-flame mb-5">
              Get In Touch
            </h5>
            <ul className="space-y-4 font-grotesk font-semibold text-sm text-apoc-bone/70">
              <li>
                <a
                  href={buildWhatsAppLink("Hi Well's Merry! I have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-apoc-flame transition-colors"
                >
                  <HiOutlineChatBubbleLeftRight className="w-4 h-4 mt-0.5 text-apoc-ember shrink-0" />
                  {siteConfig.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phoneNumber}`} className="flex items-start gap-3 hover:text-apoc-flame transition-colors">
                  <HiOutlinePhone className="w-4 h-4 mt-0.5 text-apoc-ember shrink-0" />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-3 hover:text-apoc-flame transition-colors break-all">
                  <HiOutlineEnvelope className="w-4 h-4 mt-0.5 text-apoc-ember shrink-0" />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter — Full-bleed bold color-block moment */}
        <div className="bg-apoc-ember text-apoc-soot p-8 sm:p-12 text-center -mx-2 sm:mx-0 border-4 border-apoc-soot shadow-hard-ink">
          <div className="w-12 h-12 mx-auto mb-4 border-[3px] border-apoc-soot flex items-center justify-center bg-apoc-bone -rotate-3">
            <HiOutlineEnvelope className="w-5 h-5 text-apoc-soot" />
          </div>
          <h4 className="font-apoc uppercase text-2xl sm:text-3xl lg:text-4xl text-apoc-soot mb-1">Stay in the Loop</h4>
          <p className="font-grotesk font-bold text-apoc-soot/80 text-base sm:text-lg mb-6">New drops, seasonal offers & botanical secrets.</p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex items-center gap-0 border-4 border-apoc-soot overflow-hidden shadow-hard-ink bg-apoc-bone">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent outline-none text-apoc-soot placeholder:text-apoc-soot/50 font-grotesk font-semibold text-sm py-3 px-4"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-label="Subscribe"
              className="bg-apoc-soot text-apoc-bone font-black uppercase text-[11px] tracking-[0.14em] px-5 py-3
                         hover:bg-apoc-rust disabled:opacity-40 transition-colors
                         border-l-4 border-apoc-soot"
            >
              {submitting ? "..." : "JOIN"}
            </button>
          </form>
        </div>

        {/* Tagline */}
        <p className="font-distressed text-lg sm:text-xl text-apoc-flame text-center border-t border-apoc-bone/10 pt-10">
          {siteConfig.tagline}
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-apoc-bone/10">
        <div className="container-content py-5 flex flex-col sm:flex-row items-center justify-between gap-3 font-grotesk font-semibold text-xs text-apoc-bone/40">
          <p>© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</p>
          <p>Guest checkout · Cash on Delivery · WhatsApp Orders</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;