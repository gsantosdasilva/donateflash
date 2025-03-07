"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Copy, ExternalLink, ArrowLeft, QrCode, Camera } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Dashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [paymentType, setPaymentType] = useState("pix")
  const [paymentDetails, setPaymentDetails] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(5)
  const [isActive, setIsActive] = useState(false)
  const [overlayUrl, setOverlayUrl] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check")
      if (!response.ok) {
        router.push("/login")
      } else {
        setIsAuthenticated(true)
      }
    }
    checkAuth()
  }, [router])

  const handleCreateOverlay = () => {
    if (!paymentDetails || !recipientName) {
      toast({
        title: "Informações faltando",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Em um app real, isso criaria uma sessão no servidor
    // Para fins de demonstração, estamos apenas gerando uma URL falsa com parâmetros de consulta
    const params = new URLSearchParams({
      type: paymentType,
      details: paymentDetails,
      name: recipientName,
      description: description || `Ajude ${recipientName}`,
      duration: duration.toString(),
    })

    const url = `${window.location.origin}/overlay?${params.toString()}`
    setOverlayUrl(url)
    setIsActive(true)

    toast({
      title: "Overlay criado!",
      description: "Seu overlay de doação está ativo agora",
    })
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(overlayUrl)
    toast({
      title: "Copiado para a área de transferência",
      description: "A URL do overlay foi copiada para a área de transferência",
    })
  }

  const handleDeactivate = () => {
    setIsActive(false)
    setOverlayUrl("")
    toast({
      title: "Overlay desativado",
      description: "Seu overlay de doação foi desativado",
    })
  }

  if (!isAuthenticated) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-bold">DonateFlash</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user && <span className="text-sm">Olá, {user.display_name}</span>}
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Início
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="create">
            <TabsList>
              <TabsTrigger value="create">Criar Overlay</TabsTrigger>
              <TabsTrigger value="obs">Configurar OBS</TabsTrigger>
              <TabsTrigger value="instructions">Instruções</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h1 className="text-3xl font-bold mb-6">Criar Overlay de Doação</h1>
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes da Doação</CardTitle>
                      <CardDescription>
                        Insira as informações de pagamento da pessoa que você quer ajudar
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-type">Tipo de Pagamento</Label>
                        <Select value={paymentType} onValueChange={setPaymentType}>
                          <SelectTrigger id="payment-type">
                            <SelectValue placeholder="Selecione o tipo de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pix">Pix</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="picpay">PicPay</SelectItem>
                            <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-details">
                          {paymentType === "pix"
                            ? "Chave Pix ou QR Code"
                            : paymentType === "paypal"
                              ? "E-mail do PayPal"
                              : paymentType === "picpay"
                                ? "Nome de usuário PicPay"
                                : "Nome de usuário Mercado Pago"}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="payment-details"
                            placeholder={
                              paymentType === "pix"
                                ? "Chave Pix ou QR code escaneado"
                                : paymentType === "paypal"
                                  ? "email@exemplo.com"
                                  : "@nomeusuario"
                            }
                            value={paymentDetails}
                            onChange={(e) => setPaymentDetails(e.target.value)}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "Escaneamento de QR Code",
                                description:
                                  "O escaneamento de QR Code não está disponível no app desktop. Por favor, use o app móvel para esta funcionalidade.",
                              })
                            }}
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipient-name">Nome do Destinatário</Label>
                        <Input
                          id="recipient-name"
                          placeholder="Quem você está ajudando?"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição (Opcional)</Label>
                        <Input
                          id="description"
                          placeholder="Para que eles estão usando o dinheiro?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="duration">Duração da Exibição (minutos)</Label>
                          <span className="text-sm text-gray-500">{duration} minutos</span>
                        </div>
                        <Slider
                          id="duration"
                          min={1}
                          max={15}
                          step={1}
                          value={[duration]}
                          onValueChange={(value) => setDuration(value[0])}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={handleCreateOverlay}
                        className="w-full"
                        disabled={isActive || !paymentDetails || !recipientName}
                      >
                        Criar Overlay
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-6">Status do Overlay</h2>
                  <Card className={isActive ? "border-green-500" : "border-gray-200"}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Overlay Atual</span>
                        {isActive && (
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Ativo</div>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {isActive
                          ? `Ajudando ${recipientName} por ${duration} minutos`
                          : "Nenhum overlay ativo. Crie um para começar."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isActive ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">URL do Overlay</span>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                                  <Copy className="h-3.5 w-3.5 mr-1" />
                                  Copiar
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={overlayUrl} target="_blank">
                                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                    Abrir
                                  </Link>
                                </Button>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border text-xs text-gray-500 font-mono break-all">
                              {overlayUrl}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg border p-4">
                            <h3 className="text-sm font-medium mb-2">Prévia</h3>
                            <div className="bg-white border rounded-lg p-4 flex flex-col items-center">
                              <div className="text-sm font-medium mb-2">{description || `Ajude ${recipientName}`}</div>
                              <div className="bg-gray-100 p-2 rounded mb-2 flex items-center justify-center">
                                <QrCode className="w-24 h-24 text-gray-400" />
                              </div>
                              <div className="text-xs text-gray-500">Disponível por {duration}:00 minutos</div>
                            </div>
                          </div>

                          <div className="pt-2">
                            <h3 className="text-sm font-medium mb-2">Como usar</h3>
                            <ol className="text-sm text-gray-500 space-y-2 list-decimal pl-4">
                              <li>Copie a URL do overlay acima</li>
                              <li>No OBS, adicione uma nova fonte do tipo "Navegador"</li>
                              <li>Cole a URL e defina a largura como 350 e a altura como 250</li>
                              <li>Posicione o overlay onde desejar na sua transmissão</li>
                            </ol>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <QrCode className="h-16 w-16 text-gray-200 mb-4" />
                          <p className="text-gray-500 mb-2">Nenhum overlay ativo</p>
                          <p className="text-sm text-gray-400">
                            Preencha o formulário à esquerda para criar um overlay de doação
                          </p>
                        </div>
                      )}
                    </CardContent>
                    {isActive && (
                      <CardFooter>
                        <Button variant="destructive" className="w-full" onClick={handleDeactivate}>
                          Desativar Overlay
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="obs">
              <Card>
                <CardHeader>
                  <CardTitle>Configurar OBS</CardTitle>
                  <CardDescription>Siga estas etapas para configurar o DonateFlash no OBS</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-4">
                    <li>Abra o OBS Studio</li>
                    <li>
                      Clique com o botão direito na área de "Fontes" e selecione "Adicionar" &gt; "Fonte de navegador"
                    </li>
                    <li>Dê um nome à sua fonte, como "DonateFlash Overlay"</li>
                    <li>
                      Na janela de propriedades, cole a seguinte URL:
                      <div className="bg-gray-100 p-2 rounded mt-2">
                        <code>{`${window.location.origin}/overlay`}</code>
                      </div>
                    </li>
                    <li>Defina a largura como 350 e a altura como 250</li>
                    <li>Clique em "OK" para adicionar a fonte</li>
                    <li>Posicione o overlay onde desejar na sua cena</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="instructions">
              <Card>
                <CardHeader>
                  <CardTitle>Instruções de Uso</CardTitle>
                  <CardDescription>Como usar o DonateFlash em suas transmissões</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-4">
                    <li>Faça login com sua conta da Twitch</li>
                    <li>Configure o OBS seguindo as instruções na aba "Configurar OBS"</li>
                    <li>
                      Na aba "Criar Overlay":
                      <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>Escolha o tipo de pagamento</li>
                        <li>Insira os detalhes de pagamento (ou escaneie o QR code no app móvel)</li>
                        <li>Preencha o nome do destinatário e uma descrição opcional</li>
                        <li>Defina a duração do overlay</li>
                        <li>Clique em "Criar Overlay"</li>
                      </ul>
                    </li>
                    <li>O overlay aparecerá automaticamente na sua transmissão</li>
                    <li>Quando o tempo acabar, o overlay desaparecerá automaticamente</li>
                    <li>Você pode desativar manualmente o overlay a qualquer momento</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <span className="text-lg font-bold">DonateFlash</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} DonateFlash. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

