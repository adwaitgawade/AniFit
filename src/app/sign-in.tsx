import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GoogleSignInButton } from "react-native-nitro-google-signin";

import { signInWithGoogle } from "@/lib/google-auth";

export default function SignIn() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AniFit</Text>
      <GoogleSignInButton
        size="wide"
        colorScheme="dark"
        disabled={isSigningIn}
        signInBehavior="none"
        onPress={handleGoogleSignIn}
        loading={isSigningIn}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  error: {
    color: "#D32F2F",
    textAlign: "center",
  },
});
