import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineTruck,
  HiOutlineBuildingStorefront,
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import { siteConfig, buildWhatsAppLink } from "../config/siteConfig.js";
import FormField from "../components/FormField.jsx";

const CONTACT_CHANNELS = [
  {
    icon: HiOutlineChatBubbleLeftRight,
    label: "WhatsApp",
    value: siteConfig.whatsappDisplay,
    note: "Fastest reply — usually minutes",
    href: buildWhatsAppLink("Hi Well's Merry! I have a question."),
    external: true,
  },
  {
    icon: HiOutlinePhone,
    label: "Call Us",
    value: siteConfig.phoneDisplay,
    note: "Mon–Sat, 10am – 8pm PKT",
    href: `tel:${siteConfig.phoneNumber}`,
  },
  {
    icon: HiOutlineEnvelope,
    label: "Email",
    value: siteConfig.email,
    note: "Best for detailed or bulk enquiries",
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: HiOutlineClock,
    label: "Response Time",
    value: "Within 24 hours",
    note: "Seven days a week, including holidays",
  },
];

const REASONS = [
  { value: "", label: "What is this about?" },
  { value: "Order Enquiry", label: "An existing order" },
  { value: "Product Question", label: "A product question" },
  { value: "Stockist / Wholesale", label: "Becoming a stockist or wholesale" },
  { value: "Feedback", label: "Feedback or a complaint" },
  { value: "Other", label: "Something else" },
];

const QUICK_LINKS = [
  {
    icon: HiOutlineTruck,
    title: "Track an order",
    text: "See live status and delivery updates.",
    to: "/account/orders",
    cta: "Track Order",
  },
  {
    icon: HiOutlineBuildingStorefront,
    title: "Find a stockist",
    text: "Buy in person at one of our outlets.",
    to: "/outlets",
    cta: "View Outlets",
  },
  {
    icon: HiOutlineQuestionMarkCircle,
    title: "Read the journal",
    text: "Routines, ingredients, and honest answers.",
    to: "/blog",
    cta: "Browse Articles",
  },
];

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Orders ship within 24 hours of confirmation. Most addresses in Karachi, Lahore, and Islamabad receive delivery in 2–3 working days; other cities take 3–5. Shipping is free nationwide on every order.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes, COD is available across Pakistan with no extra handling fee. You can also pay by transfer through EasyPaisa, JazzCash, NayaPay, or Raqami — just upload the receipt at checkout and we'll verify it before dispatch.",
  },
  {
    q: "Can I order without creating an account?",
    a: "You can. Guest checkout only needs an email address so we can send your confirmation. Creating an account is optional and mainly useful for tracking past orders in one place.",
  },
  {
    q: "I'd like to stock Well's Merry in my store.",
    a: "We'd like that too. Message us on WhatsApp or select 'Becoming a stockist' in the form below with your store name and city, and we'll send wholesale pricing and minimum order details.",
  },
  {
    q: "What if the product doesn't suit my hair?",
    a: "Tell us. If an unopened product arrives damaged or isn't what you ordered, we'll replace it. If it simply isn't working for your scalp, message us anyway — we'd rather give you honest advice than have you keep using something that isn't right.",
  },
];

const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", orderId: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email";
    if (form.phone.trim() && form.phone.replace(/\D/g, "").length < 10) {
      next.phone = "Enter a valid phone number";
    }
    if (!form.message.trim()) next.message = "Message is required";
    else if (form.message.trim().length < 10) next.message = "Please add a little more detail";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // No backend endpoint for a contact form exists yet — this intentionally
  // opens a pre-filled WhatsApp chat with the submitted details instead of
  // silently pretending to "send" something that goes nowhere. It actually
  // reaches the business using infrastructure that already exists. If this
  // should route to a ticketing inbox later, it's a clean swap of this one
  // function; the form fields already collect everything a ticket needs.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const message = [
      "Hi Well's Merry! I have a message from the Contact form:",
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : "",
      form.subject ? `Regarding: ${form.subject}` : "",
      form.orderId ? `Order #: ${form.orderId}` : "",
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp with your message...");
    setForm(EMPTY_FORM);
    setSubmitting(false);
  };

  return (
    <div className="bg-ivory">
      {/* Hero */}
      <div className="bg-ink text-ivory py-16 sm:py-20 text-center">
        <span className="eyebrow mb-3">Get In Touch</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ivory">
          We're Easy to Reach
        </h1>
        <p className="text-cream/60 max-w-xl mx-auto mt-4 px-6 leading-relaxed">
          Questions about a product, an order, or becoming a stockist — pick
          whichever channel suits you. A real person answers every one.
        </p>
      </div>

      {/* Channel cards */}
      <div className="container-content -mt-10 sm:-mt-12 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_CHANNELS.map(({ icon: Icon, label, value, note, href, external }) => {
            const inner = (
              <>
                <Icon className="w-6 h-6 text-gold-1 mb-4" />
                <p className="text-[10.5px] tracking-[0.14em] uppercase text-ink/40 font-semibold mb-1.5">
                  {label}
                </p>
                <p className="text-[14.5px] font-medium text-ink break-words">{value}</p>
                <p className="text-[12px] text-ink/50 mt-1.5 leading-relaxed">{note}</p>
              </>
            );

            return href ? (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="bg-white border border-cream-dim p-6 hover:border-gold-2 hover:shadow-soft transition-all duration-300 block"
              >
                {inner}
              </a>
            ) : (
              <div key={label} className="bg-white border border-cream-dim p-6">
                {inner}
              </div>
            );
          })}
        </div>
      </div>

      <div className="container-content py-14 sm:py-20">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
          {/* ---------- Form ---------- */}
          <div className="bg-white border border-cream-dim p-7 sm:p-10">
            <h2 className="font-display text-2xl sm:text-[28px] mb-2">Send a Message</h2>
            <p className="text-[13.5px] text-ink/55 leading-relaxed mb-8">
              Fill this in and we'll open WhatsApp with your details already
              written out, so your message lands with us instantly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField
                  label="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  autoComplete="name"
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <FormField
                  label="Phone (optional)"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  autoComplete="tel"
                />

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-[12px] tracking-[0.1em] uppercase text-ink/50 mb-2"
                  >
                    Reason
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-cream-dim bg-white px-4 py-3 text-sm rounded-sm
                               focus:outline-none focus:border-gold-2 transition-colors text-ink/80 h-[46px]"
                  >
                    {REASONS.map((r) => (
                      <option key={r.label} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Only relevant when the enquiry is about an order — asking
                  everyone for an order number just adds friction. */}
              {form.subject === "Order Enquiry" && (
                <FormField
                  label="Order Number (optional)"
                  name="orderId"
                  value={form.orderId}
                  onChange={handleChange}
                  placeholder="e.g. A1B2C3D4"
                />
              )}

              <div>
                <label
                  htmlFor="message"
                  className="block text-[12px] tracking-[0.1em] uppercase text-ink/50 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what you need — the more detail, the better we can help."
                  className={`w-full border bg-white px-4 py-3 text-sm rounded-sm focus:outline-none transition-colors resize-y
                    ${errors.message
                      ? "border-red-400 focus:border-red-500"
                      : "border-cream-dim focus:border-gold-2"}`}
                />
                {errors.message && (
                  <p className="text-red-500 text-[12px] mt-1.5">{errors.message}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-dark w-full sm:w-auto gap-2"
                >
                  <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
                  {submitting ? "Opening WhatsApp..." : "Send via WhatsApp"}
                </button>
                <p className="text-[12px] text-ink/45 leading-relaxed">
                  Your details go straight to our team. We never share them.
                </p>
              </div>
            </form>
          </div>

          {/* ---------- Side column ---------- */}
          <div className="space-y-6">
            {/* Visit us */}
            <div className="bg-espresso text-ivory p-7 sm:p-9">
              <HiOutlineMapPin className="w-6 h-6 text-gold-2 mb-4" />
              <h3 className="font-display text-xl text-ivory mb-3">Visit Us In Person</h3>
              <p className="text-cream/60 text-[13.5px] leading-relaxed mb-6">
                Well's Merry is stocked at partner outlets across Pakistan. Find
                the one nearest you, along with its address and opening hours.
              </p>
              <Link
                to="/outlets"
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase font-semibold text-gold-3 hover:text-ivory transition-colors"
              >
                See All Outlets &rarr;
              </Link>
            </div>

            {/* Quick links */}
            <div className="space-y-3">
              {QUICK_LINKS.map(({ icon: Icon, title, text, to, cta }) => (
                <Link
                  key={title}
                  to={to}
                  className="group flex items-start gap-4 bg-white border border-cream-dim p-5 hover:border-gold-2 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gold-1 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-ink mb-0.5">{title}</p>
                    <p className="text-[12.5px] text-ink/55 leading-relaxed">{text}</p>
                    <span className="inline-block mt-2 text-[11.5px] tracking-[0.1em] uppercase font-semibold text-gold-1 group-hover:text-ink transition-colors">
                      {cta} &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- FAQ ---------- */}
        <div className="mt-16 sm:mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="eyebrow mb-3">Before You Write</span>
            <h2 className="font-display text-2xl sm:text-3xl">Frequently Asked</h2>
            <p className="text-[14px] text-ink/55 mt-3">
              The five questions we get most often — answered properly.
            </p>
          </div>

          <div className="border-t border-cream-dim">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={faq.q} className="border-b border-cream-dim">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                  >
                    <span className="text-[15px] font-medium text-ink group-hover:text-gold-1 transition-colors">
                      {faq.q}
                    </span>
                    <HiOutlineChevronDown
                      className={`w-4 h-4 shrink-0 mt-1 text-ink/40 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-[14px] text-ink/60 leading-[1.75] pb-6 pr-8">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-center text-[13.5px] text-ink/50 mt-8">
            Still stuck?{" "}
            <a
              href={buildWhatsAppLink("Hi Well's Merry! I have a question that isn't in your FAQ.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-1 hover:text-ink font-semibold transition-colors"
            >
              Message us on WhatsApp
            </a>{" "}
            and we'll sort it out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
