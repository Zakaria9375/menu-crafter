"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Login = () => {
  const t = useTranslations('auth.login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    tenantName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // TODO: Implement actual login logic
  };

  return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm shadow-elegant border-0">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
              <ChefHat className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('username')}</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                  className="transition-all focus:shadow-soft"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="transition-all focus:shadow-soft"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tenantName">{t('tenant')}</Label>
                <Input
                  id="tenantName"
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                  required
                  className="transition-all focus:shadow-soft"
                />
              </div>
              
              <Button type="submit" className="w-full" variant="hero">
                {t('button')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('noAccount')}{' '}
                <Link href="/register" className="text-primary hover:text-primary-glow font-semibold transition-colors">
                  {t('signUp')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Login;


