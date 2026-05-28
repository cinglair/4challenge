import { NextResponse } from "next/server";
import { buscarDesafioPorNivel } from "@/lib/desafios-db";

/**
 * GET /api/desafios/nivel/[nivel]
 * Retorna o desafio do nível especificado para o dia atual
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ nivel: string }> },
) {
  try {
    const { nivel: nivelStr } = await params;
    const nivel = parseInt(nivelStr);

    if (isNaN(nivel) || nivel < 1 || nivel > 10) {
      return NextResponse.json(
        { error: "Nível deve ser um número entre 1 e 10" },
        { status: 400 },
      );
    }

    const desafio = await buscarDesafioPorNivel(nivel);

    if (!desafio) {
      return NextResponse.json(
        {
          error: `Nenhum desafio encontrado para o nível ${nivel} hoje`,
          mensagem: "Execute 'npm run db:seed' para gerar desafios",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(desafio);
  } catch (error) {
    console.error("Erro ao buscar desafio:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar desafio",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
