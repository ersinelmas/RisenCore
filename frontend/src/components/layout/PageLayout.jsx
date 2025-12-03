import styles from './PageLayout.module.css';
import FixedLanguageSwitcher from '../common/FixedLanguageSwitcher';

function PageLayout({ title, children }) {
  return (
    <div className={styles.pageLayout}>
      <FixedLanguageSwitcher />
      {title && <h1 className={styles.title}>{title}</h1>}
      <div>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;