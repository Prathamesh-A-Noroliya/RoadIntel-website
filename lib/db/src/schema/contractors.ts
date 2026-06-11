import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contractorsTable = pgTable("contractors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roadsManaged: integer("roads_managed").default(0),
  totalContracts: integer("total_contracts").default(0),
  totalValue: real("total_value").default(0),
  avgHealthScore: real("avg_health_score").default(70),
  trustScore: real("trust_score").default(75),
  failedRoads: integer("failed_roads").default(0),
  repeatFailures: integer("repeat_failures").default(0),
  corruptionFlags: integer("corruption_flags").default(0),
  status: text("status").default("active"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContractorSchema = createInsertSchema(contractorsTable).omit({ id: true, createdAt: true });
export type InsertContractor = z.infer<typeof insertContractorSchema>;
export type Contractor = typeof contractorsTable.$inferSelect;
