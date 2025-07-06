import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(username, email, password);
      // After successful registration, navigate to the login page
      navigate('/login');
    } catch (err) {
      // Assuming the backend sends a meaningful error message
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text" id="username" value={username}
            onChange={(e) => setUsername(e.target.value)} required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email" id="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password" id="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={6}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;