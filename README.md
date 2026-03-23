# WhatsApp Ordering System

Production-style MVP for Lebanese small shops that want a public storefront, structured order capture, and a WhatsApp-first checkout flow.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma
- NextAuth credentials auth
- Zod + React Hook Form
- Vitest

## What is included

- Multi-tenant shop model with `/s/{shopSlug}` public storefronts
- Cart and checkout flow that saves the order before redirecting to `wa.me`
- Shop owner dashboard for orders, products, categories, analytics, and settings
- Platform admin overview, shops list, and subscriptions list
- Arabic/English locale structure with RTL handling on storefronts
- Demo seed data for Beirut Bakery, Saida Mini Market, and Zahle Coffee Spot

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```powershell
Copy-Item .env.example .env
```

3. Generate Prisma client and apply the migration:

```bash
npx prisma generate
npx prisma migrate dev
```

4. Seed demo data:

```bash
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

## Demo credentials

- Platform admin: `admin@platform.demo` / `admin12345`
- Beirut Bakery owner: `owner@beirutbakery.demo` / `demo12345`
- Saida Mini Market owner: `owner@saidamarket.demo` / `demo12345`
- Zahle Coffee Spot owner: `owner@zahlecoffee.demo` / `demo12345`

## Key routes

- `/` landing page
- `/pricing` pricing page
- `/s/beirut-bakery` demo storefront
- `/checkout?shop=beirut-bakery` checkout flow
- `/auth/login` admin login
- `/admin` shop dashboard
- `/platform/overview` platform admin overview

## Notes

- The public order creation endpoint recalculates prices on the server and never trusts client totals.
- Delivery fees come from shop settings JSON for the MVP.
- Orders are stored before the WhatsApp deep link is generated.
- Admin APIs are scoped by the current session, with ownership checks on shop resources.

## Tests

Run the lightweight formatter tests with:

```bash
npm test
```
