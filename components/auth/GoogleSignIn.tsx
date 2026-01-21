import React, { useCallback, useEffect } from "react"
import * as WebBrowser from "expo-web-browser"
import * as AuthSession from "expo-auth-session"
import { useSSO } from "@clerk/clerk-expo"
import { Text, TouchableOpacity, Platform } from "react-native"
import { AntDesign } from "@expo/vector-icons"

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export const GoogleSignIn = () => {
  useWarmUpBrowser()
  const { startSSOFlow } = useSSO()

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
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
      className="flex-row items-center justify-center bg-blue-500 py-4 rounded-xl"
    >
      <AntDesign
        name="google"
        size={24}
        color="white"
        style={{ marginRight: 10 }}
      />
      <Text className="text-white font-semibold text-lg">
        Sign in with Google
      </Text>
    </TouchableOpacity>
  )
}
