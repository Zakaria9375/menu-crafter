"use client"
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';



export const LanguageSelector = () => {

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("lang");
  const normalizedPathname = (() => {
    // e.g. /^\/(en|es|fr)(?=\/|$)/
    const localePrefix = new RegExp(`^/(?:${languages.map(l => l.code).join("|")})(?=/|$)`);
    const withoutLocale = pathname.replace(localePrefix, "");
    return withoutLocale === "" ? "/" : withoutLocale;
  })();

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const changeLanguage = (languageCode: string) => {
    // @ts-expect-error -- TypeScript will validate that only known `params`
    // are used in combination with a given `pathname`. Since the two will
    // always match for the current route, we can skip runtime checks.
    router.replace({ pathname: normalizedPathname, params }, { locale: languageCode })
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag} {t(currentLanguage.name)}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="cursor-pointer"
          >
            {language.flag} {t(language.name)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};