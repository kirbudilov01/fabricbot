import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppDataProvider } from '@/lib/store'
import { ToastProvider } from '@/components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FabricBot - Earn with Others',
  description: 'Get referral links to other people\'s products and earn together',
  keywords: 'referral, earnings, products, creators, marketplace',
  authors: [{ name: 'FabricBot Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppDataProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AppDataProvider>
      </body>
    </html>
  )
}