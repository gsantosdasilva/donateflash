"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Heart, QrCode, History, Settings, Plus, ArrowLeft, Camera, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import QrScanner from "qr-scanner"
import { ThemeToggle } from "@/components/theme-toggle"

export default function MobileApp() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("create")
  const [paymentType, setPaymentType] = useState("pix")
  const [paymentDetails, setPaymentDetails] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(5)
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef(null)
  const [overlays, setOverlays] = useState([
    {
      id: "1",
      name: "Street Musician",
      type: "pix",
      details: "musician@email.com",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      active: false,
    },
    {
      id: "2",
      name: "Food Vendor",
      type: "paypal",
      details: "foodvendor",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      active: false,
    },
  ])

  useEffect(() => {
    let qrScanner

    if (isScanning && videoRef.current) {
      qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          setPaymentDetails(result.data)
          setIsScanning(false)
          toast({
            title: "QR Code Scanned",
            description: "Payment details have been added.",
          })
        },
        {
          /* your options or returnDetailedScanResult: true */
        },
      )

      qrScanner.start()
    }

    return () => {
      if (qrScanner) {
        qrScanner.destroy()
      }
    }
  }, [isScanning, toast])

  const handleCreateOverlay = () => {
    if (!paymentDetails || !recipientName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newOverlay = {
      id: Date.now().toString(),
      name: recipientName,
      type: paymentType,
      details: paymentDetails,
      description: description || `Help ${recipientName}`,
      duration,
      createdAt: new Date().toISOString(),
      active: true,
    }

    // Add to history and mark as active
    setOverlays([newOverlay, ...overlays.map((o) => ({ ...o, active: false }))])

    toast({
      title: "Overlay created!",
      description: "Your donation overlay is now live on your stream",
    })

    // Reset form
    setPaymentDetails("")
    setRecipientName("")
    setDescription("")

    // Switch to history tab to show the active overlay
    setActiveTab("history")

    // Simulate sending to OBS
    console.log("Sending overlay to OBS:", newOverlay)
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleDeactivate = (id) => {
    setOverlays(overlays.map((overlay) => (overlay.id === id ? { ...overlay, active: false } : overlay)))

    toast({
      title: "Overlay deactivated",
      description: "Your donation overlay has been removed from the stream",
    })

    // Simulate removing from OBS
    console.log("Removing overlay from OBS:", id)
  }

  const handleActivate = (id) => {
    setOverlays(
      overlays.map((overlay) => (overlay.id === id ? { ...overlay, active: true } : { ...overlay, active: false })),
    )

    toast({
      title: "Overlay activated",
      description: "Your donation overlay is now live on your stream",
    })

    // Simulate sending to OBS
    console.log("Sending overlay to OBS:", id)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              <span className="text-lg font-bold">DonateFlash</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 max-w-md mx-auto">
        {activeTab === "create" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Create Overlay</h1>

            <Card>
              <CardHeader>
                <CardTitle>Donation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-type">Payment Type</Label>
                  <Select value={paymentType} onValueChange={setPaymentType}>
                    <SelectTrigger id="payment-type">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">Pix (Brazil)</SelectItem>
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
                          ? "Chave Pix ou escaneie o QR code"
                          : paymentType === "paypal"
                            ? "email@exemplo.com"
                            : paymentType === "picpay"
                              ? "@nomeusuario"
                              : "nomeusuario"
                      }
                      value={paymentDetails}
                      onChange={(e) => setPaymentDetails(e.target.value)}
                    />
                    <Button variant="outline" size="icon" onClick={() => setIsScanning(!isScanning)}>
                      {isScanning ? <X className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {isScanning && (
                  <div className="relative aspect-square w-full max-w-sm mx-auto mb-4 overflow-hidden rounded-lg">
                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-white opacity-50"></div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="recipient-name">Recipient Name</Label>
                  <Input
                    id="recipient-name"
                    placeholder="Who are you helping?"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="What are they using the money for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="duration">Display Duration</Label>
                    <span className="text-sm text-gray-500">{duration} minutes</span>
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
                <Button onClick={handleCreateOverlay} className="w-full" disabled={!paymentDetails || !recipientName}>
                  Create Overlay
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Recent Overlays</h1>

            {overlays.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <History className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-500">No overlays created yet</p>
                  <Button variant="outline" onClick={() => setActiveTab("create")}>
                    Create Your First Overlay
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {overlays.map((overlay) => (
                  <Card key={overlay.id} className={overlay.active ? "border-green-500" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{overlay.name}</CardTitle>
                        {overlay.active && (
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatTime(overlay.createdAt)} · {overlay.type.toUpperCase()}
                      </p>
                    </CardHeader>
                    <CardFooter className="pt-2 flex justify-between">
                      {overlay.active ? (
                        <Button variant="destructive" size="sm" onClick={() => handleDeactivate(overlay.id)}>
                          Deactivate
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleActivate(overlay.id)}>
                          Activate
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/overlay?id=${overlay.id}`} target="_blank">
                          Preview
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>

            <Card>
              <CardHeader>
                <CardTitle>Stream Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="obs-url">OBS Browser Source URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="obs-url"
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/overlay`}
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${typeof window !== "undefined" ? window.location.origin : ""}/overlay`,
                        )
                        toast({
                          title: "Copied to clipboard",
                          description: "The overlay URL has been copied",
                        })
                      }}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Add this URL as a browser source in OBS with width: 350px, height: 250px
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Default Duration</Label>
                  <div className="flex justify-between">
                    <span className="text-sm">5 minutes</span>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Account</Label>
                  <div className="flex justify-between">
                    <span className="text-sm">user@example.com</span>
                    <Button variant="outline" size="sm">
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <div className="sticky bottom-0 border-t bg-white py-2">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-around">
            <Button
              variant={activeTab === "create" ? "default" : "ghost"}
              className="flex flex-col h-auto py-2"
              onClick={() => setActiveTab("create")}
            >
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-xs">Create</span>
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              className="flex flex-col h-auto py-2"
              onClick={() => setActiveTab("history")}
            >
              <History className="h-5 w-5 mb-1" />
              <span className="text-xs">History</span>
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="flex flex-col h-auto py-2"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5 mb-1" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

