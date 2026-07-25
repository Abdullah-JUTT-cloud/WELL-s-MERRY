import { Link } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineHeart,
  HiOutlineGlobeAsiaAustralia,
} from "react-icons/hi2";
import { useReveal } from "../hooks/useReveal.js";
import storyImg from "../assets/oil-box-bottle-standing.jpg";
import bannerImg from "../assets/oil-flatlay-diagonal.jpg";

const VALUES = [
  {
    icon: HiOutlineSparkles,
    title: "Rooted in Nature",
    desc: "Every formula starts with botanical oils and extracts — never shortcuts, never fillers.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Chemical Free, Always",
    desc: "100% organic, safe for every hair type and every member of the family, including children.",
  },
  {
    icon: HiOutlineHeart,
    title: "Made With Care",
    desc: "Small-batch formulation means every bottle gets real attention before it reaches you.",
  },
  {
    icon: HiOutlineGlobeAsiaAustralia,
    title: "Growing With You",
    desc: "We're building slowly and honestly — one product, one customer, one outlet at a time.",
  },
];

const About = () => {
  const storyRef = useReveal();
  const valuesRef = useReveal();

  return (
    <div>
      {/* Page hero */}
      <div className="bg-ink text-ivory py-16 sm:py-20 text-center">
        <span className="eyebrow mb-3">Our Story</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl">About Well's Merry</h1>
        <p className="text-cream/60 max-w-lg mx-auto mt-4 px-6">
          A name built from wellness and joy — because good hair care should
          feel like both.
        </p>
      </div>

      {/* Story */}
      <section className="py-16 sm:py-24">
        <div className="container-content grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-sm overflow-hidden order-2 lg:order-1">
            <img src={storyImg} alt="Well's Merry Hair Care Oil" className="w-full object-cover" />
          </div>

          <div ref={storyRef} className="reveal order-1 lg:order-2">
            <span className="eyebrow mb-4">Why We Started</span>
            <h2 className="font-display text-3xl sm:text-4xl mb-6">
              Wellness Shouldn't Come With a Trade-Off
            </h2>
            <div className="space-y-4 text-ink/65 leading-relaxed max-w-lg">
              <p>
                Well's Merry began with a simple frustration: most hair care
                promises results but quietly relies on harsh chemicals to get
                there. We wanted something different — care that actually
                nourishes, not just coats.
              </p>
              <p>
                Our first product, the Hair Care Oil, is a deliberate blend of
                traditional botanical oils — rice bran, sesame, almond,
                coconut, walnut, olive, jojoba, argan, and more — brought
                together the way they would have been generations ago, without
                cutting corners for the sake of speed or cost.
              </p>
              <p>
                The name itself is our philosophy in two words: <em className="font-display italic text-ink">wellness</em> and{" "}
                <em className="font-display italic text-ink">merriness</em> —
                because taking care of yourself should feel good, not like a
                chore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream py-16 sm:py-24">
        <div className="container-content">
          <div ref={valuesRef} className="reveal text-center max-w-xl mx-auto mb-14">
            <span className="eyebrow mb-3">What We Stand For</span>
            <h2 className="font-display text-3xl sm:text-4xl">Our Values</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-ivory border border-cream-dim p-7 text-center">
                <div className="w-12 h-12 mx-auto mb-5 rounded-full border border-gold-1 flex items-center justify-center text-gold-1">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-medium text-[15px] mb-2">{title}</h4>
                <p className="text-[13.5px] text-ink/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote banner */}
      <section className="relative bg-ink text-ivory py-20 sm:py-24 overflow-hidden">
        <img
          src={bannerImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative container-content max-w-2xl mx-auto text-center">
          <p className="font-display italic text-2xl sm:text-3xl lg:text-4xl leading-snug text-ivory">
            "We're not trying to be the biggest brand on the shelf — just the
            one you actually trust to put on your family."
          </p>
          <p className="mt-6 text-[13px] tracking-[0.1em] uppercase text-gold-3">
            — Well's Merry
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 text-center">
        <div className="container-content">
          <h2 className="font-display text-2xl sm:text-3xl mb-3">Ready to Try It Yourself?</h2>
          <p className="text-ink/55 mb-8 max-w-md mx-auto">
            Start with our signature Hair Care Oil — the product this whole
            brand was built around.
          </p>
          <Link to="/shop" className="btn btn-dark">Shop Now</Link>
        </div>
      </section>
    </div>
  );
};

export default About;