
import Link from 'next/link'
import { Shield, UserCog, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary">
            Sentinel Mbare
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            High-tech health surveillance and microplanning for Wards 3, 4, 11, and 12.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:border-primary transition-all duration-300">
            <CardHeader>
              <UserCog className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Community Health Mobilizer</CardTitle>
              <CardDescription>
                Supervisor access for resource intelligence, stock management, and field oversight.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full h-12 text-lg">
                <Link href="/dashboard">Access Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-accent transition-all duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-accent mb-4" />
              <CardTitle className="text-2xl">Peer Educator</CardTitle>
              <CardDescription>
                Field access for real-time service tracking, UIN registration, and risk assessment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full h-12 text-lg bg-accent text-white hover:bg-accent/90">
                <Link href="/field">Go to Field Kit</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
