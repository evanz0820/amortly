# Amortly — Frontend

A modern loan management web app built with React, TypeScript, and Vite. Simulate loans, view amortization schedules, make payments via Stripe, and track a mock credit score.

## Tech Stack

- **React 19** + **TypeScript** — UI framework
- **Vite** — build tool and dev server
- **React Router v7** — client-side routing
- **Zustand** — lightweight state management
- **Recharts** — charts and data visualization
- **Stripe.js** + **React Stripe** — payment processing
- **Axios** — HTTP client

## Getting Started

### Prerequisites

- Node.js 20+
- The [Amortly API](../amortly-api/) running on `http://localhost:8000`

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

## Project Structure

```
src/
├── routes/                    # Page components
│   ├── Dashboard.tsx          # Overview: balances, credit score, active loans
│   ├── Loans.tsx              # All loans with status filters
│   ├── LoanDetail.tsx         # Single loan: chart, schedule table, pay button
│   ├── NewLoan.tsx            # Loan simulator form with live payment preview
│   ├── Payments.tsx           # Payment history with status filters
│   ├── Profile.tsx            # Credit score gauge and payment behavior breakdown
│   └── Checkout.tsx           # Stripe Payment Element integration
├── components/                # Reusable UI components
│   ├── TabLayout.tsx          # Sidebar navigation shell
│   ├── LoanCard.tsx           # Loan summary card
│   ├── AmortizationChart.tsx  # Remaining balance area chart
│   ├── PayoffProjection.tsx   # Progress bar and payoff metrics
│   ├── CreditScoreGauge.tsx   # SVG ring gauge for credit score
│   └── PaymentRow.tsx         # Single payment list item
├── services/
│   ├── api.ts                 # Axios client for the backend API
│   └── stripe.ts              # Stripe.js initialization
├── store/
│   └── loanStore.ts           # Zustand store for app state
├── types/
│   └── index.ts               # Shared TypeScript interfaces
├── App.tsx                    # Route definitions
├── main.tsx                   # Entry point with providers
└── index.css                  # Global design system (CSS variables, animations)
```

## Pages

| Route | Description |
|---|---|
| `/dashboard` | Overview with total balance, active loans, credit score, and quick pay |
| `/loans` | All loans with filter chips (All / Active / Paid Off / Defaulted) |
| `/loan/new` | Loan simulator with live monthly payment and interest preview |
| `/loan/:id` | Loan detail with amortization chart, payoff projection, and schedule table |
| `/payments` | Payment history with summary cards and status filters |
| `/profile` | Credit score gauge, score breakdown, and recent payment history |
| `/payment/checkout` | Stripe checkout with Payment Element |

## Configuration

### API Base URL

Edit `src/services/api.ts`:

```ts
const BASE_URL = 'http://localhost:8000'; // Change for production
```

### Stripe Publishable Key

Edit `src/services/stripe.ts`:

```ts
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_...';
```

### Mock User ID

The app uses a hardcoded user UUID in route files. Search for `MOCK_USER_ID` and replace with your seeded user's ID.

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `amortly`
4. Build command: `npm run build`, output: `dist`
5. Add a `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

6. Update `BASE_URL` in `api.ts` to your deployed backend URL before deploying.
