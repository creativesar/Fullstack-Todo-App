"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    // Auto dismiss after 4 seconds
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
  };

  const styles = {
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25",
    error: "bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/25",
    info: "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25",
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl text-white min-w-[320px] max-w-[420px]
        transform transition-all duration-300 ease-out
        ${styles[toast.type]}
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100 scale-100" : "translate-x-8 opacity-0 scale-95"}
      `}
    >
      <div className="flex-shrink-0 p-1 bg-white/20 rounded-xl">
        <Icon className="h-5 w-5" />
      </div>
      <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
        aria-label="Close notification"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
