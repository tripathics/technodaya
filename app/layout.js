import './globals.scss'
import { Inter, Cormorant, Crimson_Text, Open_Sans, Zilla_Slab } from 'next/font/google'
import UserProvider from '@/contexts/user'

// const inter = Inter({ subsets: ['latin'] })
const open_sans = Open_Sans({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })
// const cormorant = Cormorant({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })
// const crimson_text = Crimson_Text({ display: 'swap', subsets: ['latin'], weight: ['400', '600', '700'], styles: ['normal', 'italic'] })
// const zilla_slab = Zilla_Slab({ display: 'swap', subsets: ['latin'], weight: ['300', '400'] })

export const metadata = {
  title: 'Technodaya | NIT AP',
  description: 'Technodaya Newsletter, NIT Arunachal Pradesh',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={[open_sans.className].join(' ')}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}