"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

const NOTIFICATION_SETTINGS = [
  {
    id: 'menu-updates',
    title: 'Menu Updates',
    description: 'Get notified when menu items are viewed',
    defaultChecked: true,
  },
  {
    id: 'qr-scans',
    title: 'QR Code Scans',
    description: 'Receive alerts when customers scan your QR code',
    defaultChecked: true,
  },
  {
    id: 'weekly-reports',
    title: 'Weekly Reports',
    description: 'Get weekly analytics and insights via email',
    defaultChecked: true,
  },
  {
    id: 'marketing',
    title: 'Marketing Updates',
    description: 'Receive tips and promotional content',
    defaultChecked: false,
  },
]

export default function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose what notifications you want to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {NOTIFICATION_SETTINGS.map((setting, index) => (
          <div key={setting.id}>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{setting.title}</Label>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <Switch defaultChecked={setting.defaultChecked} />
            </div>
            {index < NOTIFICATION_SETTINGS.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}