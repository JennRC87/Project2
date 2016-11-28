DROP TABLE IF EXISTS usersli;

CREATE TABLE users_li (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255)
);


DROP TABLE IF EXISTS usersinfo;

CREATE TABLE users_info(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  show VARCHAR(255)
);
