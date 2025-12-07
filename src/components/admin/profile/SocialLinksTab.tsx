"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Twitter, MessageCircle, Music2, Globe } from "lucide-react"

const SOCIAL_PLATFORMS = [
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    placeholder: 'https://facebook.com/yourrestaurant',
    type: 'url',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    placeholder: 'https://instagram.com/yourrestaurant',
    type: 'url',
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    icon: Twitter,
    placeholder: 'https://x.com/yourrestaurant',
    type: 'url',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    placeholder: '+1234567890',
    type: 'tel',
    helper: 'Enter phone number with country code',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: Music2,
    placeholder: 'https://tiktok.com/@yourrestaurant',
    type: 'url',
  },
]

export default function SocialLinksTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Accounts</CardTitle>
        <CardDescription>Connect your social media profiles to appear on your menu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {SOCIAL_PLATFORMS.map((platform) => (
          <div key={platform.id} className="space-y-2">
            <Label htmlFor={platform.id} className="flex items-center gap-2">
              <platform.icon className="h-4 w-4" />
              {platform.label}
            </Label>
            <Input 
              id={platform.id} 
              type={platform.type} 
              placeholder={platform.placeholder} 
            />
            {platform.helper && (
              <p className="text-xs text-muted-foreground">{platform.helper}</p>
            )}
          </div>
        ))}

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Website
          </Label>
          <Input 
            id="website" 
            type="url" 
            placeholder="https://yourrestaurant.com" 
          />
        </div>

        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  )
}