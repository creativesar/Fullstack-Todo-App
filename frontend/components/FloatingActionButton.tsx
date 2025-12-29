"use client";

import { useState, useRef } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface FloatingActionButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
}

export function FloatingActionButton({
  onClick,
  isOpen = false,
  className = "",
}: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleCounter = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Create ripple effect
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleCounter.current++;
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bottom-24 right-6 sm:bottom-8 sm:right-8
        z-50
        h-14 w-14 sm:h-16 sm:w-16
        rounded-full
        bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600
        shadow-lg shadow-purple-500/30
        flex items-center justify-center
        overflow-hidden
        transition-all duration-300 ease-out
        group
        ${isHovered ? "scale-110 shadow-xl shadow-purple-500/40" : "scale-100"}
        ${isOpen ? "rotate-45" : "rotate-0"}
        ${className}
      `}
      aria-label={isOpen ? "Close" : "Add new task"}
    >
      {/* Animated gradient background */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600
          transition-opacity duration-500
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        style={{
          backgroundSize: "200% 200%",
          animation: isHovered ? "gradient-shift 2s ease infinite" : "none",
        }}
      />

      {/* Pulse ring effect */}
      <div
        className={`
          absolute inset-0 rounded-full
          border-2 border-white/30
          transition-all duration-300
          ${isHovered ? "scale-125 opacity-0" : "scale-100 opacity-100"}
        `}
      />

      {/* Glow effect */}
      <div
        className={`
          absolute inset-0 rounded-full
          bg-gradient-to-br from-violet-400/50 to-pink-400/50
          blur-lg
          transition-all duration-300
          ${isHovered ? "scale-150 opacity-60" : "scale-100 opacity-0"}
        `}
      />

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Icon */}
      <span className="relative z-10 transition-transform duration-300">
        {isOpen ? (
          <XMarkIcon className="h-7 w-7 text-white" />
        ) : (
          <PlusIcon className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
        )}
      </span>

      {/* Tooltip */}
      <span
        className={`
          absolute right-full mr-3
          px-3 py-1.5
          bg-gray-900 dark:bg-white
          text-white dark:text-gray-900
          text-sm font-medium
          rounded-lg
          whitespace-nowrap
          transition-all duration-200
          ${isHovered && !isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"}
        `}
      >
        Add Task
        <span className="text-xs opacity-60 ml-1.5">Ctrl+N</span>
      </span>
    </button>
  );
}
