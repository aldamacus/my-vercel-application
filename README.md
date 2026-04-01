This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment variables

Merged availability uses private iCal URLs from Airbnb and Booking.com. Copy [`.env.example`](.env.example) to `.env.local` and set `AIRBNB_ICAL_URL` and `BOOKING_ICAL_URL`. Use the same keys in the Vercel project under **Settings → Environment Variables**. Regenerate those links in each platform if they were ever exposed (for example in git history).

EmailJS and PayPal use their respective `NEXT_PUBLIC_*` variables where configured in the app.

## Operations

On [Vercel](https://vercel.com), use **Runtime Logs** for the production deployment to spot failures or slow responses from `/api/airbnb-calendar`. Optional: enable **Speed Insights** and **Web Analytics** on the project for Core Web Vitals and traffic.

## Neon Postgres

Check out the [Neon Postgres integration](https://neon.com/docs/get-started-with-neon/query-with-neon-sql-editor) if you add a database later.

