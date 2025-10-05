import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Policy, Customer, PolicyStatus } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowLeft, User, Calendar, DollarSign, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
const fetchPolicy = async (policyId: string) => api<Policy>(`/api/policies/${policyId}`);
const fetchCustomer = async (customerId: string) => api<Customer>(`/api/customers/${customerId}`);
const statusStyles: { [key in PolicyStatus]: string } = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Expired: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};
function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-3">
      <Icon className="h-5 w-5 text-muted-foreground mt-1" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
export function PolicyDetailPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const { data: policy, isLoading: isLoadingPolicy, error: policyError } = useQuery({
    queryKey: ['policy', policyId],
    queryFn: () => fetchPolicy(policyId!),
    enabled: !!policyId,
  });
  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', policy?.customerId],
    queryFn: () => fetchCustomer(policy!.customerId),
    enabled: !!policy?.customerId,
  });
  const isLoading = isLoadingPolicy || (!!policy && isLoadingCustomer);
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  if (policyError || !policy) {
    return <div>Error loading policy details.</div>;
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title={`Policy #${policy.policyNumber}`}>
        <Button variant="outline" asChild>
          <Link to="/policies"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Policies</Link>
        </Button>
      </PageHeader>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Policy Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DetailItem icon={User} label="Customer" value={customer?.name || '...'} />
          <DetailItem icon={Shield} label="Policy Type" value={policy.policyType} />
          <DetailItem icon={DollarSign} label="Premium" value={`$${policy.premium.toLocaleString()}`} />
          <DetailItem icon={Calendar} label="Start Date" value={new Date(policy.startDate).toLocaleDateString()} />
          <DetailItem icon={Calendar} label="End Date" value={new Date(policy.endDate).toLocaleDateString()} />
          <DetailItem icon={Shield} label="Status" value={<Badge className={cn('border-transparent', statusStyles[policy.status])}>{policy.status}</Badge>} />
        </CardContent>
      </Card>
    </div>
  );
}