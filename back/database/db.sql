CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at timestamp default CURRENT_TIMESTAMP
);

INSERT INTO users (name, email)
    values ('kevin alfonso', 'kevinalfonsovillarreall2024@gmail.com'),
    values ('kevin alfonso', 'kevinalfonsovillarreall2025@gmail.com');