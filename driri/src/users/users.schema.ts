import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
// import { /* Static, */ Type } from '@sinclair/typebox';

// type Prettify<T> = { [P in keyof T]: T[P] } & {};

// enum UserRole {
//   admin = 'admin',
//   user = 'user',
// }
//
// export const usersModel = Type.Object({
//   id: Type.Required(Type.Number()),
//   name: Type.Required(Type.String()),
//   email: Type.Required(Type.String()),
//   role: Type.Required(Type.Enum(UserRole, { default: UserRole.user })),
//   createdAt: Type.Required(Type.Date({ default: new Date() })),
// });

// Drizzle ORM table definition
export const users = pgTable('users', {
  // id: uuid('id').defaultRandom().primaryKey().notNull(),
  id: uuid('id').primaryKey().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['admin', 'user'] })
    .notNull()
    .default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Define a type for your schema using InferInsertModel
export type InsertUser = InferInsertModel<typeof users>;
// TB schema for creating a new user (request body validation)
export const insertUserSchema = createInsertSchema(users);
// export type InsertUser = Static<typeof insertUserSchema>;

export type SelectUser = InferSelectModel<typeof users>;
// TypeBox schema for selecting a user (API response validation/typing)
export const selectUserSchema = createSelectSchema(users);
// Derive TypeScript types from TypeBox schemas
// export type SelectUser = Static<typeof selectUserSchema>;
