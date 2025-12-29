"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getAuthUser } from "@/lib/auth";
import TaskList from "./TaskList";

export default function TasksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);

  useEffect(() => {
    // Check authentication on mount
    if (!isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const authUser = getAuthUser();
    if (!authUser) {
      router.push("/signin");
      return;
    }

    setUser(authUser);
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return <TaskList userId={user.id} userName={user.name || user.email} />;
}
