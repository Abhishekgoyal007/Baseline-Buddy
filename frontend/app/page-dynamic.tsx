"use client"

import dynamic from 'next/dynamic'

// Dynamically import the main App component to prevent hydration mismatches
const DynamicApp = dynamic(() => import('./page'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  )
})

export default function HomePage() {
  return <DynamicApp />
}