-- ============================================
-- Script SQL para Popular Banco Supabase
-- 4challenge - Desafios Matemáticos
-- ============================================
-- Como usar:
-- 1. Abra o SQL Editor no Supabase Dashboard
-- 2. Cole este script completo
-- 3. Execute (Run)
-- ============================================

-- Criar tabela de desafios diários
CREATE TABLE IF NOT EXISTS desafio_diario (
  id SERIAL PRIMARY KEY,
  data DATE UNIQUE NOT NULL,
  desafios JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_desafio_diario_data ON desafio_diario(data);

-- Criar tabela de tentativas (opcional)
CREATE TABLE IF NOT EXISTS tentativa_usuario (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  desafio_id INTEGER,
  nivel INTEGER NOT NULL,
  expressao TEXT NOT NULL,
  sucesso BOOLEAN NOT NULL,
  tempo_segundos INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tentativa_usuario_user_id ON tentativa_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_tentativa_usuario_created_at ON tentativa_usuario(created_at DESC);

-- ============================================
-- Habilitar RLS (Row Level Security)
-- ============================================

ALTER TABLE desafio_diario ENABLE ROW LEVEL SECURITY;
ALTER TABLE tentativa_usuario ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler desafios
DROP POLICY IF EXISTS "Desafios são públicos" ON desafio_diario;
CREATE POLICY "Desafios são públicos" 
  ON desafio_diario FOR SELECT 
  USING (true);

-- Política: Todos podem inserir tentativas
DROP POLICY IF EXISTS "Qualquer um pode registrar tentativas" ON tentativa_usuario;
CREATE POLICY "Qualquer um pode registrar tentativas" 
  ON tentativa_usuario FOR INSERT 
  WITH CHECK (true);

-- Política: Todos podem ver tentativas (ajuste conforme necessário)
DROP POLICY IF EXISTS "Tentativas são públicas" ON tentativa_usuario;
CREATE POLICY "Tentativas são públicas" 
  ON tentativa_usuario FOR SELECT 
  USING (true);

-- ============================================
-- Popular com dados de exemplo
-- ============================================

-- Inserir desafios para hoje
INSERT INTO desafio_diario (data, desafios) VALUES 
(CURRENT_DATE, '[
  {
    "nivel": 1,
    "digito": 2,
    "quantidade": 3,
    "alvo": 6,
    "solucao": "(2 + 2 + 2)",
    "dificuldade": "facil"
  },
  {
    "nivel": 2,
    "digito": 3,
    "quantidade": 3,
    "alvo": 9,
    "solucao": "(3 + 3 + 3)",
    "dificuldade": "facil"
  },
  {
    "nivel": 3,
    "digito": 2,
    "quantidade": 4,
    "alvo": 20,
    "solucao": "((2 + 2) * (2 + 2 + 2))",
    "dificuldade": "medio"
  },
  {
    "nivel": 4,
    "digito": 3,
    "quantidade": 4,
    "alvo": 12,
    "solucao": "(3 + 3 + 3 + 3)",
    "dificuldade": "medio"
  },
  {
    "nivel": 5,
    "digito": 4,
    "quantidade": 3,
    "alvo": 16,
    "solucao": "(4 + 4 + 4 + 4)",
    "dificuldade": "dificil"
  },
  {
    "nivel": 6,
    "digito": 4,
    "quantidade": 4,
    "alvo": 24,
    "solucao": "((4 + 4) * (4 - (4 / 4)))",
    "dificuldade": "dificil"
  },
  {
    "nivel": 7,
    "digito": 5,
    "quantidade": 4,
    "alvo": 30,
    "solucao": "((5 + 5) * (5 - (5 / 5)))",
    "dificuldade": "dificil"
  },
  {
    "nivel": 8,
    "digito": 3,
    "quantidade": 5,
    "alvo": 33,
    "solucao": "(33 + (3 - 3))",
    "dificuldade": "muito-dificil"
  },
  {
    "nivel": 9,
    "digito": 4,
    "quantidade": 5,
    "alvo": 44,
    "solucao": "(44 + (4 - 4))",
    "dificuldade": "muito-dificil"
  },
  {
    "nivel": 10,
    "digito": 5,
    "quantidade": 5,
    "alvo": 55,
    "solucao": "(55 + (5 - 5))",
    "dificuldade": "mestre"
  }
]'::jsonb)
ON CONFLICT (data) DO NOTHING;

-- Inserir desafios para amanhã
INSERT INTO desafio_diario (data, desafios) VALUES 
(CURRENT_DATE + INTERVAL '1 day', '[
  {
    "nivel": 1,
    "digito": 2,
    "quantidade": 3,
    "alvo": 4,
    "solucao": "(2 + 2 - 2)",
    "dificuldade": "facil"
  },
  {
    "nivel": 2,
    "digito": 3,
    "quantidade": 3,
    "alvo": 6,
    "solucao": "(3 + 3 - 3)",
    "dificuldade": "facil"
  },
  {
    "nivel": 3,
    "digito": 2,
    "quantidade": 4,
    "alvo": 8,
    "solucao": "(2 + 2 + 2 + 2)",
    "dificuldade": "medio"
  },
  {
    "nivel": 4,
    "digito": 3,
    "quantidade": 4,
    "alvo": 18,
    "solucao": "((3 + 3) * (3 + 3))",
    "dificuldade": "medio"
  },
  {
    "nivel": 5,
    "digito": 4,
    "quantidade": 3,
    "alvo": 12,
    "solucao": "(4 + 4 + 4)",
    "dificuldade": "dificil"
  },
  {
    "nivel": 6,
    "digito": 4,
    "quantidade": 4,
    "alvo": 32,
    "solucao": "((4 + 4) * (4 + 4))",
    "dificuldade": "dificil"
  },
  {
    "nivel": 7,
    "digito": 5,
    "quantidade": 4,
    "alvo": 25,
    "solucao": "(5 * 5 + 5 - 5)",
    "dificuldade": "dificil"
  },
  {
    "nivel": 8,
    "digito": 3,
    "quantidade": 5,
    "alvo": 27,
    "solucao": "(3 * 3 * 3 + 3 - 3)",
    "dificuldade": "muito-dificil"
  },
  {
    "nivel": 9,
    "digito": 4,
    "quantidade": 5,
    "alvo": 64,
    "solucao": "(4 * 4 * 4 + 4 - 4)",
    "dificuldade": "muito-dificil"
  },
  {
    "nivel": 10,
    "digito": 5,
    "quantidade": 5,
    "alvo": 125,
    "solucao": "(5 * 5 * 5 + 5 - 5)",
    "dificuldade": "mestre"
  }
]'::jsonb)
ON CONFLICT (data) DO NOTHING;

-- Inserir mais 7 dias de desafios
INSERT INTO desafio_diario (data, desafios) VALUES 
(CURRENT_DATE + INTERVAL '2 days', '[
  {"nivel": 1, "digito": 2, "quantidade": 3, "alvo": 2, "solucao": "(2 + 2 - 2)", "dificuldade": "facil"},
  {"nivel": 2, "digito": 3, "quantidade": 3, "alvo": 3, "solucao": "(3 + 3 - 3)", "dificuldade": "facil"},
  {"nivel": 3, "digito": 2, "quantidade": 4, "alvo": 16, "solucao": "((2 + 2) * (2 + 2))", "dificuldade": "medio"},
  {"nivel": 4, "digito": 3, "quantidade": 4, "alvo": 36, "solucao": "((3 + 3) * (3 + 3))", "dificuldade": "medio"},
  {"nivel": 5, "digito": 4, "quantidade": 3, "alvo": 8, "solucao": "(4 + 4 - 4)", "dificuldade": "dificil"},
  {"nivel": 6, "digito": 4, "quantidade": 4, "alvo": 16, "solucao": "(4 * 4 + 4 - 4)", "dificuldade": "dificil"},
  {"nivel": 7, "digito": 5, "quantidade": 4, "alvo": 20, "solucao": "(5 * 5 - 5 + 5)", "dificuldade": "dificil"},
  {"nivel": 8, "digito": 3, "quantidade": 5, "alvo": 30, "solucao": "((3 + 3) * (3 + 3 - 3))", "dificuldade": "muito-dificil"},
  {"nivel": 9, "digito": 4, "quantidade": 5, "alvo": 48, "solucao": "((4 + 4) * (4 + 4 - 4))", "dificuldade": "muito-dificil"},
  {"nivel": 10, "digito": 5, "quantidade": 5, "alvo": 100, "solucao": "((5 + 5) * (5 + 5 - 5))", "dificuldade": "mestre"}
]'::jsonb),
(CURRENT_DATE + INTERVAL '3 days', '[
  {"nivel": 1, "digito": 2, "quantidade": 3, "alvo": 8, "solucao": "(2 * 2 * 2)", "dificuldade": "facil"},
  {"nivel": 2, "digito": 3, "quantidade": 3, "alvo": 27, "solucao": "(3 * 3 * 3)", "dificuldade": "facil"},
  {"nivel": 3, "digito": 2, "quantidade": 4, "alvo": 10, "solucao": "(2 + 2 + 2 + 2 + 2)", "dificuldade": "medio"},
  {"nivel": 4, "digito": 3, "quantidade": 4, "alvo": 15, "solucao": "(3 + 3 + 3 + 3 + 3)", "dificuldade": "medio"},
  {"nivel": 5, "digito": 4, "quantidade": 3, "alvo": 64, "solucao": "(4 * 4 * 4)", "dificuldade": "dificil"},
  {"nivel": 6, "digito": 4, "quantidade": 4, "alvo": 20, "solucao": "(4 * 4 + 4 + 4)", "dificuldade": "dificil"},
  {"nivel": 7, "digito": 5, "quantidade": 4, "alvo": 50, "solucao": "(5 * 5 + 5 * 5)", "dificuldade": "dificil"},
  {"nivel": 8, "digito": 3, "quantidade": 5, "alvo": 36, "solucao": "((3 + 3) * (3 + 3))", "dificuldade": "muito-dificil"},
  {"nivel": 9, "digito": 4, "quantidade": 5, "alvo": 80, "solucao": "((4 + 4) * (4 + 4 + 4))", "dificuldade": "muito-dificil"},
  {"nivel": 10, "digito": 5, "quantidade": 5, "alvo": 150, "solucao": "((5 + 5 + 5) * (5 + 5))", "dificuldade": "mestre"}
]'::jsonb),
(CURRENT_DATE + INTERVAL '4 days', '[
  {"nivel": 1, "digito": 2, "quantidade": 3, "alvo": 0, "solucao": "(2 - 2 - 2)", "dificuldade": "facil"},
  {"nivel": 2, "digito": 3, "quantidade": 3, "alvo": 0, "solucao": "(3 - 3 - 3)", "dificuldade": "facil"},
  {"nivel": 3, "digito": 2, "quantidade": 4, "alvo": 12, "solucao": "((2 + 2) * (2 + 2 - 1))", "dificuldade": "medio"},
  {"nivel": 4, "digito": 3, "quantidade": 4, "alvo": 24, "solucao": "((3 + 3) * (3 + 3 - 2))", "dificuldade": "medio"},
  {"nivel": 5, "digito": 4, "quantidade": 3, "alvo": 0, "solucao": "(4 - 4 - 4)", "dificuldade": "dificil"},
  {"nivel": 6, "digito": 4, "quantidade": 4, "alvo": 28, "solucao": "(4 * 4 + 4 + 4 + 4)", "dificuldade": "dificil"},
  {"nivel": 7, "digito": 5, "quantidade": 4, "alvo": 40, "solucao": "(5 * 5 + 5 + 5 + 5)", "dificuldade": "dificil"},
  {"nivel": 8, "digito": 3, "quantidade": 5, "alvo": 45, "solucao": "((3 + 3 + 3) * (3 + 3 + 3))", "dificuldade": "muito-dificil"},
  {"nivel": 9, "digito": 4, "quantidade": 5, "alvo": 96, "solucao": "((4 + 4 + 4) * (4 + 4 + 4))", "dificuldade": "muito-dificil"},
  {"nivel": 10, "digito": 5, "quantidade": 5, "alvo": 225, "solucao": "((5 + 5 + 5) * (5 + 5 + 5))", "dificuldade": "mestre"}
]'::jsonb),
(CURRENT_DATE + INTERVAL '5 days', '[
  {"nivel": 1, "digito": 2, "quantidade": 3, "alvo": 1, "solucao": "(2 / 2 / 2)", "dificuldade": "facil"},
  {"nivel": 2, "digito": 3, "quantidade": 3, "alvo": 1, "solucao": "(3 / 3 / 3)", "dificuldade": "facil"},
  {"nivel": 3, "digito": 2, "quantidade": 4, "alvo": 14, "solucao": "((2 + 2 + 2) * 2 + 2)", "dificuldade": "medio"},
  {"nivel": 4, "digito": 3, "quantidade": 4, "alvo": 21, "solucao": "((3 + 3 + 3) * 3 - 6)", "dificuldade": "medio"},
  {"nivel": 5, "digito": 4, "quantidade": 3, "alvo": 1, "solucao": "(4 / 4 / 4)", "dificuldade": "dificil"},
  {"nivel": 6, "digito": 4, "quantidade": 4, "alvo": 40, "solucao": "((4 + 4 + 4 + 4) * 2.5)", "dificuldade": "dificil"},
  {"nivel": 7, "digito": 5, "quantidade": 4, "alvo": 60, "solucao": "((5 + 5 + 5 + 5) * 3)", "dificuldade": "dificil"},
  {"nivel": 8, "digito": 3, "quantidade": 5, "alvo": 54, "solucao": "((3 + 3) * (3 + 3 + 3))", "dificuldade": "muito-dificil"},
  {"nivel": 9, "digito": 4, "quantidade": 5, "alvo": 112, "solucao": "((4 + 4 + 4 + 4) * 7)", "dificuldade": "muito-dificil"},
  {"nivel": 10, "digito": 5, "quantidade": 5, "alvo": 250, "solucao": "((5 + 5) * (5 + 5 + 5 + 5 + 5))", "dificuldade": "mestre"}
]'::jsonb),
(CURRENT_DATE + INTERVAL '6 days', '[
  {"nivel": 1, "digito": 2, "quantidade": 3, "alvo": 3, "solucao": "(2 + 2 / 2)", "dificuldade": "facil"},
  {"nivel": 2, "digito": 3, "quantidade": 3, "alvo": 4, "solucao": "(3 + 3 / 3)", "dificuldade": "facil"},
  {"nivel": 3, "digito": 2, "quantidade": 4, "alvo": 18, "solucao": "((2 + 2 + 2) * 2 + 6)", "dificuldade": "medio"},
  {"nivel": 4, "digito": 3, "quantidade": 4, "alvo": 27, "solucao": "((3 + 3 + 3) * 3)", "dificuldade": "medio"},
  {"nivel": 5, "digito": 4, "quantidade": 3, "alvo": 5, "solucao": "(4 + 4 / 4)", "dificuldade": "dificil"},
  {"nivel": 6, "digito": 4, "quantidade": 4, "alvo": 36, "solucao": "((4 + 4 + 4) * 3)", "dificuldade": "dificil"},
  {"nivel": 7, "digito": 5, "quantidade": 4, "alvo": 75, "solucao": "((5 + 5 + 5) * 5)", "dificuldade": "dificil"},
  {"nivel": 8, "digito": 3, "quantidade": 5, "alvo": 60, "solucao": "((3 + 3 + 3 + 3) * 5)", "dificuldade": "muito-dificil"},
  {"nivel": 9, "digito": 4, "quantidade": 5, "alvo": 128, "solucao": "((4 + 4 + 4 + 4) * 8)", "dificuldade": "muito-dificil"},
  {"nivel": 10, "digito": 5, "quantidade": 5, "alvo": 300, "solucao": "((5 + 5 + 5 + 5) * 15)", "dificuldade": "mestre"}
]'::jsonb),
(CURRENT_DATE + INTERVAL '7 days', '[
  {"nivel": 1, "digito": 2, "quantidade": 3, "alvo": 5, "solucao": "(2 + 2 + 2 / 2)", "dificuldade": "facil"},
  {"nivel": 2, "digito": 3, "quantidade": 3, "alvo": 7, "solucao": "(3 + 3 + 3 / 3)", "dificuldade": "facil"},
  {"nivel": 3, "digito": 2, "quantidade": 4, "alvo": 22, "solucao": "((2 + 2) * 5 + 2)", "dificuldade": "medio"},
  {"nivel": 4, "digito": 3, "quantidade": 4, "alvo": 30, "solucao": "((3 + 3) * 5)", "dificuldade": "medio"},
  {"nivel": 5, "digito": 4, "quantidade": 3, "alvo": 15, "solucao": "(4 * 4 - 4 / 4)", "dificuldade": "dificil"},
  {"nivel": 6, "digito": 4, "quantidade": 4, "alvo": 48, "solucao": "((4 + 4 + 4 + 4) * 3)", "dificuldade": "dificil"},
  {"nivel": 7, "digito": 5, "quantidade": 4, "alvo": 80, "solucao": "((5 + 5) * (5 + 5 - 2))", "dificuldade": "dificil"},
  {"nivel": 8, "digito": 3, "quantidade": 5, "alvo": 72, "solucao": "((3 + 3 + 3 + 3) * 6)", "dificuldade": "muito-dificil"},
  {"nivel": 9, "digito": 4, "quantidade": 5, "alvo": 144, "solucao": "((4 + 4 + 4 + 4) * 9)", "dificuldade": "muito-dificil"},
  {"nivel": 10, "digito": 5, "quantidade": 5, "alvo": 375, "solucao": "((5 * 5 * 5) * (5 - 5 / 5))", "dificuldade": "mestre"}
]'::jsonb)
ON CONFLICT (data) DO NOTHING;

-- ============================================
-- Verificar dados inseridos
-- ============================================

SELECT 
  data, 
  jsonb_array_length(desafios) as total_desafios,
  created_at
FROM desafio_diario
ORDER BY data;

-- ============================================
-- CONCLUÍDO!
-- Execute: SELECT * FROM desafio_diario;
-- ============================================
