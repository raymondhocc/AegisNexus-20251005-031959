/**
 * Minimal real-world demo: One Durable Object instance per entity (User, ChatBoard), with Indexes for listing.
 */
import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, Customer, Policy, Claim } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_CUSTOMERS, MOCK_POLICIES, MOCK_CLAIMS } from "@shared/mock-data";
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
// CHAT BOARD ENTITY: one DO instance per chat board, stores its own messages
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
// AEGIS NEXUS ENTITIES
export class CustomerEntity extends IndexedEntity<Customer> {
  static readonly entityName = "customer";
  static readonly indexName = "customers";
  static readonly initialState: Customer = { id: "", name: "", email: "", phone: "", address: "", createdAt: "" };
  static seedData = MOCK_CUSTOMERS;
}
export class PolicyEntity extends IndexedEntity<Policy> {
  static readonly entityName = "policy";
  static readonly indexName = "policies";
  static readonly initialState: Policy = { id: "", policyNumber: "", customerId: "", policyType: "", startDate: "", endDate: "", premium: 0, status: "Pending" };
  static seedData = MOCK_POLICIES;
}
export class ClaimEntity extends IndexedEntity<Claim> {
  static readonly entityName = "claim";
  static readonly indexName = "claims";
  static readonly initialState: Claim = { id: "", claimNumber: "", policyId: "", customerId: "", dateOfIncident: "", description: "", amount: 0, status: "Open" };
  static seedData = MOCK_CLAIMS;
}