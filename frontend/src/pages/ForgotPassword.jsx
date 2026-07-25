import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";
import logo from "../assets/nav-up.png";

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
    <div className="container-content py-16 sm:py-24 max-w-md mx-auto">
      <div className="text-center mb-10">
        <img src={logo} alt="Well's Merry" className="h-14 w-auto mx-auto mb-6 rounded-md" />
        <h1 className="font-display text-3xl mb-2">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h1>
        <p className="text-ink/55 text-sm">
          {step === 1
            ? "Enter your email and we'll send you a reset code"
            : "Enter the code we sent you and choose a new password"}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="space-y-5">
          <FormField
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
          />
          <button type="submit" disabled={submitting} className="btn btn-dark w-full">
            {submitting ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-sm">
              {errors.form}
            </div>
          )}

          <FormField
            label="6-Digit Code"
            name="otp"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
              if (errors.otp) setErrors((er) => ({ ...er, otp: undefined }));
            }}
            error={errors.otp}
            placeholder="000000"
          />
          <FormField
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors((er) => ({ ...er, newPassword: undefined }));
            }}
            error={errors.newPassword}
            autoComplete="new-password"
          />
          <FormField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((er) => ({ ...er, confirmPassword: undefined }));
            }}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <button type="submit" disabled={submitting} className="btn btn-dark w-full">
            {submitting ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-[12.5px] text-ink/50 hover:text-ink w-full text-center"
          >
            &larr; Use a different email
          </button>
        </form>
      )}

      <p className="text-center text-[13.5px] text-ink/55 mt-8">
        Remembered your password?{" "}
        <Link to="/login" className="text-gold-1 hover:text-ink font-medium">Log in</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;