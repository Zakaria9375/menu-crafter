import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BusinessInfoTab from "@/components/admin/profile/BusinessInfoTab"
import SocialLinksTab from "@/components/admin/profile/SocialLinksTab"
import OperatingHoursTab from "@/components/admin/profile/OperatingHoursTab"
import LanguagesCurrenciesTab from "@/components/admin/profile/LanguagesCurrenciesTab"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Business Profile</h1>
        <p className="text-muted-foreground">Manage your business profile information and business details</p>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="hours">Operating Hours</TabsTrigger>
          <TabsTrigger value="languages">Languages & Currencies</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <BusinessInfoTab />
        </TabsContent>

        <TabsContent value="social">
          <SocialLinksTab />
        </TabsContent>

        <TabsContent value="hours">
          <OperatingHoursTab />
        </TabsContent>

        <TabsContent value="languages">
          <LanguagesCurrenciesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
