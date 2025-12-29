# React Interactive Card Pattern

**Category:** Frontend UI Pattern
**Stack:** React + TypeScript + Tailwind CSS
**Reusability:** High - Applicable to any interactive list items

## Overview

A reusable pattern for creating interactive card components with:
- Smooth animations and transitions
- Hover effects and visual feedback
- Loading and action states
- Accessibility support
- Responsive design

## Component Structure

```typescript
"use client";

import { useState, useRef, useEffect } from "react";

interface CardProps<T> {
  item: T;
  onToggle?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  index?: number;
}

export function InteractiveCard<T extends { id: number; completed?: boolean }>({
  item,
  onToggle,
  onEdit,
  onDelete,
  index = 0,
}: CardProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Action handlers with loading states
  const handleToggle = async () => {
    if (!onToggle) return;
    setIsLoading(true);
    await onToggle(item.id);
    setIsLoading(false);
  };

  const handleDelete = () => {
    if (!onDelete) return;
    setIsDeleting(true);
    setTimeout(() => onDelete(item.id), 400); // Wait for animation
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative overflow-hidden
        bg-white/[0.03] backdrop-blur
        border transition-all duration-500 ease-out
        rounded-2xl
        ${item.completed
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-white/5 hover:border-violet-500/30"
        }
        ${isDeleting ? "animate-fade-out" : ""}
        ${isHovered ? "hover:shadow-2xl hover:-translate-y-1" : ""}
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Content */}
    </div>
  );
}
```

## Animation Classes (Tailwind CSS)

Add to `globals.css`:

```css
@layer utilities {
  /* Staggered entrance animation */
  .task-card-animate {
    animation: slideInUp 0.4s ease-out forwards;
    opacity: 0;
    animation-delay: calc(var(--card-index, 0) * 80ms);
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Delete animation */
  .animate-task-delete {
    animation: slideOut 0.4s ease-in forwards;
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(-100px) scale(0.8);
    }
  }

  /* Checkbox completion animation */
  .animate-check-explosion {
    animation: checkPop 0.6s ease-out;
  }

  @keyframes checkPop {
    0% { transform: scale(1); }
    30% { transform: scale(1.3); }
    60% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }

  /* Gradient border animation */
  .animate-border-glow {
    background: linear-gradient(90deg, #8b5cf6, #d946ef, #8b5cf6);
    background-size: 200% 100%;
    animation: gradientMove 2s linear infinite;
    border-radius: inherit;
    padding: 1px;
  }

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }

  /* Floating particles */
  .animate-float-particle {
    animation: floatUp 1.5s ease-out forwards;
  }

  @keyframes floatUp {
    from {
      opacity: 0;
      transform: translateY(100%) scale(0);
    }
    50% {
      opacity: 1;
      transform: translateY(50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(-100%) scale(0);
    }
  }

  /* Button hover shimmer */
  .animate-shimmer {
    animation: shimmer 2s linear infinite;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    background-size: 200% 100%;
  }

  @keyframes shimmer {
    from { background-position: -200% 0; }
    to { background-position: 200% 0; }
  }
}
```

## Reusable Sub-Components

### Animated Checkbox

```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  loading?: boolean;
}

export function AnimatedCheckbox({ checked, onChange, loading }: CheckboxProps) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`
        relative h-7 w-7 flex-shrink-0 rounded-xl
        flex items-center justify-center
        transition-all duration-300 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
        ${checked
          ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/40"
          : "border-2 border-white/20 hover:border-violet-500 hover:bg-violet-500/10"
        }
        ${loading ? "scale-125 animate-check-explosion" : "hover:scale-110"}
      `}
      aria-label={checked ? "Mark as incomplete" : "Mark as complete"}
    >
      {checked ? (
        <CheckIcon className="h-4 w-4 text-white" />
      ) : (
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute h-full w-full rounded-full bg-violet-400 opacity-75" />
          <span className="relative rounded-full h-2.5 w-2.5 bg-violet-500" />
        </span>
      )}
    </button>
  );
}
```

### Status Badge

```typescript
interface BadgeProps {
  status: "pending" | "completed" | "latest";
}

export function StatusBadge({ status }: BadgeProps) {
  const styles = {
    latest: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/20",
    pending: "bg-violet-500/10 text-violet-400",
    completed: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/20",
  };

  const labels = {
    latest: "Latest",
    pending: "Active",
    completed: "Done",
  };

  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-1
      bg-gradient-to-r ${styles[status]}
      rounded-full text-xs font-medium border
    `}>
      {status === "completed" && <CheckCircleIcon className="h-3.5 w-3.5" />}
      {status === "latest" && <StarIcon className="h-3.5 w-3.5" />}
      {labels[status]}
    </span>
  );
}
```

### Action Button

```typescript
interface ActionButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: "default" | "danger";
}

export function ActionButton({ onClick, icon: Icon, label, variant = "default" }: ActionButtonProps) {
  const variants = {
    default: "text-white/30 hover:text-violet-400 hover:bg-violet-500/20",
    danger: "text-white/30 hover:text-red-400 hover:bg-red-500/20",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        inline-flex items-center justify-center w-9 h-9 rounded-xl
        ${variants[variant]}
        transition-all duration-300
        hover:scale-110 active:scale-95
      `}
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
```

## Date Formatting Utility

```typescript
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
```

## Accessibility Considerations

1. **Keyboard Navigation**: All buttons are focusable and operable via keyboard
2. **ARIA Labels**: Descriptive labels for icon-only buttons
3. **Focus Indicators**: Visible focus rings with `focus-visible`
4. **Screen Reader Support**: Status conveyed through text, not just color
5. **Motion Preferences**: Consider `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  .task-card-animate,
  .animate-task-delete,
  .animate-check-explosion {
    animation: none;
  }
}
```

## Responsive Design

```typescript
// Tailwind classes for responsive card
className={`
  p-4 sm:p-5              // Padding adjusts on mobile
  pl-5 sm:pl-6            // Left padding for indicator strip
  hidden sm:flex          // Hide some elements on mobile
  text-xs sm:text-sm      // Font size scales
`}
```

## Key Principles

1. **Progressive Enhancement**: Basic functionality works without JS
2. **Optimistic Updates**: UI responds immediately, syncs in background
3. **Loading States**: Visual feedback during async operations
4. **Staggered Animations**: Cards animate in sequence for polish
5. **Hover States**: Rich feedback on interactive elements

---

**Version:** 1.0.0
**Extracted From:** Phase II Todo Full-Stack Application
**Last Updated:** 2025-12-29
