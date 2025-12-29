"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Task } from "@/lib/types";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Confetti } from "@/components/Confetti";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n";
import {
  CheckCircleIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
  FireIcon,
  TrophyIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid, ClockIcon } from "@heroicons/react/24/solid";

interface TaskListProps {
  userId: string;
  userName: string;
}

type FilterType = "all" | "pending" | "completed";
type ViewType = "list" | "grid";

export default function TaskList({ userId, userName }: TaskListProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<ViewType>("list");
  const [showConfetti, setShowConfetti] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    taskId: number | null;
    taskTitle: string;
  }>({ isOpen: false, taskId: null, taskTitle: "" });

  useEffect(() => {
    setMounted(true);
    fetchTasks();

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setEditingTask(undefined);
        setShowForm(true);
      }
      if (e.key === "Escape" && showForm) {
        setShowForm(false);
        setEditingTask(undefined);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showForm]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await api.getTasks(userId);
      setTasks(fetchedTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      showToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
    showToast(t("list.tasksRefreshed"), "info");
  };

  const handleSaveTask = (savedTask: Task) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === savedTask.id ? savedTask : t)));
      showToast(t("list.taskUpdated"), "success");
    } else {
      setTasks([savedTask, ...tasks]);
      showToast(t("list.taskCreated"), "success");
    }
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const updated = await api.toggleCompletion(userId, taskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));

      if (updated.completed && !task?.completed) {
        setShowConfetti(true);
        showToast(t("list.taskCompleted"), "success");
      } else {
        showToast(t("list.taskMarkedPending"), "info");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("list.failedUpdate"));
      showToast(t("list.failedUpdate"), "error");
    }
  };

  const openDeleteModal = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    setDeleteModal({
      isOpen: true,
      taskId,
      taskTitle: task?.title || "",
    });
  };

  const handleDeleteTask = async () => {
    if (!deleteModal.taskId) return;

    try {
      await api.deleteTask(userId, deleteModal.taskId);
      setTasks(tasks.filter((t) => t.id !== deleteModal.taskId));
      showToast(t("tasks.deleteSuccess"), "info");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("list.failedDelete"));
      showToast(t("list.failedDelete"), "error");
    } finally {
      setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
    }
  };

  const handleLogout = () => {
    signOut();
    showToast(t("nav.logout") + " " + t("common.success"), "info");
    router.push("/");
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !task.completed) ||
      (filter === "completed" && task.completed);
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting.morning");
    if (hour < 17) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  // Loading state with animated skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-56 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: '100ms' }} />
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 mb-3 animate-pulse" />
                <div className="h-7 w-12 bg-white/5 rounded-lg mb-1 animate-pulse" />
                <div className="h-4 w-16 bg-white/5 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          <div className="h-16 bg-white/[0.03] border border-white/5 rounded-2xl mb-6 animate-pulse" />

          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-white/5 rounded-lg" />
                    <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-24 sm:pb-8 relative overflow-hidden">
      {/* Confetti celebration */}
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t("tasks.deleteTitle")}
        message={t("tasks.deleteMessage", { title: deleteModal.taskTitle })}
        confirmText={t("common.delete")}
        cancelText={t("tasks.keepIt")}
        variant="danger"
        onConfirm={handleDeleteTask}
        onCancel={() => setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" })}
      />

      {/* Animated background with aurora effect */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        {/* Pulsating orbs with morphing */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-morph-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-morph-slow" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] animate-breathe" />
        {/* Moving gradient beam */}
        <div className="absolute inset-0 bg-gradient-conic from-violet-500/10 via-transparent to-fuchsia-500/10 animate-spin-very-slow" style={{ animationDuration: '20s' }} />
      </div>

      {/* Enhanced floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float-enhanced ${i % 3 === 0 ? 'bg-violet-400/40 w-1.5 h-1.5' : i % 3 === 1 ? 'bg-fuchsia-400/30 w-1 h-1' : 'bg-pink-400/20 w-2 h-2'}`}
            style={{
              left: `${5 + (i * 7) % 90}%`,
              top: `${10 + (i * 13) % 80}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 4)}s`
            }}
          />
        ))}
        {/* Sparkle particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-0.5 h-0.5 bg-white/60 rounded-full animate-twinkle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Animated grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] animate-grid-pulse"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Diagonal light streak */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[200%] h-32 bg-gradient-to-r from-transparent via-violet-500/5 to-transparent rotate-12 animate-streak" />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & User */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-xl bg-violet-500/30 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">{getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{userName}</span>!</h1>
                <p className="text-sm text-white/40 hidden sm:block">
                  {tasks.length === 0 ? (
                    <span className="flex items-center gap-1">
                      <RocketLaunchIcon className="h-4 w-4 animate-bounce" />
                      {t("list.getProductive")}
                    </span>
                  ) : (
                    t("list.tasksRemaining", { count: pendingCount, plural: pendingCount !== 1 ? "s" : "" })
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageSwitcher />

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`p-2.5 rounded-xl text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-300 hover:scale-105 ${refreshing ? "animate-spin" : ""}`}
                aria-label={t("common.loading")}
                title={t("common.loading")}
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-105"
                aria-label={t("nav.logout")}
                title={t("nav.logout")}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards with staggered animation */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {/* Total Tasks */}
            <div
              className={`group bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] hover:border-violet-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-400" />
                  <div className="absolute inset-0 rounded-xl bg-indigo-500/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '1.5s' }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{tasks.length}</p>
                  <p className="text-xs text-white/40">{t("list.total")}</p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div
              className={`group bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] hover:border-amber-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <ClockIcon className="h-5 w-5 text-amber-400" />
                  {pendingCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{pendingCount}</p>
                  <p className="text-xs text-white/40">{t("list.pending")}</p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div
              className={`group bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] hover:border-emerald-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <CheckCircleSolid className="h-5 w-5 text-emerald-400" />
                  {completedCount > 0 && (
                    <div className="absolute inset-0 rounded-xl bg-emerald-500/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '1.5s' }} />
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{completedCount}</p>
                  <p className="text-xs text-white/40">{t("list.done")}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div
              className={`group bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] hover:border-fuchsia-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-fuchsia-500/10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="flex items-center gap-3">
                <div className={`relative h-10 w-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${completionRate === 100 ? 'bg-gradient-to-br from-amber-500 to-orange-500 animate-pulse' : 'bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20'}`}>
                  {completionRate === 100 ? (
                    <TrophyIcon className="h-5 w-5 text-white animate-bounce" />
                  ) : (
                    <FireIcon className="h-5 w-5 text-fuchsia-400" />
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:scale-105 transition-transform duration-300">{completionRate}%</p>
                  <p className="text-xs text-white/40">{t("list.progress")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Animated Progress Bar */}
        {tasks.length > 0 && (
          <div
            className={`mb-6 bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white/60 flex items-center gap-2">
                {completionRate === 100 ? (
                  <>
                    <SparklesIcon className="h-4 w-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                    {t("list.allDone")}
                  </>
                ) : completionRate >= 50 ? (
                  <>
                    <FireIcon className="h-4 w-4 text-orange-400 animate-pulse" />
                    {t("list.keepItUp")}
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="h-4 w-4 text-violet-400 animate-bounce" />
                    {t("list.makeProgress")}
                  </>
                )}
              </span>
              <span className="text-sm font-medium text-violet-400">{t("list.completedOf", { completed: String(completedCount), total: String(tasks.length) })}</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${completionRate}%` }}
              >
                {/* Shimmer effect on progress bar */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div
          className={`flex flex-col sm:flex-row gap-3 mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '600ms' }}
        >
          {/* Add Task Button */}
          {!showForm && (
            <button
              onClick={() => {
                setEditingTask(undefined);
                setShowForm(true);
              }}
              className="
                group relative inline-flex items-center justify-center gap-2
                px-5 py-3 rounded-xl font-semibold
                bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white
                shadow-lg shadow-violet-500/25
                hover:shadow-xl hover:shadow-violet-500/40
                hover:-translate-y-1 active:translate-y-0
                transition-all duration-300
                overflow-hidden
              "
              title="Add new task (Ctrl+N)"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <PlusIcon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
              <span className="relative z-10">{t("tasks.addTask")}</span>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-xl bg-violet-400/30 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '1s' }} />
            </button>
          )}

          {/* Search & Filter */}
          {tasks.length > 0 && !showForm && (
            <div className="flex gap-2 flex-1">
              {/* Search */}
              <div className="relative flex-1 group">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors duration-300" />
                <input
                  id="search-input"
                  type="text"
                  placeholder={t("tasks.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-10 pr-10 py-3 rounded-xl
                    bg-white/[0.03] backdrop-blur
                    text-white placeholder:text-white/30
                    border border-white/5
                    focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                    focus:bg-white/[0.05]
                    transition-all duration-300 text-sm
                  "
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 hover:scale-110 transition-all duration-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setViewType("list")}
                  className={`p-3 transition-all duration-300 hover:scale-105 ${viewType === "list" ? "bg-violet-500/20 text-violet-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"}`}
                  aria-label="List view"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-3 transition-all duration-300 hover:scale-105 ${viewType === "grid" ? "bg-violet-500/20 text-violet-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"}`}
                  aria-label="Grid view"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Dropdown */}
              <div className="relative group">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="
                    appearance-none px-4 py-3 pr-10 rounded-xl text-sm
                    bg-white/[0.03] backdrop-blur text-white
                    border border-white/5
                    focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                    cursor-pointer transition-all duration-300
                    hover:bg-white/[0.05]
                  "
                >
                  <option value="all" className="bg-[#0a0a0f]">{t("common.all")}</option>
                  <option value="pending" className="bg-[#0a0a0f]">{t("common.pending")}</option>
                  <option value="completed" className="bg-[#0a0a0f]">{t("common.completed")}</option>
                </select>
                <FunnelIcon className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-hover:text-violet-400 transition-colors duration-300" />
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl animate-shake">
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Task Form with animation */}
        {showForm && (
          <div className="mb-6 animate-scale-in">
            <TaskForm
              task={editingTask}
              userId={userId}
              onSave={handleSaveTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(undefined);
              }}
            />
          </div>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 && !showForm ? (
          <div
            className={`relative bg-white/[0.03] backdrop-blur border-2 border-dashed border-white/10 rounded-3xl p-10 sm:p-16 text-center transition-all duration-700 overflow-hidden ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '700ms' }}
          >
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl animate-float-slow" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '-2s' }} />
            </div>

            <div className="relative z-10">
              {/* Animated icon container */}
              <div className="relative inline-block mb-8">
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] flex items-center justify-center animate-levitate border border-white/10">
                  <ClipboardDocumentListIcon className="h-12 w-12 text-white/30 animate-pulse" />
                </div>
                {/* Orbiting sparkles */}
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '8s' }}>
                  <div className="absolute -top-2 left-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-lg shadow-violet-500/50" />
                </div>
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                  <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-fuchsia-400 rounded-full shadow-lg shadow-fuchsia-500/50" />
                </div>
                {/* Corner badge */}
                <div className="absolute -bottom-3 -right-3 h-10 w-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-xl shadow-violet-500/40 animate-bounce-gentle">
                  <SparklesIcon className="h-5 w-5 text-white animate-spin-slow" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {searchQuery || filter !== "all" ? t("tasks.emptySearch") : t("tasks.empty")}
              </h3>
              <p className="text-white/40 mb-8 max-w-sm mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {searchQuery || filter !== "all"
                  ? t("tasks.emptySearchDesc")
                  : t("tasks.emptyDesc")}
              </p>
              {!searchQuery && filter === "all" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="
                    group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl
                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                    text-white font-semibold
                    hover:shadow-2xl hover:shadow-violet-500/40
                    hover:-translate-y-1 hover:scale-105
                    transition-all duration-300
                    animate-fade-in-up overflow-hidden
                  "
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <SparklesIcon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="relative z-10">{t("tasks.createFirst")}</span>
                  <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={viewType === "grid" ? "grid sm:grid-cols-2 gap-4 sm:gap-5" : "space-y-4"}>
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className={`
                  transition-all duration-700 ease-out
                  ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
                  animate-task-enter
                `}
                style={{
                  transitionDelay: `${Math.min(800 + index * 80, 1500)}ms`,
                  animationDelay: `${Math.min(index * 80, 500)}ms`
                }}
              >
                <TaskCard
                  task={task}
                  index={index}
                  onToggle={handleToggleComplete}
                  onEdit={(id) => {
                    setEditingTask(tasks.find((t) => t.id === id));
                    setShowForm(true);
                  }}
                  onDelete={openDeleteModal}
                />
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Mobile Bottom Stats Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-white/5 p-3 z-30">
        <div className="flex justify-around items-center">
          <div className="text-center group">
            <div className="text-xl font-bold text-amber-400 group-hover:scale-110 transition-transform duration-300">{pendingCount}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wide">{t("list.pending")}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center group">
            <div className="text-xl font-bold text-emerald-400 group-hover:scale-110 transition-transform duration-300">{completedCount}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wide">{t("list.done")}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center group">
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:scale-110 transition-transform duration-300">{completionRate}%</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wide">{t("list.progress")}</div>
          </div>
        </div>
      </div>

    </div>
  );
}
