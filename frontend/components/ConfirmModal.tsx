"use client";

import { useEffect, useRef } from "react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus confirm button when modal opens
      setTimeout(() => confirmButtonRef.current?.focus(), 100);

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
      };
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
    return undefined;
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      button: "bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30 hover:shadow-red-500/40",
    },
    warning: {
      icon: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
      button: "bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/30 hover:shadow-amber-500/40",
    },
    info: {
      icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      button: "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/30 hover:shadow-blue-500/40",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md glass-strong rounded-2xl shadow-2xl animate-modal-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-4 ${variantStyles[variant].icon}`}>
            <ExclamationTriangleIcon className="h-7 w-7" />
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 id="modal-title" className="text-xl font-display font-bold mb-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {cancelText}
            </button>
            <button
              ref={confirmButtonRef}
              onClick={onConfirm}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ${variantStyles[variant].button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
