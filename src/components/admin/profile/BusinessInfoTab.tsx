"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"

export default function BusinessInfoTab() {
  return (
    <div className="space-y-6">
      {/* Tenant Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
          <CardDescription>Update your restaurant&apos;s basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Restaurant Name</Label>
            <Input id="restaurantName" defaultValue="The Golden Spoon" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="restaurantSlug">Restaurant Slug</Label>
            <Input id="restaurantSlug" defaultValue="the-golden-spoon" placeholder="restaurant-url-slug" />
            <p className="text-xs text-muted-foreground">This will be used in your restaurant URL</p>
          </div>


          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Select defaultValue="RESTAURANT">
              <SelectTrigger id="businessType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                <SelectItem value="HOTEL">Hotel</SelectItem>
                <SelectItem value="CAFE">Cafe</SelectItem>
                <SelectItem value="BAR">Bar</SelectItem>
                <SelectItem value="BAKERY">Bakery</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How customers can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" defaultValue="123 Gourmet Street, New York, NY 10001" rows={2} />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="info@goldenspoon.com" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" defaultValue="https://goldenspoon.com" placeholder="https://yourrestaurant.com" />
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Logo</CardTitle>
          <CardDescription>Upload your restaurant&apos;s logo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                <span className="text-3xl font-bold text-muted-foreground">GS</span>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB. Recommended 512x512px</p>
              </div>
            </div>
          </div>

          <Button>Save Logo</Button>
        </CardContent>
      </Card>
    </div>
  )
}