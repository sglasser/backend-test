CREATE TABLE locations (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=INNODB;

CREATE TABLE tasks (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(100) NOT NULL,
  
  location_id INT(11) NOT NULL,

  FOREIGN KEY(location_id) REFERENCES locations(id) ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE workers (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  hourly_wage DECIMAL(5, 2) NOT NULL
) ENGINE=INNODB;

CREATE TABLE logged_time (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  time_seconds INT(11) NOT NULL,

  task_id INT(11) NOT NULL,
  worker_id INT(11) NOT NULL,

  FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=INNODB;

/* sample data */
INSERT INTO locations (name) VALUES
('Location 1'),
('Location 2'),
('Location 3');

INSERT INTO tasks (description, location_id) VALUES
('Task 1', 1),
('Task 2', 2);

INSERT INTO workers (username, hourly_wage) VALUES
('Worker 1', 15.00),
('Worker 2', 20.00),
('Worker 3', 25.00);

-- Worker 1 logs 5 entries for Task 1 and Task 2 at different locations
INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES
(3600, 1, 1), -- Worker 1 logs 1 hour for Task 1
(1800, 2, 1), -- Worker 1 logs 30 minutes for Task 2
(3600, 1, 1), -- Worker 1 logs another 1 hour for Task 1
(1800, 2, 1), -- Worker 1 logs another 30 minutes for Task 2
(3600, 1, 1); -- Worker 1 logs one more hour for Task 1

-- Worker 2 logs 5 entries for Task 1 and Task 2 at different locations
INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES
(3600, 1, 2), -- Worker 2 logs 1 hour for Task 1
(1800, 2, 2), -- Worker 2 logs 30 minutes for Task 2
(3600, 1, 2), -- Worker 2 logs another 1 hour for Task 1
(1800, 2, 2), -- Worker 2 logs another 30 minutes for Task 2
(3600, 1, 2); -- Worker 2 logs one more hour for Task 1
