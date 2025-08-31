-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- create table identity (
--     id uuid primary key,
--     email varchar(64),
--     name varchar(64)
-- );

drop table "public"."identity";
