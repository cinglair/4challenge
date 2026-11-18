import { Link, ROUTES } from '@/src/shared'

/** Rodapé "sobre": o logo, uma linha dizendo o que é o jogo e os links do site. */
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
         <nav aria-label="Páginas do site">
            <Link to={ROUTES.about}>Sobre</Link>
            <Link to={ROUTES.terms}>Termos</Link>
         </nav>
      </footer>
   )
}
