# Setup project

```
bun install
```

# Run project

```
bunx expo prebuild --platform ios
bunx expo run:ios
```

# Run convex

```
bunx convex dev
```

# Steps needed outside the code

1. Setup convex and clerk accounts and fill these into your .env.local:
   CONVEX_DEPLOYMENT=your-convex-deployment
   EXPO_PUBLIC_CONVEX_URL=https://your-convex-url
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_123

2. Setup CLERK_JWT_ISSUER_DOMAIN in convex dashboard (see https://docs.convex.dev/auth/clerk)

3. Set CLERK_WEBHOOK_SECRET in convex dashboard (see https://docs.convex.dev/auth/database-auth#set-up-webhooks)
