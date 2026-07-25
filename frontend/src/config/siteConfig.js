// Central place for brand contact details & social links.
// Update THIS file when real business email/social links are ready —
// every component (Footer, Contact page, WhatsApp button) reads from here,
// so nothing needs to be hunted down and changed in multiple places.

export const siteConfig = {
  brandName: "Well's Merry",
  tagline: "Rooted in Nature, Crowned in Gold",

  whatsappNumber: "923272555522", // used for wa.me links (no + or spaces)
  whatsappDisplay: "+92 327 2555522",
  phoneNumber: "+923214194045",
  phoneDisplay: "0321 4194045",
  email: "wellsmerry44@gmail.com", // TODO: swap to dedicated business email later

  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
  },
};

export const buildWhatsAppLink = (message = "") =>
  `https://wa.me/${siteConfig.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;