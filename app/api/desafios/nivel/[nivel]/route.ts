import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Desafio } from "@/lib/desafios-db";

const MOCK_DESAFIOS: Record<number, Desafio> = {
  1:  { nivel: 1,  digito: 2, quantidade: 3, alvo: 6,   solucao: "(2 + 2 + 2)",              dificuldade: "facil"         },
  2:  { nivel: 2,  digito: 3, quantidade: 3, alvo: 9,   solucao: "(3 + 3 + 3)",              dificuldade: "facil"         },
  3:  { nivel: 3,  digito: 2, quantidade: 4, alvo: 20,  solucao: "((2 + 2) * (2 + 2 + 2))", dificuldade: "medio"         },
  4:  { nivel: 4,  digito: 3, quantidade: 4, alvo: 12,  solucao: "(3 + 3 + 3 + 3)",         dificuldade: "medio"         },
  5:  { nivel: 5,  digito: 4, quantidade: 3, alvo: 16,  solucao: "(4 + 4 + 4 + 4)",         dificuldade: "dificil"       },
  6:  { nivel: 6,  digito: 4, quantidade: 4, alvo: 24,  solucao: "((4 + 4) * (4 - (4 / 4)))", dificuldade: "dificil"    },
  7:  { nivel: 7,  digito: 5, quantidade: 4, alvo: 30,  solucao: "((5 + 5) * (5 - (5 / 5)))", dificuldade: "dificil"    },
  8:  { nivel: 8,  digito: 3, quantidade: 5, alvo: 33,  solucao: "(33 + (3 - 3))",          dificuldade: "muito-dificil" },
  9:  { nivel: 9,  digito: 4, quantidade: 5, alvo: 44,  solucao: "(44 + (4 - 4))",          dificuldade: "muito-dificil" },
  10: { nivel: 10, digito: 5, quantidade: 5, alvo: 55,  solucao: "(55 + (5 - 5))",          dificuldade: "mestre"        },
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ nivel: string }> },
) {
  const { nivel: nivelStr } = await params;
  const nivel = parseInt(nivelStr);

  if (isNaN(nivel) || nivel < 1 || nivel > 10) {
    return NextResponse.json({ error: "Nível deve ser entre 1 e 10" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const hoje = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("desafio_diario")
      .select("desafios")
      .eq("data", hoje)
      .single();

    if (!error && data) {
      const desafio = (data.desafios as Desafio[]).find((d) => d.nivel === nivel);
      if (desafio) return NextResponse.json({ ...desafio, fonte: "banco" });
    }
  } catch {}

  return NextResponse.json({ ...MOCK_DESAFIOS[nivel], fonte: "mock" });
}
