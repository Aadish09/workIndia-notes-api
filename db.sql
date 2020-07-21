create databse notes;
use db notes;
CREATE TABLE `users` (  `id` int(11) NOT NULL AUTO_INCREMENT,  `username` varchar(255) NOT NULL,    `password` varchar(255) NOT NULL,  PRIMARY KEY (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
CREATE TABLE IF NOT EXISTS notes(notesID  INT UNSIGNED  NOT NULL AUTO_INCREMENT primary key, title varchar(250),  textNote varchar(1000),  userId INT(11) ,  foreign key (userID) references users(id));
