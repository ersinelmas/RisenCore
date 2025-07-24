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
      />

      {isEditing ? (
        <input
          type="text"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onKeyDown={handleSaveWithEnter}
          onBlur={onCancelEdit}
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
        {isEditing ? (
          <>
            <button
              className={styles.saveButton}
              onMouseDown={() => onSave(task, editingText)}
            >
              <FiSave size={18} />
            </button>
            <button className={styles.cancelButton} onClick={onCancelEdit}>
              <FiXCircle size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.editButton}
              onClick={() => onStartEdit(task)}
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(task)}
              className={styles.deleteButton}
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
