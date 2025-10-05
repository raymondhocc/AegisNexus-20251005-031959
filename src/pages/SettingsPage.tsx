import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';
import { useTheme } from '@/hooks/use-theme';
import { Switch } from '@/components/ui/switch';
const ProfileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});
type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: 'Admin User',
      email: 'admin@aegis-nexus.com',
    },
  });
  const onSubmit = (data: ProfileFormValues) => {
    toast.success('Profile updated successfully!');
    console.log(data);
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="Settings" description="Manage your account and application preferences." />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>Update your personal information here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Save Changes</Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
        <div className="md:col-span-1">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize the application's appearance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the dark theme.
                  </p>
                </div>
                <Switch
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}