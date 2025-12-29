"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function AppearanceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Appearance</CardTitle>
        <CardDescription>Customize how your restaurant website looks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Color Scheme</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primaryColor" className="text-sm">
                Primary Color
              </Label>
              <div className="flex gap-2">
                <Input id="primaryColor" type="color" defaultValue="#3b82f6" className="h-10 w-20" />
                <Input defaultValue="#3b82f6" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor" className="text-sm">
                Accent Color
              </Label>
              <div className="flex gap-2">
                <Input id="accentColor" type="color" defaultValue="#f59e0b" className="h-10 w-20" />
                <Input defaultValue="#f59e0b" className="flex-1" />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="font">Font Family</Label>
          <Select defaultValue="inter">
            <SelectTrigger id="font">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="playfair">Playfair Display</SelectItem>
              <SelectItem value="lato">Lato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  )
}