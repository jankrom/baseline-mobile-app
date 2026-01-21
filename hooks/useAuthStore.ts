import { useAuth } from "@clerk/clerk-expo"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const useAuthStore = () => {
  const { isSignedIn, isLoaded } = useAuth()
  const currentUser = useQuery(api.auth.users.current)

  const isLoggedIn = isSignedIn ?? false
  const hasCompletedOnboarding = currentUser?.hasCompletedOnboarding ?? false

  return {
    isLoggedIn,
    isAuthLoaded: isLoaded,
    currentUser,
    hasCompletedOnboarding,
  }
}

export default useAuthStore
