import { useState, useRef } from "react";
import { HiPlus } from "react-icons/hi2";

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);

  return (
    <div className="border-b border-cream-dim">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-[13px] tracking-[0.08em] uppercase font-medium">{title}</span>
        <HiPlus className={`w-4 h-4 shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
      </button>

      {/* Animating max-height (not just conditional render) gives a smooth
          expand/collapse rather than an abrupt show/hide. Capped generously
          high since content length varies (ingredients list is much longer
          than "How to Use"). */}
      <div
        ref={contentRef}
        style={{ maxHeight: open ? contentRef.current?.scrollHeight ?? 600 : 0 }}
        className="overflow-hidden transition-[max-height] duration-400 ease-out"
      >
        <div className="pb-6 text-[14.5px] text-ink/70 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

// Wrapper enforces "only one open at a time" behavior by tracking the
// open index itself, rather than each AccordionItem managing independent
// state — matches standard accordion UX (matches the reference site
// you showed me, where opening one section closes the others).
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="border-t border-cream-dim mt-8">
      {items.map((item, i) => (
        <div key={item.title} className="border-b border-cream-dim">
          <button
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            aria-expanded={openIndex === i}
            className="w-full flex items-center justify-between py-5 text-left"
          >
            <span className="text-[13px] tracking-[0.08em] uppercase font-medium">{item.title}</span>
            <HiPlus className={`w-4 h-4 shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`} />
          </button>
          <div
            style={{ maxHeight: openIndex === i ? 1000 : 0 }}
            className="overflow-hidden transition-[max-height] duration-400 ease-out"
          >
            <div className="pb-6 text-[14.5px] text-ink/70 leading-relaxed">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { AccordionItem };
export default Accordion;