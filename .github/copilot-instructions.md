# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js application (TypeScript, App Router) using Tailwind CSS for styling.
- The project is bootstrapped with `create-next-app` and follows the default Next.js app directory structure.
- Major UI components are in `src/components/ui/` and shared components in `components/`.
- API routes are under `src/app/api/` (e.g., `auth`, `airbnb-calendar`).
- Client-side logic for calendar integrations is in `src/clients/`.
- Public assets (images, SVGs) are in `public/`.

## Key Workflows
- **Development:**
  - Start with `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`).
  - Main entry: `src/app/page.tsx` and `src/app/layout.tsx`.
  - Global styles: `src/app/globals.css`.
- **Build:**
  - Use `npm run build` to create a production build.
- **Deployment:**
  - Deploy via Vercel (see README for details).

## Project Conventions
- Use TypeScript for all new code.
- UI components should be placed in `src/components/ui/` for atomic design, or `components/` for shared/global components.
- API endpoints must be placed in `src/app/api/` and use Next.js route handlers.
- Use Tailwind CSS utility classes for styling; global config in `tailwind.config.js`.
- Prefer functional React components and hooks.
- For calendar integrations, use the corresponding client in `src/clients/` or `clients/`.
- Images and static assets go in `public/`.

## Integration Points
- **Authentication:**
  - See `src/app/api/auth/` for NextAuth integration.
- **Calendar Sync:**
  - Airbnb, Booking, and HomeAway calendar logic in `src/clients/` and `src/app/clients/`.
- **Payments:**
  - Payment UI and logic in `components/PaymentModal.tsx` and `components/PayPalCheckout.tsx`.

## Examples
- To add a new API route: create a file in `src/app/api/[route]/route.ts`.
- To add a new UI component: add to `src/components/ui/` and import where needed.
- To update global styles: edit `src/app/globals.css`.

## References
- See `README.md` for getting started, build, and deployment instructions.
- Tailwind config: `tailwind.config.js`.
- TypeScript config: `tsconfig.json`.
- Next.js config: `next.config.ts`.

---

If any conventions or workflows are unclear, ask for clarification or check the referenced files.