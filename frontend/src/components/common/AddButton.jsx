import { FiPlus } from "react-icons/fi";
import styles from "./AddButton.module.css";

function AddButton({ label, onClick }) {
  return (
    <button type="button" className={styles.addButton} onClick={onClick}>
      <FiPlus /> <span>{label}</span>
    </button>
  );
}

export default AddButton;
