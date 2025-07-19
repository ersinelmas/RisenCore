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
    setLoading(true);
    try {
      const response = await habitService.getAllHabits();
      setHabits(response.data);
    } catch (error) {
      toast.error("Failed to load habits.");
      console.error("Failed to fetch habits:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleHabitUpdate = (habitId, newCompletionDates) => {
    setHabits(currentHabits =>
      currentHabits.map(h =>
        h.id === habitId ? { ...h, completionDates: newCompletionDates } : h
      )
    );
  };

  const handleHabitDelete = (habitIdToDelete) => {
    setHabits(currentHabits =>
      currentHabits.filter(h => h.id !== habitIdToDelete)
    );
  };

  const handleHabitCreated = () => {
    fetchHabits();
  };

  if (loading) {
    return <PageLayout title="Habit Tracker"><div>Loading habits...</div></PageLayout>;
  }

  return (
    <PageLayout title="Habit Tracker">
      <div className={styles.pageContent}>
        <Card>
          <h2 className={styles.sectionTitle}>Add a New Habit</h2>
          <CreateHabitForm onHabitCreated={handleHabitCreated} />
        </Card>

        <div>
            <h2 className={styles.sectionTitle}>My Habits</h2>
            {habits.length > 0 ? (
              <div className={styles.habitListContainer}>
                {habits.map(habit => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    onUpdate={handleHabitUpdate}
                    onDelete={handleHabitDelete}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <p style={{textAlign: 'center', padding: '2rem'}}>
                  You haven't added any habits yet. Add one to get started!
                </p>
              </Card>
            )}
        </div>
      </div>
    </PageLayout>
  );
}

export default HabitsPage;