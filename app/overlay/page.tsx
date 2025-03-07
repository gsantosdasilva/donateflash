"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import QRCode from "qrcode.react"

export default function OverlayPage() {
  const searchParams = useSearchParams()
  const [timeLeft, setTimeLeft] = useState(0)
  const [isExpired, setIsExpired] = useState(false)

  // Obter parâmetros da URL
  const type = searchParams.get("type") || "pix"
  const details = searchParams.get("details") || ""
  const name = searchParams.get("name") || "Alguém"
  const description = searchParams.get("description") || `Ajude ${name}`
  const duration = Number.parseInt(searchParams.get("duration") || "5", 10)

  // Gerar a URL de pagamento apropriada com base no tipo de pagamento
  const getPaymentUrl = () => {
    switch (type) {
      case "pix":
        // Se os detalhes parecem ser uma URL (provavelmente um QR code escaneado), use-os diretamente
        if (details.startsWith("http") || details.startsWith("pix:")) {
          return details
        }
        // Caso contrário, é provavelmente uma chave Pix
        return `pix:${details}`
      case "paypal":
        return `https://paypal.me/${details}`
      case "picpay":
        return `https://picpay.me/${details}`
      case "mercadopago":
        return `https://www.mercadopago.com.br/${details}`
      default:
        return details
    }
  }

  const paymentUrl = getPaymentUrl()

  useEffect(() => {
    // Definir o tempo restante inicial em segundos
    setTimeLeft(duration * 60)

    // Iniciar contagem regressiva
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setIsExpired(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [duration])

  // Formatar tempo como MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Se expirado, retornar div vazio (transparente)
  if (isExpired) {
    return <div className="w-full h-full bg-transparent"></div>
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-transparent">
      <Card className="w-full max-w-[300px] bg-white/90 backdrop-blur-sm shadow-lg border">
        <CardContent className="p-4 flex flex-col items-center">
          <div className="text-sm font-medium mb-2">{description}</div>
          <div className="bg-white p-2 rounded mb-2 border">
            <QRCode value={paymentUrl} size={120} />
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" /> Disponível por {formatTime(timeLeft)}
          </div>
          <div className="mt-2 text-xs text-center">
            {type === "pix" ? (
              details.startsWith("http") || details.startsWith("pix:") ? (
                <span>QR Code Pix escaneado</span>
              ) : (
                <span>Chave Pix: {details}</span>
              )
            ) : (
              <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {type === "paypal"
                  ? "PayPal"
                  : type === "picpay"
                    ? "PicPay"
                    : type === "mercadopago"
                      ? "Mercado Pago"
                      : ""}
                : {details}
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

