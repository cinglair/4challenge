/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly VITE_SUPABASE_URL?: string
   readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
   /** AdSense: "ca-pub-…" do editor e o bloco exibido abaixo do jogo. */
   readonly VITE_ADSENSE_CLIENT?: string
   readonly VITE_ADSENSE_SLOT?: string
}

interface ImportMeta {
   readonly env: ImportMetaEnv
}
