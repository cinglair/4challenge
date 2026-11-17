/** `cheer` é a comemoração animada; `happy` é só o rosto contente, parado. */
export type OwlMood = 'idle' | 'happy' | 'cheer' | 'oops'

/**
 * Mascote do jogo, pousada num galho: fica observando, comemora o acerto
 * e lamenta o erro.
 */
export function OwlMascot({ mood = 'idle' }: { mood?: OwlMood }) {
   return (
      <svg
         className="owl"
         data-mood={mood}
         viewBox="0 0 150 128"
         aria-hidden="true"
      >
         {/* galho, com um raminho e duas folhas */}
         <g className="owl-branch">
            <path className="owl-wood" d="M3 118q52-7 96-4t48 4" />
            <path className="owl-wood thin" d="M118 115q8-9 20-11" />
            <g className="owl-leaves">
               <path
                  className="owl-leaf"
                  d="M137 104c-1-8 4-14 12-15 1 8-4 14-12 15z"
               />
               <path
                  className="owl-leaf"
                  d="M128 108c-6-5-7-12-2-18 6 5 7 12 2 18z"
               />
            </g>
         </g>

         <g transform="translate(15 0)">
            <g className="owl-perch">
               <path
                  className="owl-foot"
                  d="M42 108h14a4 4 0 0 1 0 8H42a4 4 0 0 1 0-8z"
               />
               <path
                  className="owl-foot"
                  d="M64 108h14a4 4 0 0 1 0 8H64a4 4 0 0 1 0-8z"
               />
               <g className="owl-figure">
                  <g className="owl-tilt">
                     <ellipse
                        className="owl-wing left"
                        cx="25"
                        cy="78"
                        rx="9"
                        ry="20"
                     />
                     <ellipse
                        className="owl-wing right"
                        cx="95"
                        cy="78"
                        rx="9"
                        ry="20"
                     />
                     {/* corpo com as duas orelhinhas */}
                     <path
                        className="owl-body"
                        d="M60 30c8 0 15 2 21 6l10-15c3 9 3 17 1 25a40 40 0 0 1 4 18c0 26-16 46-36 46S24 90 24 64c0-6 1-12 4-18-2-8-2-16 1-25l10 15c6-4 13-6 21-6z"
                     />
                     <ellipse
                        className="owl-belly"
                        cx="60"
                        cy="88"
                        rx="21"
                        ry="20"
                     />

                     <g className="owl-eye">
                        <circle
                           className="owl-eye-white"
                           cx="44"
                           cy="56"
                           r="13.5"
                        />
                        <circle
                           className="owl-eye-white"
                           cx="76"
                           cy="56"
                           r="13.5"
                        />
                        <g className="owl-pupils">
                           <circle
                              className="owl-pupil"
                              cx="45"
                              cy="57"
                              r="6.5"
                           />
                           <circle
                              className="owl-pupil"
                              cx="75"
                              cy="57"
                              r="6.5"
                           />
                           <circle
                              className="owl-glint"
                              cx="47.5"
                              cy="54.5"
                              r="2"
                           />
                           <circle
                              className="owl-glint"
                              cx="77.5"
                              cy="54.5"
                              r="2"
                           />
                        </g>
                     </g>
                     <path
                        className="owl-smile"
                        d="M34 59q10-12 20 0M66 59q10-12 20 0"
                     />
                     <path className="owl-brow" d="M33 47l15-5M87 47l-15-5" />

                     <path
                        className="owl-beak"
                        d="M53.5 63.5h13a2 2 0 0 1 1.6 3.2L61.6 75a2 2 0 0 1-3.2 0l-6.5-8.3a2 2 0 0 1 1.6-3.2z"
                     />
                  </g>
               </g>
            </g>
         </g>
      </svg>
   )
}
