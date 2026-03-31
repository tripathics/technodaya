import './globals.css'
// import './globals.scss'
import { Crimson_Text, Cormorant, Zilla_Slab, Open_Sans, IBM_Plex_Mono } from 'next/font/google'
import UserProvider from '@/contexts/user'
import AlertsProvider, { Alerts } from '@/contexts/alerts'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'

const openSans = Open_Sans({ variable: '--font-open-sans' })
const crimsonText = Crimson_Text({ variable: '--font-crimson-text', weight: ['400', '600', '700'] })
const zillaSlab = Zilla_Slab({ variable: '--font-zilla-slab', weight: ['300', '400'] })
const cormorant = Cormorant({ variable: '--font-cormorant' })
const ibmPlexMono = IBM_Plex_Mono({ variable: '--font-ibm-plex-mono', weight: ['100', '200', '300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Technodaya | NIT AP',
  description: 'Technodaya Newsletter, NIT Arunachal Pradesh',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(
      cormorant.variable,
      crimsonText.variable,
      openSans.variable,
      zillaSlab.variable,
      ibmPlexMono.variable
    )}>
      <body>
        <AlertsProvider>
          <Alerts />
          <UserProvider>
            {children}
          </UserProvider>
        </AlertsProvider>
      </body>
    </html>
  )
}
