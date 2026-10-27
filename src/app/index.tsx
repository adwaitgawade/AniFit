import { Button, StyleSheet, Text, View } from "react-native";

import { signOut } from "@/lib/google-auth";
import { useSession } from "@/providers/session-provider";

export default function Index() {
  const { session } = useSession();

  return (
    <View style={styles.container}>
      <Text>Signed in as {session?.user.email}</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
});
