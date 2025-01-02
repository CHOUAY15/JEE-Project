CREATE DATABASE IF NOT EXISTS jee_project_first;
CREATE DATABASE IF NOT EXISTS jee_project_second;

GRANT ALL PRIVILEGES ON jee_project_first.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON jee_project_second.* TO 'user'@'%';
FLUSH PRIVILEGES;