import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import taskService from '../services/taskService';

function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');

  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchTasks = () => {
    setLoadingTasks(true);
    setError('');
    taskService.getAllTasks()
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch tasks:', error);
        setError('Failed to load tasks.');
      })
      .finally(() => {
        setLoadingTasks(false);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!newTaskDescription.trim()) return; 

    setIsCreating(true);
    setError('');

    try {
      await taskService.createTask(newTaskDescription);
      setNewTaskDescription('');
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task.');
    } finally {
      setIsCreating(false);
    }
  };


  return (
    <div>
      <h1>Welcome to RisenCore!</h1>
      {isAuthenticated ? (
        <div>
          <p>Hello, {user?.username}!</p>
          <button onClick={logout}>Logout</button>
          <hr />
          
          {/* --- CREATE TASK FORM --- */}
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
          {/* --- END --- */}

          <h2>Your Tasks</h2>
          {loadingTasks && <p>Loading tasks...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <ul>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <li key={task.id}>
                  {task.description} - {task.completed ? 'Completed' : 'Pending'}
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