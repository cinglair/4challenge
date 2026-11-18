import { CookiePreferencesButton } from '../ads'
import { Link, usePathname } from '../router'
import { SITE_NAV } from '../site'

/** Links do rodapé para as outras páginas do site. */
export function SiteNav() {
   const pathname = usePathname()

   return (
      <nav className="site-nav" aria-label="Páginas do site">
         {SITE_NAV.filter((item) => item.to !== pathname).map((item) => (
            <Link key={item.to} to={item.to}>
               {item.label}
            </Link>
         ))}
         <CookiePreferencesButton />
      </nav>
   )
}
