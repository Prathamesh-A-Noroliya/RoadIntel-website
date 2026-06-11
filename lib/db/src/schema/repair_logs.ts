import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const repairLogsTable = pgTable("repair_logs", {
  id: serial("id").primaryKey(),
  roadId: integer("road_id").notNull(),
  description: text("description").notNull(),
  cost: real("cost").notNull(),
  contractorId: integer("contractor_id"),
  contractorName: text("contractor_name"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  status: text("status").default("completed"),
  beforeImageUrl: text("before_image_url"),
  afterImageUrl: text("after_image_url"),
  citizenVerified: boolean("citizen_verified").default(false),
  aiValidated: boolean("ai_validated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRepairLogSchema = createInsertSchema(repairLogsTable).omit({ id: true, createdAt: true });
export type InsertRepairLog = z.infer<typeof insertRepairLogSchema>;
export type RepairLog = typeof repairLogsTable.$inferSelect;
