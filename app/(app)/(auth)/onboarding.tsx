import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { useRouter } from "expo-router"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

const Onboarding = () => {
  const router = useRouter()
  const updateUsername = useMutation(api.auth.users.updateUsername)
  const completeOnboarding = useMutation(api.auth.users.completeOnboarding)

  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateUsername = (value: string): string | null => {
    if (value.length < 3) {
      return "Username must be at least 3 characters"
    }
    if (value.length > 20) {
      return "Username must be 20 characters or less"
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "Username can only contain letters, numbers, and underscores"
    }
    return null
  }

  const handleFinishOnboarding = async () => {
    const validationError = validateUsername(username)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await updateUsername({ username: username.trim() })
      await completeOnboarding({})
      router.replace("/")
    } catch (err) {
      console.error("Failed to update username:", err)
      setError("Failed to save username. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl font-bold mb-4">Welcome to PlayLoop!</Text>

      <Text className="text-gray-500 text-center mb-8 text-lg">
        Choose your username
      </Text>

      <TextInput
        className="w-full bg-gray-100 rounded-xl px-4 py-4 text-lg mb-2"
        placeholder="Enter username"
        placeholderTextColor="#9ca3af"
        value={username}
        onChangeText={(text) => {
          setUsername(text)
          setError(null)
        }}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={20}
      />

      {error && (
        <Text className="text-red-500 text-sm mb-4 self-start">{error}</Text>
      )}

      <TouchableOpacity
        onPress={handleFinishOnboarding}
        disabled={isLoading || username.length === 0}
        className={`w-full py-4 rounded-full mt-4 ${
          isLoading || username.length === 0 ? "bg-purple-300" : "bg-purple-600"
        }`}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg text-center">
            Continue
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default Onboarding
