import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
  MutationCtx,
} from "../_generated/server"
import { UserJSON } from "@clerk/backend"
import { v, Validator } from "convex/values"

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx)
  },
})

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const user = await userByExternalId(ctx, data.id)
    if (user === null) {
      await ctx.db.insert("users", {
        externalId: data.id,
        hasCompletedOnboarding: false,
      })
    } else {
      await ctx.db.patch(user._id, { externalId: data.id })
    }
  },
})

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId)

    if (user !== null) {
      await ctx.db.delete(user._id)
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      )
    }
  },
})

export const updateUsername = mutation({
  args: { username: v.string() },
  async handler(ctx, { username }) {
    const user = await getCurrentUserOrThrowMutation(ctx)

    // Check if username is already taken by another user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique()

    if (existingUser && existingUser._id !== user._id) {
      throw new Error("Username is already taken")
    }

    await ctx.db.patch(user._id, { username })
  },
})

export const completeOnboarding = mutation({
  args: {},
  async handler(ctx) {
    const user = await getCurrentUserOrThrowMutation(ctx)
    await ctx.db.patch(user._id, { hasCompletedOnboarding: true })
  },
})

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx)
  if (!userRecord) throw new Error("Can't get current user")
  return userRecord
}

async function getCurrentUserOrThrowMutation(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (identity === null) {
    throw new Error("Can't get current user")
  }
  const user = await userByExternalId(ctx, identity.subject)
  if (!user) throw new Error("Can't get current user")
  return user
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (identity === null) {
    return null
  }
  return await userByExternalId(ctx, identity.subject)
}

async function userByExternalId(
  ctx: QueryCtx | MutationCtx,
  externalId: string,
) {
  return await ctx.db
    .query("users")
    .withIndex("by_external_id", (q) => q.eq("externalId", externalId))
    .unique()
}
