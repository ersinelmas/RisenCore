import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PageLayout from '../components/layout/PageLayout';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import styles from './ProfilePage.module.css';

import ProfileDetails from '../components/profile/ProfileDetails';

function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details');

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <PageLayout title="Profile & Settings">
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{userInitial}</div>
        <div className={styles.userInfo}>
          <h2>{user?.firstName} {user?.lastName}</h2>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'details' ? styles.active : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Profile Details
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'password' ? styles.active : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'details' && <ProfileDetails />}
        {activeTab === 'password' && <ChangePasswordForm />}
      </div>
    </PageLayout>
  );
}

export default ProfilePage;