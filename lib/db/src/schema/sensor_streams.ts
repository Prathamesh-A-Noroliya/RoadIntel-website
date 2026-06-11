import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sensorStreamsTable = pgTable("sensor_streams", {
  id: serial("id").primaryKey(),
  roadId: integer("road_id").notNull(),
  roadName: text("road_name").notNull(),
  timestamp: text("timestamp").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  vibrationIntensity: real("vibration_intensity").notNull(),
  shockSpikes: integer("shock_spikes").default(0),
  roughnessIndex: real("roughness_index").notNull(),
  temperature: real("temperature"),
  humidity: real("humidity"),
  sensorStatus: text("sensor_status").default("active"),
  damageClassification: text("damage_classification").notNull(),
  damageProbability: real("damage_probability").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSensorStreamSchema = createInsertSchema(sensorStreamsTable).omit({ id: true, createdAt: true });
export type InsertSensorStream = z.infer<typeof insertSensorStreamSchema>;
export type SensorStream = typeof sensorStreamsTable.$inferSelect;
