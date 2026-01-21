import { useSSO } from "@clerk/clerk-expo"
import { Text, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import * as AuthSession from "expo-auth-session"
import { useCallback } from "react"

export const AppleSignIn = () => {
  const { startSSOFlow } = useSSO()

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
        // Navigation is handled by _layout.tsx based on auth state
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [startSSOFlow])

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-center bg-black py-4 rounded-xl"
    >
      <AntDesign
        name="apple"
        size={24}
        color="white"
        style={{ marginRight: 10 }}
      />
      <Text className="text-white font-semibold text-lg">
        Sign in with Apple
      </Text>
    </TouchableOpacity>
  )
}
