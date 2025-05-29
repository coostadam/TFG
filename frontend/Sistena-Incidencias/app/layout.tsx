import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Service Now',
  description: 'Created with TypeScript and Java with a APIRest, by Costa, Alex and Darius',
  generator: 'Costa, Alex and Darius',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
