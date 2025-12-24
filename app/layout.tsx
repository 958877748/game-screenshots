import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { EnvProvider } from './env-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DreamScreen AI',
  description: 'Generate mobile game screenshots from text descriptions using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Pass environment variables to client
  const env = {
    MODELSCOPE_API_TOKEN: process.env.MODELSCOPE_API_TOKEN,
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <EnvProvider env={env}>
          {children}
        </EnvProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
      </body>
    </html>
  )
}