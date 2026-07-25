import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";
import logo from "../assets/nav-up.png";

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

  return (
    <div className="container-content py-16 sm:py-24 max-w-md mx-auto">
      <div className="text-center mb-10">
        <img src={logo} alt="Well's Merry" className="h-14 w-auto mx-auto mb-6 rounded-md" />
        <h1 className="font-display text-3xl mb-2">Create Your Account</h1>
        <p className="text-ink/55 text-sm">Join Well's Merry for faster checkout and order tracking</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-sm">
            {errors.form}
          </div>
        )}

        <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Phone Number (optional)" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="03XX XXXXXXX" autoComplete="tel" />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
        <FormField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />

        <div className="pt-2">
          <p className="text-[12px] tracking-[0.08em] uppercase text-ink/50 mb-4 font-medium">Home / Delivery Address</p>
          <div className="space-y-4">
            <FormField label="Street Address*" name="street" value={form.street} onChange={handleChange} error={errors.street} autoComplete="street-address" placeholder="House #, Street, Area" />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="City*" name="city" value={form.city} onChange={handleChange} error={errors.city} autoComplete="address-level2" />
              <FormField label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} autoComplete="postal-code" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-dark w-full">
          {submitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-[13.5px] text-ink/55 mt-8">
        Already have an account?{" "}
        <Link to={`/login${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="text-gold-1 hover:text-ink font-medium">
          Log in
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

export default Register;
