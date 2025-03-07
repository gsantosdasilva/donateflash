"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  Copy,
  ArrowLeft,
  QrCode,
  History,
  Settings,
  Layers,
  Play,
  Pause,
  Trash2,
  Plus,
  RefreshCw,
  Camera,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Clock } from "lucide-react"

export default function DesktopApp() {
  const { toast } = useToast()
  const [paymentType, setPaymentType] = useState("pix")
  const [paymentDetails, setPaymentDetails] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(5)
  const [isConnected, setIsConnected] = useState(true)
  const [overlays, setOverlays] = useState([
    {
      id: "1",
      name: "Street Musician",
      type: "pix",
      details: "musician@email.com",
      description: "Help this amazing guitarist",
      duration: 5,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      active: true,
      timeRemaining: 300, // 5 minutes in seconds
    },
    {
      id: "2",
      name: "Food Vendor",
      type: "paypal",
      details: "foodvendor",
      description: "Support local food",
      duration: 10,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      active: false,
      timeRemaining: 600, // 10 minutes in seconds
    },
    {
      id: "3",
      name: "Local Artist",
      type: "venmo",
      details: "@artist",
      description: "Buy art supplies",
      duration: 8,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      active: false,
      timeRemaining: 480, // 8 minutes in seconds
    },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setOverlays((prevOverlays) =>
        prevOverlays.map((overlay) => {
          if (overlay.active && overlay.timeRemaining > 0) {
            return { ...overlay, timeRemaining: overlay.timeRemaining - 1 }
          } else if (overlay.active && overlay.timeRemaining === 0) {
            handleDeactivate(overlay.id)
            return { ...overlay, active: false }
          }
          return overlay
        }),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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
      timeRemaining: duration * 60,
    }

    // Add to history and activate
    setOverlays([newOverlay, ...overlays.map((o) => ({ ...o, active: false }))])

    toast({
      title: "Overlay created!",
      description: "Your donation overlay is now active on the stream",
    })

    // Reset form
    setPaymentDetails("")
    setRecipientName("")
    setDescription("")
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleActivate = (id) => {
    setOverlays(
      overlays.map((overlay) =>
        overlay.id === id
          ? { ...overlay, active: true, timeRemaining: overlay.duration * 60 }
          : { ...overlay, active: false },
      ),
    )

    toast({
      title: "Overlay activated",
      description: "Your donation overlay is now active on the stream",
    })
  }

  const handleDeactivate = (id) => {
    setOverlays(overlays.map((overlay) => (overlay.id === id ? { ...overlay, active: false } : overlay)))

    toast({
      title: "Overlay deactivated",
      description: "Your donation overlay has been removed from the stream",
    })
  }

  const handleDelete = (id) => {
    setOverlays(overlays.filter((overlay) => overlay.id !== id))

    toast({
      title: "Overlay deleted",
      description: "Your donation overlay has been deleted",
    })
  }

  const activeOverlay = overlays.find((overlay) => overlay.active)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-bold">DonateFlash</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Desktop</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${isConnected ? "text-green-600" : "text-red-500"}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-600" : "bg-red-500"}`}></div>
              <span className="text-sm">{isConnected ? "Connected to OBS" : "Not connected"}</span>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="col-span-3">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Stream Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-600" : "bg-red-500"}`}></div>
                      <span>OBS Connection</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsConnected(!isConnected)
                        toast({
                          title: isConnected ? "Disconnected from OBS" : "Connected to OBS",
                          description: isConnected ? "You are now disconnected" : "Successfully connected to OBS",
                        })
                      }}
                    >
                      {isConnected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Active Overlay</h3>
                    {activeOverlay ? (
                      <div className="bg-white border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{activeOverlay.name}</span>
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Active</div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{activeOverlay.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">{activeOverlay.type.toUpperCase()}</span>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">
                              {formatTimeRemaining(activeOverlay.timeRemaining)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border rounded p-4 text-center">
                        <p className="text-sm text-gray-500">No active overlay</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>OBS Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="obs-url">Browser Source URL</Label>
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
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-scene">Auto Scene Switching</Label>
                      <Switch id="auto-scene" />
                    </div>
                    <p className="text-xs text-gray-500">Automatically switch to your overlay scene when activated</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-hide">Auto Hide When Expired</Label>
                      <Switch id="auto-hide" defaultChecked />
                    </div>
                    <p className="text-xs text-gray-500">Automatically hide the overlay when the timer expires</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-9">
            <Tabs defaultValue="create">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="create" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Create Overlay
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-1">
                    <History className="h-4 w-4" />
                    History
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="create" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Overlay</CardTitle>
                    <CardDescription>Enter the payment information for the person you want to help</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment-type">Payment Type</Label>
                          <Select value={paymentType} onValueChange={setPaymentType}>
                            <SelectTrigger id="payment-type">
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pix">Pix (Brazil)</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="venmo">Venmo</SelectItem>
                              <SelectItem value="cashapp">Cash App</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment-details">
                            {paymentType === "pix"
                              ? "Pix Key"
                              : paymentType === "paypal"
                                ? "PayPal.me Username"
                                : paymentType === "venmo"
                                  ? "Venmo Username"
                                  : "Cash App $Cashtag"}
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="payment-details"
                              placeholder={
                                paymentType === "pix"
                                  ? "CPF, email, phone, or random key"
                                  : paymentType === "paypal"
                                    ? "username (without paypal.me/)"
                                    : paymentType === "venmo"
                                      ? "@username"
                                      : "$cashtag"
                              }
                              value={paymentDetails}
                              onChange={(e) => setPaymentDetails(e.target.value)}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                toast({
                                  title: "QR Code Scanner",
                                  description:
                                    "QR Code scanning is not available in the desktop app. Please use the mobile app for this feature.",
                                })
                              }}
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

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
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="duration">Display Duration (minutes)</Label>
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

                        <div className="space-y-2">
                          <Label>Overlay Position</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" size="sm" className="h-20">
                              Top Left
                            </Button>
                            <Button variant="outline" size="sm" className="h-20">
                              Top Center
                            </Button>
                            <Button variant="outline" size="sm" className="h-20">
                              Top Right
                            </Button>
                            <Button variant="outline" size="sm" className="h-20">
                              Middle Left
                            </Button>
                            <Button variant="outline" size="sm" className="h-20">
                              Center
                            </Button>
                            <Button variant="outline" size="sm" className="h-20 bg-gray-100">
                              Middle Right
                            </Button>
                            <Button variant="outline" size="sm" className="h-20">
                              Bottom Left
                            </Button>
                            <Button variant="outline" size="sm" className="h-20">
                              Bottom Center
                            </Button>
                            <Button variant="outline" size="sm" className="h-20">
                              Bottom Right
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="activate-immediately">Activate Immediately</Label>
                            <Switch id="activate-immediately" />
                          </div>
                          <p className="text-xs text-gray-500">Automatically activate this overlay when created</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleCreateOverlay}
                      className="w-full"
                      disabled={!paymentDetails || !recipientName}
                    >
                      Create Overlay
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Overlay History</CardTitle>
                    <CardDescription>View and manage your previously created overlays</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {overlays.length === 0 ? (
                        <div className="text-center py-8">
                          <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No overlays created yet</p>
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 bg-gray-50 p-3 text-sm font-medium text-gray-500">
                            <div className="col-span-3">Name</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-3">Description</div>
                            <div className="col-span-2">Created</div>
                            <div className="col-span-2">Actions</div>
                          </div>
                          {overlays.map((overlay) => (
                            <div
                              key={overlay.id}
                              className={`grid grid-cols-12 p-3 text-sm border-t ${overlay.active ? "bg-green-50" : ""}`}
                            >
                              <div className="col-span-3 font-medium flex items-center">
                                {overlay.name}
                                {overlay.active && (
                                  <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                    Active
                                  </div>
                                )}
                              </div>
                              <div className="col-span-2 text-gray-500">{overlay.type.toUpperCase()}</div>
                              <div className="col-span-3 text-gray-500 truncate">{overlay.description}</div>
                              <div className="col-span-2 text-gray-500">{formatTime(overlay.createdAt)}</div>
                              <div className="col-span-2 flex space-x-2">
                                {overlay.active ? (
                                  <Button variant="destructive" size="sm" onClick={() => handleDeactivate(overlay.id)}>
                                    <Pause className="h-3.5 w-3.5 mr-1" />
                                    Stop
                                  </Button>
                                ) : (
                                  <Button variant="default" size="sm" onClick={() => handleActivate(overlay.id)}>
                                    <Play className="h-3.5 w-3.5 mr-1" />
                                    Start
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(overlay.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>Preview how your overlay will appear on stream</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-900 rounded-md relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=400&width=600"
                          alt="Stream preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {activeOverlay && (
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border flex flex-col items-center">
                          <div className="text-sm font-medium mb-2">{activeOverlay.description}</div>
                          <div className="bg-white p-2 rounded mb-2">
                            <QrCode className="w-28 h-28 text-gray-800" />
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> Available for{" "}
                            {formatTimeRemaining(activeOverlay.timeRemaining)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Overlay Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-timer">Show Timer</Label>
                            <Switch id="show-timer" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-description">Show Description</Label>
                            <Switch id="show-description" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="transparent-bg">Transparent Background</Label>
                            <Switch id="transparent-bg" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Style Customization</h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-5 gap-2">
                            <Button variant="outline" size="sm" className="h-8 bg-white"></Button>
                            <Button variant="outline" size="sm" className="h-8 bg-rose-100"></Button>
                            <Button variant="outline" size="sm" className="h-8 bg-blue-100"></Button>
                            <Button variant="outline" size="sm" className="h-8 bg-green-100"></Button>
                            <Button variant="outline" size="sm" className="h-8 bg-purple-100"></Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="border-radius">Border Radius</Label>
                            <Slider id="border-radius" min={0} max={20} step={1} value={[8]} className="w-32" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

