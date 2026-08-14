import { pgTable, text, jsonb } from 'drizzle-orm/pg-core';

export const appState = pgTable('app_state', {
  id: text('id').primaryKey(),
  data: jsonb('data').notNull(),
});
