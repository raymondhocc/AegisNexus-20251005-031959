import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Policy, PolicyStatus, Customer } from '@shared/types';
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
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const statusStyles: { [key in PolicyStatus]: string } = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Expired: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};
const fetchPolicies = async () => api<{ items: Policy[] }>('/api/policies');
const fetchCustomers = async () => api<{ items: Customer[] }>('/api/customers');
const deletePolicy = async (policyId: string) => api(`/api/policies/${policyId}`, { method: 'DELETE' });
export function PoliciesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: policiesData, isLoading: isLoadingPolicies, error: policiesError } = useQuery({
    queryKey: ['policies'],
    queryFn: fetchPolicies,
  });
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });
  const deleteMutation = useMutation({
    mutationFn: deletePolicy,
    onSuccess: () => {
      toast.success('Policy deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete policy: ${error.message}`);
    },
  });
  const handleDelete = (policyId: string) => {
    deleteMutation.mutate(policyId);
  };
  const customerMap = React.useMemo(() => {
    if (!customersData) return new Map();
    return new Map(customersData.items.map(c => [c.id, c.name]));
  }, [customersData]);
  const isLoading = isLoadingPolicies || isLoadingCustomers;
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="Policies" description="Manage all insurance policies.">
        <Button
          onClick={() => navigate('/policies/new')}
          className="hover:scale-105 active:scale-95 transition-transform duration-200 bg-blue-500 hover:bg-blue-600"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Policy
        </Button>
      </PageHeader>
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Premium</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : policiesError ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500">Failed to load policies.</TableCell>
                </TableRow>
              ) : (
                policiesData?.items.map((policy: Policy) => (
                  <TableRow key={policy.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/policies/${policy.id}`)}>
                    <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                    <TableCell>{customerMap.get(policy.customerId) || 'Unknown'}</TableCell>
                    <TableCell>{policy.policyType}</TableCell>
                    <TableCell>
                      <Badge className={cn('border-transparent', statusStyles[policy.status])}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${policy.premium.toLocaleString()}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/policies/${policy.id}`)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Policy</DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>Delete Policy</DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this policy.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(policy.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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