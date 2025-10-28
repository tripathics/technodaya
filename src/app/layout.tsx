import './globals.scss'
import { Open_Sans } from 'next/font/google'
import UserProvider from '@/contexts/user'
import AlertsProvider, { Alerts } from '@/contexts/alerts'
import type { Metadata } from 'next'

const open_sans = Open_Sans({
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic']
})

export const metadata: Metadata = {
  title: 'Technodaya | NIT AP',
  description: 'Technodaya Newsletter, NIT Arunachal Pradesh',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={[open_sans.className].join(' ')}>
        <AlertsProvider>
          <Alerts />
          <UserProvider>{children}</UserProvider>
        </AlertsProvider>
      </body>
    </html>
  )
}
