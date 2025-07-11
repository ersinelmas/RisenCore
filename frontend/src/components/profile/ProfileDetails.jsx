import Card from "../Card";
import { useAuth } from "../../hooks/useAuth";
import styles from './ProfileDetails.module.css';

function ProfileDetails() {
    const { user } = useAuth();

    return (
        <Card>
            <h2 className={styles.title}>Account Information</h2>
            <div className={styles.infoGrid}>
                <div className={styles.infoLabel}>Full Name</div>
                <div className={styles.infoValue}>{user?.firstName} {user?.lastName}</div>

                <div className={styles.infoLabel}>Username</div>
                <div className={styles.infoValue}>{user?.username}</div>

                <div className={styles.infoLabel}>Email Address</div>
                <div className={styles.infoValue}>{user?.email}</div>

                <div className={styles.infoLabel}>Roles</div>
                <div className={styles.infoValue}>
                    {user?.roles?.map(role => (
                        <span 
                            key={role}
                            className={`${styles.roleBadge} ${
                                role === 'ADMIN' ? styles.roleAdmin : styles.roleUser
                            }`}
                        >
                            {role.replace('ROLE_', '')}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );
}

export default ProfileDetails;