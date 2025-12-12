import { useTranslation } from "react-i18next";
import styles from "./EmptyState.module.css";

const EmptyState = ({
  icon = "📭",
  title,
  description,
  titleKey = "common.emptyTitle",
  descriptionKey = "common.emptyDescription",
  actionLabel,
  actionLabelKey = "common.retry",
  onAction,
  compact = false,
}) => {
  const { t } = useTranslation();
  const resolvedTitle = title || t(titleKey);
  const resolvedDescription = description || t(descriptionKey);

  return (
    <div className={`${styles.container} ${compact ? styles.compact : ""}`}>
      <div className={styles.icon} aria-hidden>
        {icon}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{resolvedTitle}</h3>
        {resolvedDescription && (
          <p className={styles.description}>{resolvedDescription}</p>
        )}
        {onAction && (
          <button className={styles.actionButton} onClick={onAction}>
            {actionLabel || t(actionLabelKey)}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
