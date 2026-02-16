
import { Navigation } from '@/components/Navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-auto">
        {children}
      </main>
    </>
  )
}
