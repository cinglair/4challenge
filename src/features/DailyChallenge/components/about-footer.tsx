/** Rodapé "sobre": o logo e uma linha dizendo o que é o jogo. */
export function AboutFooter() {
   return (
      <footer className="about">
         <img
            src="/logo-algarism.webp"
            alt="algarism.io"
            width={720}
            height={192}
            loading="lazy"
         />
         <p>Desafios diários de matemática</p>
      </footer>
   )
}
