import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/merry/AuthLayout.jsx";
import {
  AuthField,
  AuthSubmit,
  AuthAlert,
  AuthSwitch,
} from "../components/merry/AuthForm.jsx";

const ForgotPassword = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  // step 1: enter email and request a code
  // step 2: enter the code + new password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    setSubmitting(true);
    try {
      const data = await forgotPassword(email.trim());
      // Backend deliberately returns the same success message whether or
      // not the email exists (prevents account enumeration — see
      // authController.js). We move to step 2 regardless; if the email
      // wasn't real, entering any code there will just fail cleanly.
      toast.success(data.message);
      setUserId(data.userId || null);
      setStep(2);
    } catch (err) {
      setErrors({ email: err.response?.data?.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const next = {};
    if (!otp.trim() || otp.trim().length !== 6) next.otp = "Enter the 6-digit code";
    if (!newPassword || newPassword.length < 6) next.newPassword = "Password must be at least 6 characters";
    if (confirmPassword !== newPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!userId) {
      // This only happens if the email genuinely wasn't registered —
      // the backend never sent a real userId back in that case.
      setErrors({ form: "We couldn't find an account for that email." });
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ userId, otp: otp.trim(), newPassword });
      toast.success("Password reset! Please log in with your new password.");
      navigate("/login", { replace: true });
    } catch (err) {
      setErrors({ form: err.response?.data?.message || "Couldn't reset password. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={step === 1 ? "Password recovery" : "Step 2 of 2"}
      title={
        step === 1 ? (
          <>
            Forgot
            <br />
            your <span className="text-merry-clay">password?</span>
          </>
        ) : (
          <>
            Reset
            <br />
            your <span className="text-merry-clay">password.</span>
          </>
        )
      }
      subtitle={
        step === 1
          ? "Enter the email on your account and we'll send a 6-digit reset code."
          : "Enter the code we just emailed you, then choose a new password."
      }
      quote={{
        text: "Roots run deep. Passwords, less so.",
        author: "We'll get you back in",
      }}
      footer={<AuthSwitch prompt="Remembered your password?" to="/login" cta="Log in" />}
    >
      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="space-y-6">
          <AuthField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({});
            }}
            error={errors.email}
            autoComplete="email"
            placeholder="you@email.com"
          />
          <AuthSubmit loading={submitting} loadingLabel="Sending…">
            Send reset code
          </AuthSubmit>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <AuthAlert>{errors.form}</AuthAlert>

          <AuthField
            label="6-digit code"
            name="otp"
            inputMode="numeric"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
              if (errors.otp) setErrors((er) => ({ ...er, otp: undefined }));
            }}
            error={errors.otp}
            placeholder="000000"
          />
          <AuthField
            label="New password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors((er) => ({ ...er, newPassword: undefined }));
            }}
            error={errors.newPassword}
            autoComplete="new-password"
            placeholder="Min. 6 characters"
          />
          <AuthField
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((er) => ({ ...er, confirmPassword: undefined }));
            }}
            error={errors.confirmPassword}
            autoComplete="new-password"
            placeholder="Repeat it"
          />

          <AuthSubmit loading={submitting} loadingLabel="Resetting…">
            Reset password
          </AuthSubmit>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-center font-slab text-[11px] uppercase tracking-widest2 text-merry-forest/55 underline decoration-2 underline-offset-4 hover:text-merry-clay"
          >
            &larr; Use a different email
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
