import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className={cn('container')}>
      <header className='page-header'>
        <h1 className='heading'>404 - Not found</h1>
      </header>
      <section className="font-serif">
        <p className="my-4">We couldn&#39;t find the page you were looking for. This is either because:</p>
        <ul className="list-disc pl-8">
          <li>There is an error in the URL entered into your web browser. Please check the URL and try again.</li>
          <li>The page you are looking for has been moved or deleted.</li>
        </ul>
        <p className="my-4"><Link replace href='/'>Return to Technodaya home</Link></p>
      </section>
    </div>
  )
}
