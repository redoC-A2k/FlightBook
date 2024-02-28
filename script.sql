use `flight_booking`;

CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `admins` (`id`, `username`, `password`) VALUES ('1', 'admin@flight', '2b$12$3.JrtazqM9BMZvXcFG.7YuUHGRNzpYxYHj0qP10upJqV11RPATfLi');

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
)

