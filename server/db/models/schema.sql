USE greenfield;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  creditCard VARCHAR (255)
);

CREATE TABLE locations (
  id VARCHAR(255) PRIMARY KEY UNIQUE,
  name VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  address VARCHAR(255),
  image1 VARCHAR(255),
  image2 VARCHAR(255),
  image3 VARCHAR(255)
);

CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  coffeeTea INT,
  atmosphere INT,
  comfort INT,
  food INT,
  location VARCHAR(255),
  FOREIGN KEY (location) REFERENCES locations(id),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users_locations (
  user_id INT,
  location_id VARCHAR(255)
);

CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  text VARCHAR(255),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  location VARCHAR(255),
  FOREIGN KEY (location) REFERENCES locations(id) 
);

CREATE TABLE flashcards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  title VARCHAR(25),
  front VARCHAR(30),
  back VARCHAR(300),
  card_id INT
);

CREATE TABLE flashcard_decks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  title VARCHAR(25)
);