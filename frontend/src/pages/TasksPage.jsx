import TaskWidget from '../features/tasks/TaskWidget';
import styles from './TasksPage.module.css';

function TasksPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>My Tasks</h1>
      <p className={styles.subtitle}>
        Here you can manage all of your personal tasks.
      </p>
      <TaskWidget />
    </div>
  );
}

export default TasksPage;