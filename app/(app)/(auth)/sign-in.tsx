import React, { useState, useCallback } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useSignIn } from "@clerk/clerk-expo"
import { Link, useRouter } from "expo-router"
import { AppleSignIn } from "@/components/auth/AppleSignIn"
import { GoogleSignIn } from "@/components/auth/GoogleSignIn"

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return

    setIsLoading(true)
    setError(null)

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace("/")
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
        setError("Sign in incomplete. Please try again.")
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      setError(
        err.errors?.[0]?.message ||
          "Invalid email or password. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [isLoaded, emailAddress, password, signIn, setActive, router])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        className="p-6"
      >
        <View className="mb-10">
          <Text className="text-4xl font-bold text-center mb-2">PlayLoop</Text>
          <Text className="text-gray-500 text-center text-lg">
            TikTok for games
          </Text>
        </View>

        <View className="gap-4 mb-6">
          <TextInput
            className="w-full bg-gray-100 rounded-xl px-4 py-4 text-lg"
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={emailAddress}
            onChangeText={(text) => {
              setEmailAddress(text)
              setError(null)
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <TextInput
            className="w-full bg-gray-100 rounded-xl px-4 py-4 text-lg"
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              setError(null)
            }}
            secureTextEntry
            autoComplete="current-password"
          />
        </View>

        {error && (
          <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
        )}

        <TouchableOpacity
          onPress={onSignInPress}
          disabled={isLoading || !emailAddress || !password}
          className={`py-4 rounded-xl mb-6 ${
            isLoading || !emailAddress || !password
              ? "bg-purple-300"
              : "bg-purple-600"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg text-center">
              Sign in
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-gray-400">or</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        <View className="gap-4">
          <AppleSignIn />
          <GoogleSignIn />
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500">Need an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-purple-600 font-semibold">Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
