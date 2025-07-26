import { useState, useEffect } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/Card";
import analyticsService from "../services/analyticsService";
import styles from "./WeeklyReviewPage.module.css";
import ReactMarkdown from "react-markdown";

function WeeklyReviewPage() {
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await analyticsService.getWeeklyReview();
        setReview(response.data);
      } catch (err) {
        setError(
          "We couldn't generate your weekly review. Please try again later."
        );
        console.error("Failed to fetch weekly review:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>
            Generating your AI-powered review...
          </p>
          <p className={styles.subtleText}>(This may take a moment)</p>
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
    <PageLayout title="Your Weekly Review">
      <Card>{renderContent()}</Card>
    </PageLayout>
  );
}

export default WeeklyReviewPage;
