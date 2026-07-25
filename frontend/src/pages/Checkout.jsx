import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiOutlineTruck,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCreditCard,
  HiOutlineLockClosed,
  HiOutlineCloudArrowUp,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createOrder } from "../api/orders.js";
import { buildWhatsAppLink } from "../config/siteConfig.js";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  postalCode: "",
  notes: "",
};

// Payment provider account details (where customer sends money)
const PROVIDER_ACCOUNTS = {
  easypaisa: {
    label: "EasyPaisa",
    accountTitle: "Muhammad Abdullah",
    accountNumber: "03014624644",
    color: "bg-green-50 border-green-200",
    accent: "text-green-700",
  },
  jazzcash: {
    label: "JazzCash",
    accountTitle: "Misbah Tabasum",
    accountNumber: "03214194045",
    color: "bg-red-50 border-red-200",
    accent: "text-red-700",
  },
  nayapay: {
    label: "NayaPay",
    accountTitle: "Muhammad Abdullah",
    accountNumber: "03214194045",
    nayaPayId: "abullahjutt@nayapay",
    iban: "PK53NAYA1234503214194045",
    color: "bg-purple-50 border-purple-200",
    accent: "text-purple-700",
  },
  raqami: {
    label: "Raqami Bank Transfer",
    accountTitle: "Muhammad Abdullah",
    accountNumber: "021017632079",
    iban: "PK20RQMI0000021017632079",
    bankName: "Raqami Islamic Digital Bank",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-700",
  },
};

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const homeAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || null;

  const [useHomeAddress, setUseHomeAddress] = useState(!!homeAddress);
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Online payment state
  const [onlineProvider, setOnlineProvider] = useState("");
  const [onlineSenderAccount, setOnlineSenderAccount] = useState("");
  const [onlineTransactionAmount, setOnlineTransactionAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  useEffect(() => {
    if (useHomeAddress && homeAddress) {
      setForm((f) => ({
        ...f,
        fullName: homeAddress.fullName || user?.name || f.fullName,
        phone: homeAddress.phone || user?.phone || f.phone,
        street: homeAddress.street || "",
        city: homeAddress.city || "",
        postalCode: homeAddress.postalCode || "",
      }));
    }
  }, [useHomeAddress, homeAddress, user]);

  const handleUseHomeToggle = (e) => {
    const checked = e.target.checked;
    setUseHomeAddress(checked);
    if (!checked) {
      setForm((f) => ({ ...f, street: "", city: "", postalCode: "" }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-content py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Nothing to Check Out</h1>
        <p className="text-ink/55 mb-8">Your cart is empty — add a product before checking out.</p>
        <Link to="/shop" className="btn btn-dark">Browse Products</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Receipt image must be under 5MB");
      return;
    }
    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
    if (errors.receipt) setErrors((er) => ({ ...er, receipt: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    else if (!/^[\d+\s-]{7,15}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    if (!isAuthenticated && !form.email.trim()) next.email = "Email is required for guest checkout";
    else if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email";
    if (!form.street.trim()) next.street = "Street address is required";
    if (!form.city.trim()) next.city = "City is required";

    // Online payment validations
    if (paymentMethod === "online") {
      if (!onlineProvider) next.onlineProvider = "Please select a payment provider";
      if (!onlineSenderAccount.trim() || onlineSenderAccount.trim().length < 7)
        next.onlineSenderAccount = "Enter your account/phone number (min 7 digits)";
      if (!onlineTransactionAmount || Number(onlineTransactionAmount) <= 0)
        next.onlineTransactionAmount = "Enter the amount you sent";
      if (!receiptFile) next.receipt = "Please upload a receipt screenshot";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildOrderItems = () =>
    items.map((i) => ({ product: i.productId, qty: i.qty }));

  const handleWhatsAppCheckout = () => {
    if (!validate()) {
      toast.error("Please complete the required fields first");
      return;
    }
    const lines = items.map(
      (i) => `${i.qty} x ${i.name} (${i.size}) - Rs.${(i.price * i.qty).toLocaleString()}`
    );
    const message = [
      `Hi Well's Merry! I'd like to order:`,
      "",
      ...lines,
      "",
      `Total: Rs.${subtotal.toLocaleString()}`,
      "",
      `Name: ${form.fullName}`,
      `Phone: ${form.phone}`,
      `Address: ${form.street}, ${form.city} ${form.postalCode}`.trim(),
      form.notes ? `Note: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppLink(message), "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === "whatsapp") {
      handleWhatsAppCheckout();
      return;
    }
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      let payload;

      if (paymentMethod === "online") {
        // Build FormData for multipart upload
        payload = new FormData();
        payload.append("orderItems", JSON.stringify(buildOrderItems()));
        payload.append(
          "shippingAddress",
          JSON.stringify({
            fullName: form.fullName,
            phone: form.phone,
            street: form.street,
            city: form.city,
            postalCode: form.postalCode,
          })
        );
        payload.append("paymentMethod", "online");
        payload.append("onlineProvider", onlineProvider);
        payload.append("onlineSenderAccount", onlineSenderAccount.trim());
        payload.append("onlineTransactionAmount", onlineTransactionAmount);
        payload.append("receipt", receiptFile);
        if (!isAuthenticated) payload.append("guestEmail", form.email);
        if (form.notes) payload.append("notes", form.notes);
      } else {
        // Plain JSON for COD
        payload = {
          orderItems: buildOrderItems(),
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            street: form.street,
            city: form.city,
            postalCode: form.postalCode,
          },
          paymentMethod: "cod",
          guestEmail: !isAuthenticated ? form.email : undefined,
          notes: form.notes,
        };
      }

      const order = await createOrder(payload);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order._id}`, { state: { order } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-content py-10 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl mb-2">Checkout</h1>
      {!isAuthenticated && (
        <p className="text-ink/50 text-sm mb-10">
          Checking out as guest.{" "}
          <Link to="/login?redirect=/checkout" className="text-gold-1 hover:text-ink underline underline-offset-2">
            Log in
          </Link>{" "}
          for faster checkout next time.
        </p>
      )}
      {isAuthenticated && <p className="text-ink/50 text-sm mb-10">Welcome back, {user.name}.</p>}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-start">
        {/* Form */}
        <div>
          <h3 className="text-[13px] tracking-[0.1em] uppercase font-medium mb-5">Shipping Details</h3>

          {isAuthenticated && homeAddress && (
            <label className="flex items-center gap-3 mb-6 cursor-pointer select-none bg-cream border border-cream-dim px-4 py-3 rounded-sm">
              <input
                type="checkbox"
                checked={useHomeAddress}
                onChange={handleUseHomeToggle}
                className="accent-gold-1 w-4 h-4 shrink-0"
              />
              <span className="text-[13.5px] text-ink/70">
                Delivery address is the same as my home address
                <span className="block text-[12px] text-ink/45 mt-0.5">
                  {homeAddress.street}, {homeAddress.city}{homeAddress.postalCode ? ` ${homeAddress.postalCode}` : ""}
                </span>
              </span>
            </label>
          )}

          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
            <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="03XX XXXXXXX" />
          </div>

          <div className="mb-5">
            <Field
              label={`Email${isAuthenticated ? " (optional)" : ""}`}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isAuthenticated}
            />
          </div>

          <div className="mb-5">
            <Field label="Street Address" name="street" value={form.street} onChange={handleChange} error={errors.street} disabled={useHomeAddress} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} disabled={useHomeAddress} />
            <Field label="Postal Code (optional)" name="postalCode" value={form.postalCode} onChange={handleChange} disabled={useHomeAddress} />
          </div>

          <div className="mb-8">
            <label className="block text-[12px] tracking-[0.1em] uppercase text-ink/50 mb-2">
              Order Notes (optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Delivery instructions, landmark, etc."
              className="w-full border border-cream-dim bg-white px-4 py-3 text-sm rounded-sm focus:outline-none focus:border-gold-2"
            />
          </div>

          {/* Payment method */}
          <h3 className="text-[13px] tracking-[0.1em] uppercase font-medium mb-5">Payment Method</h3>
          <div className="flex flex-col gap-3 mb-4">
            <PaymentOption
              id="cod"
              label="Cash on Delivery"
              desc="Pay with cash when your order arrives"
              icon={HiOutlineTruck}
              selected={paymentMethod === "cod"}
              onSelect={() => setPaymentMethod("cod")}
            />
            <PaymentOption
              id="whatsapp"
              label="Order via WhatsApp"
              desc="Confirm your order directly with us on WhatsApp"
              icon={HiOutlineChatBubbleLeftRight}
              selected={paymentMethod === "whatsapp"}
              onSelect={() => setPaymentMethod("whatsapp")}
            />
            <PaymentOption
              id="online"
              label="Online Payment"
              desc="EasyPaisa, JazzCash, NayaPay, or Bank Transfer"
              icon={HiOutlineCreditCard}
              selected={paymentMethod === "online"}
              onSelect={() => setPaymentMethod("online")}
            />
          </div>

          {/* Online Payment Details Panel */}
          {paymentMethod === "online" && (
            <OnlinePaymentPanel
              provider={onlineProvider}
              setProvider={setOnlineProvider}
              senderAccount={onlineSenderAccount}
              setSenderAccount={setOnlineSenderAccount}
              transactionAmount={onlineTransactionAmount}
              setTransactionAmount={setOnlineTransactionAmount}
              receiptFile={receiptFile}
              receiptPreview={receiptPreview}
              onReceiptChange={handleReceiptChange}
              errors={errors}
              subtotal={subtotal}
            />
          )}
        </div>

        {/* Summary */}
        <div className="bg-cream border border-cream-dim p-7 sm:p-8 sticky top-24">
          <h3 className="font-display text-xl mb-6">Order Summary</h3>

          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-white shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink text-ivory text-[10px] flex items-center justify-center">
                    {item.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium truncate">{item.name}</p>
                  <p className="text-[12px] text-ink/45">{item.size}</p>
                </div>
                <span className="text-[13px]">Rs.{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[14.5px] text-ink/70 mb-3 pt-4 border-t border-cream-dim">
            <span>Subtotal</span>
            <span>Rs.{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[14.5px] text-ink/70 mb-5">
            <span>Shipping</span>
            <span className="text-moss">Free</span>
          </div>
          <div className="flex justify-between font-display text-lg border-t border-cream-dim pt-5 mb-7">
            <span>Total</span>
            <span>Rs.{subtotal.toLocaleString()}</span>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-dark w-full">
            {submitting
              ? "Placing Order..."
              : paymentMethod === "whatsapp"
              ? "Continue on WhatsApp"
              : paymentMethod === "online"
              ? "Place Order — Payment Pending Verification"
              : "Place Order"}
          </button>

          {paymentMethod === "online" && (
            <p className="text-[11.5px] text-ink/50 mt-3 text-center leading-relaxed">
              Your order will be confirmed once we verify your payment receipt.
            </p>
          )}

          <p className="flex items-center justify-center gap-1.5 text-[11.5px] text-ink/40 mt-4">
            <HiOutlineLockClosed className="w-3.5 h-3.5" /> Your information is safe with us
          </p>
        </div>
      </form>
    </div>
  );
};

/* ─── Online Payment Panel ─── */
const OnlinePaymentPanel = ({
  provider,
  setProvider,
  senderAccount,
  setSenderAccount,
  transactionAmount,
  setTransactionAmount,
  receiptFile,
  receiptPreview,
  onReceiptChange,
  errors,
  subtotal,
}) => {
  const selectedAccount = provider ? PROVIDER_ACCOUNTS[provider] : null;

  return (
    <div className="border border-cream-dim rounded-sm p-5 sm:p-6 mb-8 bg-white space-y-5">
      <p className="text-[13px] text-ink/60 leading-relaxed">
        Send payment to our account using any of the methods below, then upload the receipt screenshot.
      </p>

      {/* Provider selection */}
      <div>
        <label className="block text-[12px] tracking-[0.1em] uppercase text-ink/50 mb-3">
          Select Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {Object.entries(PROVIDER_ACCOUNTS).map(([key, p]) => (
            <button
              key={key}
              type="button"
              onClick={() => setProvider(key)}
              className={`border rounded-sm px-3 py-2.5 text-left transition-all text-[13px] font-medium
                ${provider === key
                  ? "border-ink bg-ink text-ivory"
                  : "border-cream-dim bg-white text-ink/70 hover:border-ink/30"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {errors.onlineProvider && <p className="text-red-500 text-[12px] mt-1.5">{errors.onlineProvider}</p>}
      </div>

      {/* Account details display */}
      {selectedAccount && (
        <div className={`border rounded-sm p-4 ${selectedAccount.color}`}>
          <p className={`text-[11px] tracking-[0.08em] uppercase font-medium mb-2 ${selectedAccount.accent}`}>
            Send payment to:
          </p>
          <div className="space-y-1.5">
            <p className="text-[13.5px] font-medium text-ink/80">
              Account Title: <span className="font-semibold text-ink">{selectedAccount.accountTitle}</span>
            </p>
            <p className="text-[13.5px] font-medium text-ink/80">
              Account/Phone: <span className="font-semibold text-ink font-mono">{selectedAccount.accountNumber}</span>
            </p>
            {selectedAccount.nayaPayId && (
              <p className="text-[13.5px] font-medium text-ink/80">
                NayaPay ID: <span className="font-semibold text-ink font-mono">{selectedAccount.nayaPayId}</span>
              </p>
            )}
            {selectedAccount.iban && (
              <p className="text-[13.5px] font-medium text-ink/80">
                IBAN: <span className="font-semibold text-ink font-mono">{selectedAccount.iban}</span>
              </p>
            )}
            {selectedAccount.bankName && (
              <p className="text-[13.5px] font-medium text-ink/80">
                Bank: <span className="font-semibold text-ink">{selectedAccount.bankName}</span>
              </p>
            )}
            <p className="text-[13.5px] font-medium text-ink/80">
              Amount to send: <span className="font-semibold text-ink">Rs.{subtotal.toLocaleString()}</span>
            </p>
          </div>
        </div>
      )}

      {/* Sender account number */}
      <div>
        <label className="block text-[12px] tracking-[0.1em] uppercase text-ink/50 mb-2">
          Your Account / Phone Number (sent from)
        </label>
        <input
          type="text"
          value={senderAccount}
          onChange={(e) => setSenderAccount(e.target.value)}
          placeholder="03XX XXXXXXX"
          className={`w-full border bg-white px-4 py-3 text-sm rounded-sm focus:outline-none transition-colors
            ${errors.onlineSenderAccount ? "border-red-400 focus:border-red-500" : "border-cream-dim focus:border-gold-2"}`}
        />
        {errors.onlineSenderAccount && <p className="text-red-500 text-[12px] mt-1.5">{errors.onlineSenderAccount}</p>}
      </div>

      {/* Transaction amount */}
      <div>
        <label className="block text-[12px] tracking-[0.1em] uppercase text-ink/50 mb-2">
          Amount Sent (Rs.)
        </label>
        <input
          type="number"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(e.target.value)}
          placeholder={subtotal.toString()}
          min="1"
          className={`w-full border bg-white px-4 py-3 text-sm rounded-sm focus:outline-none transition-colors
            ${errors.onlineTransactionAmount ? "border-red-400 focus:border-red-500" : "border-cream-dim focus:border-gold-2"}`}
        />
        {errors.onlineTransactionAmount && <p className="text-red-500 text-[12px] mt-1.5">{errors.onlineTransactionAmount}</p>}
      </div>

      {/* Receipt upload */}
      <div>
        <label className="block text-[12px] tracking-[0.1em] uppercase text-ink/50 mb-2">
          Payment Receipt Screenshot
        </label>
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-sm p-6 cursor-pointer transition-colors
            ${receiptFile ? "border-green-300 bg-green-50/50" : errors.receipt ? "border-red-300 bg-red-50/30" : "border-cream-dim hover:border-ink/30 bg-cream/30"}`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onReceiptChange}
            className="sr-only"
          />
          {receiptPreview ? (
            <div className="flex items-center gap-3">
              <img src={receiptPreview} alt="Receipt preview" className="w-16 h-16 object-cover rounded-sm border" />
              <div>
                <p className="text-[13px] font-medium text-green-700 flex items-center gap-1">
                  <HiOutlineCheckCircle className="w-4 h-4" /> Receipt uploaded
                </p>
                <p className="text-[11.5px] text-ink/50 mt-0.5">{receiptFile.name}</p>
                <p className="text-[11.5px] text-gold-1 mt-1 underline underline-offset-2">Change file</p>
              </div>
            </div>
          ) : (
            <>
              <HiOutlineCloudArrowUp className="w-8 h-8 text-ink/30 mb-2" />
              <p className="text-[13px] text-ink/60">Click to upload receipt screenshot</p>
              <p className="text-[11px] text-ink/40 mt-1">JPG, PNG or WebP — max 5MB</p>
            </>
          )}
        </label>
        {errors.receipt && <p className="text-red-500 text-[12px] mt-1.5">{errors.receipt}</p>}
      </div>
    </div>
  );
};

/* ─── Reusable Components ─── */
const Field = ({ label, name, value, onChange, error, type = "text", placeholder, disabled }) => (
  <div>
    <label htmlFor={name} className="block text-[12px] tracking-[0.1em] uppercase text-ink/50 mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full border bg-white px-4 py-3 text-sm rounded-sm focus:outline-none transition-colors
        disabled:bg-cream disabled:text-ink/50
        ${error ? "border-red-400 focus:border-red-500" : "border-cream-dim focus:border-gold-2"}`}
    />
    {error && <p className="text-red-500 text-[12px] mt-1.5">{error}</p>}
  </div>
);

const PaymentOption = ({ id, label, desc, icon: Icon, selected, onSelect, disabled, soon }) => (
  <label
    htmlFor={id}
    className={`flex items-center gap-4 border rounded-sm px-5 py-4 transition-colors
      ${disabled ? "opacity-50 cursor-not-allowed bg-cream/50" : "cursor-pointer hover:border-ink"}
      ${selected ? "border-ink bg-white" : "border-cream-dim bg-white"}`}
  >
    <input
      type="radio"
      id={id}
      name="paymentMethod"
      checked={selected}
      onChange={onSelect}
      disabled={disabled}
      className="accent-gold-1 w-4 h-4"
    />
    <Icon className="w-5 h-5 text-gold-1 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium">{label}</p>
      <p className="text-[12.5px] text-ink/50">{desc}</p>
    </div>
    {soon && (
      <span className="text-[10px] tracking-[0.08em] uppercase bg-espresso text-gold-3 px-2.5 py-1 rounded-full shrink-0">
        Coming Soon
      </span>
    )}
  </label>
);

export default Checkout;
