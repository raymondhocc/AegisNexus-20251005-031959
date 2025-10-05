import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage';
import { AppLayout } from '@/components/AppLayout';
import { PoliciesPage } from '@/pages/PoliciesPage';
import { ClaimsPage } from '@/pages/ClaimsPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Toaster } from "@/components/ui/sonner";
import { CreatePolicyPage } from "./pages/CreatePolicyPage";
import { PolicyDetailPage } from "./pages/PolicyDetailPage";
import { SubmitClaimPage } from "./pages/SubmitClaimPage";
import { ClaimDetailPage } from "./pages/ClaimDetailPage";
import { CustomerDetailPage } from "./pages/CustomerDetailPage";
import { CreateCustomerPage } from "./pages/CreateCustomerPage";
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "policies", element: <PoliciesPage /> },
      { path: "policies/new", element: <CreatePolicyPage /> },
      { path: "policies/:policyId", element: <PolicyDetailPage /> },
      { path: "claims", element: <ClaimsPage /> },
      { path: "claims/new", element: <SubmitClaimPage /> },
      { path: "claims/:claimId", element: <ClaimDetailPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "customers/new", element: <CreateCustomerPage /> },
      { path: "customers/:customerId", element: <CustomerDetailPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ]
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors closeButton />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)