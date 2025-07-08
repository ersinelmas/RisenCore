import styles from './Card.module.css';

function Card({ children, className = '' }) {
  const cardClasses = `${styles.card} ${className}`;

  return <div className={cardClasses}>{children}</div>;
}

export default Card;