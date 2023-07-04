import './globals.scss'
import { Open_Sans } from 'next/font/google'
import UserProvider from '@/contexts/user'
import AlertsProvider, { Alerts } from '@/contexts/alerts'

const open_sans = Open_Sans({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })

export const metadata = {
  title: 'Technodaya | NIT AP',
  description: 'Technodaya Newsletter, NIT Arunachal Pradesh',
}

export default function RootLayout({ children }) {
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