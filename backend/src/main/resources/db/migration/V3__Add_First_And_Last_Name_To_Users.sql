-- Add first_name and last_name columns to the app_users table
-- We add them first with nullable constraints to handle existing data.
ALTER TABLE app_users ADD COLUMN first_name VARCHAR(50);
ALTER TABLE app_users ADD COLUMN last_name VARCHAR(50);

-- For existing users, we can populate these new fields with a default value.
-- Here, we'll just use their username as a placeholder.
UPDATE app_users SET first_name = username WHERE first_name IS NULL;
UPDATE app_users SET last_name = 'User' WHERE last_name IS NULL;

-- Now that all rows have a value, we can enforce the NOT NULL constraint.
ALTER TABLE app_users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE app_users ALTER COLUMN last_name SET NOT NULL;