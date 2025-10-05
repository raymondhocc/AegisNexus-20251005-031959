import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { CustomerCreateSchema, CustomerCreateData } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PageHeader } from '@/components/PageHeader';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
const createCustomer = async (data: CustomerCreateData) => api('/api/customers', {
  method: 'POST',
  body: JSON.stringify(data),
});
export function CreateCustomerPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<CustomerCreateData>({
    resolver: zodResolver(CustomerCreateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });
  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast.success('Customer created successfully!');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/customers');
    },
    onError: (error) => {
      toast.error(`Failed to create customer: ${error.message}`);
    },
  });
  const onSubmit = (data: CustomerCreateData) => {
    mutation.mutate(data);
  };
  return (
    <div className="animate-fade-in">
      <PageHeader title="Create New Customer" description="Add a new customer profile to the system.">
        <Button variant="outline" asChild>
          <Link to="/customers"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers</Link>
        </Button>
      </PageHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-sm">
            <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input type="email" placeholder="e.g., john.doe@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input placeholder="e.g., 555-0101" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Input placeholder="e.g., 123 Maple St, Springfield" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/customers')}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending} className="bg-blue-500 hover:bg-blue-600">
                {mutation.isPending ? 'Creating...' : 'Create Customer'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}