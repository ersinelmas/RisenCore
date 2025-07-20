import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import taskService from '../../services/taskService';
import styles from './TaskWidget.module.css';
import Card from '../../components/Card';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import modalStyles from '../../components/common/Modal.module.css';

function TaskWidget() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // State to keep track of which task is about to be deleted
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

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
    const originalTasks = [...tasks];
    const updatedTasks = tasks.map(t =>
      t.id === taskToToggle.id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    try {
      await taskService.updateTask(taskToToggle.id, { completed: !taskToToggle.completed });
    } catch (err) {
      toast.error('Failed to update task.');
      setTasks(originalTasks);
      console.error('Failed to update task:', err);
    }
  }, [tasks]);

  // Function to open the confirmation modal
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    openDeleteModal();
  };
  
  // Function to be called when deletion is confirmed in the modal
  const confirmDeleteTask = useCallback(async () => {
    if (!taskToDelete) return;
    
    closeDeleteModal();
    const toastId = toast.loading('Deleting task...');
    const originalTasks = [...tasks];
    const updatedTasks = tasks.filter(t => t.id !== taskToDelete.id);
    setTasks(updatedTasks);
    
    try {
      await taskService.deleteTask(taskToDelete.id);
      toast.success('Task deleted.', { id: toastId });
    } catch (err) {
      toast.error('Failed to delete task.', { id: toastId });
      setTasks(originalTasks);
      console.error('Failed to delete task:', err);
    } finally {
      setTaskToDelete(null);
    }
  }, [tasks, taskToDelete, closeDeleteModal]);

  return (
    <>
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
                  <button
                      onClick={() => handleDeleteClick(task)}
                      className={styles.deleteButton}
                    >
                      <FiTrash2 size={18}/>
                  </button>
                </li>
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
            <button className={modalStyles.actionButton} onClick={closeDeleteModal}>Cancel</button>
            <button className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`} onClick={confirmDeleteTask}>Delete</button>
          </>
        }
      >
        <p>Are you sure you want to delete this task: "<strong>{taskToDelete?.description}</strong>"?</p>
      </Modal>
    </>
  );
}

export default TaskWidget;