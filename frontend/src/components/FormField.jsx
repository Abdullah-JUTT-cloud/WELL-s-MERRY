const FormField = ({ label, name, value, onChange, error, type = "text", placeholder, autoComplete }) => (
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
      autoComplete={autoComplete}
      className={`w-full border bg-white px-4 py-3 text-sm rounded-sm focus:outline-none transition-colors
        ${error ? "border-red-400 focus:border-red-500" : "border-cream-dim focus:border-gold-2"}`}
    />
    {error && <p className="text-red-500 text-[12px] mt-1.5">{error}</p>}
  </div>
);

export default FormField;