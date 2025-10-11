import {redirect} from '@/i18n/navigation';
import { getCurrentLocale } from '@/utils/getCurrentLocale';

// This page only renders when the app is built statically (output: 'export')
export default async function RootPage() {
  const locale = await getCurrentLocale();
  redirect({ href: '/', locale });
}