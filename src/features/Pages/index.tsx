import {
   CONTACT_EMAIL,
   Link,
   PageShell,
   ROUTES,
   useDocumentHead,
   type PageContent,
} from '@/src/shared'

/** Troca `{email}` pelo link do e-mail de contato. */
function withEmail(text: string) {
   const [before, after] = text.split('{email}')
   if (after === undefined) return text
   return (
      <>
         {before}
         <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
         {after}
      </>
   )
}

/** Página institucional: o texto vem de `shared/site/pages.ts`. */
export function StaticPage({ page }: { page: PageContent }) {
   useDocumentHead(page)

   return (
      <PageShell heading={page.heading}>
         {page.sections.map((section, i) => (
            <section key={i}>
               {section.heading && <h2>{section.heading}</h2>}
               {section.paragraphs.map((paragraph, j) => (
                  <p key={j}>{withEmail(paragraph)}</p>
               ))}
            </section>
         ))}
      </PageShell>
   )
}

export function NotFoundPage() {
   useDocumentHead({
      title: 'Página não encontrada',
      description: 'Esta página não existe no algarism.io.',
      path: ROUTES.home,
   })

   return (
      <PageShell heading="Página não encontrada">
         <p>
            Este endereço não existe, ou o desafio deste dia ainda não foi
            liberado.
         </p>
         <p>
            <Link to={ROUTES.home}>Jogar o desafio de hoje</Link>
         </p>
      </PageShell>
   )
}
