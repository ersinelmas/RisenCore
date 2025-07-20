import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import taskService from "../../services/taskService";
import styles from "./TaskWidget.module.css";
import Card from "../../components/Card";
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiXCircle } from "react-icons/fi";
import Modal from "../../components/common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../../components/common/Modal.module.css";

function TaskWidget() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

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

  const handleCreateTask = useCallback(
    async (event) => {
      event.preventDefault();
      if (!newTaskDescription.trim()) {
        toast.error("Task description cannot be empty.");
        return;
      }
      const toastId = toast.loading("Creating task...");
      setIsCreating(true);
      try {
        await taskService.createTask(newTaskDescription);
        setNewTaskDescription("");
        await fetchTasks();
        toast.success("Task created successfully!", { id: toastId });
      } catch (err) {
        toast.error("Failed to create task.", { id: toastId });
        console.error("Failed to create task:", err);
      } finally {
        setIsCreating(false);
      }
    },
    [newTaskDescription, fetchTasks]
  );

  const handleToggleComplete = useCallback(
    async (taskToToggle) => {
      if (editingTaskId === taskToToggle.id) return;

      const originalTasks = [...tasks];
      const updatedTasks = tasks.map((t) =>
        t.id === taskToToggle.id ? { ...t, completed: !t.completed } : t
      );
      setTasks(updatedTasks);

      try {
        await taskService.updateTask(taskToToggle.id, {
          completed: !taskToToggle.completed,
        });
      } catch (err) {
        toast.error("Failed to update task.");
        setTasks(originalTasks);
        console.error("Failed to update task:", err);
      }
    },
    [tasks, editingTaskId]
  );

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    openDeleteModal();
  };

  const confirmDeleteTask = useCallback(async () => {
    if (!taskToDelete) return;

    closeDeleteModal();
    const toastId = toast.loading("Deleting task...");
    const originalTasks = [...tasks];
    setTasks((currentTasks) =>
      currentTasks.filter((t) => t.id !== taskToDelete.id)
    );

    try {
      await taskService.deleteTask(taskToDelete.id);
      toast.success("Task deleted.", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete task.", { id: toastId });
      setTasks(originalTasks);
      console.error("Failed to delete task:", err);
    } finally {
      setTaskToDelete(null);
    }
  }, [tasks, taskToDelete, closeDeleteModal]);

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.description);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleSaveEdit = useCallback(
    async (taskToSave) => {
      if (!editingText.trim()) {
        toast.error("Description cannot be empty.");
        return;
      }
      const toastId = toast.loading("Saving task...");

      const originalTasks = [...tasks];
      setTasks((currentTasks) =>
        currentTasks.map((t) =>
          t.id === taskToSave.id ? { ...t, description: editingText } : t
        )
      );

      setEditingTaskId(null);
      setEditingText("");

      try {
        await taskService.updateTask(taskToSave.id, {
          description: editingText,
          completed: taskToSave.completed,
        });
        toast.success("Task updated!", { id: toastId });
      } catch (err) {
        toast.error("Failed to save task.", { id: toastId });
        setTasks(originalTasks);
        console.error("Failed to save task:", err);
      }
    },
    [tasks, editingText]
  );

  return (
    <>
      <div>
        <Card className={styles.mb8}>
          <div>
            <h3 className={styles.sectionTitle}>Create a New Task</h3>
            <form onSubmit={handleCreateTask} className={styles.createTaskForm}>
              <input
                type="text"
                className={styles.textInput}
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="What do you need to do?"
              />
              <button
                type="submit"
                disabled={isCreating}
                className={styles.primaryButton}
              >
                {isCreating ? (
                  "Adding..."
                ) : (
                  <>
                    <FiPlus /> <span>Add Task</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </Card>

        <Card>
          <main>
            <h2 className={styles.sectionTitle}>Your Tasks</h2>
            {loadingTasks && (
              <p style={{ textAlign: "center", padding: "1rem" }}>
                Loading tasks...
              </p>
            )}
            <ul className={styles.tasksList}>
              {!loadingTasks && tasks.length === 0 && (
                <p className={styles.noTasks}>You have no tasks yet.</p>
              )}
              {tasks.map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    disabled={editingTaskId === task.id}
                  />

                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveEdit(task)
                      }
                      onBlur={() => handleCancelEdit()}
                      className={styles.editInput}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`${styles.taskDescription} ${
                        task.completed ? styles.completed : ""
                      }`}
                    >
                      {task.description}
                    </span>
                  )}

                  <div className={styles.taskActions}>
                    {editingTaskId === task.id ? (
                      <>
                        <button
                          className={styles.saveButton}
                          onMouseDown={() => handleSaveEdit(task)}
                        >
                          <FiSave size={18} />
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={handleCancelEdit}
                        >
                          <FiXCircle size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditClick(task)}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(task)}
                          className={styles.deleteButton}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </main>
        </Card>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Task"
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button
              className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
              onClick={confirmDeleteTask}
            >
              Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this task: "
          <strong>{taskToDelete?.description}</strong>"?
        </p>
      </Modal>
    </>
  );
}

export default TaskWidget;
