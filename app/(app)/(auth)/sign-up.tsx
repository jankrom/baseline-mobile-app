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
import { useSignUp } from "@clerk/clerk-expo"
import { Link, useRouter } from "expo-router"
import { AppleSignIn } from "@/components/auth/AppleSignIn"
import { GoogleSignIn } from "@/components/auth/GoogleSignIn"

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSignUpPress = useCallback(async () => {
    if (!isLoaded) return

    setIsLoading(true)
    setError(null)

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setPendingVerification(true)
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      setError(
        err.errors?.[0]?.message || "Failed to sign up. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [isLoaded, emailAddress, password, signUp])

  const onVerifyPress = useCallback(async () => {
    if (!isLoaded) return

    setIsLoading(true)
    setError(null)

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace("/")
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
        setError("Verification failed. Please try again.")
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      setError(err.errors?.[0]?.message || "Invalid code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [isLoaded, code, signUp, setActive, router])

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-white p-6 justify-center">
        <Text className="text-2xl font-bold text-center mb-2">
          Verify your email
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          We sent a code to {emailAddress}
        </Text>

        <TextInput
          className="w-full bg-gray-100 rounded-xl px-4 py-4 text-lg mb-4"
          placeholder="Enter verification code"
          placeholderTextColor="#9ca3af"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoFocus
        />

        {error && (
          <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
        )}

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading || code.length === 0}
          className={`py-4 rounded-xl ${
            isLoading || code.length === 0 ? "bg-purple-300" : "bg-purple-600"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg text-center">
              Verify
            </Text>
          )}
        </TouchableOpacity>
      </View>
    )
  }

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
            Create your account
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
            autoComplete="new-password"
          />
        </View>

        {error && (
          <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text>
        )}

        <TouchableOpacity
          onPress={onSignUpPress}
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
              Sign up
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
          <Text className="text-gray-500">Have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-purple-600 font-semibold">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
