import Card from "../Card";
import { useAuth } from "../../hooks/useAuth";
import styles from './ProfileDetails.module.css';

import { useTranslation } from "react-i18next";

function ProfileDetails() {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <Card>
            <h2 className={styles.title}>{t("profile.accountInfo")}</h2>
            <div className={styles.infoGrid}>
                <div className={styles.infoLabel}>{t("profile.fullName")}</div>
                <div className={styles.infoValue}>{user?.firstName} {user?.lastName}</div>

                <div className={styles.infoLabel}>{t("profile.username")}</div>
                <div className={styles.infoValue}>{user?.username}</div>

                <div className={styles.infoLabel}>{t("profile.email")}</div>
                <div className={styles.infoValue}>{user?.email}</div>

                <div className={styles.infoLabel}>{t("profile.roles")}</div>
                <div className={styles.infoValue}>
                    {user?.roles?.map(role => (
                        <span
                            key={role}
                            className={`${styles.roleBadge} ${role === 'ADMIN' ? styles.roleAdmin : styles.roleUser
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