"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Task } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface TaskFormProps {
  task?: Task;
  userId: string;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

export function TaskForm({ task, userId, onSave, onCancel }: TaskFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<"title" | "description" | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus title input on mount
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError(t("form.titleRequired"));
      titleInputRef.current?.focus();
      return;
    }

    if (title.length > 200) {
      setError(t("form.titleMax"));
      return;
    }

    if (description.length > 1000) {
      setError(t("form.descriptionMax"));
      return;
    }

    setLoading(true);

    try {
      let savedTask: Task;
      if (task) {
        savedTask = await api.updateTask(userId, task.id, {
          title: title.trim(),
          description: description.trim() || undefined,
        });
      } else {
        savedTask = await api.createTask(userId, {
          title: title.trim(),
          description: description.trim() || undefined,
        });
      }

      if (!task) {
        setTitle("");
        setDescription("");
      }

      onSave(savedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("list.failedUpdate"));
      setLoading(false);
    }
  };

  const titleProgress = (title.length / 200) * 100;
  const descProgress = (description.length / 1000) * 100;

  return (
    <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 rounded-2xl blur-xl opacity-50" />

      <div className="relative">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                {task ? (
                  <PencilSquareIcon className="h-5 w-5 text-white" />
                ) : (
                  <SparklesIcon className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="font-bold text-white">
                  {task ? t("tasks.editTask") : t("tasks.newTask")}
                </h2>
                <p className="text-xs text-white/40">
                  {task ? t("form.updateDetails") : t("form.whatNeedsToBeDone")}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Close form"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Title Field */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-sm font-medium text-white/70">
              <span>
                {t("form.title")} <span className="text-red-400">*</span>
              </span>
              <span
                className={`text-xs transition-colors ${
                  title.length > 180 ? "text-red-400 font-medium" : "text-white/30"
                }`}
              >
                {title.length}/200
              </span>
            </label>
            <div className="relative">
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setIsFocused("title")}
                onBlur={() => setIsFocused(null)}
                maxLength={200}
                required
                className={`
                  w-full px-4 py-3 rounded-xl text-sm
                  bg-white/[0.05] backdrop-blur
                  text-white placeholder:text-white/30
                  border transition-all duration-300
                  ${isFocused === "title"
                    ? "border-violet-500/50 ring-2 ring-violet-500/20 bg-white/[0.08]"
                    : "border-white/10 hover:border-white/20"
                  }
                `}
                placeholder={t("form.titlePlaceholder")}
              />
              {/* Progress bar under input */}
              {title.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-b-xl overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      titleProgress > 90 ? "bg-red-500" : titleProgress > 70 ? "bg-amber-500" : "bg-violet-500"
                    }`}
                    style={{ width: `${titleProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-sm font-medium text-white/70">
              <span className="flex items-center gap-2">
                {t("form.description")}
                <span className="text-xs text-white/30 font-normal">{t("form.descriptionOptional")}</span>
              </span>
              <span
                className={`text-xs transition-colors ${
                  description.length > 900 ? "text-red-400 font-medium" : "text-white/30"
                }`}
              >
                {description.length}/1000
              </span>
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={() => setIsFocused("description")}
                onBlur={() => setIsFocused(null)}
                maxLength={1000}
                rows={3}
                className={`
                  w-full px-4 py-3 rounded-xl resize-none text-sm
                  bg-white/[0.05] backdrop-blur
                  text-white placeholder:text-white/30
                  border transition-all duration-300
                  ${isFocused === "description"
                    ? "border-violet-500/50 ring-2 ring-violet-500/20 bg-white/[0.08]"
                    : "border-white/10 hover:border-white/20"
                  }
                `}
                placeholder={t("form.descriptionPlaceholder")}
              />
              {/* Progress bar under textarea */}
              {description.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-b-xl overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      descProgress > 90 ? "bg-red-500" : descProgress > 70 ? "bg-amber-500" : "bg-violet-500"
                    }`}
                    style={{ width: `${descProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className={`
                group flex-1 inline-flex items-center justify-center gap-2
                py-3 px-5 rounded-xl font-semibold text-sm
                transition-all duration-300
                ${loading || !title.trim()
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
                }
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{t("tasks.saving")}</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>{task ? t("tasks.saveChanges") : t("tasks.createTask")}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="
                px-5 py-3 rounded-xl font-semibold text-sm
                bg-white/5 border border-white/10
                text-white/60 hover:text-white hover:bg-white/10
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
