import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, CustomerEntity, PolicyEntity, ClaimEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { PolicyCreateSchema, ClaimCreateSchema, CustomerCreateSchema } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // USERS (Demo)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env, c.req.query('cursor') ?? null, c.req.query('limit') ? Math.max(1, (Number(c.req.query('limit')) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  // CHATS (Demo)
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const page = await ChatBoardEntity.list(c.env, c.req.query('cursor') ?? null, c.req.query('limit') ? Math.max(1, (Number(c.req.query('limit')) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  // MESSAGES (Demo)
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // AEGIS NEXUS ROUTES
  // CUSTOMERS
  app.get('/api/customers', async (c) => {
    await CustomerEntity.ensureSeed(c.env);
    const page = await CustomerEntity.list(c.env, null, 100);
    return ok(c, page);
  });
  app.get('/api/customers/:id', async (c) => {
    const { id } = c.req.param();
    const customerEntity = new CustomerEntity(c.env, id);
    if (!(await customerEntity.exists())) return notFound(c, 'Customer not found');
    return ok(c, await customerEntity.getState());
  });
  app.post('/api/customers', async (c) => {
    const body = await c.req.json();
    const validation = CustomerCreateSchema.safeParse(body);
    if (!validation.success) return bad(c, validation.error.issues.map(e => e.message).join(', '));
    const newCustomer = { id: `cust_${crypto.randomUUID()}`, createdAt: new Date().toISOString(), ...validation.data };
    return ok(c, await CustomerEntity.create(c.env, newCustomer));
  });
  app.delete('/api/customers/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await CustomerEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Customer not found');
    return ok(c, { id, deleted });
  });
  // POLICIES
  app.get('/api/policies', async (c) => {
    await PolicyEntity.ensureSeed(c.env);
    const page = await PolicyEntity.list(c.env, null, 100);
    return ok(c, page);
  });
  app.get('/api/policies/:id', async (c) => {
    const { id } = c.req.param();
    const policyEntity = new PolicyEntity(c.env, id);
    if (!(await policyEntity.exists())) return notFound(c, 'Policy not found');
    return ok(c, await policyEntity.getState());
  });
  app.post('/api/policies', async (c) => {
    const body = await c.req.json();
    const validation = PolicyCreateSchema.safeParse(body);
    if (!validation.success) return bad(c, validation.error.issues.map(e => e.message).join(', '));
    const newPolicy = { id: `pol_${crypto.randomUUID()}`, status: 'Pending' as const, ...validation.data };
    return ok(c, await PolicyEntity.create(c.env, newPolicy));
  });
  app.delete('/api/policies/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await PolicyEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Policy not found');
    return ok(c, { id, deleted });
  });
  // CLAIMS
  app.get('/api/claims', async (c) => {
    await ClaimEntity.ensureSeed(c.env);
    const page = await ClaimEntity.list(c.env, null, 100);
    return ok(c, page);
  });
  app.get('/api/claims/:id', async (c) => {
    const { id } = c.req.param();
    const claimEntity = new ClaimEntity(c.env, id);
    if (!(await claimEntity.exists())) return notFound(c, 'Claim not found');
    return ok(c, await claimEntity.getState());
  });
  app.post('/api/claims', async (c) => {
    const body = await c.req.json();
    const validation = ClaimCreateSchema.safeParse(body);
    if (!validation.success) return bad(c, validation.error.issues.map(e => e.message).join(', '));
    const newClaim = { id: `clm_${crypto.randomUUID()}`, status: 'Open' as const, ...validation.data };
    return ok(c, await ClaimEntity.create(c.env, newClaim));
  });
}