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
import logo from "../assets/nav-up.png";
import { siteConfig, buildWhatsAppLink } from "../config/siteConfig.js";

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
    <footer className="bg-ink text-cream">
      <div className="container-content pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14">
          {/* Brand */}
          <div>
            <img src={logo} alt={siteConfig.brandName} className="h-14 w-auto rounded-md mb-5" />
            <p className="text-sm text-cream/60 max-w-[260px] leading-relaxed">
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
                    className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center
                               hover:border-gold-2 hover:text-gold-3 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-[12px] tracking-[0.16em] uppercase text-gold-3 font-semibold mb-5">
              Quick Links
            </h5>
            <ul className="space-y-3 text-sm text-cream/70">
              <li><Link to="/outlets" className="hover:text-gold-3 transition-colors">Our Outlets</Link></li>
              <li><Link to="/contact" className="hover:text-gold-3 transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-gold-3 transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-gold-3 transition-colors">The Journal</Link></li>
              <li><Link to="/terms" className="hover:text-gold-3 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-3 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-gold-3 transition-colors">Shipping &amp; Returns</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-[12px] tracking-[0.16em] uppercase text-gold-3 font-semibold mb-5">
              Shop
            </h5>
            <ul className="space-y-3 text-sm text-cream/70">
              <li><Link to="/shop" className="hover:text-gold-3 transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=hair-care" className="hover:text-gold-3 transition-colors">Hair Care</Link></li>
              <li><Link to="/account/orders" className="hover:text-gold-3 transition-colors">Track Order</Link></li>
              <li><Link to="/cart" className="hover:text-gold-3 transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-[12px] tracking-[0.16em] uppercase text-gold-3 font-semibold mb-5">
              Get In Touch
            </h5>
            <ul className="space-y-4 text-sm text-cream/70">
              <li>
                <a
                  href={buildWhatsAppLink("Hi Well's Merry! I have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-gold-3 transition-colors"
                >
                  <HiOutlineChatBubbleLeftRight className="w-4 h-4 mt-0.5 text-gold-2 shrink-0" />
                  {siteConfig.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phoneNumber}`} className="flex items-start gap-3 hover:text-gold-3 transition-colors">
                  <HiOutlinePhone className="w-4 h-4 mt-0.5 text-gold-2 shrink-0" />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-3 hover:text-gold-3 transition-colors break-all">
                  <HiOutlineEnvelope className="w-4 h-4 mt-0.5 text-gold-2 shrink-0" />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter — Full-bleed bold color-block moment */}
        <div className="bg-moss rounded-xl p-8 sm:p-12 text-center -mx-2 sm:mx-0 border-[1.5px] border-ivory/15 shadow-hard">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-[1.5px] border-gold-3/40 flex items-center justify-center bg-ivory/10">
            <HiOutlineEnvelope className="w-5 h-5 text-gold-3" />
          </div>
          <h4 className="font-display text-2xl sm:text-3xl lg:text-4xl text-ivory mb-1 font-bold">Stay in the Loop</h4>
          <p className="font-display italic text-gold-3/80 text-base sm:text-lg mb-6">New drops, seasonal offers & botanical secrets.</p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex items-center gap-0 border-[1.5px] border-ivory/30 rounded-sm overflow-hidden shadow-hard-sm bg-ivory/5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent outline-none text-ivory placeholder:text-cream/40 text-sm py-3 px-4"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-label="Subscribe"
              className="bg-gold-2 text-ink font-bold uppercase text-[11px] tracking-[0.14em] px-5 py-3
                         hover:bg-gold-3 disabled:opacity-40 transition-colors
                         border-l-[1.5px] border-ink/30"
            >
              {submitting ? "..." : "JOIN"}
            </button>
          </form>
        </div>

        {/* Tagline */}
        <p className="font-display italic text-xl text-gold-3 text-center border-t border-cream/10 pt-10">
          {siteConfig.tagline}
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="container-content py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</p>
          <p>Guest checkout · Cash on Delivery · WhatsApp Orders</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;