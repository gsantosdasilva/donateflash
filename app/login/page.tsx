import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">DonateFlash</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Entrar no DonateFlash</CardTitle>
            <CardDescription>
              Conecte-se com sua conta da Twitch para começar a criar overlays de doação
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Link href="/api/auth/twitch" className="w-full">
              <Button className="w-full" size="lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                </svg>
                Entrar com Twitch
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Ao entrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
            </p>
          </CardContent>
        </Card>
      </main>
      <footer className="border-t py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} DonateFlash. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}

