import { useEffect } from "react"
import { Platform } from "react-native"
import * as SplashScreen from "expo-splash-screen"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import useAuthStore from "@/hooks/useAuthStore"

const isWeb = Platform.OS === "web"

if (!isWeb) {
  SplashScreen.preventAutoHideAsync()
}

const RootNav = () => {
  const { isLoggedIn, hasCompletedOnboarding, isAuthLoaded, currentUser } =
    useAuthStore()

  // User data is loading if logged in and currentUser is undefined
  const isUserDataLoading = isLoggedIn && currentUser === undefined

  // Ready to show UI when auth loaded AND user data loaded (if logged in)
  const isReady = isAuthLoaded && !isUserDataLoading

  // Hide splash screen once ready
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync()
    }
  }, [isReady])

  // Keep splash screen visible until ready
  if (!isReady) {
    return null
  }

  // Show sign-in/sign-up when:
  // - Not logged in, OR
  // - Logged in but user not found in DB (null)
  // Note: undefined case is handled above (keeps splash visible)
  // This prevents the user from being redirected to the home screen before the
  // user data is loaded which causes the screen to flicker
  const showAuth = !isLoggedIn || currentUser === null

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={showAuth}>
          <Stack.Screen name="(auth)/sign-in" options={{ animation: "none" }} />
          <Stack.Screen name="(auth)/sign-up" options={{ animation: "none" }} />
        </Stack.Protected>
        <Stack.Protected guard={!showAuth}>
          <Stack.Protected guard={hasCompletedOnboarding}>
            <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
          </Stack.Protected>
          <Stack.Protected guard={!hasCompletedOnboarding}>
            <Stack.Screen name="(auth)/onboarding" />
          </Stack.Protected>
        </Stack.Protected>
      </Stack>
    </>
  )
}

export default RootNav
