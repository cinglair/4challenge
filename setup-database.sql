-- ============================================
-- 4challenge — Setup completo do banco
-- Supabase SQL Editor: cole e execute (Run)
-- ============================================

-- Drop completo
DROP TABLE IF EXISTS tentativa_usuario CASCADE;
DROP TABLE IF EXISTS desafio_diario CASCADE;

-- ============================================
-- Tabela principal: um registro por dificuldade/dia
-- ============================================

CREATE TABLE desafio_diario (
  id          SERIAL PRIMARY KEY,
  data        DATE    NOT NULL,
  dificuldade TEXT    NOT NULL CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
  digito      INTEGER NOT NULL,
  quantidade  INTEGER NOT NULL,
  alvo        NUMERIC NOT NULL,
  solucao     TEXT    NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (data, dificuldade)
);

CREATE INDEX idx_desafio_data_dif ON desafio_diario(data, dificuldade);

-- ============================================
-- Tabela de tentativas (opcional)
-- ============================================

CREATE TABLE tentativa_usuario (
  id              SERIAL PRIMARY KEY,
  user_id         TEXT,
  data            DATE    NOT NULL,
  dificuldade     TEXT    NOT NULL,
  expressao       TEXT    NOT NULL,
  sucesso         BOOLEAN NOT NULL,
  tempo_segundos  INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tentativa_user ON tentativa_usuario(user_id);
CREATE INDEX idx_tentativa_data ON tentativa_usuario(created_at DESC);

-- ============================================
-- Permissões (necessário em projetos recentes)
-- ============================================

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT            ON desafio_diario   TO anon;
GRANT SELECT            ON desafio_diario   TO authenticated;
GRANT SELECT, INSERT    ON tentativa_usuario TO anon;
GRANT SELECT, INSERT    ON tentativa_usuario TO authenticated;

-- ============================================
-- RLS
-- ============================================

ALTER TABLE desafio_diario    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tentativa_usuario ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "desafios_publicos"     ON desafio_diario;
DROP POLICY IF EXISTS "tentativas_insert"     ON tentativa_usuario;
DROP POLICY IF EXISTS "tentativas_select"     ON tentativa_usuario;

CREATE POLICY "desafios_publicos"
  ON desafio_diario FOR SELECT USING (true);

CREATE POLICY "tentativas_insert"
  ON tentativa_usuario FOR INSERT WITH CHECK (true);

CREATE POLICY "tentativas_select"
  ON tentativa_usuario FOR SELECT USING (true);

-- ============================================
-- Seed: 10 dias de desafios
-- ============================================

INSERT INTO desafio_diario (data, dificuldade, digito, quantidade, alvo, solucao) VALUES

-- Dia 0 (hoje)
(CURRENT_DATE, 'facil',   2, 3, 6,   '(2 + 2 + 2)'),
(CURRENT_DATE, 'medio',   4, 4, 16,  '(4 + 4 + 4 + 4)'),
(CURRENT_DATE, 'dificil', 3, 5, 36,  '((3 + 3) * (3 + 3) + 3 - 3)'),

-- Dia 1
(CURRENT_DATE + 1, 'facil',   3, 3, 9,   '(3 + 3 + 3)'),
(CURRENT_DATE + 1, 'medio',   5, 3, 25,  '(5 * 5 + 5 - 5)'),
(CURRENT_DATE + 1, 'dificil', 4, 5, 44,  '(44 + (4 - 4))'),

-- Dia 2
(CURRENT_DATE + 2, 'facil',   2, 4, 8,   '(2 + 2 + 2 + 2)'),
(CURRENT_DATE + 2, 'medio',   3, 4, 27,  '(3 * 3 * 3 + 3 - 3)'),
(CURRENT_DATE + 2, 'dificil', 5, 5, 55,  '(55 + (5 - 5))'),

-- Dia 3
(CURRENT_DATE + 3, 'facil',   4, 3, 12,  '(4 + 4 + 4)'),
(CURRENT_DATE + 3, 'medio',   2, 4, 20,  '((2 + 2) * (2 + 2 + 2))'),
(CURRENT_DATE + 3, 'dificil', 3, 5, 30,  '((3 + 3) * (3 + 3 - 3) + 3 - 3)'),

-- Dia 4
(CURRENT_DATE + 4, 'facil',   5, 3, 15,  '(5 + 5 + 5)'),
(CURRENT_DATE + 4, 'medio',   4, 4, 24,  '((4 + 4) * (4 - (4 / 4)))'),
(CURRENT_DATE + 4, 'dificil', 2, 5, 22,  '((2 + 2) * (2 + 2 + 2) + 2 + 2)'),

-- Dia 5
(CURRENT_DATE + 5, 'facil',   3, 3, 3,   '(3 + 3 - 3)'),
(CURRENT_DATE + 5, 'medio',   5, 4, 30,  '((5 + 5) * (5 - 5 / 5))'),
(CURRENT_DATE + 5, 'dificil', 4, 5, 64,  '(4 * 4 * 4 + 4 - 4)'),

-- Dia 6
(CURRENT_DATE + 6, 'facil',   2, 3, 4,   '(2 * 2 - 2 + 2)'),
(CURRENT_DATE + 6, 'medio',   3, 4, 36,  '((3 + 3) * (3 + 3))'),
(CURRENT_DATE + 6, 'dificil', 5, 5, 100, '((5 + 5) * (5 + 5 - 5 + 5))'),

-- Dia 7
(CURRENT_DATE + 7, 'facil',   4, 3, 8,   '(4 + 4 - 4 + 4)'),
(CURRENT_DATE + 7, 'medio',   2, 4, 14,  '((2 + 2) * 2 + 2 * 2 + 2)'),
(CURRENT_DATE + 7, 'dificil', 3, 5, 45,  '((3 + 3 + 3) * (3 + 3 - 3) - 3 + 3)'),

-- Dia 8
(CURRENT_DATE + 8, 'facil',   5, 3, 10,  '(5 + 5 * 5 / 5)'),
(CURRENT_DATE + 8, 'medio',   4, 4, 32,  '((4 + 4) * (4 + 4 / 4 - 1))'),
(CURRENT_DATE + 8, 'dificil', 2, 5, 16,  '((2 + 2) * (2 + 2) + 2 - 2)'),

-- Dia 9
(CURRENT_DATE + 9, 'facil',   3, 3, 6,   '(3 + 3 - 3 + 3)'),
(CURRENT_DATE + 9, 'medio',   5, 3, 20,  '(5 * 5 - 5 - 5 + 5)'),
(CURRENT_DATE + 9, 'dificil', 4, 5, 48,  '((4 + 4) * (4 + 4 - (4 / 4)))')

ON CONFLICT (data, dificuldade) DO NOTHING;

-- ============================================
-- Verificar
-- ============================================

SELECT data, dificuldade, digito, quantidade, alvo
FROM desafio_diario
ORDER BY data, dificuldade;
