"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy, Check, QrCodeIcon } from "lucide-react"
import { useState } from "react"

export default function AdminQRCodesPage() {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://golden-spoon.menucrafter.com/menu")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">QR Codes</h1>
        <p className="text-muted-foreground">Generate and download QR codes for your restaurant menu</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Menu QR Code</CardTitle>
            <CardDescription>Scan this code to view your digital menu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="rounded-lg border-4 border-border bg-white p-8">
                <div className="flex h-64 w-64 items-center justify-center bg-muted">
                  <QrCodeIcon className="h-32 w-32 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Menu URL</Label>
              <div className="flex gap-2">
                <Input value="https://golden-spoon.menucrafter.com/menu" readOnly />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Download className="h-4 w-4" />
                Download PNG
              </Button>
              <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Download SVG
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customization Options */}
        <Card>
          <CardHeader>
            <CardTitle>Customize QR Code</CardTitle>
            <CardDescription>Personalize your QR code appearance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="style" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>

              <TabsContent value="style" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (256x256)</SelectItem>
                      <SelectItem value="medium">Medium (512x512)</SelectItem>
                      <SelectItem value="large">Large (1024x1024)</SelectItem>
                      <SelectItem value="xlarge">Extra Large (2048x2048)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foreground">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input id="foreground" type="color" defaultValue="#000000" className="h-10 w-20" />
                    <Input defaultValue="#000000" className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background">Background Color</Label>
                  <div className="flex gap-2">
                    <Input id="background" type="color" defaultValue="#ffffff" className="h-10 w-20" />
                    <Input defaultValue="#ffffff" className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="errorCorrection">Error Correction</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="errorCorrection">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (7%)</SelectItem>
                      <SelectItem value="medium">Medium (15%)</SelectItem>
                      <SelectItem value="high">High (25%)</SelectItem>
                      <SelectItem value="highest">Highest (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Higher levels allow the QR code to be read even if partially damaged
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Add Logo (Optional)</Label>
                  <Input id="logo" type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground">Add your restaurant logo to the center of the QR code</p>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="qrType">QR Code Type</Label>
                  <Select defaultValue="menu">
                    <SelectTrigger id="qrType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menu">Full Menu</SelectItem>
                      <SelectItem value="homepage">Restaurant Homepage</SelectItem>
                      <SelectItem value="category">Specific Category</SelectItem>
                      <SelectItem value="custom">Custom URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customUrl">Custom URL (Optional)</Label>
                  <Input id="customUrl" placeholder="https://..." />
                  <p className="text-xs text-muted-foreground">Override the default menu URL</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="label">Label Text (Optional)</Label>
                  <Input id="label" placeholder="Scan for Menu" />
                  <p className="text-xs text-muted-foreground">Add text below the QR code</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Button className="w-full">Apply Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Print Templates</CardTitle>
          <CardDescription>Ready-to-print QR code designs for your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Table Tent",
                description: "Foldable stand for tables",
                size: "4x6 inches",
              },
              {
                name: "Poster",
                description: "Large format for walls",
                size: "11x17 inches",
              },
              {
                name: "Sticker",
                description: "Adhesive labels",
                size: "3x3 inches",
              },
            ].map((template, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-muted">
                    <QrCodeIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 font-semibold">{template.name}</h3>
                  <p className="mb-1 text-sm text-muted-foreground">{template.description}</p>
                  <p className="mb-4 text-xs text-muted-foreground">{template.size}</p>
                  <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Best Practices</CardTitle>
          <CardDescription>Tips for effective QR code placement and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Placement Tips</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Place at eye level for easy scanning</li>
                <li>• Ensure good lighting conditions</li>
                <li>• Keep QR codes at least 1 inch in size</li>
                <li>• Avoid placing on curved or reflective surfaces</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Design Tips</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Maintain high contrast between colors</li>
                <li>• Test QR codes before printing</li>
                <li>• Include a call-to-action like &quot;Scan for Menu&quot;</li>
                <li>• Keep logos small to ensure scannability</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
