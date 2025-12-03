import { useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import habitService from "../../services/habitService";
import styles from "./HabitItem.module.css";
import modalStyles from "../../components/common/Modal.module.css";
import { FiTrash2 } from "react-icons/fi";
import Modal from "../../components/common/Modal";
import { useModal } from "../../hooks/useModal";
import { toTitleCase } from "../../utils/stringUtils";
import { useTranslation } from "react-i18next";

const getWeekDays = () => {
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  firstDayOfWeek.setDate(today.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(firstDayOfWeek);
    day.setDate(day.getDate() + i);
    return day;
  });
};

const formatDate = (date) => date.toISOString().split("T")[0];

function HabitItem({ habit, onUpdate, onDelete }) {
  const { t } = useTranslation();
  const weekDays = useMemo(() => getWeekDays(), []);
  const completionSet = useMemo(
    () => new Set(habit.completionDates),
    [habit.completionDates]
  );

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const isDaily = habit.frequency === "DAILY";
  const todayString = useMemo(() => formatDate(new Date()), []);

  const completedCount = useMemo(() => {
    if (isDaily) {
      return completionSet.has(todayString) ? 1 : 0;
    } else {
      const currentWeekStrings = weekDays.map(formatDate);
      return habit.completionDates.filter((date) =>
        currentWeekStrings.includes(date)
      ).length;
    }
  }, [isDaily, completionSet, todayString, weekDays, habit.completionDates]);

  const handleToggle = useCallback(
    async (date) => {
      const originalCompletions = new Set(completionSet);
      const dateString = formatDate(date);

      const newCompletions = new Set(originalCompletions);
      const isCurrentlyCompleted = newCompletions.has(dateString);

      if (isCurrentlyCompleted) {
        newCompletions.delete(dateString);
      } else {
        newCompletions.add(dateString);
      }

      const isTogglingOn = !isCurrentlyCompleted;
      if (isTogglingOn) {
        if (isDaily) {
          setTimeout(
            () => toast.success(t("habits.greatJob", { name: habit.name })),
            300
          );
        } else {
          const newWeeklyCount = Array.from(newCompletions).filter((d) =>
            weekDays.map(formatDate).includes(d)
          ).length;
          if (newWeeklyCount === habit.targetCount) {
            setTimeout(
              () =>
                toast.success(
                  t("habits.weeklyGoalHit", { name: habit.name })
                ),
              300
            );
          }
        }
      }

      onUpdate(habit.id, Array.from(newCompletions));

      try {
        await habitService.toggleHabitCompletion(habit.id, dateString);
      } catch (error) {
        toast.error(t("habits.toggleError"));
        onUpdate(habit.id, Array.from(originalCompletions));
        console.error("Habit toggle failed:", error);
      }
    },
    [habit, onUpdate, completionSet, weekDays, isDaily, t]
  );

  const handleDelete = useCallback(async () => {
    closeDeleteModal();
    const toastId = toast.loading(t("admin.deleting") + "...");
    try {
      await habitService.deleteHabit(habit.id);
      toast.success(t("habits.habitDeleted"), { id: toastId });
      onDelete(habit.id);
    } catch (error) {
      toast.error(t("habits.deleteHabitError"), { id: toastId });
      console.error("Habit deletion failed:", error);
    }
  }, [habit.id, onDelete, closeDeleteModal, t]);

  return (
    <>
      <div className={styles.habitItem}>
        <div className={styles.habitHeader}>
          <div>
            <h3 className={styles.habitName}>{habit.name}</h3>
            <p className={styles.habitMeta}>
              {isDaily
                ? completedCount > 0
                  ? t("habits.completedToday")
                  : t("habits.pendingToday")
                : `${t("habits.target")}: ${completedCount} / ${habit.targetCount
                } ${toTitleCase(habit.frequency)}`}
            </p>
          </div>
          <button className={styles.deleteButton} onClick={openDeleteModal}>
            <FiTrash2 size={20} />
          </button>
        </div>

        {!isDaily && (
          <div className={styles.weekView}>
            {weekDays.map((day) => {
              const isCompleted = completionSet.has(formatDate(day));
              return (
                <div key={day.toISOString()} className={styles.day}>
                  <span className={styles.dayLabel}>
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className={styles.dayNumber}>{day.getDate()}</span>
                  <div
                    className={`${styles.dayCheckbox} ${isCompleted ? styles.completed : ""
                      }`}
                    onClick={() => handleToggle(day)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {isDaily && (
          <div className={styles.dailyView}>
            <button
              className={`${styles.dailyButton} ${completedCount > 0 ? styles.completed : ""
                }`}
              onClick={() => handleToggle(new Date())}
            >
              {completedCount > 0 ? t("habits.completed") : t("habits.markAsDone")}
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title={t("habits.deleteHabit")}
        actions={
          <>
            <button
              className={modalStyles.actionButton}
              onClick={closeDeleteModal}
            >
              {t("common.cancel")}
            </button>
            <button
              className={`${modalStyles.actionButton} ${modalStyles.confirmButton}`}
              onClick={handleDelete}
            >
              {t("common.delete")}
            </button>
          </>
        }
      >
        <p>
          {t("habits.deleteHabitConfirm")} "
          <strong>{habit.name}</strong>"? {t("admin.permanentAction")}
        </p>
      </Modal>
    </>
  );
}

export default HabitItem;
