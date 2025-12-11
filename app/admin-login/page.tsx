'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/providers/AuthProvider';
import { encryptPassword } from '@/lib/crypto';
import { Vote, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginFormInputs {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { login, loading: authLoading, error: authError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormInputs>();

  const passwordValue = watch('password');

  // Auto-hide password after 3.5 seconds
  useEffect(() => {
    if (showPassword && passwordValue) {
      // Clear existing timer
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
      }
      
      // Set new timer
      const timer = setTimeout(() => {
        setShowPassword(false);
      }, 3500);
      
      setAutoHideTimer(timer);
    }

    return () => {
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
      }
    };
  }, [showPassword, passwordValue, autoHideTimer]);

  const handlePasswordPeek = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLocalError(null);
      const encryptedPassword = encryptPassword(data.password);
      await login(data.username, encryptedPassword);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const isLoading = authLoading || isSubmitting;
  const displayError = authError || localError;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Vote className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the voting administration panel
          </CardDescription>
        </CardHeader>

        <CardContent>
          {displayError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                placeholder="Enter your username"
                autoComplete="username"
                {...register('username', {
                  required: 'Username is required',
                })}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={handlePasswordPeek}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Protected admin area. Credentials required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
