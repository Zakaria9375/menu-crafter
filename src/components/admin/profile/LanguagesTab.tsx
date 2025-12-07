"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', description: 'Default language', disabled: true, defaultChecked: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', description: 'Enable Arabic menu', defaultChecked: true },
  { code: 'fr', name: 'French', nativeName: 'Français', description: 'Enable French menu', defaultChecked: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', description: 'Enable Spanish menu', defaultChecked: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', description: 'Enable German menu', defaultChecked: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', description: 'Enable Italian menu', defaultChecked: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', description: 'Enable Chinese menu', defaultChecked: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', description: 'Enable Japanese menu', defaultChecked: false },
]

export default function LanguagesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supported Languages</CardTitle>
        <CardDescription>Select languages to display your menu in multiple languages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {AVAILABLE_LANGUAGES.map((language) => (
            <div key={language.code} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">
                  {language.name} ({language.nativeName})
                </Label>
                <p className="text-sm text-muted-foreground">{language.description}</p>
              </div>
              <Switch 
                defaultChecked={language.defaultChecked} 
                disabled={language.disabled}
              />
            </div>
          ))}
        </div>

        <Separator />

        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-medium">💡 Translation Tip</p>
          <p className="mt-1 text-blue-800">
            Enable languages here, then use the Translation Center to automatically translate your menu items.
          </p>
        </div>

        <Button>Save Languages</Button>
      </CardContent>
    </Card>
  )
}