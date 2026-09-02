import { Link } from "react-router-dom";
import {
  HiOutlineTruck,
  HiOutlineArrowPathRoundedSquare,
  HiOutlineBanknotes,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineEnvelope,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { siteConfig, buildWhatsAppLink } from "../config/siteConfig.js";
import Accordion from "../components/Accordion.jsx";

/**
 * Shipping & Returns policy.
 *
 * IMPORTANT — these are the actual business commitments customers will hold
 * us to, so they live in one object at the top rather than being scattered
 * through the copy below. Adjust here and the whole page follows.
 *
 * `freeShippingThreshold` matches the figure already promised in the header
 * announcement bar. The rest are sensible starting values — confirm them
 * against real courier terms before launch.
 */
const POLICY = {
  freeShippingThreshold: 3000,
  flatShippingRate: 200,
  dispatchDays: "1–2 business days",
  majorCityDelivery: "2–3 business days",
  otherAreaDelivery: "3–5 business days",
  returnWindowDays: 7,
  refundProcessingDays: "5–7 business days",
};

const money = (n) => `Rs. ${n.toLocaleString()}`;

const HIGHLIGHTS = [
  {
    icon: HiOutlineTruck,
    title: "Free Over " + money(POLICY.freeShippingThreshold),
    desc: `Orders below that are charged a flat ${money(POLICY.flatShippingRate)} anywhere in Pakistan.`,
  },
  {
    icon: HiOutlineBanknotes,
    title: "Cash on Delivery",
    desc: "Pay the courier when your parcel arrives. Available nationwide.",
  },
  {
    icon: HiOutlineClock,
    title: "Dispatched Fast",
    desc: `Orders leave us within ${POLICY.dispatchDays} of being confirmed.`,
  },
  {
    icon: HiOutlineArrowPathRoundedSquare,
    title: `${POLICY.returnWindowDays}-Day Returns`,
    desc: "Sealed and unused products can be returned for a refund or exchange.",
  },
];

const Shipping = () => {
  const whatsappHref = buildWhatsAppLink(
    "Hi Well's Merry! I have a question about shipping / returns for my order."
  );

  return (
    <div className="bg-merry-cream">
      {/* Banner — forest green band, matching the global Merry shell.
          (The legacy `.page-banner` black bar was part of the old theme.) */}
      <div className="bg-merry-forest text-merry-cream text-center py-14 sm:py-20 border-b-4 border-merry-forest">
        <span className="eyebrow mb-3 text-merry-clay">Customer Care</span>
        <h1 className="font-slab text-3xl sm:text-4xl lg:text-5xl uppercase text-merry-cream">
          Shipping &amp; Returns
        </h1>
        <p className="text-merry-sage max-w-xl mx-auto mt-4 px-6 leading-relaxed">
          How your order reaches you, what it costs, and what happens if
          something isn't right.
        </p>
      </div>

      <div className="container-content py-14 sm:py-20 max-w-3xl mx-auto">
        {/* At-a-glance highlights */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="border-2 border-merry-forest bg-merry-oat p-5 flex gap-4"
            >
              <span className="w-10 h-10 shrink-0 rounded-full border-2 border-merry-clay flex items-center justify-center text-merry-clay">
                <Icon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-[14.5px] mb-1">{title}</h3>
                <p className="text-[13px] text-ink/55 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery timeframes */}
        <section className="mb-14">
          <h2 className="font-display text-2xl sm:text-3xl mb-2">Delivery Times</h2>
          <p className="text-[14px] text-ink/55 leading-relaxed mb-6">
            Timeframes start once your order is confirmed, and count business
            days — Sundays and public holidays aren't included.
          </p>

          <div className="border border-cream-dim bg-white rounded-sm divide-y divide-cream-dim">
            {[
              {
                label: "Karachi, Lahore, Islamabad & Rawalpindi",
                value: POLICY.majorCityDelivery,
              },
              { label: "Other cities & towns", value: POLICY.otherAreaDelivery },
              { label: "Dispatch from our facility", value: POLICY.dispatchDays },
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-4"
              >
                <span className="text-[13.5px] text-ink/70 flex items-center gap-2">
                  <HiOutlineMapPin className="w-4 h-4 text-merry-clay shrink-0" />
                  {row.label}
                </span>
                <span className="text-[13.5px] font-semibold">{row.value}</span>
              </div>
            ))}
          </div>

          <p className="text-[12.5px] text-ink/45 mt-3 leading-relaxed">
            Remote areas can take a little longer depending on courier coverage.
            If your parcel seems delayed, message us and we'll chase it up.
          </p>
        </section>

        {/* Shipping charges */}
        <section className="mb-14">
          <h2 className="font-display text-2xl sm:text-3xl mb-2">Shipping Charges</h2>
          <p className="text-[14px] text-ink/55 leading-relaxed mb-6">
            Calculated at checkout before you confirm — there's nothing added
            afterwards.
          </p>

          <div className="border border-cream-dim bg-white rounded-sm divide-y divide-cream-dim">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[13.5px] text-ink/70">
                Orders {money(POLICY.freeShippingThreshold)} and above
              </span>
              <span className="text-[13.5px] font-semibold text-moss">Free</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[13.5px] text-ink/70">
                Orders below {money(POLICY.freeShippingThreshold)}
              </span>
              <span className="text-[13.5px] font-semibold">
                {money(POLICY.flatShippingRate)}
              </span>
            </div>
          </div>
        </section>

        {/* Returns */}
        <section className="mb-14">
          <h2 className="font-display text-2xl sm:text-3xl mb-2">Returns &amp; Refunds</h2>
          <p className="text-[14px] text-ink/55 leading-relaxed mb-6">
            We want you to be happy with what arrives. Because these are
            personal care products, there are a few limits on what can come
            back to us — all set out below.
          </p>

          <Accordion
            items={[
              {
                title: `What can be returned (within ${POLICY.returnWindowDays} days)`,
                content: (
                  <ul className="list-disc pl-5 space-y-2 text-[13.5px] text-ink/70 leading-relaxed">
                    <li>Unopened products with the seal intact.</li>
                    <li>Items that arrived damaged, leaking, or broken.</li>
                    <li>
                      Wrong item or wrong size delivered — we'll cover return
                      shipping on this one.
                    </li>
                  </ul>
                ),
              },
              {
                title: "What can't be returned",
                content: (
                  <ul className="list-disc pl-5 space-y-2 text-[13.5px] text-ink/70 leading-relaxed">
                    <li>
                      Opened or used products, for hygiene and safety reasons.
                    </li>
                    <li>
                      Items reported more than {POLICY.returnWindowDays} days
                      after delivery.
                    </li>
                    <li>Products without proof of purchase or an order number.</li>
                  </ul>
                ),
              },
              {
                title: "How to start a return",
                content: (
                  <ol className="list-decimal pl-5 space-y-2 text-[13.5px] text-ink/70 leading-relaxed">
                    <li>
                      Message us on WhatsApp or email within{" "}
                      {POLICY.returnWindowDays} days of delivery, with your
                      order number.
                    </li>
                    <li>
                      Send a photo of the product and packaging — this usually
                      settles damage claims immediately.
                    </li>
                    <li>
                      We'll confirm whether to send it back and share the
                      return address.
                    </li>
                    <li>
                      Once it reaches us and passes a quick check, your refund
                      or exchange is processed.
                    </li>
                  </ol>
                ),
              },
              {
                title: "Refund timing",
                content: (
                  <p className="text-[13.5px] text-ink/70 leading-relaxed">
                    Approved refunds are issued within{" "}
                    {POLICY.refundProcessingDays} of us receiving the return.
                    Cash on Delivery orders are refunded by bank or mobile
                    wallet transfer, so we'll ask for those details when the
                    return is approved.
                  </p>
                ),
              },
              {
                title: "Damaged or incorrect deliveries",
                content: (
                  <p className="text-[13.5px] text-ink/70 leading-relaxed">
                    Tell us within 48 hours of delivery and keep the original
                    packaging. Send a photo and we'll arrange a replacement or
                    a full refund, including any shipping you paid. You won't
                    be charged to return something that was our error.
                  </p>
                ),
              },
              {
                title: "Cancelling an order",
                content: (
                  <p className="text-[13.5px] text-ink/70 leading-relaxed">
                    Orders can be cancelled free of charge any time before
                    they're dispatched. Once the courier has collected the
                    parcel, treat it as a return instead. You can check your
                    current status on the{" "}
                    <Link to="/account/orders" className="underline hover:text-ink">
                      Track Your Order
                    </Link>{" "}
                    page.
                  </p>
                ),
              },
            ]}
          />
        </section>

        {/* Help / contact */}
        <section className="bg-merry-forest text-merry-cream border-4 border-merry-forest p-8 sm:p-12 text-center">
          <span className="eyebrow mb-3 text-merry-clay">Still Have A Question?</span>
          <h3 className="font-slab text-2xl sm:text-3xl uppercase text-merry-cream mb-3">
            Talk To A Human
          </h3>
          <p className="text-merry-sage max-w-md mx-auto mb-8 text-[14px] leading-relaxed">
            Have your order number handy and we'll get straight to it. WhatsApp
            is usually the fastest way to reach us.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white hover:bg-[#1fb959] font-bold uppercase text-[12px] tracking-wider rounded-sm py-3.5 flex items-center justify-center gap-2 transition-colors"
            >
              <FaWhatsapp className="w-4 h-4" />
              {siteConfig.whatsappDisplay}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex-1 border-2 border-merry-cream/40 text-merry-cream hover:bg-merry-cream hover:text-merry-forest font-bold uppercase text-[12px] tracking-wider rounded-sm py-3.5 flex items-center justify-center gap-2 transition-colors"
            >
              <HiOutlineEnvelope className="w-4 h-4" />
              Email Us
            </a>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-6 text-[12px] tracking-[0.14em] uppercase font-semibold text-merry-clay hover:text-merry-cream transition-colors"
          >
            <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
            Other ways to contact us
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Shipping;
