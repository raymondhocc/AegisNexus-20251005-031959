import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ClaimCreateSchema, ClaimCreateData, Customer, Policy } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PageHeader } from '@/components/PageHeader';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
const fetchCustomers = async () => api<{ items: Customer[] }>('/api/customers');
const fetchPolicies = async () => api<{ items: Policy[] }>('/api/policies');
const createClaim = async (data: ClaimCreateData) => api('/api/claims', {
  method: 'POST',
  body: JSON.stringify(data),
});
export function SubmitClaimPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<ClaimCreateData>({
    resolver: zodResolver(ClaimCreateSchema),
    defaultValues: { claimNumber: '', policyId: '', customerId: '', dateOfIncident: '', description: '', amount: 0 },
  });
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({ queryKey: ['customers'], queryFn: fetchCustomers });
  const { data: policiesData, isLoading: isLoadingPolicies } = useQuery({ queryKey: ['policies'], queryFn: fetchPolicies });
  const selectedCustomerId = form.watch('customerId');
  const filteredPolicies = React.useMemo(() => {
    return policiesData?.items.filter(p => p.customerId === selectedCustomerId) || [];
  }, [selectedCustomerId, policiesData]);
  const mutation = useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      toast.success('Claim submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      navigate('/claims');
    },
    onError: (error) => {
      toast.error(`Failed to submit claim: ${error.message}`);
    },
  });
  const onSubmit = (data: ClaimCreateData) => {
    mutation.mutate(data);
  };
  return (
    <div className="animate-fade-in">
      <PageHeader title="Submit New Claim" description="Fill in the details to submit a new insurance claim.">
        <Button variant="outline" asChild>
          <Link to="/claims"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Claims</Link>
        </Button>
      </PageHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-sm">
            <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="claimNumber" render={({ field }) => (
                <FormItem><FormLabel>Claim Number</FormLabel><FormControl><Input placeholder="e.g., CLM-00123" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="customerId" render={({ field }) => (
                <FormItem><FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCustomers}>
                    <FormControl><SelectTrigger><SelectValue placeholder={isLoadingCustomers ? "Loading..." : "Select a customer"} /></SelectTrigger></FormControl>
                    <SelectContent>{customersData?.items.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="policyId" render={({ field }) => (
                <FormItem><FormLabel>Policy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCustomerId || isLoadingPolicies}>
                    <FormControl><SelectTrigger><SelectValue placeholder={!selectedCustomerId ? "Select customer first" : "Select a policy"} /></SelectTrigger></FormControl>
                    <SelectContent>{filteredPolicies.map(p => <SelectItem key={p.id} value={p.id}>{p.policyNumber} ({p.policyType})</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem><FormLabel>Claim Amount ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dateOfIncident" render={({ field }) => (
                <FormItem><FormLabel>Date of Incident</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="md:col-span-2">
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the incident..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/claims')}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending} className="bg-blue-500 hover:bg-blue-600">{mutation.isPending ? 'Submitting...' : 'Submit Claim'}</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}