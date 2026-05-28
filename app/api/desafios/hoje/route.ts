import { NextResponse } from "next/server";
import { buscarDesafiosDeHoje } from "@/lib/desafios-db";

/**
 * GET /api/desafios/hoje
 * Retorna os 10 desafios do dia atual
 */
export async function GET() {
  try {
    console.log("🎯 API /api/desafios/hoje chamada");

    const desafiosDoDia = await buscarDesafiosDeHoje();

    if (!desafiosDoDia) {
      console.log("❌ Nenhum desafio encontrado");
      return NextResponse.json(
        {
          error: "Nenhum desafio encontrado para hoje",
          mensagem: "Execute 'npm run db:seed' para gerar desafios",
        },
        { status: 404 },
      );
    }

    console.log("✅ Retornando", desafiosDoDia.desafios.length, "desafios");

    return NextResponse.json({
      data: desafiosDoDia.data,
      desafios: desafiosDoDia.desafios,
      total: desafiosDoDia.desafios.length,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar desafios:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar desafios",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
