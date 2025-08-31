alter table "public"."users"
  add constraint "users_identity2_id_fkey"
  foreign key ("identity2_id")
  references "public"."identity"
  ("id") on update restrict on delete restrict;
