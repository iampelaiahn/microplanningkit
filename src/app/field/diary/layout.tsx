
import { Navigation } from '@/components/Navigation'

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-auto bg-background">
        {children}
      </main>
    </>
  )
}
