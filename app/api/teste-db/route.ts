import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json({
      ok: false,
      etapa: "env",
      erro: { message: "Variáveis de ambiente não configuradas" },
      variaveis: {
        NEXT_PUBLIC_SUPABASE_URL: url ?? "❌ ausente",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key ? "✅ presente" : "❌ ausente",
      },
    });
  }

  try {
    const supabase = await createClient();

    const { data, error, status } = await supabase
      .from("desafio_diario")
      .select("id, data, created_at")
      .limit(5)
      .order("data", { ascending: false });

    return NextResponse.json({
      ok: !error,
      etapa: error ? "query" : "sucesso",
      httpStatus: status,
      erro: error
        ? { message: error.message, code: error.code, details: error.details, hint: error.hint }
        : null,
      dados: data ?? [],
      total: data?.length ?? 0,
      variaveis: {
        NEXT_PUBLIC_SUPABASE_URL: url,
        chave_usada: key.slice(0, 24) + "...",
      },
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      etapa: "exception",
      erro: { message: String(e) },
      variaveis: { NEXT_PUBLIC_SUPABASE_URL: url, chave_usada: key.slice(0, 24) + "..." },
    });
  }
}
