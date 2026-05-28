import { createClient } from "@/utils/supabase/server";

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

export async function buscarDesafiosDeHoje(): Promise<DesafioDoDia | null> {
  const supabase = await createClient();
  const hoje = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("desafio_diario")
    .select("*")
    .eq("data", hoje)
    .single();

  if (error || !data) return null;

  return { data: new Date(data.data), desafios: data.desafios as Desafio[] };
}

export async function buscarDesafioPorNivel(nivel: number): Promise<Desafio | null> {
  const desafiosDoDia = await buscarDesafiosDeHoje();
  if (!desafiosDoDia) return null;
  return desafiosDoDia.desafios.find((d) => d.nivel === nivel) ?? null;
}

export async function buscarDesafiosProximos(dias = 7): Promise<DesafioDoDia[]> {
  const supabase = await createClient();
  const hoje = new Date().toISOString().split("T")[0];
  const fim = new Date();
  fim.setDate(fim.getDate() + dias);
  const dataFim = fim.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("desafio_diario")
    .select("*")
    .gte("data", hoje)
    .lt("data", dataFim)
    .order("data", { ascending: true });

  if (error || !data) return [];

  return data.map((d: { data: string; desafios: unknown }) => ({
    data: new Date(d.data),
    desafios: d.desafios as Desafio[],
  }));
}

export async function registrarTentativa(params: {
  userId?: string;
  desafioId: number;
  nivel: number;
  expressao: string;
  sucesso: boolean;
  tempoSegundos?: number;
}) {
  const supabase = await createClient();

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

  if (error) throw error;
  return data;
}
