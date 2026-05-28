import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

console.log("🔌 Conectando ao Supabase...");
console.log("📍 URL:", supabaseUrl);
console.log("🔑 Key:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "FALTANDO");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Erro: Variáveis de ambiente do Supabase não configuradas");
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("✅ Cliente Supabase criado com sucesso");

export default supabase;
