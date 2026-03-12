import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Karyadwar - Manufacturing Intranet Portal',
    template: '%s | Karyadwar',
  },
  description:
    'Karyadwar (Work Gateway) - Unified intranet portal for manufacturing operations. Access enterprise applications, site resources, and employee services.',
  keywords: ['intranet', 'manufacturing', 'portal', 'enterprise'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
