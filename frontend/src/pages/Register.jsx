import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const EMPTY_FORM = {
  name: "", email: "", phone: "", password: "", confirmPassword: "",
  street: "", city: "", postalCode: "",
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email";
    if (form.phone && !/^[\d+\s-]{7,15}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match";
    if (!form.street.trim()) next.street = "Street address is required";
    if (!form.city.trim()) next.city = "City is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim() || undefined,
        },
      });

      toast.success(data.message || "Account created! Check your email for a code.");
      navigate("/verify-otp", {
        state: { userId: data.userId, email: form.email.trim(), redirect: redirectTo },
      });
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  };

  const suffix = redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : "";

  return (
    <AuthLayout
      eyebrow="Join the grove"
      title={
        <>
          Create
          <br />
          your <span className="text-merry-clay">account.</span>
        </>
      }
      subtitle="Faster checkout, live order tracking and first dibs on every new batch."
      quote={{
        text: "Small batches. Real ingredients. Delivered to your door.",
        author: "Cash on delivery, nationwide",
      }}
      footer={
        <div className="space-y-8">
          <AuthSwitch prompt="Already have an account?" to={`/login${suffix}`} cta="Log in" />
          <AuthDivider label="or continue as guest" />
          <AuthGhostLink to="/shop">Browse without an account</AuthGhostLink>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthAlert>{errors.form}</AuthAlert>

        <AuthField
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          placeholder="Your name"
        />
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
          label="Phone number"
          hint="Optional"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="03XX XXXXXXX"
          autoComplete="tel"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <AuthField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            placeholder="Min. 6 characters"
          />
          <AuthField
            label="Confirm"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            placeholder="Repeat it"
          />
        </div>

        {/* Delivery address — blocked off with a heavy rule so the form
            reads as two deliberate chunks rather than one long scroll. */}
        <div className="border-t-4 border-merry-forest/15 pt-6">
          <p className="mb-5 font-slab text-[11px] uppercase tracking-widest2 text-merry-clay">
            Home / delivery address
          </p>
          <div className="space-y-6">
            <AuthField
              label="Street address"
              name="street"
              value={form.street}
              onChange={handleChange}
              error={errors.street}
              autoComplete="street-address"
              placeholder="House #, street, area"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <AuthField
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
                autoComplete="address-level2"
                placeholder="Lahore"
              />
              <AuthField
                label="Postal code"
                hint="Optional"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                autoComplete="postal-code"
                placeholder="54000"
              />
            </div>
          </div>
        </div>

        <AuthSubmit loading={submitting} loadingLabel="Creating account…">
          Create account
        </AuthSubmit>
      </form>
    </AuthLayout>
  );
};

export default Register;
