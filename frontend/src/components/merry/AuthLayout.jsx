import { Link } from "react-router-dom";
import { LeafIcon } from "./icons.jsx";
import authVisual from "../../assets/merry/auth-visual.jpg";

/* =====================================================================
   AuthLayout — the full-screen 50/50 split shell for every auth route
   (/login, /register, /verify-otp, /forgot-password).

   ┌───────────────────────────┬───────────────────────────┐
   │ LEFT  w-1/2 (lg+ only)    │ RIGHT  w-1/2 (w-full sm)  │
   │ edge-to-edge lifestyle    │ cream canvas, form is     │
   │ photo + heavy forest      │ centred both axes         │
   │ overlay + brand logo      │                           │
   └───────────────────────────┴───────────────────────────┘

   The visual panel is `position: fixed` on large screens so a tall form
   (Register) scrolls on the right without dragging the photo with it —
   the image always stays edge-to-edge, never letterboxed.

   Props
     eyebrow   — small clay caps line above the heading
     title     — the h1 (chunky slab)
     subtitle  — supporting copy under the title
     children  — the form itself
     footer    — node rendered under the form (links, guest CTA…)
     image     — override the left-hand photograph
     imageAlt  — alt text for that photograph
     quote     — { text, author } pull-quote stamped over the visual
     compact   — tightens the right column's max width (OTP screen)
   ===================================================================== */

const DEFAULT_QUOTE = {
  text: "Eight cold-pressed oils. One honest bottle. Zero shortcuts.",
  author: "The Well's Merry pledge",
};

const AuthLayout = ({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  image = authVisual,
  imageAlt = "Well's Merry organic hair oil ritual",
  quote = DEFAULT_QUOTE,
  compact = false,
}) => (
  <div className="theme-merry min-h-screen bg-merry-cream text-merry-forest antialiased lg:flex">
    {/* ── LEFT · VISUAL ───────────────────────────────────────────────
        Hidden below lg. Fixed so the photo stays edge-to-edge while a
        long form scrolls in the right column. */}
    <aside className="relative hidden w-1/2 overflow-hidden bg-merry-forest lg:fixed lg:inset-y-0 lg:left-0 lg:block">
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable="false"
      />

      {/* Heavy overlay — the brand wash that makes the type readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-merry-forest/75 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-merry-forest via-merry-forest/35 to-merry-forest/70"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
        {/* Brand logo block */}
        <Link
          to="/"
          className="flex w-fit items-center gap-3 text-merry-cream"
          aria-label="Well's Merry — home"
        >
          <span className="grid h-12 w-12 place-items-center border-4 border-merry-cream bg-merry-clay text-merry-cream shadow-hard-merry-cream">
            <LeafIcon className="h-6 w-6" />
          </span>
          <span className="leading-none">
            <span className="block font-slab text-2xl uppercase tracking-tight">
              Well&rsquo;s Merry
            </span>
            <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-widest2 text-merry-clay">
              Organic hair care
            </span>
          </span>
        </Link>

        {/* Pull-quote + trust stamps */}
        <div className="max-w-lg">
          <p className="font-slab text-4xl uppercase leading-[0.98] text-merry-cream xl:text-5xl">
            {quote.text}
          </p>
          <p className="mt-5 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest2 text-merry-sage">
            <LeafIcon className="h-4 w-4 text-merry-clay" />
            {quote.author}
          </p>

          <div className="mt-9 flex flex-wrap gap-2">
            {["100% Organic", "Cold-Pressed", "Cash on Delivery"].map((tag) => (
              <span
                key={tag}
                className="border-2 border-merry-cream/30 px-3 py-1.5 font-slab text-[10px] uppercase tracking-widest2 text-merry-cream/85"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>

    {/* ── RIGHT · FUNCTIONAL ──────────────────────────────────────── */}
    <main className="flex min-h-screen w-full flex-col bg-merry-cream lg:ml-[50%] lg:w-1/2">
      {/* Mobile-only brand bar — the visual panel is hidden down here */}
      <div className="border-b-4 border-merry-forest bg-merry-cream px-6 py-4 lg:hidden">
        <Link to="/" className="flex w-fit items-center gap-3" aria-label="Well's Merry — home">
          <span className="grid h-10 w-10 place-items-center border-4 border-merry-forest bg-merry-clay text-merry-cream shadow-hard-merry-sm">
            <LeafIcon className="h-5 w-5" />
          </span>
          <span className="font-slab text-lg uppercase tracking-tight">Well&rsquo;s Merry</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className={`w-full ${compact ? "max-w-sm" : "max-w-md"}`}>
          {eyebrow && (
            <p className="flex items-center gap-2 font-slab text-[11px] uppercase tracking-widest2 text-merry-clay">
              <LeafIcon className="h-3.5 w-3.5" />
              {eyebrow}
            </p>
          )}

          <h1 className="mt-4 text-4xl uppercase leading-[0.95] sm:text-5xl">{title}</h1>

          {subtitle && (
            <p className="mt-4 text-sm font-medium leading-relaxed text-merry-forest/70 sm:text-base">
              {subtitle}
            </p>
          )}

          <div className="mt-9">{children}</div>

          {footer && <div className="mt-8">{footer}</div>}
        </div>
      </div>

      {/* Bottom rule — grounds the column so the form doesn't float */}
      <div className="border-t-4 border-merry-forest bg-merry-oat px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest2 text-merry-forest/55 sm:px-10">
        &copy; {new Date().getFullYear()} Well&rsquo;s Merry · Small-batch, cold-pressed, delivered
      </div>
    </main>
  </div>
);

export default AuthLayout;
