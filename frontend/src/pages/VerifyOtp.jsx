import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/merry/AuthLayout.jsx";
import { AuthSubmit, AuthGhostLink } from "../components/merry/AuthForm.jsx";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

const VerifyOtp = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // This page only makes sense arriving from Register (or a "resend" link)
  // with a userId already in hand — there's no legitimate way to land here
  // cold with nothing to verify.
  const { userId, email, redirect } = location.state || {};

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  if (!userId) {
    return (
      <AuthLayout
        compact
        eyebrow="Dead end"
        title={
          <>
            Nothing to
            <br />
            <span className="text-merry-clay">verify.</span>
          </>
        }
        subtitle="This screen needs to be reached from registration or login. Sign up first and we'll email you a fresh code."
      >
        <div className="space-y-4">
          <AuthGhostLink to="/register">Create an account</AuthGhostLink>
          <AuthGhostLink to="/login">Back to log in</AuthGhostLink>
        </div>
      </AuthLayout>
    );
  }

  const handleDigitChange = (index, value) => {
    // Only accept a single numeric character per box
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);

    if (clean && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Lets someone paste a full 6-digit code (e.g. copied from their email
  // client) directly into any box instead of forcing manual one-by-one entry
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const code = digits.join("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setSubmitting(true);
    try {
      await verifyOtp({ userId, otp: code });
      toast.success("Email verified! You can now log in.");
      navigate(`/login${redirect && redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`, {
        replace: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtp({ userId, purpose: "verify-email" });
      toast.success("A new code has been sent");
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="One last step"
      title={
        <>
          Verify
          <br />
          your <span className="text-merry-clay">email.</span>
        </>
      }
      subtitle={
        <>
          We sent a 6-digit code to{" "}
          <span className="font-bold text-merry-forest">{email || "your email address"}</span>.
          It expires in 15 minutes.
        </>
      }
      quote={{
        text: "Good things take an hour. Verification takes six digits.",
        author: "Well's Merry",
      }}
      footer={
        <p className="text-center text-[12px] font-medium leading-relaxed text-merry-forest/50">
          Nothing in your inbox? Check the spam folder — our emails are as
          unprocessed as the oil.{" "}
          <Link to="/contact" className="font-bold text-merry-clay underline decoration-2 underline-offset-4">
            Contact us
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <p className="mb-3 font-slab text-[11px] uppercase tracking-widest2 text-merry-forest">
            Verification code
          </p>
          <div className="flex gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-16 w-full min-w-0 border-4 border-merry-forest bg-merry-cream text-center
                           font-slab text-2xl text-merry-forest transition-colors duration-150
                           focus:border-merry-clay focus:outline-none focus:ring-4 focus:ring-merry-clay/30
                           sm:h-[4.5rem] sm:text-3xl"
              />
            ))}
          </div>
        </div>

        <AuthSubmit loading={submitting} loadingLabel="Verifying…">
          Verify email
        </AuthSubmit>

        <div className="border-4 border-merry-forest/15 bg-merry-oat px-5 py-4 text-center">
          {cooldown > 0 ? (
            <p className="text-[12px] font-bold uppercase tracking-widest2 text-merry-forest/55">
              Resend code in {cooldown}s
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-slab text-[12px] uppercase tracking-widest2 text-merry-clay underline decoration-4 underline-offset-4 hover:text-merry-forest disabled:opacity-50"
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtp;
