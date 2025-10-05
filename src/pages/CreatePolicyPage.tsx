import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { PolicyCreateSchema, PolicyCreateData, Customer } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PageHeader } from '@/components/PageHeader';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
const fetchCustomers = async () => api<{ items: Customer[] }>('/api/customers');
const createPolicy = async (data: PolicyCreateData) => api('/api/policies', {
  method: 'POST',
  body: JSON.stringify(data),
});
export function CreatePolicyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<PolicyCreateData>({
    resolver: zodResolver(PolicyCreateSchema),
    defaultValues: {
      policyNumber: '',
      customerId: '',
      policyType: undefined,
      startDate: '',
      endDate: '',
      premium: 0,
    },
  });
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });
  const mutation = useMutation({
    mutationFn: createPolicy,
    onSuccess: () => {
      toast.success('Policy created successfully!');
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      navigate('/policies');
    },
    onError: (error) => {
      toast.error(`Failed to create policy: ${error.message}`);
    },
  });
  const onSubmit = (data: PolicyCreateData) => {
    mutation.mutate(data);
  };
  return (
    <div className="animate-fade-in">
      <PageHeader title="Create New Policy" description="Fill in the details to issue a new insurance policy.">
        <Button variant="outline" asChild>
          <Link to="/policies"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Policies</Link>
        </Button>
      </PageHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-sm">
            <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="policyNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Number</FormLabel>
                  <FormControl><Input placeholder="e.g., AUT-12345" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="customerId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCustomers}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCustomers ? "Loading customers..." : "Select a customer"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customersData?.items.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="policyType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a policy type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Auto', 'Home', 'Life', 'Health', 'Business'].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="premium" render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium ($)</FormLabel>
                  <FormControl><Input
                    type="number"
                    placeholder="e.g., 1200"
                    {...field}
                  /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/policies')}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending} className="bg-blue-500 hover:bg-blue-600">
                {mutation.isPending ? 'Creating...' : 'Create Policy'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}