-- RisenCore Database Reset Script
-- This will drop everything and recreate from scratch

-- Connect to PostgreSQL as superuser (postgres)
-- Run: psql -U postgres

-- Drop existing database and user (if they exist)
DROP DATABASE IF EXISTS risencore_db;
DROP USER IF EXISTS risencore_user;

-- Create new user with simple password
CREATE USER risencore_user WITH PASSWORD 'risencore123';

-- Create new database
CREATE DATABASE risencore_db OWNER risencore_user;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE risencore_db TO risencore_user;

-- Connect to the new database
\c risencore_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO risencore_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO risencore_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO risencore_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO risencore_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO risencore_user;

\q
