import { pgTable, text, serial, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roadsTable = pgTable("roads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roadType: text("road_type").notNull(),
  location: text("location").notNull(),
  constructionDate: text("construction_date"),
  contractorId: integer("contractor_id"),
  contractorName: text("contractor_name"),
  allocatedBudget: real("allocated_budget"),
  spentBudget: real("spent_budget"),
  healthScore: real("health_score").default(70),
  riskLevel: text("risk_level").default("low"),
  status: text("status").default("active"),
  totalComplaints: integer("total_complaints").default(0),
  lastRepairDate: text("last_repair_date"),
  repeatFailures: integer("repeat_failures").default(0),
  aiSummary: text("ai_summary"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRoadSchema = createInsertSchema(roadsTable).omit({ id: true, createdAt: true });
export type InsertRoad = z.infer<typeof insertRoadSchema>;
export type Road = typeof roadsTable.$inferSelect;
