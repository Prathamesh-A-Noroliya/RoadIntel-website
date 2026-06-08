import { supabase } from "../../../roadintel/src/lib/supabase";

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("roadintel_connection_test")
    .select("message, created_at")
    .limit(1)
    .single();

  if (error) {
    console.error("❌ Supabase connection failed:", error.message);
    return;
  }

  console.log("✅ Supabase connected successfully:", data.message);
}