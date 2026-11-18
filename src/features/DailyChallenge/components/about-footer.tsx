import { Link, ROUTES } from '@/src/shared'

/** Rodapé "sobre": uma linha dizendo o que é o jogo e os links do site. */
export function AboutFooter() {
   return (
      <footer className="about">
         <p>Desafios diários de matemática</p>
         <nav aria-label="Páginas do site">
            <Link to={ROUTES.about}>Sobre</Link>
            <Link to={ROUTES.terms}>Termos</Link>
         </nav>
      </footer>
   )
}
