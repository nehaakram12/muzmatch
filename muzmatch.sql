CREATE TABLE user
(
  userId INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password text NOT NULL,
  name VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255) NULL,
  PRIMARY KEY (userId)
);

CREATE TABLE profileDetail
(
  profileDetailId INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  bio VARCHAR(255) NULL,
  ethnicity VARCHAR(255) NULL,
  religion VARCHAR(255) NULL,
  profession VARCHAR(255) NULL,
  dob VARCHAR(255) NULL,
  sect VARCHAR(255) NULL,
  PRIMARY KEY (profileDetailId),
  FOREIGN KEY (userId) REFERENCES user(userId)
);

CREATE TABLE message
(
  messageId INT NOT NULL AUTO_INCREMENT,
  message TEXT NOT NULL,
  userId INT NOT NULL,
  friendId INT NOT NULL,
  PRIMARY KEY (messageId),
  FOREIGN KEY (userId) REFERENCES user(userId),
  FOREIGN KEY (friendId) REFERENCES user(userId)
);

CREATE TABLE favoriteList
(
  favoriteListId INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  friendId INT NOT NULL,
  PRIMARY KEY (favoriteListId),
  FOREIGN KEY (userId) REFERENCES user(userId),
  FOREIGN KEY (friendId) REFERENCES user(userId)
);

CREATE TABLE likeDislikeList
(
  likeDislikeList INT NOT NULL AUTO_INCREMENT,
  isLike INT NOT NULL,
  userId INT NOT NULL,
  friendId INT NOT NULL,
  PRIMARY KEY (likeDislikeList),
  FOREIGN KEY (userId) REFERENCES user(userId),
  FOREIGN KEY (friendId) REFERENCES user(userId)
);

CREATE TABLE blockList
(
  blockListId INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  friendId INT NOT NULL,
  PRIMARY KEY (blockListId),
  FOREIGN KEY (userId) REFERENCES user(userId),
  FOREIGN KEY (friendId) REFERENCES user(userId)
);