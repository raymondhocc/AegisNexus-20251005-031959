import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@aegis-nexus.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@aegis-nexus.com' && password === 'password123') {
        localStorage.setItem('aegis-auth-token', 'mock-jwt-token');
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };
  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-slate-900 opacity-20 dark:opacity-30"></div>
      <Card className="w-full max-w-sm z-10 shadow-lg animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-lg bg-blue-500 text-white">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-display">Aegis Nexus</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full hover:scale-105 active:scale-95 transition-transform duration-200 bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}