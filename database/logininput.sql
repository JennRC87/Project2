DROP TABLE IF EXISTS users_li;

CREATE TABLE users_li (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);


DROP TABLE IF EXISTS users_info;

CREATE TABLE users_info(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  show VARCHAR(255)
);
