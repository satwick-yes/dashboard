# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development Server**: `npm run dev` (starts Next.js at `http://localhost:3000`)
- **Build Production**: `npm run build`
- **Start Production**: `npm run start`
- **Lint**: `npm run lint`

## Architecture Overview

Gustosa Food WhatsApp Orders Dashboard is a real-time order management dashboard connected to the Meta WhatsApp Cloud API (Graph API v21.0), built with Next.js App Router, React 19, TypeScript, Tailwind CSS, and Shadcn UI.

### Key Directories & Files

- **`app/api/whatsapp/route.ts`**: Core Meta WhatsApp Business API webhook & order handler:
  - `GET`: Webhook verification challenge (`hub.mode`, `hub.verify_token`, `hub.challenge`).
  - `POST`: Order ingestion (incoming WhatsApp interactive order/messages) and simulation action dispatcher.
  - `PATCH`: Order pipeline status updates & automated WhatsApp customer notification dispatch.
- **`app/page.tsx`**: Flagship dashboard client component featuring KPI metric cards, status filtering tabs, search, responsive orders table with quick pipeline dropdown actions, and live auto-refresh polling.
- **`app/layout.tsx`**: Root layout with font management, `ThemeProvider` (system/light/dark), and Sonner `Toaster`.
- **`components/ui/`**: Accessible Shadcn UI primitives built with Radix UI (`button`, `badge`, `card`, `dialog`, `dropdown-menu`, `input`, `tabs`, `tooltip`).
- **`components/order-details-dialog.tsx`**: Deep-dive order inspection modal with live status progression, itemized breakdown, and `wa.me` customer contact links.
- **`components/create-order-dialog.tsx`**: Interactive modal to simulate customer WhatsApp catalog orders.
- **`components/api-config-modal.tsx`**: Meta Cloud API configuration guide, webhook callback URL copy tools, and environment variables helper.
- **`lib/types.ts`**: TypeScript definitions for `WhatsAppOrder`, `OrderItem`, `OrderStatus`, `OrderAnalytics`, and `MetaApiStatus`.

### Environment Variables

Configured in `.env.local` (and documented in `.env.example`):
- `WHATSAPP_API_TOKEN`: Meta System User Permanent Access Token.
- `WHATSAPP_PHONE_NUMBER_ID`: WhatsApp Business Phone Number ID from Meta Developer Dashboard.
- `WHATSAPP_BUSINESS_ACCOUNT_ID`: WhatsApp Business Account ID (WABA).
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`: Verification token matching Meta webhook subscription.
- `META_GRAPH_API_VERSION`: Graph API version (default: `v21.0`).

When API keys are not provided, the dashboard gracefully operates in **Mock Simulation Mode** with realistic in-memory dummy data and interactive customer simulation.
