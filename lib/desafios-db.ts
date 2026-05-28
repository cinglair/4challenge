import supabase from "./supabase";

export interface Desafio {
  nivel: number;
  digito: number;
  quantidade: number;
  alvo: number;
  solucao: string;
  dificuldade: "facil" | "medio" | "dificil" | "muito-dificil" | "mestre";
}

export interface DesafioDoDia {
  data: Date;
  desafios: Desafio[];
}

/**
 * Busca os desafios do dia atual
 */
export async function buscarDesafiosDeHoje(): Promise<DesafioDoDia | null> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataFormatada = hoje.toISOString().split("T")[0];

  console.log("📅 Buscando desafios para:", dataFormatada);

  const { data, error } = await supabase
    .from("desafio_diario")
    .select("*")
    .eq("data", dataFormatada)
    .single();

  console.log("📊 Resposta Supabase:", { data, error });

  if (error || !data) {
    console.log(
      "⚠️ Nenhum desafio encontrado ou erro:",
      error?.message || "Sem dados",
    );
    return null;
  }

  console.log("✅ Desafios encontrados:", data);

  return {
    data: new Date(data.data),
    desafios: data.desafios as Desafio[],
  };
}

/**
 * Busca os desafios de uma data específica
 */
export async function buscarDesafiosPorData(
  data: Date,
): Promise<DesafioDoDia | null> {
  const dataLimpa = new Date(data);
  dataLimpa.setHours(0, 0, 0, 0);

  const { data: result, error } = await supabase
    .from("desafio_diario")
    .select("*")
    .eq("data", dataLimpa.toISOString().split("T")[0])
    .single();

  if (error || !result) {
    return null;
  }

  return {
    data: new Date(result.data),
    desafios: result.desafios as Desafio[],
  };
}

/**
 * Busca um desafio específico do dia por nível
 */
export async function buscarDesafioPorNivel(
  nivel: number,
): Promise<Desafio | null> {
  const desafiosDoDia = await buscarDesafiosDeHoje();

  if (!desafiosDoDia) {
    return null;
  }

  const desafio = desafiosDoDia.desafios.find((d) => d.nivel === nivel);
  return desafio || null;
}

/**
 * Busca desafios dos próximos N dias
 */
export async function buscarDesafiosProximos(
  dias: number = 7,
): Promise<DesafioDoDia[]> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataFinal = new Date(hoje);
  dataFinal.setDate(dataFinal.getDate() + dias);

  const { data: desafiosDiarios, error } = await supabase
    .from("desafio_diario")
    .select("*")
    .gte("data", hoje.toISOString().split("T")[0])
    .lt("data", dataFinal.toISOString().split("T")[0])
    .order("data", { ascending: true });

  if (error || !desafiosDiarios) {
    return [];
  }

  return desafiosDiarios.map((d: { data: string; desafios: unknown }) => ({
    data: new Date(d.data),
    desafios: d.desafios as Desafio[],
  }));
}

/**
 * Registra uma tentativa de resolução de desafio
 */
export async function registrarTentativa(params: {
  userId?: string;
  desafioId: number;
  nivel: number;
  expressao: string;
  sucesso: boolean;
  tempoSegundos?: number;
}) {
  const { data, error } = await supabase
    .from("tentativa_usuario")
    .insert({
      user_id: params.userId,
      desafio_id: params.desafioId,
      nivel: params.nivel,
      expressao: params.expressao,
      sucesso: params.sucesso,
      tempo_segundos: params.tempoSegundos,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Busca estatísticas de tentativas de um usuário
 */
export async function buscarEstatisticasUsuario(userId: string) {
  const { data: tentativas, error } = await supabase
    .from("tentativa_usuario")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !tentativas) {
    return {
      total: 0,
      sucesso: 0,
      falhas: 0,
      taxaSucesso: 0,
      ultimasTentativas: [],
    };
  }

  const total = tentativas.length;
  const sucesso = tentativas.filter(
    (t: { sucesso: boolean }) => t.sucesso,
  ).length;
  const taxaSucesso = total > 0 ? (sucesso / total) * 100 : 0;

  return {
    total,
    sucesso,
    falhas: total - sucesso,
    taxaSucesso: Math.round(taxaSucesso * 100) / 100,
    ultimasTentativas: tentativas.slice(0, 10),
  };
}
