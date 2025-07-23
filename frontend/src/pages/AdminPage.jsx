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

function AdminPage() {
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
      toast.error("Failed to fetch users.");
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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
    const toastId = toast.loading(`Promoting ${userToModify.username}...`);
    try {
      await adminService.promoteUser(userToModify.username);
      toast.success("User promoted to Admin!", { id: toastId });
      fetchUsers();
    } catch (err) {
      toast.error("Failed to promote user.", { id: toastId });
      console.error("Promote user error:", err);
    } finally {
      setUserToModify(null);
    }
  }, [userToModify, closePromoteModal, fetchUsers]);

  const handleDemoteClick = (user) => {
    setUserToModify(user);
    openDemoteModal();
  };

  const confirmDemote = useCallback(async () => {
    if (!userToModify) return;
    closeDemoteModal();
    const toastId = toast.loading(`Demoting ${userToModify.username}...`);
    try {
      await adminService.demoteUser(userToModify.username);
      toast.success("User demoted from Admin!", { id: toastId });
      fetchUsers();
    } catch (err) {
      toast.error("Failed to demote user.", { id: toastId });
      console.error("Demote user error:", err);
    } finally {
      setUserToModify(null);
    }
  }, [userToModify, closeDemoteModal, fetchUsers]);

  const handleDeleteClick = (user) => {
    if (currentUser?.username === user.username) {
      toast.error("You cannot delete your own account.");
      return;
    }
    setUserToModify(user);
    openDeleteModal();
  };

  const confirmDelete = useCallback(async () => {
    if (!userToModify) return;
    closeDeleteModal();
    const toastId = toast.loading(`Deleting ${userToModify.username}...`);
    try {
      await adminService.deleteUser(userToModify.id);
      toast.success("User deleted!", { id: toastId });
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user.", { id: toastId });
      console.error("Delete user error:", err);
    } finally {
      setUserToModify(null);
    }
  }, [userToModify, closeDeleteModal, fetchUsers]);

  return (
    <>
      <PageLayout title="Admin Panel - User Management">
        <Card>
          {loading ? (
            <p style={{ padding: "2rem", textAlign: "center" }}>
              Loading users...
            </p>
          ) : users.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Roles</th>
                    <th>Actions</th>
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
                            className={`${styles.roleBadge} ${
                              role === "ADMIN"
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
                            Current User
                          </span>
                        ) : (
                          <>
                            {!user.roles.includes("ADMIN") ? (
                              <button
                                className={styles.actionButton}
                                onClick={() => handlePromoteClick(user)}
                              >
                                Promote
                              </button>
                            ) : (
                              <button
                                className={`${styles.actionButton} ${styles.demoteButton}`}
                                onClick={() => handleDemoteClick(user)}
                              >
                                Demote
                              </button>
                            )}
                            <button
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              onClick={() => handleDeleteClick(user)}
                            >
                              Delete
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
              No users found in the system.
            </p>
          )}
        </Card>
      </PageLayout>

      <Modal
        isOpen={isPromoteModalOpen}
        onClose={closePromoteModal}
        title="Confirm Promotion"
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closePromoteModal}
            >
              Cancel
            </button>
            <button
              className={`${modalStyles.actionButton} ${styles.promoteConfirmButton}`}
              onClick={confirmPromote}
            >
              Promote
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to promote{" "}
          <strong>{userToModify?.username}</strong> to ADMIN?
        </p>
      </Modal>

      <Modal
        isOpen={isDemoteModalOpen}
        onClose={closeDemoteModal}
        title="Confirm Demotion"
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeDemoteModal}
            >
              Cancel
            </button>
            <button
              className={`${modalStyles.actionButton} ${styles.demoteConfirmButton}`}
              onClick={confirmDemote}
            >
              Demote
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to demote{" "}
          <strong>{userToModify?.username}</strong> from ADMIN role?
        </p>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button
              className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
              onClick={confirmDelete}
            >
              Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete user{" "}
          <strong>{userToModify?.username}</strong>? This action is permanent.
        </p>
      </Modal>
    </>
  );
}

export default AdminPage;
