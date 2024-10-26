CREATE DATABASE IF NOT EXISTS `flightbookdb`;

use `flightbookdb`;

CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO
  `admins` (`id`, `username`, `password`)
VALUES
  (
    '1',
    'admin@flight',
    '$2b$12$fRhxAVOff.JV/ihCy.QZvul1CPDPXaYcDfuEW9C7Dy3fivx0zwuN.'
  );

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `flights` (
  flight_number INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  seat_count INT NOT NULL DEFAULT 60
);

INSERT INTO
  `flights` (`date`, `time`)
VALUES
  ('2024-02-29', '22:11:00'),
  ('2024-03-02', '11:30:00'),
  ('2024-03-15', '14:30:00'), 
  ('2024-03-19', '07:30:00'),
  ('2024-03-29', '09:00:00'),
  ('2024-04-02', '11:05:00'),
  ("2024-03-05", "14:00:00"),
  ("2024-03-10", "10:30:00"),
  ("2024-03-15", "17:45:00"),
  ("2024-03-20", "08:20:00"),
  ("2024-04-05", "11:15:00"),
  ("2024-04-10", "16:30:00");

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  flight_number INT NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) on update cascade,
  CONSTRAINT fk_flight FOREIGN KEY (flight_number) REFERENCES flights(flight_number) on update cascade
);