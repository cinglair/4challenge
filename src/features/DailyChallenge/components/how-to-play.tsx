import { useRef } from 'react'

/** Botão "?" do cabeçalho, que abre as regras do jogo. */
export function HowToPlay() {
   const dialogRef = useRef<HTMLDialogElement>(null)

   return (
      <>
         <button
            type="button"
            className="icon-button"
            aria-label="Como jogar"
            title="Como jogar"
            onClick={() => dialogRef.current?.showModal()}
         >
            <svg viewBox="0 0 24 24" aria-hidden="true">
               <circle cx="12" cy="12" r="9.5" />
               <path d="M9.4 9.4a2.7 2.7 0 1 1 4.2 2.2c-.9.6-1.6 1.1-1.6 2.1" />
               <path d="M12 16.9v.01" />
            </svg>
         </button>

         <dialog
            ref={dialogRef}
            className="howto"
            aria-labelledby="howto-title"
            // clique no fundo escuro fecha
            onClick={(e) => {
               if (e.target === e.currentTarget) e.currentTarget.close()
            }}
         >
            <div className="howto-head">
               <h2 id="howto-title">Como jogar</h2>
               <button
                  type="button"
                  className="icon-button"
                  aria-label="Fechar"
                  onClick={() => dialogRef.current?.close()}
               >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                     <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                  </svg>
               </button>
            </div>

            <p>
               Forme o <strong>número-alvo</strong> usando só o algarismo do
               desafio, <strong>exatamente</strong> a quantidade de vezes
               pedida. Algarismos lado a lado formam um número: 4 e 4 viram 44.
            </p>
            <ul>
               <li>
                  <strong>Fácil:</strong> soma, subtração, multiplicação, fração
                  e parênteses.
               </li>
               <li>
                  <strong>Médio:</strong> entram potência e raiz quadrada.
               </li>
               <li>
                  <strong>Difícil:</strong> entra o fatorial.
               </li>
            </ul>
            <ul>
               <li>
                  O <strong>olho</strong> mostra o resultado da conta enquanto
                  você escreve.
               </li>
               <li>
                  A <strong>dica</strong> mostra uma solução com metade dos
                  algarismos e metade dos sinais escondidos.
               </li>
               <li>
                  O <strong>calendário</strong> abre os desafios de outros dias.
               </li>
            </ul>
            <p>
               No teclado: <kbd>/</kbd> fração, <kbd>^</kbd> potência,{' '}
               <kbd>r</kbd> raiz, <kbd>!</kbd> fatorial e <kbd>Enter</kbd> para
               verificar.
            </p>
         </dialog>
      </>
   )
}
