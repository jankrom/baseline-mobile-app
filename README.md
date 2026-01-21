# What is it?
This repo serves as a baseline for starting a new mobile app. It is not meant to have good UI or anything like that.
The point of the repo is to have annoying things already set up for you. This way you only focus on the actual app not waste time just setting up a project.
This repo sets up a basic react native app using Expo with working navigation with Expo Router, authentication with Clerk, and a backend/db with Convex.

# Tech Stack
- React Native
- Typescript
- Expo with Expo Router
- Uniwind for styling
- Zustand for state management
- Clerk for authentication
- React Native MMKV for storage

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
