import styles from './PageLayout.module.css';

function PageLayout({ title, headerAction, children }) {
  return (
    <div className={styles.pageLayout}>
      {(title || headerAction) && (
        <div className={styles.header}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {headerAction && <div className={styles.headerAction}>{headerAction}</div>}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
