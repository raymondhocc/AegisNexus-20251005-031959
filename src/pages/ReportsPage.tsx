import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Policy, Claim } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { PageHeader } from '@/components/PageHeader';
import { FileQuestion } from 'lucide-react';
const fetchPolicies = async () => api<{ items: Policy[] }>('/api/policies');
const fetchClaims = async () => api<{ items: Claim[] }>('/api/claims');
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
    <FileQuestion className="h-12 w-12 mb-4" />
    <p>{message}</p>
  </div>
);
export function ReportsPage() {
  const { data: policiesData, isLoading: isLoadingPolicies } = useQuery({ queryKey: ['policies'], queryFn: fetchPolicies });
  const { data: claimsData, isLoading: isLoadingClaims } = useQuery({ queryKey: ['claims'], queryFn: fetchClaims });
  const isLoading = isLoadingPolicies || isLoadingClaims;
  const policiesByType = React.useMemo(() => {
    if (!policiesData) return [];
    const counts = policiesData.items.reduce((acc, policy) => {
      acc[policy.policyType] = (acc[policy.policyType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [policiesData]);
  const claimsByStatus = React.useMemo(() => {
    if (!claimsData) return [];
    const counts = claimsData.items.reduce((acc, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [claimsData]);
  const monthlyPremiums = React.useMemo(() => {
    if (!policiesData) return [];
    const monthlyData: Record<string, number> = {};
    policiesData.items.forEach(policy => {
      const month = new Date(policy.startDate).toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + policy.premium;
    });
    return Object.entries(monthlyData)
      .map(([name, premium]) => ({ name, premium }))
      .sort((a, b) => new Date(`1 ${a.name}`).getTime() - new Date(`1 ${b.name}`).getTime());
  }, [policiesData]);
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <PageHeader title="Reports" description="Loading key business insights..." />
        <div className="grid gap-8 md:grid-cols-2">
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
          <Card className="md:col-span-2"><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="Reports" description="Key insights into policies, claims, and revenue." />
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Policies by Type</CardTitle>
            <CardDescription>Distribution of all active and pending policies.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {policiesByType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={policiesByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {policiesByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No policy data available to display." />
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Claims by Status</CardTitle>
            <CardDescription>Current status of all submitted claims.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {claimsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={claimsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No claim data available to display." />
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Premium Revenue</CardTitle>
            <CardDescription>Total premium value from policies started each month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {monthlyPremiums.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPremiums}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value as number / 1000)}k`} />
                  <Tooltip formatter={(value) => `${(value as number).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="premium" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No premium data available to display." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}