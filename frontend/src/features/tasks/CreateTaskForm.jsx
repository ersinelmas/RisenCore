import { useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/Card";
import styles from "./TaskWidget.module.css";
import { FiPlus } from "react-icons/fi";

function CreateTaskForm({ onCreateTask, isCreating }) {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreateTask(description, () => {
      setDescription("");
    });
  };

  return (
    <Card className={styles.mb8}>
      <div>
        <h3 className={styles.sectionTitle}>{t("tasks.createNewTask")}</h3>
        <form onSubmit={handleSubmit} className={styles.createTaskForm}>
          <input
            type="text"
            className={styles.textInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("tasks.descriptionPlaceholder")}
            aria-label={t("tasks.descriptionPlaceholder")}
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={isCreating || !description.trim()}
            className={styles.primaryButton}
          >
            {isCreating ? (
              t("tasks.adding")
            ) : (
              <>
                <FiPlus /> <span>{t("tasks.addTask")}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </Card>
  );
}

export default CreateTaskForm;
