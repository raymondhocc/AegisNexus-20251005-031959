import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Customer, Policy, Claim, PolicyStatus, ClaimStatus } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Mail, Phone, MapPin, User, FileText, HandCoins } from 'lucide-react';
import { cn } from '@/lib/utils';
const fetchCustomer = async (customerId: string) => api<Customer>(`/api/customers/${customerId}`);
const fetchPolicies = async () => api<{ items: Policy[] }>('/api/policies');
const fetchClaims = async () => api<{ items: Claim[] }>('/api/claims');
const policyStatusStyles: { [key in PolicyStatus]: string } = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Expired: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};
const claimStatusStyles: { [key in ClaimStatus]: string } = {
  Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Denied: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};
interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}
function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
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
export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading: isLoadingCustomer, error: customerError } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomer(customerId!),
    enabled: !!customerId,
  });
  const { data: policiesData, isLoading: isLoadingPolicies } = useQuery({ queryKey: ['policies'], queryFn: fetchPolicies });
  const { data: claimsData, isLoading: isLoadingClaims } = useQuery({ queryKey: ['claims'], queryFn: fetchClaims });
  const customerPolicies = React.useMemo(() => policiesData?.items.filter(p => p.customerId === customerId) || [], [policiesData, customerId]);
  const customerClaims = React.useMemo(() => claimsData?.items.filter(c => c.customerId === customerId) || [], [claimsData, customerId]);
  const isLoading = isLoadingCustomer || isLoadingPolicies || isLoadingClaims;
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <PageHeader title={<Skeleton className="h-10 w-64" />} />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1"><Skeleton className="h-48 w-full" /></div>
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (customerError || !customer) {
    return <div>Error loading customer details.</div>;
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title={customer.name} description={`Member since ${new Date(customer.createdAt).toLocaleDateString()}`}>
        <Button variant="outline" asChild>
          <Link to="/customers"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers</Link>
        </Button>
      </PageHeader>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
          <Card className="shadow-sm">
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <DetailItem icon={Mail} label="Email" value={<a href={`mailto:${customer.email}`} className="text-blue-500 hover:underline">{customer.email}</a>} />
              <DetailItem icon={Phone} label="Phone" value={customer.phone} />
              <DetailItem icon={MapPin} label="Address" value={customer.address} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-muted-foreground" /> Policies</CardTitle>
              <CardDescription>All policies associated with this customer.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Premium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerPolicies.map(policy => (
                    <TableRow key={policy.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/policies/${policy.id}`)}>
                      <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                      <TableCell>{policy.policyType}</TableCell>
                      <TableCell><Badge className={cn('border-transparent', policyStatusStyles[policy.status])}>{policy.status}</Badge></TableCell>
                      <TableCell className="text-right">${policy.premium.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><HandCoins className="mr-2 h-5 w-5 text-muted-foreground" /> Claims History</CardTitle>
              <CardDescription>All claims filed by this customer.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim #</TableHead>
                    <TableHead>Policy #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerClaims.map(claim => (
                    <TableRow key={claim.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/claims/${claim.id}`)}>
                      <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                      <TableCell>{policiesData?.items.find(p => p.id === claim.policyId)?.policyNumber}</TableCell>
                      <TableCell><Badge className={cn('border-transparent', claimStatusStyles[claim.status])}>{claim.status}</Badge></TableCell>
                      <TableCell className="text-right">${claim.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}