import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Desafio } from "@/lib/desafios-db";

type Dificuldade = "facil" | "medio" | "dificil";

const NIVEL: Record<Dificuldade, number> = { facil: 1, medio: 2, dificil: 3 };

const MOCK: Record<Dificuldade, Desafio> = {
  facil:   { nivel: 1, digito: 2, quantidade: 3, alvo: 6,  solucao: "(2 + 2 + 2)",                    dificuldade: "facil"   },
  medio:   { nivel: 2, digito: 4, quantidade: 4, alvo: 16, solucao: "(4 + 4 + 4 + 4)",                dificuldade: "medio"   },
  dificil: { nivel: 3, digito: 3, quantidade: 5, alvo: 36, solucao: "((3 + 3) * (3 + 3) + 3 - 3)",   dificuldade: "dificil" },
};

export async function handleDesafio(dificuldade: Dificuldade) {
  const hoje = new Date().toISOString().split("T")[0];

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("desafio_diario")
      .select("digito, quantidade, alvo, solucao")
      .eq("data", hoje)
      .eq("dificuldade", dificuldade)
      .single();

    if (error) {
      return NextResponse.json({
        ...MOCK[dificuldade],
        fonte: "mock",
        _debug: { erro: error.message, code: error.code, data_consultada: hoje },
      });
    }

    return NextResponse.json({
      nivel:      NIVEL[dificuldade],
      digito:     data.digito,
      quantidade: data.quantidade,
      alvo:       Number(data.alvo), // NUMERIC volta como string do Postgres
      solucao:    data.solucao,
      dificuldade,
      fonte:      "banco",
    });
  } catch (e) {
    return NextResponse.json({
      ...MOCK[dificuldade],
      fonte: "mock",
      _debug: { erro: String(e), data_consultada: hoje },
    });
  }
}
