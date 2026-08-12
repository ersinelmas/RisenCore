import { useTranslation } from "react-i18next";
import styles from "./TaskWidget.module.css";
import { FiTrash2, FiEdit2, FiSave, FiXCircle } from "react-icons/fi";

function TaskItem({
  task,
  editingState,
  onToggleComplete,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}) {
  const { t } = useTranslation();
  const { editingTaskId, editingText, setEditingText } = editingState;
  const isEditing = editingTaskId === task.id;

  const handleSaveWithEnter = (e) => {
    if (e.key === "Enter") {
      onSave(task, editingText);
    }
  };

  return (
    <li className={styles.taskItem}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={task.completed}
        onChange={() => onToggleComplete(task)}
        disabled={isEditing}
        aria-label={task.description}
      />

      {isEditing ? (
        <input
          type="text"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onKeyDown={handleSaveWithEnter}
          onBlur={onCancelEdit}
          className={styles.editInput}
          aria-label={t("tasks.descriptionPlaceholder")}
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
        {isEditing ? (
          <>
            <button
              className={styles.saveButton}
              onMouseDown={() => onSave(task, editingText)}
              aria-label={t("common.save")}
            >
              <FiSave size={18} />
            </button>
            <button
              className={styles.cancelButton}
              onClick={onCancelEdit}
              aria-label={t("common.cancel")}
            >
              <FiXCircle size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.editButton}
              onClick={() => onStartEdit(task)}
              aria-label={t("common.edit")}
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(task)}
              className={styles.deleteButton}
              aria-label={t("common.delete")}
            >
              <FiTrash2 size={18} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default TaskItem;
