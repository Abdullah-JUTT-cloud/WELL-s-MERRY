import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.jpg";

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
      <div className="container-content py-24 text-center max-w-md mx-auto">
        <h1 className="font-display text-3xl mb-3">Nothing to Verify</h1>
        <p className="text-ink/55 mb-8">
          This page needs to be reached from registration or login. Please sign up first.
        </p>
        <Link to="/register" className="btn btn-dark">Create an Account</Link>
      </div>
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
    <div className="container-content py-16 sm:py-24 max-w-md mx-auto text-center">
      <img src={logo} alt="Well's Merry" className="h-14 w-auto mx-auto mb-6 rounded-md" />
      <h1 className="font-display text-3xl mb-2">Verify Your Email</h1>
      <p className="text-ink/55 text-sm mb-1">We sent a 6-digit code to</p>
      <p className="text-ink font-medium text-sm mb-10">{email || "your email address"}</p>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2.5 sm:gap-3 mb-8" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-display border border-cream-dim rounded-sm
                         focus:outline-none focus:border-gold-2 bg-white"
            />
          ))}
        </div>

        <button type="submit" disabled={submitting} className="btn btn-dark w-full">
          {submitting ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="mt-8 text-[13.5px] text-ink/55">
        {cooldown > 0 ? (
          <span>Resend code in {cooldown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-gold-1 hover:text-ink font-medium disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        )}
      </div>

      <p className="text-[12px] text-ink/40 mt-10">
        Code expires in 15 minutes. Check your spam folder if it doesn't arrive shortly.
      </p>
    </div>
  );
};

export default VerifyOtp;