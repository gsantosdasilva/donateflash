"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Heart, Clock, Zap, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check")
        if (response.ok) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      }
    }
    checkAuth()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">DonateFlash</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Início
            </Link>
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Recursos
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              Como Funciona
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Usar Agora
                </Button>
              </Link>
            ) : (
              <Link href="/api/auth/twitch">
                <Button>
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
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ajude Outros, <span className="text-rose-500">Instantaneamente</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  DonateFlash permite que streamers IRL criem overlays de doação temporários para pessoas que encontram.
                  Compartilhe detalhes de pagamento com sua audiência em segundos, sem interromper sua transmissão.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                    <Button size="lg" className="gap-1">
                      Comece Agora <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="relative rounded-lg overflow-hidden border shadow-xl">
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                    AO VIVO
                  </div>
                  <div className="bg-muted aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Prévia da transmissão"
                        className="object-cover"
                        width={600}
                        height={400}
                      />
                    </div>
                    <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border flex flex-col items-center">
                      <div className="text-sm font-medium mb-2">Ajude Maria com seu negócio</div>
                      <div className="bg-white p-2 rounded mb-2">
                        <img
                          src="/placeholder.svg?height=120&width=120"
                          alt="Código QR"
                          className="w-28 h-28"
                          width={120}
                          height={120}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Disponível por 5:00 minutos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted-foreground/20 px-3 py-1 text-sm">Recursos</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Por que usar o DonateFlash?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Projetado especificamente para streamers IRL que querem ajudar outros em movimento
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Zap className="h-8 w-8 text-rose-500" />
                  <CardTitle className="text-xl">Configuração Rápida</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Crie overlays de doação em segundos. Basta inserir os detalhes de pagamento e você está pronto.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Clock className="h-8 w-8 text-rose-500" />
                  <CardTitle className="text-xl">Exibição Temporária</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Defina um temporizador para a duração do overlay de doação. Ele desaparece automaticamente quando o
                    tempo acaba.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Shield className="h-8 w-8 text-rose-500" />
                  <CardTitle className="text-xl">Seguro e Privado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Não armazenamos detalhes de pagamento a longo prazo. As informações são usadas apenas para gerar o
                    overlay temporário.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Como Funciona</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Processo Simples em 3 Etapas</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  O DonateFlash é projetado para ser o mais simples possível, para que você possa se concentrar na sua
                  transmissão
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-900">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Insira os Detalhes de Pagamento</h3>
                <p className="text-muted-foreground">
                  Insira as informações de pagamento do destinatário (chave Pix, PayPal, etc.) e defina a duração da
                  exibição.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-900">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Adicione à Sua Transmissão</h3>
                <p className="text-muted-foreground">
                  Copie a URL da fonte do navegador para o OBS ou seu software de streaming preferido.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-900">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Deixe os Espectadores Doarem</h3>
                <p className="text-muted-foreground">
                  O overlay aparece na sua transmissão com um código QR e temporizador. Ele desaparece automaticamente
                  quando o tempo acaba.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <span className="text-lg font-bold">DonateFlash</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DonateFlash. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

