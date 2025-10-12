
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { FileText, Scale, AlertTriangle, Users } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleParams } from '@/types/ITypes';

const Terms = async ({params}: {params: LocaleParams}) => {
  const { locale } = await params;

  setRequestLocale(locale);
  const t = await getTranslations('terms');

  return (
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('lastUpdated')} January 1, 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <Scale className="h-6 w-6 text-primary mt-1" />
                  <h2 className="text-2xl font-semibold">{t('acceptance.title')}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t('acceptance.content')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <Users className="h-6 w-6 text-primary mt-1" />
                  <h2 className="text-2xl font-semibold">{t('services.title')}</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>{t('services.intro')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('services.item1')}</li>
                    <li>{t('services.item2')}</li>
                    <li>{t('services.item3')}</li>
                    <li>{t('services.item4')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">{t('userRights.title')}</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>{t('userRights.intro')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('userRights.item1')}</li>
                    <li>{t('userRights.item2')}</li>
                    <li>{t('userRights.item3')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-4">
                  <AlertTriangle className="h-6 w-6 text-primary mt-1" />
                  <h2 className="text-2xl font-semibold">{t('prohibited.title')}</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>{t('prohibited.intro')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('prohibited.item1')}</li>
                    <li>{t('prohibited.item2')}</li>
                    <li>{t('prohibited.item3')}</li>
                    <li>{t('prohibited.item4')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">{t('liability.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('liability.content')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">{t('changes.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('changes.content')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">{t('contact.title')}</h2>
                <p className="text-muted-foreground mb-4">
                  {t('contact.content')}
                </p>
                <Link href="/contact">
                  <Button variant="hero">
                    {t('contact.button')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
  );
};

export default Terms;