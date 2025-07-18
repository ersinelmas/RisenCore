import { useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import habitService from '../../services/habitService';
import styles from './HabitItem.module.css';
import { FiTrash2 } from 'react-icons/fi';

const getWeekDays = () => {
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to make Monday the first day
  firstDayOfWeek.setDate(today.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(firstDayOfWeek);
    day.setDate(day.getDate() + i);
    return day;
  });
};

const formatDate = (date) => date.toISOString().split('T')[0];

function HabitItem({ habit, onUpdate, onDelete }) {
  const weekDays = useMemo(() => getWeekDays(), []);
  const completionSet = useMemo(() => new Set(habit.completionDates), [habit.completionDates]);

  const handleToggle = useCallback(async (date) => {
    const dateString = formatDate(date);
    try {
      await habitService.toggleHabitCompletion(habit.id, dateString);
      onUpdate();
    } catch (error) {
      toast.error("Failed to update habit.");
      console.error("Habit toggle failed:", error);
    }
  }, [habit.id, onUpdate]);

  const handleDelete = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
        const toastId = toast.loading('Deleting habit...');
        try {
            await habitService.deleteHabit(habit.id);
            toast.success("Habit deleted!", { id: toastId });
            onDelete();
        } catch (error) {
            toast.error("Failed to delete habit.", { id: toastId });
            console.error("Habit deletion failed:", error);
        }
    }
  }, [habit.id, onDelete]);

  const completedCount = useMemo(() => {
    return weekDays.filter(day => completionSet.has(formatDate(day))).length;
  }, [weekDays, completionSet]);

  return (
    <div className={styles.habitItem}>
      <div className={styles.habitHeader}>
        <div>
          <h3 className={styles.habitName}>{habit.name}</h3>
          <p className={styles.habitMeta}>
            Target: {completedCount} / {habit.targetCount} this {habit.frequency.toLowerCase()}
          </p>
        </div>
        <button className={styles.deleteButton} onClick={handleDelete}>
            <FiTrash2 size={20} />
        </button>
      </div>
      <div className={styles.weekView}>
        {weekDays.map(day => {
          const isCompleted = completionSet.has(formatDate(day));
          return (
            <div key={day.toISOString()} className={styles.day}>
              <span className={styles.dayLabel}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <div
                className={`${styles.dayCheckbox} ${isCompleted ? styles.completed : ''}`}
                onClick={() => handleToggle(day)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HabitItem;