import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import styles from "./TaskWidget.module.css";
import Card from "../../components/Card";
import Modal from "../../components/common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../../components/common/Modal.module.css";
import TaskItem from "./TaskItem";
import CreateTaskForm from "./CreateTaskForm";

function TaskWidget() {
  const {
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
  } = useTasks();

  const [taskToDelete, setTaskToDelete] = useState(null);
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const handleCreateTask = (description, callback) => {
    createTask(description, callback);
  };

  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
    }
    closeDeleteModal();
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.description);
  };

  const handleSaveEdit = (task, newDescription) => {
    updateTaskDescription(task, newDescription);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  return (
    <>
      <div>
        <CreateTaskForm
          onCreateTask={handleCreateTask}
          isCreating={isCreating}
        />

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
                <TaskItem
                  key={task.id}
                  task={task}
                  editingState={{
                    editingTaskId,
                    editingText,
                    setEditingText,
                  }}
                  onToggleComplete={toggleTaskComplete}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveEdit}
                  onDelete={handleDeleteRequest}
                />
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
              onClick={confirmDelete}
            >
              Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this task: "
          <strong>{taskToDelete?.description}</strong>"? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
}

export default TaskWidget;
