
DROP TABLE IF EXISTS location;
-- DROP TABLE IF EXISTS weather;
-- DROP TABLE IF EXISTS trails;

CREATE TABLE location(
    ID SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    display_name VARCHAR(255),
    lat VARCHAR(255),
    lon VARCHAR(255)
);
-- CREATE TABLE weather(
--     ID SERIAL PRIMARY KEY,
--     search_query VARCHAR(255),
--     forecast VARCHAR(255),
--     time VARCHAR(255)
-- );
-- CREATE TABLE trails(
--     ID SERIAL PRIMARY KEY,
--     search_query VARCHAR(255),
--     name VARCHAR(255),
--     location VARCHAR(255),
--     length VARCHAR(255),
--     stars VARCHAR(255),
--     star_votes VARCHAR(255),
--     summary VARCHAR(255),
--     trail_url VARCHAR(255),
--     conditions VARCHAR(255),
--     condition_date VARCHAR(255),
--     condition_time VARCHAR(255)
-- );
