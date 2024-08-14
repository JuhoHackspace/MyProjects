-- Active: 1710485472561@@127.0.0.1@5432@postgres


DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Groups_ CASCADE;
DROP TABLE IF EXISTS RequestToGroup CASCADE;
DROP TABLE IF EXISTS UsersToGroups CASCADE;
DROP TABLE IF EXISTS Favourites CASCADE;
DROP TABLE IF EXISTS Reviews CASCADE;
DROP TABLE IF EXISTS Events_ CASCADE;
DROP TABLE IF EXISTS Movies CASCADE ;

DROP TYPE IF EXISTS participant_status CASCADE;
DROP TYPE IF EXISTS movie_type CASCADE;

CREATE TABLE Users (
                       user_id SERIAL PRIMARY KEY,
                       user_name VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE Groups_ (
                         group_id SERIAL PRIMARY KEY,
                         group_name VARCHAR(255) UNIQUE NOT NULL,
                         group_description TEXT NOT NULL
);

CREATE TYPE participant_status AS ENUM ('accepted', 'pending', 'owner');
CREATE CAST (varchar AS participant_status) WITH INOUT AS IMPLICIT;

CREATE TABLE UsersToGroups (
                               users_to_groups_id SERIAL PRIMARY KEY,
                               user_id INT NOT NULL,
                               group_id INT NOT NULL,
                               status participant_status,
                               UNIQUE (user_id, group_id),
                               FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
                               FOREIGN KEY (group_id) REFERENCES Groups_(group_id) ON DELETE CASCADE
);

CREATE TYPE movie_type AS ENUM ('movie', 'tv');

CREATE CAST (varchar AS movie_type) WITH INOUT AS IMPLICIT;

CREATE TABLE Favourites (
                            favourite_id SERIAL PRIMARY KEY,
                            movie_id INT NOT NULL,
                            type movie_type NOT NULL,
                            user_id INT NOT NULL,
                            share_slur VARCHAR(255) NOT NULL,
                            FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Reviews (
                         review_id SERIAL PRIMARY KEY,
                         movie_id INT NOT NULL,
                         type movie_type NOT NULL,
                         stars INT NOT NULL,
                         description TEXT NOT NULL,
                         user_id INT NOT NULL,
                         FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Events_ (
                         event_id SERIAL PRIMARY KEY,
                         event_id_on_finnkino INT NOT NULL,
                         show_id_on_finnkino INT NOT NULL,
                         area_id_on_finnkino INT NOT NULL,
                         group_id INT NOT NULL,
                         FOREIGN KEY (group_id) REFERENCES Groups_(group_id) ON DELETE CASCADE
);

CREATE TABLE Movies (
                        movie_id SERIAL PRIMARY KEY ,
                        movie_id_on_tmdb INT NOT NULL,
                        type movie_type NOT NULL,
                        group_id INT NOT NULL,
                        UNIQUE (movie_id_on_tmdb, group_id, type),
                        FOREIGN KEY (group_id) REFERENCES Groups_(group_id) ON DELETE CASCADE
);

