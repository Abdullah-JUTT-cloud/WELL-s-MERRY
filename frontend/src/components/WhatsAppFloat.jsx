import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppLink } from "../config/siteConfig.js";

const WhatsAppFloat = () => {
  const [visible, setVisible] = useState(false);

  // Appears after a small scroll instead of being present immediately on
  // load — showing it instantly on top of the hero competes with the
  // primary "Shop Now" CTA for attention. Letting the hero breathe first
  // is a deliberate UX choice, not an oversight.
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={buildWhatsAppLink("Hi Well's Merry! I'd like to know more about your products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366]
                  flex items-center justify-center shadow-[0_10px_26px_rgba(0,0,0,0.25)]
                  transition-all duration-300 ease-out
                  hover:scale-105 active:scale-95
                  ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"}`}
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
};

export default WhatsAppFloat;