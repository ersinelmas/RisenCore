import styles from './PageLayout.module.css';

function PageLayout({ title, children }) {
  return (
    <div className={styles.pageLayout}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;