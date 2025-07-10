import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import taskService from '../../services/taskService';
import styles from './TaskWidget.module.css';
import Card from '../../components/Card';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

function TaskWidget() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const response = await taskService.getAllTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load tasks.');
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = useCallback(async (event) => {
    event.preventDefault();
    if (!newTaskDescription.trim()) {
      toast.error('Task description cannot be empty.');
      return;
    }

    const toastId = toast.loading('Creating task...');
    setIsCreating(true);

    try {
      await taskService.createTask(newTaskDescription);
      setNewTaskDescription('');
      await fetchTasks();
      toast.success('Task created successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to create task.', { id: toastId });
      console.error('Failed to create task:', err);
    } finally {
      setIsCreating(false);
    }
  }, [newTaskDescription, fetchTasks]);

  const handleToggleComplete = useCallback(async (taskToToggle) => {
    const originalTasks = tasks;
    const updatedTasks = tasks.map(t =>
      t.id === taskToToggle.id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    try {
      await taskService.updateTask(taskToToggle.id, { completed: !taskToToggle.completed });
      toast.success('Task status updated!');
    } catch (err) {
      toast.error('Failed to update task.');
      setTasks(originalTasks); // Revert UI on error
      console.error('Failed to update task:', err);
    }
  }, [tasks]);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const originalTasks = tasks;
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      
      const toastId = toast.loading('Deleting task...');
      try {
        await taskService.deleteTask(taskId);
        toast.success('Task deleted.', { id: toastId });
      } catch (err) {
        toast.error('Failed to delete task.', { id: toastId });
        setTasks(originalTasks); // Revert UI on error
        console.error('Failed to delete task:', err);
      }
    }
  }, [tasks]);

  return (
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
            <button type="submit" disabled={isCreating} className={styles.primaryButton}>
              {isCreating ? 'Adding...' : <><FiPlus /> <span>Add Task</span></>}
            </button>
          </form>
        </div>
      </Card>

      <Card>
        <main>
          <h2 className={styles.sectionTitle}>Your Tasks</h2>
          {loadingTasks && <p>Loading tasks...</p>}
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
                />
                <span className={`${styles.taskDescription} ${task.completed ? styles.completed : ''}`}>
                  {task.description}
                </span>
                <button onClick={() => handleDeleteTask(task.id)} className={styles.deleteButton}>
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </main>
      </Card>
    </div>
  );
}

export default TaskWidget;