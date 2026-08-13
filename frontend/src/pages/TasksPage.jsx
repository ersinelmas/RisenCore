import TaskWidget from '../features/tasks/TaskWidget';
import PageLayout from '../components/layout/PageLayout';
import AddButton from '../components/common/AddButton';
import { useModal } from '../hooks/useModal';
import { useTranslation } from 'react-i18next';

function TasksPage() {
  const { t } = useTranslation();
  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();

  return (
    <PageLayout
      title={t("tasks.title")}
      headerAction={<AddButton label={t("tasks.addTask")} onClick={openAddModal} />}
    >
      <TaskWidget
        isAddModalOpen={isAddModalOpen}
        closeAddModal={closeAddModal}
      />
    </PageLayout>
  );
}

export default TasksPage;
