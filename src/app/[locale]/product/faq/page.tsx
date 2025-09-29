import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

const FAQ = async ({params}: {params: Promise<{locale: string}>}) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('faq');

  return (
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
              <HelpCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-b border-border/20">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {t('questions.q1.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('questions.q1.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b border-border/20">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {t('questions.q2.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('questions.q2.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b border-border/20">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {t('questions.q3.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('questions.q3.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-b border-border/20">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {t('questions.q4.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('questions.q4.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-b border-border/20">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {t('questions.q5.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('questions.q5.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border-b border-border/20">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {t('questions.q6.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('questions.q6.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border-b border-border/20">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {t('questions.q7.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('questions.q7.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {t('questions.q8.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t('questions.q8.answer')}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft mt-12">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('stillNeedHelp.title')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('stillNeedHelp.description')}
              </p>
              <Link href="/product/contact">
                <Button variant="hero">
                  {t('stillNeedHelp.button')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
  );
};

export default FAQ;