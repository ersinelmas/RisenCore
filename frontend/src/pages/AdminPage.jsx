import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';
import styles from './AdminPage.module.css';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/Card';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAllUsers()
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        toast.error("Failed to fetch users.");
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PageLayout title="Admin Panel - User Management">
      <Card>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Roles</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.roles.map(role => (
                        <span
                          key={role}
                          className={`${styles.roleBadge} ${role === 'ADMIN' ? styles.roleAdmin : styles.roleUser}`}
                        >
                          {role.replace('ROLE_', '')}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageLayout>
  );
}

export default AdminPage;