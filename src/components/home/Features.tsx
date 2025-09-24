"use client"
import { Palette, Globe, BarChart3 } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { useTranslations } from "next-intl"

const Features = () => {
	const t = useTranslations('home.features');
	
	return (
		<section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6 mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Palette className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('design.title')}</h3>
                <p className="text-muted-foreground">{t('design.desc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6 mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Globe className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('multi.title')}</h3>
                <p className="text-muted-foreground">{t('multi.desc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6 mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('analytics.title')}</h3>
                <p className="text-muted-foreground">{t('analytics.desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
	)
}

export default Features
