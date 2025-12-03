import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import PageLayout from "../components/layout/PageLayout";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import styles from "./ProfilePage.module.css";
import ProfileDetails from "../components/profile/ProfileDetails";
import { useTranslation } from "react-i18next";

function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("details");

  const userInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "?";

  return (
    <PageLayout title={t("profile.title")}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{userInitial}</div>
        <div className={styles.userInfo}>
          <h2>
            {user?.firstName} {user?.lastName}
          </h2>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === "details" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("details")}
        >
          {t("profile.profileDetails")}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "password" ? styles.active : ""
            }`}
          onClick={() => setActiveTab("password")}
        >
          {t("profile.changePassword")}
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "details" && <ProfileDetails />}
        {activeTab === "password" && <ChangePasswordForm />}
      </div>
    </PageLayout>
  );
}

export default ProfilePage;
