import { Link } from "react-router-dom";
import { LeafIcon } from "./icons.jsx";

/* =====================================================================
   AuthForm — the brutalist form primitives shared by every auth route.

   Thick 4px forest borders, flat backgrounds, zero rounding, chunky
   uppercase slab buttons with a hard offset shadow that compresses on
   press. Import these instead of hand-rolling inputs per page so the
   four auth screens can never drift apart again.
   ===================================================================== */

/* Shared input skin — used by AuthField and the OTP digit boxes. */
export const authInputClass = (error) =>
  `w-full border-4 bg-merry-cream px-4 py-3.5 text-[15px] font-medium text-merry-forest
   placeholder-merry-forest/35 transition-colors duration-150 focus:outline-none
   focus:ring-4 focus:ring-merry-clay/30 ${
     error
       ? "border-red-700 focus:border-red-700 focus:ring-red-700/25"
       : "border-merry-forest focus:border-merry-clay"
   }`;

export const AuthField = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  hint,
  required,
  ...rest
}) => (
  <div>
    <label
      htmlFor={name}
      className="mb-2 flex items-baseline justify-between gap-3 font-slab text-[11px] uppercase tracking-widest2 text-merry-forest"
    >
      <span>{label}</span>
      {hint && (
        <span className="font-sans text-[10px] font-bold tracking-wider text-merry-forest/45">
          {hint}
        </span>
      )}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? `${name}-error` : undefined}
      className={authInputClass(error)}
      {...rest}
    />
    {error && (
      <p id={`${name}-error`} className="mt-2 text-[12px] font-bold text-red-700">
        {error}
      </p>
    )}
  </div>
);

/* Chunky primary CTA — clay block, forest border, hard shadow. */
export const AuthSubmit = ({ children, loading, loadingLabel = "Working…", ...rest }) => (
  <button
    type="submit"
    disabled={loading}
    className="pressable flex w-full items-center justify-center gap-3 border-4 border-merry-forest
               bg-merry-clay px-6 py-4 font-slab text-base uppercase tracking-wide text-merry-cream
               shadow-hard-merry disabled:cursor-not-allowed disabled:opacity-60
               disabled:hover:translate-x-0 disabled:hover:translate-y-0 sm:text-lg"
    {...rest}
  >
    {loading ? loadingLabel : children}
    {!loading && <LeafIcon className="h-5 w-5" />}
  </button>
);

/* Secondary / ghost CTA — cream block with the same weight. */
export const AuthGhostLink = ({ to, children, ...rest }) => (
  <Link
    to={to}
    className="pressable flex w-full items-center justify-center gap-2 border-4 border-merry-forest
               bg-merry-cream px-6 py-3.5 font-slab text-sm uppercase tracking-wide text-merry-forest
               shadow-hard-merry-sm hover:bg-merry-oat"
    {...rest}
  >
    {children}
  </Link>
);

/* Form-level error banner. */
export const AuthAlert = ({ children }) =>
  children ? (
    <div
      role="alert"
      className="border-4 border-red-700 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-800"
    >
      {children}
    </div>
  ) : null;

/* Labelled rule between the form and the guest escape hatch. */
export const AuthDivider = ({ label }) => (
  <div className="flex items-center gap-4">
    <span className="h-1 flex-1 bg-merry-forest/15" />
    <span className="font-slab text-[10px] uppercase tracking-widest2 text-merry-forest/45">
      {label}
    </span>
    <span className="h-1 flex-1 bg-merry-forest/15" />
  </div>
);

/* Inline "already have an account?" line. */
export const AuthSwitch = ({ prompt, to, cta }) => (
  <p className="text-center text-[13.5px] font-medium text-merry-forest/70">
    {prompt}{" "}
    <Link
      to={to}
      className="font-bold text-merry-clay underline decoration-4 underline-offset-4 hover:text-merry-forest"
    >
      {cta}
    </Link>
  </p>
);
