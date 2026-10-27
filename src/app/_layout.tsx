import { Stack } from "expo-router";

import { SessionProvider, useSession } from "@/providers/session-provider";

function RootNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) return null;

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}
