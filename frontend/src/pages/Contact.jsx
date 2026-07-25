import { useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineClock,
} from "react-icons/hi2";
import { siteConfig, buildWhatsAppLink } from "../config/siteConfig.js";
import FormField from "../components/FormField.jsx";

const CONTACT_ITEMS = [
  {
    icon: HiOutlineChatBubbleLeftRight,
    label: "WhatsApp",
    value: siteConfig.whatsappDisplay,
    href: buildWhatsAppLink("Hi Well's Merry! I have a question."),
    external: true,
  },
  {
    icon: HiOutlinePhone,
    label: "Call Us",
    value: siteConfig.phoneDisplay,
    href: `tel:${siteConfig.phoneNumber}`,
  },
  {
    icon: HiOutlineEnvelope,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: HiOutlineClock,
    label: "Response Time",
    value: "Within 24 hours, 7 days a week",
  },
];

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    if (!form.message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // No backend endpoint for a contact form exists yet — this intentionally
  // opens a pre-filled WhatsApp chat with the submitted details instead of
  // silently pretending to "send" something that goes nowhere. This is a
  // deliberate, honest design choice for right now, not a placeholder bug:
  // it actually reaches you (via WhatsApp) using infrastructure we've
  // already built, rather than requiring a new backend route + email
  // relay just for a contact form. If you'd rather this go to a proper
  // ticketing inbox later, that's a clean swap of this one function.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const message = [
      `Hi Well's Merry! I have a message from the Contact form:`,
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.subject ? `Subject: ${form.subject}` : "",
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppLink(message), "_blank");
    toast.success("Opening WhatsApp to send your message...");
    setForm(EMPTY_FORM);
    setSubmitting(false);
  };

  return (
    <div>
      <div className="bg-ink text-ivory py-16 sm:py-20 text-center">
        <span className="eyebrow mb-3">Get In Touch</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">Contact Us</h1>
        <p className="text-cream/60 max-w-lg mx-auto mt-4 px-6">
          Questions about a product, an order, or becoming a stockist? We'd
          love to hear from you.
        </p>
      </div>

      <div className="container-content py-16 sm:py-20">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16">
          {/* Contact info card */}
          <div className="bg-espresso text-ivory p-8 sm:p-10 rounded-sm h-fit">
            <h3 className="font-display text-2xl mb-2">Let's Talk</h3>
            <p className="text-cream/60 text-sm mb-9 leading-relaxed">
              Reach out through whichever way is easiest for you — we
              typically respond fastest on WhatsApp.
            </p>

            <ul className="space-y-6">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label} className="flex items-start gap-4">
                  <Icon className="w-5 h-5 text-gold-2 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-[0.1em] uppercase text-cream/45 mb-1">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="text-[14.5px] text-ivory hover:text-gold-3 transition-colors break-all"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[14.5px] text-ivory">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField label="Your Name" name="name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
                <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
              </div>

              <FormField label="Subject (optional)" name="subject" value={form.subject} onChange={handleChange} />

              <div>
                <label htmlFor="message" className="block text-[12px] tracking-[0.1em] uppercase text-ink/50 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className={`w-full border bg-white px-4 py-3 text-sm rounded-sm focus:outline-none transition-colors resize-y
                    ${errors.message ? "border-red-400 focus:border-red-500" : "border-cream-dim focus:border-gold-2"}`}
                />
                {errors.message && <p className="text-red-500 text-[12px] mt-1.5">{errors.message}</p>}
              </div>

              <button type="submit" disabled={submitting} className="btn btn-dark w-full sm:w-auto">
                {submitting ? "Opening WhatsApp..." : "Send via WhatsApp"}
              </button>
              <p className="text-[12px] text-ink/45">
                This opens WhatsApp with your message pre-filled, so we can
                respond to you directly and quickly.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
