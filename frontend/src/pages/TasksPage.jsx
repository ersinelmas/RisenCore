import TaskWidget from '../features/tasks/TaskWidget';
import PageLayout from '../components/layout/PageLayout'; // Import et

function TasksPage() {
  return (
    <PageLayout title="My Tasks">
      <TaskWidget />
    </PageLayout>
  );
}

export default TasksPage;