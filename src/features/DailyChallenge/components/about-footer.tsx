/** Rodapé "sobre": a coruja, o nome e uma linha dizendo o que é o jogo. */
export function AboutFooter() {
   return (
      <footer className="about">
         <img
            src="/favicon-192.png"
            alt=""
            width={192}
            height={192}
            loading="lazy"
         />
         <p className="about-name">
            algarism<span>.io</span>
         </p>
         <p>Desafios diários de matemática</p>
      </footer>
   )
}
