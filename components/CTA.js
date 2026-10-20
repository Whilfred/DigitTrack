"use client"
import { usePathname } from 'next/navigation'
import StartLink from './StartLink'

export default function CTA() {
  const path = usePathname()
  if (['/connexion', '/inscription', '/dashboard'].includes(path)) return null
  return (
    <div className="final glass">
      <h2>Prêt à commencer ?</h2>
      <p>Créez votre espace gratuitement et lancez votre premier produit digital.</p>
      <StartLink className="btn btn-blue">Commencer mon parcours</StartLink>
    </div>
  )
}
