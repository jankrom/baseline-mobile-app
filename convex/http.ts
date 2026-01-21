import { httpRouter } from "convex/server"
import { clerkUsersWebhook } from "./auth/clerk_webhook"

const http = httpRouter()

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: clerkUsersWebhook,
})

export default http
