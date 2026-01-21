import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    username: v.optional(v.string()),
    hasCompletedOnboarding: v.boolean(),
  })
    .index("by_external_id", ["externalId"])
    .index("by_username", ["username"]),
})
