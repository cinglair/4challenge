/** Rodapé "sobre": o logo e uma linha dizendo o que é o jogo. */
export function AboutFooter() {
   return (
      <footer className="about">
         <img
            src="/logo-algorism.webp"
            alt="algorism.io"
            width={720}
            height={191}
            loading="lazy"
         />
         <p>
            Um desafio de matemática por dia: forme o número-alvo usando um
            único algarismo.
         </p>
      </footer>
   )
}
