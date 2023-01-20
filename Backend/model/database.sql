CREATE database thesis;

CREATE table users(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_name VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    pwd VARCHAR(300) NOT NULL
    );

CREATE table years(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    graduation_year BIGINT UNIQUE NOT NULL
    );

CREATE table projects (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract VARCHAR(3000) NOT NULL, 
    file_url VARCHAR(500) NOT NULL,
    graduation_year_id BIGINT REFERENCES years(id),
    uploader_id BIGINT REFERENCES users(id)
);