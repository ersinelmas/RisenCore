-- The tasks table was missing an index on user_id, unlike transactions/habits/health_metrics.
-- Every task list request filters by user_id (TaskRepository.findByUserId*), so this was a
-- full-table scan on the most frequently queried table.
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
