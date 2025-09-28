import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Contact = () => {
  const t = useTranslations('contact');

  return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">{t('form.title')}</CardTitle>
              <CardDescription>{t('form.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('form.firstName')}</Label>
                  <Input id="firstName" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('form.lastName')}</Label>
                  <Input id="lastName" className="bg-background/50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input id="email" type="email" className="bg-background/50" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">{t('form.subject')}</Label>
                <Input id="subject" className="bg-background/50" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">{t('form.message')}</Label>
                <Textarea 
                  id="message" 
                  rows={5} 
                  className="bg-background/50 resize-none"
                />
              </div>
              
              <Button variant="hero" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                {t('form.send')}
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('info.email.title')}</h3>
                    <p className="text-muted-foreground">{t('info.email.desc')}</p>
                    <p className="text-primary font-medium mt-2">hello@menucrafter.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('info.phone.title')}</h3>
                    <p className="text-muted-foreground">{t('info.phone.desc')}</p>
                    <p className="text-primary font-medium mt-2">+1 (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('info.address.title')}</h3>
                    <p className="text-muted-foreground">{t('info.address.desc')}</p>
                    <p className="text-primary font-medium mt-2">
                      123 Restaurant Ave<br />
                      Food District, NY 10001
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
  );
};

export default Contact;