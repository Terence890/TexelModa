[![Deploy Vite App to GitHub Pages](https://github.com/Terence890/TexelModa/actions/workflows/webpack.yml/badge.svg)](https://github.com/Terence890/TexelModa/actions/workflows/webpack.yml)
[![DeepScan grade](https://deepscan.io/api/teams/28841/projects/30922/branches/997405/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=28841&pid=30922&bid=997405)

# Texel Moda - Virtual Try-On E-commerce Platform

Texel Moda is a fashion e-commerce website featuring virtual try-on capabilities built with React, Tailwind CSS, and Framer Motion.

## Features

- Modern responsive UI design
- Product browsing and filtering
- Virtual try-on functionality powered by Texel.Moda's Try-On Diffusion API
- Shopping cart functionality
- Smooth animations and transitions using Framer Motion

## Virtual Try-On Integration

The platform integrates with the **Virtual Try-On Diffusion [VTON-D]** technology by Texel.Moda through their RapidAPI service:

- Users can upload their photos and try on different clothing items
- Advanced options include text prompts for avatar, clothing, and background
- Background replacement options
- Image generation with seed control for consistent results

### How It Works

1. Users upload their avatar photo or use a text prompt to generate an avatar
2. Users select clothing items or provide text descriptions
3. Optional background customization
4. The API generates a realistic composite image showing the clothing on the user

## Project Structure

- `/src`: React source files
  - `/components`: Reusable UI components
    - `/layout`: Layout components (Header, Footer)
    - `/product`: Product-related components
    - `/try-on`: Try-on related components
  - `/pages`: Application pages
  - `/api`: API service functions for external services
  - `/utils`: Utility functions

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd texel-moda

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running the local Stripe server (checkout)

This project ships a tiny Express server used to create Stripe Checkout sessions.

1. Copy `.env.example` to `.env` and fill `STRIPE_SECRET_KEY` and `REACT_APP_STRIPE_PUBLISHABLE_KEY`.
2. Install dependencies (if not already):

```bash
npm install
```

3. Start the server in a separate terminal:

```bash
npm run start:server
```

4. Start the frontend as usual:

```bash
npm run dev
```

The frontend will POST to `/api/stripe/create-checkout-session` on the same host. If you run the server on a different port, set `CLIENT_URL` in `.env` and edit the fetch URL in `src/components/ecommerce/CheckoutButton.jsx` accordingly.


## Environment Variables

- `REACT_APP_API_URL`: The base URL for the Try-On API
- `REACT_APP_API_KEY`: API key for the Try-On Diffusion service

## Stripe Checkout integration

This project includes a minimal Express endpoint that creates Stripe Checkout sessions so you can complete purchases using Stripe's hosted Checkout page.

Setup

1. Copy `.env.example` to `.env` and set the following values:

   - `STRIPE_SECRET_KEY` — your Stripe secret key (use test key for local testing)
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY` — your Stripe publishable key (optional for hosted Checkout flow)
   - `CLIENT_URL` — the frontend URL, e.g. `http://localhost:5173`

2. Install dependencies:

```bash
npm install
```

3. Start the Express server (separate terminal):

```bash
npm run start:server
```

4. Start the frontend:

```bash
npm run dev
```

By default the backend listens on port `4242`. The frontend `CheckoutButton` will POST to `/api/stripe/create-checkout-session` and redirect to the Stripe Checkout URL returned by the server.

Testing the endpoint

With the server running and your `STRIPE_SECRET_KEY` set to a test key you can POST a payload like this to create a test session:

```json
{
  "items": [
    { "name": "Blue Shirt", "price": 29.99, "quantity": 1, "image": "https://example.com/blue.png", "currency": "usd" }
  ]
}
```

Example curl (replace host if needed):

```bash
curl -X POST http://localhost:4242/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Blue Shirt","price":29.99,"quantity":1}]}'
```

If successful, the endpoint returns JSON containing a `url` you can open in the browser to view Stripe Checkout.

Webhooks & production notes

- For production use you should implement a webhook endpoint to receive `checkout.session.completed` events from Stripe and mark orders as paid on your server. Use the Stripe CLI or Dashboard to test webhooks locally.
- Never commit `STRIPE_SECRET_KEY` to source control. Use environment variables and set the production secret in a secure place (CI/CD secrets, hosting environment variables, etc.).
- Consider using pre-created Stripe Prices (and sending `price` IDs to the Checkout session) for stable product pricing instead of creating `price_data` on the fly.

Security & troubleshooting

- Add `.env` to `.gitignore` to ensure secrets are not committed.
- If the frontend and server run on different origins, either enable CORS appropriately or configure a Vite proxy (see Vite docs) so the frontend can call the backend without CORS issues.
- If you see errors when creating a session, check that `STRIPE_SECRET_KEY` is valid and that the server can reach Stripe's API.


## Credits

- Try-On Diffusion API by [Texel.Moda](https://texelmoda.com/)
- UI components built with Tailwind CSS
- Animations powered by Framer Motion
- Dilan
