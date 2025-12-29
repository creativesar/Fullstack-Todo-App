/**
 * Unit tests for API client
 */
import { api } from "@/lib/api";

// Mock auth module
jest.mock("@/lib/auth", () => ({
  getAuthToken: jest.fn(() => "mock-token"),
}));

// Mock fetch
global.fetch = jest.fn();

describe("API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe("getTasks", () => {
    test("fetches tasks with correct endpoint and headers", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", completed: false },
        { id: 2, title: "Task 2", completed: true },
      ];
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockTasks,
      });

      const result = await api.getTasks("user-123");

      expect(fetch).toHaveBeenCalledWith(
        "https://creativesar-phase-11-todo.hf.space/api/user-123/tasks",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer mock-token",
          }),
        })
      );
      expect(result).toEqual(mockTasks);
    });

    test("throws error on failed request", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ detail: "Not found" }),
      });

      await expect(api.getTasks("user-123")).rejects.toThrow("Not found");
    });
  });

  describe("createTask", () => {
    test("creates task with correct payload", async () => {
      const mockTask = { id: 1, title: "New Task", completed: false };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockTask,
      });

      const result = await api.createTask("user-123", {
        title: "New Task",
        description: "Description",
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/user-123/tasks"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ title: "New Task", description: "Description" }),
        })
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe("toggleCompletion", () => {
    test("toggles task completion with PATCH method", async () => {
      const mockTask = { id: 1, title: "Task", completed: true };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockTask,
      });

      const result = await api.toggleCompletion("user-123", 1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/user-123/tasks/1/complete"),
        expect.objectContaining({
          method: "PATCH",
        })
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe("deleteTask", () => {
    test("deletes task with DELETE method", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ message: "Task deleted successfully" }),
      });

      const result = await api.deleteTask("user-123", 1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/user-123/tasks/1"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
      expect(result).toEqual({ message: "Task deleted successfully" });
    });
  });
});
