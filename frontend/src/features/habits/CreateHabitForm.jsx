import { useState } from 'react';
import toast from 'react-hot-toast';
import habitService from '../../services/habitService';
import styles from '../../pages/HabitsPage.module.css';

const FREQUENCY_TYPES = ['DAILY', 'WEEKLY'];

function CreateHabitForm({ onHabitCreated }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('DAILY');
  const [targetCount, setTargetCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Creating habit...');
    try {
      // For DAILY habits, targetCount should always be 1
      const habitData = {
        name,
        frequency,
        targetCount: frequency === 'DAILY' ? 1 : targetCount,
      };
      await habitService.createHabit(habitData);
      toast.success('Habit created!', { id: toastId });
      onHabitCreated(); // Notify parent component
      
      setName('');
      setFrequency('DAILY');
      setTargetCount(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create habit.', { id: toastId });
      console.error("Habit creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="habit-name">Habit Name</label>
        <input id="habit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={styles.input} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="habit-frequency">Frequency</label>
        <select id="habit-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className={styles.select}>
          {FREQUENCY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      {frequency === 'WEEKLY' && (
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="habit-target">Weekly Target (e.g., 3 times a week)</label>
          <input id="habit-target" type="number" min="1" max="7" value={targetCount} onChange={(e) => setTargetCount(parseInt(e.target.value, 10))} required className={styles.input} />
        </div>
      )}
      <div className={styles.formActions}>
        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? 'Adding...' : 'Add Habit'}
        </button>
      </div>
    </form>
  );
}

export default CreateHabitForm;