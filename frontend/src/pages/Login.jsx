import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import AuthLayout from "../components/merry/AuthLayout.jsx";
import {
  AuthField,
  AuthSubmit,
  AuthAlert,
  AuthDivider,
  AuthGhostLink,
  AuthSwitch,
} from "../components/merry/AuthForm.jsx";

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

  const suffix = redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : "";

  return (
    <AuthLayout
      eyebrow="Members' entrance"
      title={
        <>
          Welcome
          <br />
          <span className="text-merry-clay">back.</span>
        </>
      }
      subtitle="Log in to track orders, reorder your ritual and keep your addresses on file."
      quote={{
        text: "Your hair remembers what you feed it.",
        author: "Well's Merry · since 2019",
      }}
      footer={
        <div className="space-y-8">
          <AuthSwitch
            prompt="Don't have an account?"
            to={`/register${suffix}`}
            cta="Create one"
          />
          <AuthDivider label="or continue as guest" />
          <AuthGhostLink to="/shop">Browse without an account</AuthGhostLink>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthAlert>{errors.form}</AuthAlert>

        <AuthField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          placeholder="you@email.com"
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          placeholder="••••••••"
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="font-slab text-[11px] uppercase tracking-widest2 text-merry-forest/60 underline decoration-2 underline-offset-4 hover:text-merry-clay"
          >
            Forgot password?
          </Link>
        </div>

        <AuthSubmit loading={submitting} loadingLabel="Logging in…">
          Log in
        </AuthSubmit>
      </form>
    </AuthLayout>
  );
};

export default Login;
