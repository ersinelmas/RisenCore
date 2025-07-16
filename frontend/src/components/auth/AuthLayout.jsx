import styles from './AuthLayout.module.css';
import bannerImage from '../../assets/auth-banner.png';

function AuthLayout({ children }) {
  return (
    <div className={styles.authContainer}>
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