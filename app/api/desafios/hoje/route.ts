import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Desafio } from "@/lib/desafios-db";

const MOCK_DESAFIOS: Desafio[] = [
  { nivel: 1,  digito: 2, quantidade: 3, alvo: 6,   solucao: "(2 + 2 + 2)",              dificuldade: "facil"         },
  { nivel: 2,  digito: 3, quantidade: 3, alvo: 9,   solucao: "(3 + 3 + 3)",              dificuldade: "facil"         },
  { nivel: 3,  digito: 2, quantidade: 4, alvo: 20,  solucao: "((2 + 2) * (2 + 2 + 2))", dificuldade: "medio"         },
  { nivel: 4,  digito: 3, quantidade: 4, alvo: 12,  solucao: "(3 + 3 + 3 + 3)",         dificuldade: "medio"         },
  { nivel: 5,  digito: 4, quantidade: 3, alvo: 16,  solucao: "(4 + 4 + 4 + 4)",         dificuldade: "dificil"       },
  { nivel: 6,  digito: 4, quantidade: 4, alvo: 24,  solucao: "((4 + 4) * (4 - (4 / 4)))", dificuldade: "dificil"    },
  { nivel: 7,  digito: 5, quantidade: 4, alvo: 30,  solucao: "((5 + 5) * (5 - (5 / 5)))", dificuldade: "dificil"    },
  { nivel: 8,  digito: 3, quantidade: 5, alvo: 33,  solucao: "(33 + (3 - 3))",          dificuldade: "muito-dificil" },
  { nivel: 9,  digito: 4, quantidade: 5, alvo: 44,  solucao: "(44 + (4 - 4))",          dificuldade: "muito-dificil" },
  { nivel: 10, digito: 5, quantidade: 5, alvo: 55,  solucao: "(55 + (5 - 5))",          dificuldade: "mestre"        },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const hoje = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("desafio_diario")
      .select("*")
      .eq("data", hoje)
      .single();

    if (!error && data) {
      return NextResponse.json({
        data: data.data,
        desafios: data.desafios,
        total: (data.desafios as Desafio[]).length,
        fonte: "banco",
      });
    }
  } catch {}

  return NextResponse.json({
    data: new Date().toISOString().split("T")[0],
    desafios: MOCK_DESAFIOS,
    total: MOCK_DESAFIOS.length,
    fonte: "mock",
  });
}
