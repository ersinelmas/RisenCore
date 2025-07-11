import { useState } from 'react';
import toast from 'react-hot-toast';
import userService from '../../services/userService';
import styles from '../../pages/ProfilePage.module.css';
import Card from '../Card';

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (newPassword !== confirmationPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Changing password...');

    try {
      const passwordData = { currentPassword, newPassword, confirmationPassword };
      await userService.changePassword(passwordData);
      toast.success('Password changed successfully!', { id: toastId });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmationPassword('');
    } catch (error) {
      const errorMessage = error.response?.data || "Failed to change password.";
      toast.error(errorMessage, { id: toastId });
      console.error("Password change failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
            <label htmlFor="currentPassword" className={styles.label}>Current Password</label>
            <input
              type="password" id="currentPassword" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword" className={styles.label}>New Password</label>
            <input
              type="password" id="newPassword" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required minLength={6} className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmationPassword" className={styles.label}>Confirm New Password</label>
            <input
              type="password" id="confirmationPassword" value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              required className={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
      </form>
    </Card>
  );
}

export default ChangePasswordForm;