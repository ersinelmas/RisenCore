import { useState, useEffect, useCallback } from "react";
import adminService from "../services/adminService";
import toast from "react-hot-toast";
import styles from "./AdminPage.module.css";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/Card";
import Modal from "../components/common/Modal";
import { useModal } from "../hooks/useModal";
import modalStyles from "../components/common/Modal.module.css";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

function AdminPage() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userToModify, setUserToModify] = useState(null);
  const {
    isOpen: isPromoteModalOpen,
    openModal: openPromoteModal,
    closeModal: closePromoteModal,
  } = useModal();
  const {
    isOpen: isDemoteModalOpen,
    openModal: openDemoteModal,
    closeModal: closeDemoteModal,
  } = useModal();
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      toast.error(t("admin.fetchError"));
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePromoteClick = (user) => {
    setUserToModify(user);
    openPromoteModal();
  };

  const confirmPromote = useCallback(async () => {
    if (!userToModify) return;
    closePromoteModal();
    const toastId = toast.loading(`${t("admin.promoting")} ${userToModify.username}...`);
    try {
      await adminService.promoteUser(userToModify.username);
      toast.success(t("admin.promotedSuccess"), { id: toastId });
      fetchUsers();
    } catch (err) {
      toast.error(t("admin.promoteError"), { id: toastId });
      console.error("Promote user error:", err);
    } finally {
      setUserToModify(null);
    }
  }, [userToModify, closePromoteModal, fetchUsers, t]);

  const handleDemoteClick = (user) => {
    setUserToModify(user);
    openDemoteModal();
  };

  const confirmDemote = useCallback(async () => {
    if (!userToModify) return;
    closeDemoteModal();
    const toastId = toast.loading(`${t("admin.demoting")} ${userToModify.username}...`);
    try {
      await adminService.demoteUser(userToModify.username);
      toast.success(t("admin.demotedSuccess"), { id: toastId });
      fetchUsers();
    } catch (err) {
      toast.error(t("admin.demoteError"), { id: toastId });
      console.error("Demote user error:", err);
    } finally {
      setUserToModify(null);
    }
  }, [userToModify, closeDemoteModal, fetchUsers, t]);

  const handleDeleteClick = (user) => {
    if (currentUser?.username === user.username) {
      toast.error(t("admin.selfDeleteError"));
      return;
    }
    setUserToModify(user);
    openDeleteModal();
  };

  const confirmDelete = useCallback(async () => {
    if (!userToModify) return;
    closeDeleteModal();
    const toastId = toast.loading(`${t("admin.deleting")} ${userToModify.username}...`);
    try {
      await adminService.deleteUser(userToModify.id);
      toast.success(t("admin.deletedSuccess"), { id: toastId });
      fetchUsers();
    } catch (err) {
      toast.error(t("admin.deleteError"), { id: toastId });
      console.error("Delete user error:", err);
    } finally {
      setUserToModify(null);
    }
  }, [userToModify, closeDeleteModal, fetchUsers, t]);

  return (
    <>
      <PageLayout title={t("admin.title")}>
        <Card>
          {loading ? (
            <p style={{ padding: "2rem", textAlign: "center" }}>
              {t("admin.loading")}
            </p>
          ) : users.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>{t("admin.id")}</th>
                    <th>{t("admin.username")}</th>
                    <th>{t("admin.fullName")}</th>
                    <th>{t("admin.email")}</th>
                    <th>{t("admin.roles")}</th>
                    <th>{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className={`${styles.roleBadge} ${role === "ADMIN"
                              ? styles.roleAdmin
                              : styles.roleUser
                              }`}
                          >
                            {role}
                          </span>
                        ))}
                      </td>
                      <td className={styles.actionsCell}>
                        {currentUser?.username === user.username ? (
                          <span className={styles.currentUserBadge}>
                            {t("admin.currentUser")}
                          </span>
                        ) : (
                          <>
                            {!user.roles.includes("ADMIN") ? (
                              <button
                                className={`${styles.actionButton} ${styles.promoteButton}`}
                                onClick={() => handlePromoteClick(user)}
                              >
                                {t("admin.promote")}
                              </button>
                            ) : (
                              <button
                                className={`${styles.actionButton} ${styles.demoteButton}`}
                                onClick={() => handleDemoteClick(user)}
                              >
                                {t("admin.demote")}
                              </button>
                            )}
                            <button
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              onClick={() => handleDeleteClick(user)}
                            >
                              {t("admin.delete")}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--color-text-secondary)",
              }}
            >
              {t("admin.noUsers")}
            </p>
          )}
        </Card>
      </PageLayout>

      <Modal
        isOpen={isPromoteModalOpen}
        onClose={closePromoteModal}
        title={t("admin.confirmPromotion")}
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closePromoteModal}
            >
              {t("common.cancel")}
            </button>
            <button
              className={`${modalStyles.actionButton} ${styles.promoteConfirmButton}`}
              onClick={confirmPromote}
            >
              {t("admin.promote")}
            </button>
          </>
        }
      >
        <p>
          {t("admin.promoteMessage")}{" "}
          <strong>{userToModify?.username}</strong> {t("admin.toAdmin")}
        </p>
      </Modal>

      <Modal
        isOpen={isDemoteModalOpen}
        onClose={closeDemoteModal}
        title={t("admin.confirmDemotion")}
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeDemoteModal}
            >
              {t("common.cancel")}
            </button>
            <button
              className={`${modalStyles.actionButton} ${styles.demoteConfirmButton}`}
              onClick={confirmDemote}
            >
              {t("admin.demote")}
            </button>
          </>
        }
      >
        <p>
          {t("admin.demoteMessage")}{" "}
          <strong>{userToModify?.username}</strong> {t("admin.fromAdmin")}
        </p>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title={t("admin.confirmDeletion")}
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeDeleteModal}
            >
              {t("common.cancel")}
            </button>
            <button
              className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
              onClick={confirmDelete}
            >
              {t("admin.delete")}
            </button>
          </>
        }
      >
        <p>
          {t("admin.deleteMessage")}{" "}
          <strong>{userToModify?.username}</strong>? {t("admin.permanentAction")}
        </p>
      </Modal>
    </>
  );
}

export default AdminPage;
