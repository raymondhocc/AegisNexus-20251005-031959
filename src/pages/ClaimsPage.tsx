import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Claim, ClaimStatus, Customer } from '@shared/types';
import { api } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/PageHeader';
const statusStyles: { [key in ClaimStatus]: string } = {
  Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Denied: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};
const fetchClaims = async () => api<{ items: Claim[] }>('/api/claims');
const fetchCustomers = async () => api<{ items: Customer[] }>('/api/customers');
export function ClaimsPage() {
  const navigate = useNavigate();
  const { data: claimsData, isLoading: isLoadingClaims, error: claimsError } = useQuery({
    queryKey: ['claims'],
    queryFn: fetchClaims,
  });
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });
  const customerMap = React.useMemo(() => {
    if (!customersData) return new Map();
    return new Map(customersData.items.map(c => [c.id, c.name]));
  }, [customersData]);
  const isLoading = isLoadingClaims || isLoadingCustomers;
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="Claims" description="Manage all insurance claims.">
        <Button
          onClick={() => navigate('/claims/new')}
          className="hover:scale-105 active:scale-95 transition-transform duration-200 bg-blue-500 hover:bg-blue-600"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Claim
        </Button>
      </PageHeader>
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Policy ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : claimsError ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500">Failed to load claims.</TableCell>
                </TableRow>
              ) : (
                claimsData?.items.map((claim: Claim) => (
                  <TableRow key={claim.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/claims/${claim.id}`)}>
                    <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                    <TableCell>{customerMap.get(claim.customerId) || 'Unknown'}</TableCell>
                    <TableCell>{claim.policyId}</TableCell>
                    <TableCell>
                      <Badge className={cn('border-transparent', statusStyles[claim.status])}>
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${claim.amount.toLocaleString()}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/claims/${claim.id}`)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Process Claim</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}