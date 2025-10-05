import type { User, Chat, ChatMessage, Customer, Policy, Claim } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User' },
  { id: 'u2', name: 'Support Agent' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
// Aegis Nexus Mock Data
export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cust_1', name: 'John Doe', email: 'john.doe@example.com', phone: '555-0101', address: '123 Maple St, Springfield', createdAt: '2023-01-15T10:00:00Z' },
  { id: 'cust_2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-0102', address: '456 Oak Ave, Metropolis', createdAt: '2023-02-20T11:30:00Z' },
  { id: 'cust_3', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '555-0103', address: '789 Pine Ln, Gotham', createdAt: '2023-03-10T09:00:00Z' },
  { id: 'cust_4', name: 'Bob Brown', email: 'bob.brown@example.com', phone: '555-0104', address: '101 Elm Ct, Star City', createdAt: '2023-04-05T14:00:00Z' },
  { id: 'cust_5', name: 'Charlie Davis', email: 'charlie.d@example.com', phone: '555-0105', address: '212 Birch Rd, Central City', createdAt: '2023-05-12T16:45:00Z' },
];
export const MOCK_POLICIES: Policy[] = [
  { id: 'pol_1', policyNumber: 'AUTO-001', customerId: 'cust_1', policyType: 'Auto', startDate: '2023-02-01', endDate: '2024-02-01', premium: 1200, status: 'Active' },
  { id: 'pol_2', policyNumber: 'HOME-001', customerId: 'cust_2', policyType: 'Home', startDate: '2023-03-15', endDate: '2024-03-15', premium: 800, status: 'Active' },
  { id: 'pol_3', policyNumber: 'AUTO-002', customerId: 'cust_3', policyType: 'Auto', startDate: '2023-04-01', endDate: '2024-04-01', premium: 1500, status: 'Pending' },
  { id: 'pol_4', policyNumber: 'LIFE-001', customerId: 'cust_4', policyType: 'Life', startDate: '2022-05-20', endDate: '2032-05-20', premium: 2400, status: 'Expired' },
  { id: 'pol_5', policyNumber: 'HOME-002', customerId: 'cust_1', policyType: 'Home', startDate: '2023-06-01', endDate: '2024-06-01', premium: 950, status: 'Cancelled' },
];
export const MOCK_CLAIMS: Claim[] = [
  { id: 'clm_1', claimNumber: 'CLM-001', policyId: 'pol_1', customerId: 'cust_1', dateOfIncident: '2023-07-20', description: 'Minor fender bender', amount: 500, status: 'Approved' },
  { id: 'clm_2', claimNumber: 'CLM-002', policyId: 'pol_2', customerId: 'cust_2', dateOfIncident: '2023-08-10', description: 'Water damage from leaky pipe', amount: 2500, status: 'In Progress' },
  { id: 'clm_3', claimNumber: 'CLM-003', policyId: 'pol_3', customerId: 'cust_3', dateOfIncident: '2023-09-01', description: 'Multi-car collision', amount: 15000, status: 'Open' },
  { id: 'clm_4', claimNumber: 'CLM-004', policyId: 'pol_5', customerId: 'cust_1', dateOfIncident: '2023-09-05', description: 'Stolen bicycle from property', amount: 800, status: 'Denied' },
];