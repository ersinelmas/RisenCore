import { useState } from "react";
import Card from "../../components/Card";
import styles from "./TaskWidget.module.css";
import { FiPlus } from "react-icons/fi";

function CreateTaskForm({ onCreateTask, isCreating }) {
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
        <h3 className={styles.sectionTitle}>Create a New Task</h3>
        <form onSubmit={handleSubmit} className={styles.createTaskForm}>
          <input
            type="text"
            className={styles.textInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you need to do?"
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={isCreating || !description.trim()}
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
  );
}

export default CreateTaskForm;
