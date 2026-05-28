-- ============================================
-- Fix: Permissões do role anon no schema public
-- Rodar no SQL Editor do Supabase Dashboard
-- ============================================

-- 1. Garantir acesso ao schema public
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. Permissões nas tabelas
GRANT SELECT ON desafio_diario TO anon;
GRANT SELECT ON desafio_diario TO authenticated;

GRANT SELECT, INSERT ON tentativa_usuario TO anon;
GRANT SELECT, INSERT ON tentativa_usuario TO authenticated;

-- 3. Verificar se as tabelas existem
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('desafio_diario', 'tentativa_usuario');
