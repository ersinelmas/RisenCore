import { useState } from 'react';
import toast from 'react-hot-toast';
import userService from '../../services/userService';
import styles from '../../pages/ProfilePage.module.css';
import Card from '../Card';

import { useTranslation } from 'react-i18next';

function ChangePasswordForm() {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmationPassword) {
      toast.error(t("profile.passwordMismatch"));
      return;
    }

    setLoading(true);
    const toastId = toast.loading(t("profile.changingPassword"));

    try {
      const passwordData = { currentPassword, newPassword, confirmationPassword };
      await userService.changePassword(passwordData);
      toast.success(t("profile.passwordChanged"), { id: toastId });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmationPassword('');
    } catch (error) {
      const errorMessage = error.response?.data || t("profile.passwordChangeFailed");
      toast.error(errorMessage, { id: toastId });
      console.error("Password change failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>{t("profile.changePassword")}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="currentPassword" className={styles.label}>{t("profile.currentPassword")}</label>
          <input
            type="password" id="currentPassword" value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="newPassword" className={styles.label}>{t("profile.newPassword")}</label>
          <input
            type="password" id="newPassword" value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required minLength={6} className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmationPassword" className={styles.label}>{t("profile.confirmNewPassword")}</label>
          <input
            type="password" id="confirmationPassword" value={confirmationPassword}
            onChange={(e) => setConfirmationPassword(e.target.value)}
            required className={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? t("profile.saving") : t("profile.saveChanges")}
        </button>
      </form>
    </Card>
  );
}

export default ChangePasswordForm;