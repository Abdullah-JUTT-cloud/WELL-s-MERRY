import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";
import logo from "../assets/nav-up.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";

      // The backend returns a 403 specifically when the account exists
      // but hasn't verified its email yet — route the user to finish
      // that step instead of just showing a dead-end error message.
      if (err.response?.status === 403 && message.toLowerCase().includes("verify")) {
        toast.error("Please verify your email first");
        navigate("/verify-otp", { state: { email: form.email.trim() } });
        return;
      }

      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-content py-16 sm:py-24 max-w-md mx-auto">
      <div className="text-center mb-10">
        <img src={logo} alt="Well's Merry" className="h-14 w-auto mx-auto mb-6 rounded-md" />
        <h1 className="font-display text-3xl mb-2">Welcome Back</h1>
        <p className="text-ink/55 text-sm">Log in to your Well's Merry account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-sm">
            {errors.form}
          </div>
        )}

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-[12.5px] text-gold-1 hover:text-ink transition-colors">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-dark w-full">
          {submitting ? "Logging In..." : "Log In"}
        </button>
      </form>

      <p className="text-center text-[13.5px] text-ink/55 mt-8">
        Don't have an account?{" "}
        <Link to={`/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="text-gold-1 hover:text-ink font-medium">
          Create one
        </Link>
      </p>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-cream-dim" />
        <span className="text-[11px] tracking-[0.1em] uppercase text-ink/35">or continue as guest</span>
        <div className="flex-1 h-px bg-cream-dim" />
      </div>

      <Link to="/shop" className="btn btn-outline w-full">
        Browse Without an Account
      </Link>
    </div>
  );
};

export default Login;