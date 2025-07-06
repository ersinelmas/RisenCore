import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import et

function App() {
  return (
    <Routes>
      {/* These routes are public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* These routes are protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        {/* Add other protected routes here in the future, e.g., /profile, /settings */}
      </Route>
    </Routes>
  );
}

export default App;