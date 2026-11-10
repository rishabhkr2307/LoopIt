import type { Metadata } from 'next'
import localFont from 'next/font/local'

import './globals.css'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'

const manrope = localFont({
  src: '../../public/fonts/Manrope-VariableFont_wght.ttf',
  variable: '--font-sans',
  display: 'swap',
  weight: '200 800',
})

export const metadata: Metadata = {
  title: 'LoopIt',
  description:
    'A peer to peer rental marketplace that enables people to borrow and lend everyday items',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', manrope.className, 'font-sans', manrope.variable)}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
