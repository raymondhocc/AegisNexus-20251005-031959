import { z } from 'zod';
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// Aegis Nexus Application Types
export type PolicyStatus = 'Active' | 'Pending' | 'Expired' | 'Cancelled';
export type ClaimStatus = 'Open' | 'In Progress' | 'Approved' | 'Denied' | 'Closed';
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}
export interface Policy {
  id: string;
  policyNumber: string;
  customerId: string;
  policyType: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: PolicyStatus;
}
export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  customerId: string;
  dateOfIncident: string;
  description: string;
  amount: number;
  status: ClaimStatus;
}
// Zod Schemas for Validation
export const PolicyCreateSchema = z.object({
  policyNumber: z.string().min(3, "Policy number must be at least 3 characters"),
  customerId: z.string().min(1, "Customer is required"),
  policyType: z.enum(['Auto', 'Home', 'Life', 'Health', 'Business'], {
    required_error: "Policy type is required",
  }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid start date" }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid end date" }),
  premium: z.preprocess(
    (a) => (a === '' ? undefined : parseFloat(String(a))),
    z.number().optional().refine(val => val !== undefined, "Premium is required").pipe(z.number().min(0, "Premium must be a positive number"))
  ),
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});
export type PolicyCreateData = z.infer<typeof PolicyCreateSchema>;
export const ClaimCreateSchema = z.object({
  claimNumber: z.string().min(3, "Claim number must be at least 3 characters"),
  policyId: z.string().min(1, "Policy is required"),
  customerId: z.string().min(1, "Customer is required"),
  dateOfIncident: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date of incident" }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  amount: z.preprocess(
    (a) => (a === '' ? undefined : parseFloat(String(a))),
    z.number().optional().refine(val => val !== undefined, "Claim amount is required").pipe(z.number().min(0, "Claim amount must be a positive number"))
  ),
});
export type ClaimCreateData = z.infer<typeof ClaimCreateSchema>;
export const CustomerCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});
export type CustomerCreateData = z.infer<typeof CustomerCreateSchema>;