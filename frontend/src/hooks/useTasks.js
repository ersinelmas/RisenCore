import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import taskService from "../services/taskService";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const response = await taskService.getAllTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to load tasks.");
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (description, onSuccessCallback) => {
      if (!description.trim()) {
        toast.error("Task description cannot be empty.");
        return;
      }
      const toastId = toast.loading("Creating task...");
      setIsCreating(true);
      try {
        await taskService.createTask(description);
        await fetchTasks();
        toast.success("Task created successfully!", { id: toastId });
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      } catch (err) {
        toast.error("Failed to create task.", { id: toastId });
        console.error("Error creating task:", err);
      } finally {
        setIsCreating(false);
      }
    },
    [fetchTasks]
  );

  const toggleTaskComplete = useCallback(async (taskToToggle) => {
    setTasks((currentTasks) =>
      currentTasks.map((t) =>
        t.id === taskToToggle.id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      await taskService.updateTask(taskToToggle.id, {
        completed: !taskToToggle.completed,
      });
    } catch (err) {
      toast.error("Failed to update task.");
      console.error("Error updating task completion:", err);
      setTasks((currentTasks) =>
        currentTasks.map((t) =>
          t.id === taskToToggle.id
            ? { ...t, completed: taskToToggle.completed }
            : t
        )
      );
    }
  }, []);

  const deleteTask = useCallback(
    async (taskToDelete) => {
      const toastId = toast.loading("Deleting task...");
      setTasks((currentTasks) =>
        currentTasks.filter((t) => t.id !== taskToDelete.id)
      );

      try {
        await taskService.deleteTask(taskToDelete.id);
        toast.success("Task deleted.", { id: toastId });
      } catch (err) {
        toast.error("Failed to delete task.", { id: toastId });
        console.error("Error deleting task:", err);
        await fetchTasks();
      }
    },
    [fetchTasks]
  );

  const updateTaskDescription = useCallback(
    async (taskToSave, newDescription) => {
      if (!newDescription.trim()) {
        toast.error("Description cannot be empty.");
        return;
      }
      const toastId = toast.loading("Saving task...");
      
      setTasks((currentTasks) =>
        currentTasks.map((t) =>
          t.id === taskToSave.id ? { ...t, description: newDescription } : t
        )
      );
      setEditingTaskId(null);

      try {
        await taskService.updateTask(taskToSave.id, {
          description: newDescription,
          completed: taskToSave.completed,
        });
        toast.success("Task updated!", { id: toastId });
      } catch (err) {
        toast.error("Failed to save task.", { id: toastId });
        console.error("Error updating task description:", err);
        await fetchTasks();
      }
    },
    [fetchTasks]
  );

  return {
    tasks,
    loadingTasks,
    isCreating,
    createTask,
    deleteTask,
    toggleTaskComplete,
    editingTaskId,
    setEditingTaskId,
    editingText,
    setEditingText,
    updateTaskDescription,
  };
}