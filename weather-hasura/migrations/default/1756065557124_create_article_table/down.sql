-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE TABLE article(
--   id SERIAL NOT NULL PRIMARY KEY,
--   title TEXT NOT NULL,
--   date DATE NOT NULL,
--   content TEXT NOT NULL
-- );

drop table "public"."article";
