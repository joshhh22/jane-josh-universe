"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  emoji?: string;
  type?: "info" | "success" | "love";
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, opts?: { emoji?: string; type?: Toast["type"]; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, opts?: { emoji?: string; type?: Toast["type"]; duration?: number }) => {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = { id, message, emoji: opts?.emoji ?? "💌", type: opts?.type ?? "info", duration: opts?.duration ?? 4000 };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration);
    },
    []
  );

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const bgMap = { info: "bg-[#FFFDF8]", success: "bg-[#C8E6C9]", love: "bg-[#FFB7C5]" };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] max-w-[280px] ${bgMap[t.type ?? "info"]}`}
            >
              <span className="text-xl flex-shrink-0">{t.emoji}</span>
              <p className="text-sm font-body font-medium text-[#171717] leading-snug flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-[#171717]/40 hover:text-[#171717] transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
