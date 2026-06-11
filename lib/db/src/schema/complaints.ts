import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const complaintsTable = pgTable("complaints", {
  id: serial("id").primaryKey(),
  complaintId: text("complaint_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  status: text("status").default("pending"),
  severity: text("severity").notNull(),
  issueType: text("issue_type").notNull(),
  roadId: integer("road_id"),
  reportedBy: text("reported_by"),
  assignedDepartment: text("assigned_department"),
  aiAnalysis: text("ai_analysis"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertComplaintSchema = createInsertSchema(complaintsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaintsTable.$inferSelect;
