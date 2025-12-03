import styles from './AuthLayout.module.css';
import bannerImage from '../../assets/auth-banner.png';
import FixedLanguageSwitcher from '../common/FixedLanguageSwitcher';

function AuthLayout({ children }) {
  return (
    <div className={styles.authContainer}>
      <FixedLanguageSwitcher className="authOnly" />
      <div className={styles.layoutGrid}>
        {/* Left Column: Banner Card */}
        <div className={styles.bannerCard}>
          <img
            src={bannerImage}
            alt="RisenCore Banner"
            className={styles.bannerImage}
          />
        </div>

        {/* Right Column: Form Card */}
        <div className={styles.formCard}>
          {children} {/* LoginPage or RegisterPage will be rendered here */}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;