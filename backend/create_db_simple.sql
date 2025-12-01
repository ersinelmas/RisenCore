-- Run this with ANY PostgreSQL user that has CREATE DATABASE rights
-- Even if postgres password doesn't work, try other users

CREATE DATABASE risencore_db;
CREATE USER risencore_user WITH PASSWORD 'risencore123';
GRANT ALL PRIVILEGES ON DATABASE risencore_db TO risencore_user;

-- Then connect to risencore_db
\c risencore_db;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO risencore_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO risencore_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO risencore_user;
