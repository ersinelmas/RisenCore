import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import styles from "./TaskWidget.module.css";
import Card from "../../components/Card";
import Modal from "../../components/common/Modal";
import { useModal } from "../../hooks/useModal";
import modalStyles from "../../components/common/Modal.module.css";
import TaskItem from "./TaskItem";
import CreateTaskForm from "./CreateTaskForm";
import TaskStats from "./TaskStats";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import EmptyState from "../../components/common/EmptyState";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

import { useTranslation } from "react-i18next";

function TaskWidget({ isAddModalOpen, closeAddModal }) {
  const { t } = useTranslation();
  const {
    tasks,
    loadingTasks,
    error,
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
    createTask(description, () => {
      callback();
      closeAddModal();
    });
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
      <div className={styles.layoutGrid}>
        <Card>
          <main>
            <h2 className={styles.sectionTitle}>{t("tasks.yourTasks")}</h2>

            {loadingTasks && (
              <LoadingIndicator messageKey="tasks.loading" />
            )}

            {error ? (
              <EmptyState
                icon={<FiAlertTriangle />}
                title={t("tasks.loadError")}
                description={t("tasks.loadErrorDescription")}
              />
            ) : (
              <ul className={styles.tasksList}>
                {!loadingTasks && tasks.length === 0 && (
                  <EmptyState
                    compact
                    icon={<FiCheckCircle />}
                    title={t("tasks.noTasks")}
                    description={t("tasks.noTasksDescription")}
                  />
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
            )}
          </main>
        </Card>

        <TaskStats tasks={tasks} />
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title={t("tasks.createNewTask")}
      >
        <CreateTaskForm
          onCreateTask={handleCreateTask}
          isCreating={isCreating}
        />
      </Modal>

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
