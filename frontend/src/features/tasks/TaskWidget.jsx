import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import styles from "./TaskWidget.module.css";
import Card from "../../components/Card";
import Modal from "../../components/common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../../components/common/Modal.module.css";
import TaskItem from "./TaskItem";
import CreateTaskForm from "./CreateTaskForm";

import { useTranslation } from "react-i18next";

function TaskWidget() {
  const { t } = useTranslation();
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
            <h2 className={styles.sectionTitle}>{t("tasks.yourTasks")}</h2>

            {loadingTasks && (
              <p style={{ textAlign: "center", padding: "1rem" }}>
                {t("tasks.loading")}
              </p>
            )}

            <ul className={styles.tasksList}>
              {!loadingTasks && tasks.length === 0 && (
                <p className={styles.noTasks}>{t("tasks.noTasks")}</p>
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
        title={t("tasks.deleteTask")}
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeDeleteModal}
            >
              {t("tasks.cancel")}
            </button>
            <button
              className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
              onClick={confirmDelete}
            >
              {t("tasks.delete")}
            </button>
          </>
        }
      >
        <p>
          {t("tasks.deleteConfirm")} "
          <strong>{taskToDelete?.description}</strong>"? {t("tasks.cannotUndo")}
        </p>
      </Modal>
    </>
  );
}

export default TaskWidget;
