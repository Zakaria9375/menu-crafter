import {redirect} from '@/i18n/navigation';
import { cookies } from 'next/headers';

// This page only renders when the app is built statically (output: 'export')
export default async function RootPage() {
  const cookie =  await cookies();
  redirect({ href: '/', locale: cookie.get('NEXT_LOCALE')?.value || 'en' });
}