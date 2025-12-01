-- V6: Create weekly_reviews table
-- Author: RisenCore Team
-- Date: 2025-12-02

CREATE TABLE weekly_reviews (
    id BIGSERIAL PRIMARY KEY,
    review_text TEXT NOT NULL,
    generated_at TIMESTAMP NOT NULL,
    week_start_date TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_weekly_reviews_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_weekly_reviews_user_week ON weekly_reviews(user_id, week_start_date);
