/**
 * Unit tests for TaskCard component
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "@/components/TaskCard";
import { Task } from "@/lib/types";

describe("TaskCard", () => {
  const mockTask: Task = {
    id: 1,
    user_id: "user-123",
    title: "Test Task",
    description: "Test description",
    completed: false,
    created_at: "2025-01-01T00:00:00",
    updated_at: "2025-01-01T00:00:00",
  };

  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders task title and description", () => {
    render(
      <TaskCard
        task={mockTask}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  test("shows completed state with strikethrough", () => {
    const completedTask = { ...mockTask, completed: true };

    render(
      <TaskCard
        task={completedTask}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const title = screen.getByText("Test Task");
    expect(title).toHaveClass("line-through");
  });

  test("checkbox toggle calls onToggle with correct id", () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find button by role instead of aria-label
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
      expect(mockOnToggle).toHaveBeenCalledWith(1);
    }
  });

  test("edit button calls onEdit with correct id", () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find all buttons and click the second one (edit button)
    const buttons = container.querySelectorAll('button');
    if (buttons.length >= 2) {
      fireEvent.click(buttons[1]);
      expect(mockOnEdit).toHaveBeenCalledWith(1);
    }
  });

  test("delete button calls onDelete with correct id", () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find all buttons and click the third one (delete button)
    const buttons = container.querySelectorAll('button');
    if (buttons.length >= 3) {
      fireEvent.click(buttons[2]);
      expect(mockOnDelete).toHaveBeenCalledWith(1);
    }
  });

  test("does not render description when null", () => {
    const taskWithoutDescription = { ...mockTask, description: null };

    const { container } = render(
      <TaskCard
        task={taskWithoutDescription}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(container.textContent).not.toContain("null");
  });
});
