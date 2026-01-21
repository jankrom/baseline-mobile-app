import { TouchableOpacity, Text } from "react-native"
import { useClerk } from "@clerk/clerk-expo"

export const SignOutButton = () => {
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className="bg-red-500 p-2 rounded"
    >
      <Text>Sign out</Text>
    </TouchableOpacity>
  )
}
