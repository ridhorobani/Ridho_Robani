import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-900 bg-black/95 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" && (
                <CheckCircle className="h-4 w-4 text-[#D4AF37]" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              {toast.type === "info" && (
                <Info className="h-4 w-4 text-blue-400" />
              )}
            </div>
            <div className="flex-1 text-xs text-zinc-300 font-sans leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
