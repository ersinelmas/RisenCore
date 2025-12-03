import TaskWidget from '../features/tasks/TaskWidget';
import PageLayout from '../components/layout/PageLayout';
import { useTranslation } from 'react-i18next';

function TasksPage() {
  const { t } = useTranslation();

  return (
    <PageLayout title={t("tasks.title")}>
      <TaskWidget />
    </PageLayout>
  );
}

export default TasksPage;