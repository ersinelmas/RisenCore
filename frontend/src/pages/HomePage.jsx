import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import taskService from '../services/taskService';

const taskItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px',
  borderBottom: '1px solid #ccc',
};

function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
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
  }, []); // This function has no external dependencies, so the array is empty.

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]); // Add fetchTasks as a dependency.

  const handleCreateTask = useCallback(async (event) => {
    event.preventDefault();
    if (!newTaskDescription.trim()) return;

    setIsCreating(true);
    setError('');
    try {
      await taskService.createTask(newTaskDescription);
      setNewTaskDescription('');
      await fetchTasks(); // Re-fetch tasks to show the new one.
    } catch (err) {
      setError('Failed to create task.');
      console.error('Failed to create task:', err);
    } finally {
      setIsCreating(false);
    }
  }, [newTaskDescription, fetchTasks]); // Depends on these values.

  const handleToggleComplete = useCallback(async (taskToToggle) => {
    try {
      // Optimistic UI update for a better user experience.
      setTasks(currentTasks =>
        currentTasks.map(task =>
          task.id === taskToToggle.id ? { ...task, completed: !task.completed } : task
        )
      );
      await taskService.updateTask(taskToToggle.id, { completed: !taskToToggle.completed });
    } catch (err) {
      setError('Failed to update task. Reverting changes.');
      console.error('Failed to update task:', err);
      // Revert UI on error by fetching the source of truth from the server.
      await fetchTasks();
    }
  }, [fetchTasks]); // Depends on fetchTasks to revert on error.

  const handleDeleteTask = useCallback(async (taskId) => {
    // A simple confirmation before a destructive action.
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // Optimistic UI update.
        setTasks(currentTasks => currentTasks.filter(t => t.id !== taskId));
        await taskService.deleteTask(taskId);
      } catch (err) {
        setError('Failed to delete task. Reverting changes.');
        console.error('Failed to delete task:', err);
        await fetchTasks();
      }
    }
  }, [fetchTasks]); // Depends on fetchTasks to revert on error.

  return (
    <div>
      <h1>Welcome to RisenCore!</h1>
      {isAuthenticated ? (
        <div>
          <p>Hello, {user?.username}!</p>
          <button onClick={logout}>Logout</button>
          <hr />
          
          <form onSubmit={handleCreateTask}>
            <h3>Create a New Task</h3>
            <input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="What do you need to do?"
            />
            <button type="submit" disabled={isCreating}>
              {isCreating ? 'Adding...' : 'Add Task'}
            </button>
          </form>

          <h2>Your Tasks</h2>
          {loadingTasks && <p>Loading tasks...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <li key={task.id} style={taskItemStyle}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                  />
                  <span style={{ textDecoration: task.completed ? 'line-through' : 'none', flexGrow: 1, margin: '0 10px' }}>
                    {task.description}
                  </span>
                  <button onClick={() => handleDeleteTask(task.id)} style={{color: 'red'}}>
                    Delete
                  </button>
                </li>
              ))
            ) : (
              !loadingTasks && <p>You have no tasks yet.</p>
            )}
          </ul>
        </div>
      ) : (
        <div>
          <p>Please log in to manage your tasks.</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;