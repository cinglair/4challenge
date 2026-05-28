"use client";

import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Resultado = Record<string, any>;

type Endpoint = {
  label: string;
  url: string;
};

const ENDPOINTS: Endpoint[] = [
  { label: "Conexão direta (tabela)",   url: "/api/teste-db" },
  { label: "Desafio — Fácil",           url: "/api/desafios/facil" },
  { label: "Desafio — Médio",           url: "/api/desafios/medio" },
  { label: "Desafio — Difícil",         url: "/api/desafios/dificil" },
];

function FonteBadge({ fonte }: { fonte?: string }) {
  if (!fonte) return null;
  const isBanco = fonte === "banco";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isBanco ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
      {isBanco ? "✅ banco" : "⚠️ mock"}
    </span>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);

  const testar = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const res = await fetch(endpoint.url);
      const data = await res.json();
      setResultado(data);
      setOk(res.ok && data.ok !== false);
    } catch (e) {
      setResultado({ erro: String(e) });
      setOk(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800 text-sm">{endpoint.label}</p>
          <code className="text-xs text-gray-400">{endpoint.url}</code>
        </div>
        <button
          onClick={testar}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition"
        >
          {loading ? "..." : "Testar"}
        </button>
      </div>

      {resultado && (
        <div className={`rounded-lg p-3 text-xs ${ok ? "bg-green-50" : "bg-red-50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <span>{ok ? "✅" : "❌"}</span>
            <FonteBadge fonte={resultado.fonte} />
            {resultado._debug && (
              <span className="text-red-600 font-mono">
                {resultado._debug.erro} | data: {resultado._debug.data_consultada}
              </span>
            )}
          </div>
          <pre className="overflow-auto max-h-40 text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function TesteDB() {
  const testarTodos = async () => {
    document.querySelectorAll<HTMLButtonElement>("button[data-testar]").forEach((b) => b.click());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">🔌 Teste — Supabase</h1>
          <button
            onClick={testarTodos}
            className="bg-slate-700 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded-lg"
          >
            Testar tudo
          </button>
        </div>

        {ENDPOINTS.map((ep) => (
          <EndpointCard key={ep.url} endpoint={ep} />
        ))}

        <p className="text-xs text-gray-400 text-center">
          <code>fonte: banco</code> = Supabase · <code>fonte: mock</code> = fallback local
          {" "}· <code>_debug</code> = erro detalhado quando usa mock
        </p>
      </div>
    </div>
  );
}
