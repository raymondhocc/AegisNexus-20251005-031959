import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Claim, Customer, Policy, ClaimStatus } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowLeft, User, Calendar, DollarSign, Shield, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
const fetchClaim = async (claimId: string) => api<Claim>(`/api/claims/${claimId}`);
const fetchCustomer = async (customerId: string) => api<Customer>(`/api/customers/${customerId}`);
const fetchPolicy = async (policyId: string) => api<Policy>(`/api/policies/${policyId}`);
const statusStyles: { [key in ClaimStatus]: string } = {
  Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Denied: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
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
export function ClaimDetailPage() {
  const { claimId } = useParams<{ claimId: string }>();
  const { data: claim, isLoading: isLoadingClaim, error: claimError } = useQuery({
    queryKey: ['claim', claimId],
    queryFn: () => fetchClaim(claimId!),
    enabled: !!claimId,
  });
  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', claim?.customerId],
    queryFn: () => fetchCustomer(claim!.customerId),
    enabled: !!claim?.customerId,
  });

  const { data: policy, isLoading: isLoadingPolicy } = useQuery({
    queryKey: ['policy', claim?.policyId],
    queryFn: () => fetchPolicy(claim!.policyId),
    enabled: !!claim?.policyId,
  });

  const isLoading = isLoadingClaim || (!!claim && (isLoadingCustomer || isLoadingPolicy));
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  if (claimError || !claim) {
    return <div>Error loading claim details.</div>;
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title={`Claim #${claim.claimNumber}`}>
        <Button variant="outline" asChild>
          <Link to="/claims"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Claims</Link>
        </Button>
      </PageHeader>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Claim Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <DetailItem icon={User} label="Customer" value={customer?.name || 'Loading...'} />
              <DetailItem icon={FileText} label="Policy Number" value={policy?.policyNumber || 'Loading...'} />
              <DetailItem icon={Calendar} label="Date of Incident" value={new Date(claim.dateOfIncident).toLocaleDateString()} />
              <DetailItem icon={DollarSign} label="Claim Amount" value={`$${claim.amount.toLocaleString()}`} />
              <DetailItem icon={Shield} label="Status" value={<Badge className={cn('border-transparent', statusStyles[claim.status])}>{claim.status}</Badge>} />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Description of Incident</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{claim.description}</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Update the claim status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700">Approve Claim</Button>
              <Button variant="destructive" className="w-full">Deny Claim</Button>
              <Button variant="outline" className="w-full">Set to 'In Progress'</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}