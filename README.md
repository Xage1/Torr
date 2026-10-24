# Torr — Torra Electrical Services

Backend platform for Torra Electrical Services, an electrical-products commerce application. The repository contains the API, database schema and migrations, product-import tooling, payment integration code, invoice generation, email templates, and administrative reporting handlers.

> **Project status:** Under development. The source contains incomplete modules and inconsistencies that must be resolved before the application can be considered production-ready. A feature appearing in this document does not guarantee that its full workflow has been tested.

## Contents

- [Overview](#overview)
- [Technology stack](#technology-stack)
- [Repository structure](#repository-structure)
- [Architecture](#architecture)
- [Features](#features)
- [API reference](#api-reference)
- [Database](#database)
- [Local development](#local-development)
- [Environment configuration](#environment-configuration)
- [Product scraping and import](#product-scraping-and-import)
- [Payments and invoices](#payments-and-invoices)
- [Email system](#email-system)
- [Security considerations](#security-considerations)
- [Known issues and verification checklist](#known-issues-and-verification-checklist)
- [Development workflow](#development-workflow)

## Overview

Torr is the backend component of the Torra Electrical Services platform. It provides API handlers and supporting services for products, orders, customers, payments, invoices, product imports, email notifications, and administrative reporting.

The API is built with Express and TypeScript. Prisma provides database access to PostgreSQL. The API is mounted under `/api`, with a health endpoint and Swagger UI for API exploration.

The supplied repository snapshot documents the backend. It does not establish that a frontend application is included in this repository.

## Technology stack

| Component | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| HTTP API | Express |
| Database | PostgreSQL |
| ORM and migrations | Prisma |
| Request validation and API schemas | Zod and Zod-to-OpenAPI |
| API documentation | Swagger UI / OpenAPI |
| Authentication | JWT-related services and password hashing |
| Email | Nodemailer and SMTP |
| Payments | Safaricom Daraja / M-Pesa integration code |
| PDF invoices | PDFKit |
| QR codes | QRCode library |
| Product scraping | Puppeteer |
| Product images | Sharp |
| Import/export data | JSON and CSV |

The exact dependency versions and npm scripts must be checked against `backend/package.json`, which was not included in the source export.

## Repository structure

```text
F:\devops\Torr
├── README.md
├── .vscode/
└── backend/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   └── migrations/
    └── src/
        ├── app.ts
        ├── server.ts
        ├── config/
        ├── controllers/
        ├── docs/
        ├── middleware/
        ├── routes/
        ├── schemas/
        ├── services/
        │   └── scraper/
        ├── templates/
        │   └── email/
        ├── types/
        ├── utils/
        └── validators/
```

### Directory responsibilities

- `src/app.ts` — configures Express middleware, health check, API routing, Swagger UI, and the global error handler.
- `src/server.ts` — connects Prisma, attempts the product-import operation, and starts the HTTP server.
- `src/config/` — environment configuration, Prisma client, SMTP transport, and OpenAPI setup.
- `src/controllers/` — HTTP request handlers.
- `src/routes/` — route definitions and router mounting.
- `src/schemas/` and `src/validators/` — request and data validation definitions.
- `src/services/` — business logic for authentication, orders, sessions, payments, email, invoices, and related operations.
- `src/services/scraper/` — product scraping and import logic.
- `src/templates/email/` — HTML email templates and reusable email components.
- `src/middleware/` — authentication, authorization-related helpers, audit logging, and error handling.
- `src/utils/` — password hashing, M-Pesa callback metadata extraction, response helpers, and other utilities.
- `prisma/schema.prisma` — database models, enums, relationships, and mappings.
- `prisma/migrations/` — the recorded database migration history.
- `prisma/seed.ts` — initial whitelist seed data.

## Architecture

The intended request flow is:

```text
Client
  |
  v
Express application (src/app.ts)
  |
  +--> Health check
  |
  +--> /api
         |
         +--> Authentication and users
         +--> Products and orders
         +--> Payments and M-Pesa callbacks
         +--> Invoices
         +--> Administration and analytics
  |
  v
Controllers
  |
  v
Services
  |
  +--> Prisma
  |     |
  |     v
  |   PostgreSQL
  |
  +--> Daraja API
  +--> SMTP email transport
  +--> PDF and QR generation
  +--> Scraper output files
```

This represents the intended organization of the supplied source. Middleware imports, route protection, and individual service implementations require verification before this flow can be treated as a validated production architecture.

## Features

### Product catalogue

The product controller contains handlers for listing products, retrieving a product by ID, creating products, updating products, and deleting products.

Product listing supports:

- Text search against product titles and descriptions.
- Category filtering.
- Page and limit parameters.
- Total-result and page metadata.

Product records include price, stock, category, source, external identifier, links, and image fields.

### Orders and inventory

The order implementation includes order records, order items, product-price snapshots, and stock reservation during order creation.

Order statuses defined by the database schema include:

- `CREATED`
- `AWAITING_PAYMENT`
- `PAID`
- `PROCESSING`
- `READY_FOR_PICKUP`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `REFUNDED`

Stock restoration, concurrent stock reservation, authorization, and order-state transitions must be tested before relying on the order workflow.

### Authentication and account management

The source contains registration and login handlers, password hashing, token and session services, email-verification handlers, password-reset handlers, profile management, and session-revocation routes.

Two-factor authentication and some security controls have incomplete implementations in the supplied snapshot. Do not assume all authentication flows are operational.

### Payments

The payment code includes M-Pesa STK Push initiation, callback handling, callback metadata extraction, payment status tracking, and payment audit records.

The database defines payment statuses including `PENDING`, `STK_SENT`, `PROCESSING`, `SUCCESS`, `FAILED`, `TIMEOUT`, `CANCELLED`, and `REFUNDED`.

Successful payment processing must be tested end to end, including amount verification, receipt persistence, duplicate callbacks, order updates, and invoice generation.

### Invoices

The invoice service creates invoice records and invokes PDF generation. The PDF service uses PDFKit and a QR-code library. An invoice download handler is also present.

The generated PDF currently contains hard-coded company contact information. Company branding, tax calculations, secure invoice access, storage paths, and email delivery require further verification.

### Administrative reporting

The analytics controller includes handlers for:

- Dashboard metrics.
- Revenue grouped by month and day.
- Sales grouped by product category.
- Top customers.
- Inventory health.
- Scraper job statistics.

The administrative endpoints must be protected by verified authentication and role-based authorization.

### Product scraping and import

The scraper service uses Puppeteer to collect product information and supports local image handling and CSV output. The import service reads `ads.json` from the current working directory and imports or updates product records through Prisma.

The expected file locations, data format, image paths, and behavior when import data is missing should be verified before running the scraper in another environment.

## API reference

The Express application mounts the main router at `/api`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Basic application health response |
| GET | `/api/docs` | Swagger UI |
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/auth/logout` | Log out |
| POST | `/api/auth/forgot-password` | Request a password reset |
| POST | `/api/auth/reset-password` | Reset a password |
| POST | `/api/auth/verify-email` | Verify an email address |
| POST | `/api/auth/resend-verification` | Resend verification |
| POST | `/api/auth/enable-2fa` | Two-factor setup handler |
| POST | `/api/auth/verify-2fa` | Two-factor verification handler |
| GET | `/api/auth/sessions` | Session-list handler |
| DELETE | `/api/auth/sessions` | Delete sessions |
| DELETE | `/api/auth/sessions/:id` | Delete a specific session |
| GET | `/api/products` | List and search products |
| GET | `/api/products/:id` | Retrieve a product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/orders` | Retrieve orders |
| POST | `/api/orders` | Create an order |
| GET | `/api/orders/:orderId` | Retrieve an order |
| PUT | `/api/orders/:orderId` | Update order status |
| DELETE | `/api/orders/:orderId` | Delete an order |
| POST | `/api/payments/:orderId/stk` | Initiate payment |
| POST | `/api/payments/callback` | M-Pesa callback |
| POST | `/api/mpesa/stkpush` | Alternative STK Push route |
| POST | `/api/mpesa/callback` | M-Pesa callback route |
| GET | `/api/invoices/:id/download` | Download an invoice |
| GET | `/api/analytics/dashboard` | Admin dashboard |
| GET | `/api/analytics/sales-category` | Sales by category |
| GET | `/api/analytics/daily-revenue` | Daily revenue |
| GET | `/api/analytics/top-customers` | Top customers |
| GET | `/api/analytics/inventory` | Inventory report |
| GET | `/api/analytics/scraper` | Scraper statistics |

The admin router also contains user-management, order-management, payment-management, system-statistics, and product-import handlers. Consult `src/routes/adminRoutes.ts` for their exact paths.

**Important:** This table documents routes declared in the supplied source. It does not guarantee that every route currently builds, is reachable, or has correct access control. In particular, authentication middleware imports must be reconciled before using protected endpoints.

## Database

The Prisma schema defines the following principal models:

| Model | Responsibility |
|---|---|
| `User` | Customer/admin accounts and account-security fields |
| `Session` | Refresh-token hash, expiry, revocation, and device metadata |
| `RefreshToken` | Stored refresh-token records |
| `LoginSession` | Login and device-session metadata |
| `Product` | Product details, stock, price, source, and images |
| `Order` | Order number, customer, status, and total |
| `OrderItem` | Product, quantity, and purchase-time price |
| `Payment` | Payment method, amount, status, and M-Pesa metadata |
| `Invoice` | Invoice number, subtotal, tax, total, paid state, and PDF path |
| `PaymentAudit` | Payment event and callback audit data |
| `AuditLog` | Account and system activity |
| `PasswordReset` | Password-reset token records |
| `EmailVerification` | Email-verification token records |
| `ScrapingJob` | Scraper execution status and messages |
| `Whitelist` | Unique email and phone entries |

The schema uses PostgreSQL and Prisma. The checked-in migration history includes table-drop and table-recreation operations. Review the actual database and migration status before applying further migrations to an environment that contains data.

## Local development

### Prerequisites

- Node.js and npm.
- PostgreSQL.
- A database created for Torr.
- The backend's dependencies installed.
- A configured environment file.

Redis, SMTP credentials, and M-Pesa credentials may be needed for the features that use those services. Confirm the requirements of the actual implementation before assuming every integration is mandatory.

### Setup

1. Open PowerShell.
2. Change to the backend directory:

   ```powershell
   Set-Location "F:\devops\Torr\backend"
   ```

3. Install the dependencies using the project's package manifest:

   ```powershell
   npm install
   ```

4. Configure the local environment variables described below.
5. Generate the Prisma client:

   ```powershell
   npx prisma generate
   ```

6. Inspect migration status before applying database changes:

   ```powershell
   npx prisma migrate status
   ```

7. If the database and migration history have been reviewed and are ready for development, apply the appropriate migrations:

   ```powershell
   npx prisma migrate dev
   ```

8. Start the application using the development script defined in `package.json`:

   ```powershell
   npm run dev
   ```

The exact scripts must be confirmed against `backend/package.json`. Do not run a destructive reset to fix migration problems.

### Local URLs

With the default port configured as `4000`:

- API health check: `http://localhost:4000/health`
- API base path: `http://localhost:4000/api`
- Swagger UI: `http://localhost:4000/api/docs`

These addresses assume the application starts successfully and the port is not changed.

## Environment configuration

Create `backend/.env` locally. Do not commit credentials or production secrets.

The current environment configuration references these principal settings:

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Runtime environment |
| `PORT` | HTTP server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Access-token signing secret |
| `JWT_EXPIRES_IN` | Access-token lifetime |
| `REFRESH_TOKEN_SECRET` | Refresh-token signing secret |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh-token lifetime |
| `SESSION_SECRET` | Session-related secret |
| `FRONTEND_URL` | Frontend origin |
| `API_URL` | Public or local API URL |
| `SMTP_HOST` | SMTP host |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password or application password |
| `SMTP_FROM` | Sender address |
| `REDIS_HOST` | Redis hostname |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password |
| `MPESA_ENV` | M-Pesa environment |
| `MPESA_CONSUMER_KEY` | Daraja consumer key |
| `MPESA_CONSUMER_SECRET` | Daraja consumer secret |
| `MPESA_SHORTCODE` | Business shortcode |
| `MPESA_PASSKEY` | STK Push passkey |
| `MPESA_CALLBACK_URL` | Public callback URL |
| `MPESA_TIMEOUT_URL` | Timeout callback URL |
| `MPESA_RESULT_URL` | Result callback URL |
| `MPESA_INITIATOR` | M-Pesa initiator |
| `MPESA_SECURITY_CREDENTIAL` | M-Pesa security credential |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `COMPANY_NAME` | Company name |
| `COMPANY_EMAIL` | Company email |
| `COMPANY_PHONE` | Company phone |
| `COMPANY_ADDRESS` | Company address |
| `COMPANY_WEBSITE` | Company website |
| `COMPANY_LOGO` | Company logo URL or configured location |

The supplied `.env` also contains settings for PDFs, QR codes, scraping, rate limits, logging, password policy, OTP, email verification, cookies, uploads, analytics caching, and CORS. The current `env.ts` export does not expose all of these values through its `env` object. Confirm which settings are read directly from `process.env` before relying on them.

Use strong, unique secrets outside development. Keep `.env` out of source control and use an `.env.example` containing placeholders rather than real credentials.

## Product scraping and import

The import service expects an `ads.json` file in the process working directory. It reads product titles, prices, descriptions, links, and image references and then creates or updates product records.

Before running the import:

1. Confirm the expected JSON structure.
2. Confirm where the scraper writes `ads.json`, `ads.csv`, and images.
3. Confirm that the process working directory is correct.
4. Review the import summary and any per-product errors.
5. Verify imported prices, product identifiers, and image paths in the database.

The current server attempts the import during startup. A missing or invalid import file should be investigated separately from database or HTTP server startup.

## Payments and invoices

The intended M-Pesa flow is:

1. A customer creates an order.
2. The backend initiates an STK Push.
3. Daraja sends a callback to the backend.
4. The callback is matched to a stored payment.
5. Payment metadata is extracted and the amount is checked.
6. Payment and order records are updated.
7. A payment audit entry is recorded.
8. An invoice is generated after successful payment processing.

This flow must be verified with Daraja sandbox credentials and a reachable callback URL. Do not use production credentials until callback authentication, idempotency, amount verification, error handling, and transaction consistency have been reviewed.

The PDF service currently writes invoice files under `uploads/invoices` relative to the process working directory. The invoice download endpoint must be tested to confirm ownership checks and correct file-path handling.

## Email system

The repository includes an SMTP transporter, email services, shared HTML components, and templates for several account, payment, order, and invoice notifications.

Before relying on email delivery:

- Configure valid SMTP credentials.
- Confirm that the sender address is accepted by the SMTP provider.
- Verify every template imported by the email service exists and exports the expected function.
- Test email-verification and password-reset delivery.
- Ensure user-provided values are safely escaped in HTML.
- Avoid logging credentials or sensitive tokens.

Several template files in the supplied export are empty, so the email system should not yet be considered complete.

## Security considerations

Before deployment:

- Reconcile and test all authentication middleware imports.
- Protect product mutations and administrative endpoints.
- Ensure customers can only access their own orders, sessions, and invoices.
- Verify authorization on order updates and deletion.
- Enforce email verification and account-locking policies where intended.
- Complete and test password-reset expiry and token invalidation.
- Complete two-factor authentication before advertising it as a working security feature.
- Store token hashes where appropriate and revoke sessions after security-sensitive events.
- Validate callback amounts and identifiers and handle duplicate callbacks safely.
- Restrict CORS to explicitly trusted origins.
- Do not disable TLS certificate validation in production SMTP configuration.
- Avoid returning raw internal exception messages to clients.
- Keep secrets and personal data out of logs and repository exports.

## Known issues and verification checklist

The supplied source snapshot contains the following items requiring investigation:

- [ ] Middleware imports reference inconsistent paths and names.
- [ ] Some middleware, services, controllers, and email templates are empty.
- [ ] Route-level authentication and authorization need a complete audit.
- [ ] Login failure counters and account-lockout enforcement need verification.
- [ ] Email verification enforcement during login needs verification.
- [ ] Password-reset delivery, expiry checks, and token invalidation need completion or verification.
- [ ] Two-factor authentication requires implementation and testing.
- [ ] Payment success, failure, retries, and duplicate callback behavior require end-to-end tests.
- [ ] Invoice tax rules and company branding need confirmation.
- [ ] Invoice downloads need ownership and path-security checks.
- [ ] Stock reservation, cancellation, and concurrent orders need tests.
- [ ] Scraper file paths and startup import behavior need verification.
- [ ] Destructive historical migrations require careful review.
- [ ] `package.json` and `tsconfig.json` must be checked to confirm scripts, dependencies, and compiler settings.
- [ ] A clean TypeScript build and API test pass have not been established by the supplied export.

## Development workflow

Use the following sequence when making changes:

1. Inspect the existing implementation before editing.
2. Confirm affected routes, controllers, services, schemas, and database models.
3. Make changes directly in the relevant project files.
4. If the Prisma schema changes, review migration implications before generating or applying a migration.
5. Generate the Prisma client when required.
6. Run the available build and lint scripts.
7. Test endpoints and error cases with Postman.
8. Verify the database state and logs.
9. Update this README when routes, configuration, architecture, or setup instructions change.

Prefer small, complete, testable modules over introducing overlapping services or duplicate implementations.
