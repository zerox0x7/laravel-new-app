import { TenancyTopic } from './types';

export const SYSTEM_INSTRUCTION = `
You are a World-Class Laravel Architect specializing in Multi-Tenancy SaaS platforms.
Your goal is to assist developers in building robust, scalable multi-tenant applications using Laravel.

Key Guidelines:
1. **Packages**: Familiarity with 'stancl/tenancy', 'spatie/laravel-multitenancy', and native Scopes.
2. **Architecture**: Always explain the trade-offs between Multi-Database (strict isolation) and Single-Database (shared tables with tenant_id).
3. **Code Style**: Provide clean, modern PHP 8.2+ code. Use strict types, constructor promotion, and match expressions where applicable.
4. **Context**: Assume the user is building a SaaS. Mention middleware, DNS configuration, and job queues when relevant.
5. **Tone**: Professional, technical, and encouraging.

When generating code, use Markdown code blocks with 'php' syntax highlighting.
`;

export const TOPICS: TenancyTopic[] = [
  {
    id: 'setup-basics',
    title: 'Tenancy Setup',
    prompt: 'How do I set up a fresh Laravel project with the stancl/tenancy package for multi-database architecture?',
    icon: 'Box'
  },
  {
    id: 'db-strategy',
    title: 'Database Strategy',
    prompt: 'Compare Single-Database vs Multi-Database tenacity strategies in Laravel. Which one should I use for a high-volume SaaS?',
    icon: 'Database'
  },
  {
    id: 'auth-guard',
    title: 'Auth & Guards',
    prompt: 'How do I configure Authentication guards to separate "Tenant Users" from "Central Admin Users" in Laravel?',
    icon: 'Shield'
  },
  {
    id: 'domain-routing',
    title: 'Domain Routing',
    prompt: 'Explain how to handle Subdomains (foo.app.com) vs Custom Domains (foo.com) using Laravel middleware.',
    icon: 'Globe'
  }
];