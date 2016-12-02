DROP TABLE IF EXISTS users_li CASCADE;
DROP TABLE IF EXISTS users_info CASCADE;

CREATE TABLE users_li (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);


CREATE TABLE users_info(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  show VARCHAR(255),
  user_id INTEGER REFERENCES users_li(id)
);
