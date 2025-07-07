import { useState, useEffect, useCallback } from 'react';
import taskService from '../../services/taskService';
import styles from './TaskWidget.module.css';
import Card from '../../components/Card';

function TaskWidget() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    setError('');
    try {
      const response = await taskService.getAllTasks();
      setTasks(response.data);
    } catch (error) {
      setError('Failed to load tasks.');
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    // This widget is only ever rendered when the user is authenticated,
    // so we can fetch tasks immediately on mount.
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = useCallback(async (event) => {
    event.preventDefault();
    if (!newTaskDescription.trim()) return;
    setIsCreating(true);
    setError('');
    try {
      await taskService.createTask(newTaskDescription);
      setNewTaskDescription('');
      await fetchTasks();
    } catch (err) {
      setError('Failed to create task.');
      console.error('Failed to create task:', err);
    } finally {
      setIsCreating(false);
    }
  }, [newTaskDescription, fetchTasks]);

  const handleToggleComplete = useCallback(async (taskToToggle) => {
    try {
      setTasks(currentTasks =>
        currentTasks.map(task =>
          task.id === taskToToggle.id ? { ...task, completed: !task.completed } : task
        )
      );
      await taskService.updateTask(taskToToggle.id, { completed: !taskToToggle.completed });
    } catch (err) {
      setError('Failed to update task. Reverting changes.');
      console.error('Failed to update task:', err);
      await fetchTasks();
    }
  }, [fetchTasks]);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setTasks(currentTasks => currentTasks.filter(t => t.id !== taskId));
        await taskService.deleteTask(taskId);
      } catch (err) {
        setError('Failed to delete task. Reverting changes.');
        console.error('Failed to delete task:', err);
        await fetchTasks();
      }
    }
  }, [fetchTasks]);

  return (
    // The main container div for the entire widget.
    <div>
      {/* 'mb8' sınıfını Card'a dışarıdan vereceğiz */}
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
            <button type="submit" disabled={isCreating} className={styles.primaryButton}>
              {isCreating ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>
      </Card>

      <Card>
        <main>
          <h2 className={styles.sectionTitle}>Your Tasks</h2>
          {loadingTasks && <p>Loading tasks...</p>}
          {error && <p className={styles.error}>{error}</p>}
          <ul className={styles.tasksList}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                  />
                  <span
                    className={`${styles.taskDescription} ${
                      task.completed ? styles.completed : ''
                    }`}
                  >
                    {task.description}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              !loadingTasks && <p className={styles.noTasks}>You have no tasks yet.</p>
            )}
          </ul>
        </main>
      </Card>
    </div>
  );
}

export default TaskWidget;