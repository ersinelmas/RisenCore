import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/Card';
import habitService from '../services/habitService';
import styles from './HabitsPage.module.css';
import HabitItem from '../features/habits/HabitItem';
import CreateHabitForm from '../features/habits/CreateHabitForm';

function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    // setLoading(true) is not needed here as we want to avoid a full page loader on re-fetch.
    try {
      const response = await habitService.getAllHabits();
      setHabits(response.data);
    } catch (error) {
      toast.error("Failed to load habits.");
      console.error("Failed to fetch habits:", error);
    } finally {
      // Only set initial loading to false.
      if (loading) setLoading(false);
    }
  }, [loading]); // Depends on loading state to only run setLoading(false) once.

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  if (loading) {
    return <PageLayout title="Habit Tracker"><div>Loading habits...</div></PageLayout>;
  }

  return (
    <PageLayout title="Habit Tracker">
      <div className={styles.habitGrid}>
        <Card>
          <h2 className={styles.sectionTitle}>Add a New Habit</h2>
          <CreateHabitForm onHabitCreated={fetchHabits} />
        </Card>

        <div style={{gridColumn: 'span 2'}}>
            <h2 className={styles.sectionTitle}>My Habits</h2>
            {habits.length > 0 ? (
              <div className={styles.habitList}>
                {habits.map(habit => (
                  <HabitItem key={habit.id} habit={habit} onUpdate={fetchHabits} onDelete={fetchHabits}/>
                ))}
              </div>
            ) : (
              <Card><p style={{textAlign: 'center'}}>You haven't added any habits yet. Add one to get started!</p></Card>
            )}
        </div>
      </div>
    </PageLayout>
  );
}

export default HabitsPage;