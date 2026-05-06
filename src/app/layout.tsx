import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/dashboard/Navigation'

export const metadata: Metadata = {
  title: 'Personal Brand Developer',
  description: 'Autonomous personal brand growth system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <div className="flex h-screen overflow-hidden">
          <Navigation />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
