// Re-exporta o client para compatibilidade com código legado.
// Novas rotas de API devem importar de @/utils/supabase/server diretamente.
export { createClient } from "@/utils/supabase/server";
