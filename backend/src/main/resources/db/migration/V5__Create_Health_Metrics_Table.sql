-- V5: Create health_metrics table for tracking user health data
-- Author: RisenCore Team
-- Date: 2025-11-30

CREATE TABLE health_metrics (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_health_metrics_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX idx_health_metrics_type ON health_metrics(type);
CREATE INDEX idx_health_metrics_date ON health_metrics(date);
