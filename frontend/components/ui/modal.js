"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

export function Modal({ open, title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    ref.current?.focus();
    const onKey = event => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-black/70" role="dialog" aria-modal="true" aria-label={title}>
      <div ref={ref} tabIndex={-1} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-slate-200/90 bg-white/[0.98] shadow-[0_28px_90px_rgba(15,23,42,0.22)] ring-1 ring-slate-950/[0.05] outline-none dark:border-border/80 dark:bg-card/[0.96] dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)] dark:ring-white/[0.04]">
        <div className="flex items-center justify-between border-b border-slate-200/80 p-4 dark:border-border/75">
          <h2 className="text-base font-semibold text-card-foreground">{title}</h2>
          <Button variant="ghost" className="h-9 w-9 px-0" onClick={onClose} aria-label="Close modal"><X size={16} /></Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
