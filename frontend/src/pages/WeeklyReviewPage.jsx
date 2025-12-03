import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/Card";
import analyticsService from "../services/analyticsService";
import styles from "./WeeklyReviewPage.module.css";
import ReactMarkdown from "react-markdown";
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
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>
            {t("weeklyReview.generating")}
          </p>
          <p className={styles.subtleText}>{t("weeklyReview.mayTakeMoment")}</p>
        </div>
      );
    }

    if (error) {
      return <p className={styles.errorText}>{error}</p>;
    }

    return (
      <div className={styles.reviewContent}>
        <ReactMarkdown>{review}</ReactMarkdown>
      </div>
    );
  };

  return (
    <PageLayout title={t("weeklyReview.title")}>
      <Card>{renderContent()}</Card>
    </PageLayout>
  );
}

export default WeeklyReviewPage;
