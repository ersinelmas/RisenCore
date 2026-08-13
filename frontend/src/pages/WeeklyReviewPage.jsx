import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/Card";
import analyticsService from "../services/analyticsService";
import styles from "./WeeklyReviewPage.module.css";
import ReactMarkdown from "react-markdown";
import LoadingIndicator from "../components/common/LoadingIndicator";
import EmptyState from "../components/common/EmptyState";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { FiAlertTriangle, FiCpu } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function WeeklyReviewPage() {
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await analyticsService.getWeeklyReview();
        setReview(response.data);
      } catch (err) {
        setError(t("weeklyReview.error"));
        console.error("Failed to fetch weekly review:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [t]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingIndicator
          fullHeight
          message={`${t("weeklyReview.generating")} ${t("weeklyReview.mayTakeMoment")}`}
        />
      );
    }

    if (error) {
      return (
        <EmptyState
          icon={<FiAlertTriangle />}
          title={t("weeklyReview.error")}
          description={error}
          actionLabel={t("common.retry")}
          onAction={() => window.location.reload()}
        />
      );
    }

    if (!review || !review.trim()) {
      return (
        <EmptyState
          icon={<FiCpu />}
          title={t("weeklyReview.empty")}
          description={t("weeklyReview.emptyDescription")}
        />
      );
    }

    return (
      <div className={styles.reviewContent}>
        <ReactMarkdown>{review}</ReactMarkdown>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <PageLayout title={t("weeklyReview.title")}>
        <Card>{renderContent()}</Card>
      </PageLayout>
    </ErrorBoundary>
  );
}

export default WeeklyReviewPage;
