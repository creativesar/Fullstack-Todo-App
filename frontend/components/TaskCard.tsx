"use client";

import { useState, useRef, useEffect } from "react";
import { Task } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import {
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  ArrowPathIcon,
  SparklesIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, CheckIcon, StarIcon, FireIcon } from "@heroicons/react/24/solid";

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  index?: number;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, index = 0 }: TaskCardProps) {
  const { t } = useTranslation();
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger periodic glow pulse for pending tasks
  useEffect(() => {
    if (task.completed) return;

    const interval = setInterval(() => {
      setGlowPulse(true);
      setTimeout(() => setGlowPulse(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [task.completed]);

  const handleToggle = async () => {
    setRippleEffect(true);
    setIsChecking(true);
    await onToggle(task.id);
    setTimeout(() => {
      setIsChecking(false);
      setRippleEffect(false);
    }, 600);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(task.id), 400);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return t("task.justNow");
    if (minutes < 60) return t("task.minutesAgo", { minutes: String(minutes) });
    if (hours < 24) return t("task.hoursAgo", { hours: String(hours) });
    if (days === 1) return t("task.yesterday");
    if (days < 7) return t("task.daysAgo", { days: String(days) });

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getTimeOfDay = () => {
    const hours = new Date(task.created_at).getHours();
    if (hours < 12) return t("task.morningTask");
    if (hours < 17) return t("task.afternoonTask");
    return t("task.eveningTask");
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
        task-card-animate
        ${task.completed
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-white/5 hover:border-violet-500/30 hover:bg-white/[0.05]"
        }
        ${isDeleting ? "animate-task-delete" : ""}
        ${isHovered && !task.completed ? "hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1 hover:scale-[1.01]" : ""}
        ${glowPulse && !task.completed ? "animate-glow-pulse" : ""}
        ${rippleEffect ? "animate-ripple-bg" : ""}
      `}
      style={{
        animationDelay: `${index * 80}ms`,
        ["--card-index" as string]: index
      }}
    >
      {/* Animated gradient border on hover */}
      {isHovered && !task.completed && (
        <div className="absolute inset-0 rounded-2xl animate-border-glow opacity-50 pointer-events-none" />
      )}

      {/* Floating particles on hover */}
      {isHovered && !task.completed && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-violet-400/60 rounded-full animate-float-particle"
              style={{
                left: `${15 + i * 15}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${1.5 + i * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Priority/Status indicator strip with animation */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-1 transition-all duration-500
          ${task.completed
            ? "bg-gradient-to-b from-emerald-400 to-teal-500"
            : "bg-gradient-to-b from-violet-500 via-fuchsia-500 to-pink-500 animate-gradient-y"
          }
          ${isHovered && !task.completed ? "w-1.5 shadow-lg shadow-violet-500/50" : ""}
        `}
      />

      {/* Main content wrapper */}
      <div className="p-4 sm:p-5 pl-5 sm:pl-6">
        {/* Top row - Title and status badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Checkbox with enhanced animations */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              disabled={isChecking}
              className={`
                relative mt-0.5 h-7 w-7 flex-shrink-0 rounded-xl
                flex items-center justify-center
                transition-all duration-300 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500
                ${task.completed
                  ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/40 animate-success-glow"
                  : "border-2 border-white/20 hover:border-violet-500 hover:bg-violet-500/10 hover:shadow-lg hover:shadow-violet-500/30"
                }
                ${isChecking ? "scale-125 animate-check-explosion" : "hover:scale-110"}
              `}
              aria-label={task.completed ? t("task.markIncomplete") : t("task.markComplete")}
            >
              {/* Ripple effect on click */}
              {rippleEffect && (
                <span className="absolute inset-0 rounded-xl animate-ripple-ring" />
              )}

              {task.completed ? (
                <CheckIcon className={`h-4 w-4 text-white ${isChecking ? "animate-check-bounce" : ""}`} />
              ) : (
                /* Enhanced blinking indicator */
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" style={{ animationDuration: '1.5s' }} />
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-violet-500/50" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-br from-violet-400 to-fuchsia-500" />
                </span>
              )}

              {/* Sparkle effect on complete */}
              {isChecking && !task.completed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-sparkle-burst"
                      style={{
                        transform: `rotate(${i * 90}deg) translateY(-12px)`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </button>

            {/* Title with shimmer effect on hover */}
            <div className="flex-1 min-w-0 relative overflow-hidden">
              <h3
                className={`
                  font-semibold text-base leading-tight
                  transition-all duration-300
                  ${task.completed
                    ? "text-white/40 line-through decoration-2 decoration-emerald-500/50"
                    : "text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-violet-200 group-hover:to-white"
                  }
                `}
              >
                {task.title}
              </h3>
              {/* Text shimmer on hover */}
              {isHovered && !task.completed && (
                <div className="absolute inset-0 animate-text-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ transform: 'skewX(-20deg)' }} />
              )}
            </div>
          </div>

          {/* Status badge and star with animations */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!task.completed && index === 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-full text-xs font-medium animate-badge-glow border border-amber-500/20">
                <StarIcon className="h-3.5 w-3.5 animate-star-spin" />
                {t("task.latest")}
              </span>
            )}
            {!task.completed && index !== 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-500/10 text-violet-400 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <BoltIcon className="h-3 w-3 animate-pulse" />
                {t("task.active")}
              </span>
            )}
            {task.completed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20 animate-success-badge">
                <CheckCircleIcon className="h-3.5 w-3.5" />
                {t("task.done")}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p
            className={`
              text-sm leading-relaxed mb-4 pl-9
              transition-all duration-300
              ${task.completed
                ? "text-white/30 line-clamp-1"
                : "text-white/50 line-clamp-2"
              }
            `}
          >
            {task.description}
          </p>
        )}

        {/* Bottom row - Meta info and action buttons */}
        <div className="flex items-center justify-between gap-4 pl-9">
          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-white/30">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{formatDate(task.created_at)}</span>
            </div>
            {!task.completed && (
              <div className="hidden sm:flex items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5" />
                <span>{getTimeOfDay()}</span>
              </div>
            )}
          </div>

          {/* Action buttons with enhanced animations */}
          <div className="flex items-center gap-1.5">
            {/* Mark Complete/Incomplete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              disabled={isChecking}
              className={`
                relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                transition-all duration-300 overflow-hidden
                ${task.completed
                  ? "bg-white/5 text-white/50 hover:bg-amber-500/20 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
                  : "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 hover:from-emerald-500/30 hover:to-teal-500/30 hover:shadow-lg hover:shadow-emerald-500/20"
                }
                ${isChecking ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
              `}
            >
              {/* Button shimmer effect */}
              <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              {isChecking ? (
                <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
              ) : task.completed ? (
                <ArrowPathIcon className="h-3.5 w-3.5 group-hover:animate-reverse-spin" />
              ) : (
                <CheckIcon className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline relative z-10">{task.completed ? "Undo" : "Complete"}</span>
            </button>

            {/* Edit Button with hover animation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task.id);
              }}
              className="
                relative inline-flex items-center justify-center w-9 h-9 rounded-xl
                text-white/30 hover:text-violet-400
                hover:bg-violet-500/20 hover:shadow-lg hover:shadow-violet-500/20
                transition-all duration-300
                hover:scale-110 active:scale-95
                group/edit
              "
              aria-label={t("task.edit")}
              title={t("task.edit")}
            >
              <PencilIcon className="h-4 w-4 group-hover/edit:animate-wiggle" />
            </button>

            {/* Delete Button with hover animation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="
                relative inline-flex items-center justify-center w-9 h-9 rounded-xl
                text-white/30 hover:text-red-400
                hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/20
                transition-all duration-300
                hover:scale-110 active:scale-95
                group/delete
              "
              aria-label={t("task.delete")}
              title={t("task.delete")}
            >
              <TrashIcon className="h-4 w-4 group-hover/delete:animate-shake-small" />
            </button>
          </div>
        </div>
      </div>

      {/* Completed indicator at bottom with animation */}
      {task.completed && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 animate-gradient-x" />
      )}

      {/* Multi-layer hover glow effect */}
      <div
        className={`
          absolute inset-0 pointer-events-none transition-opacity duration-500
          ${isHovered && !task.completed ? "opacity-100" : "opacity-0"}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/8 to-pink-500/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 to-transparent" />
      </div>

      {/* Corner sparkle decoration */}
      {!task.completed && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <SparklesIcon className="h-4 w-4 text-violet-400/50 animate-pulse" />
        </div>
      )}
    </div>
  );
}
