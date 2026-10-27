import * as Crypto from "expo-crypto";
import {
  GoogleOneTapSignIn,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from "react-native-nitro-google-signin";

import { supabase } from "@/lib/supabase";

/**
 * Shows the native Google account sheet and exchanges the resulting idToken
 * for a Supabase session. Works for both sign-up and sign-in: Supabase creates
 * the user on first sign-in.
 *
 * Returns `false` if the user cancelled, throws on any other failure.
 */
export async function signInWithGoogle(): Promise<boolean> {
  // Google embeds the SHA-256 of this nonce in the idToken; Supabase hashes the
  // raw nonce we pass it and checks they match, which prevents token replay.
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  GoogleOneTapSignIn.configure({
    // The Web client ID is what makes Google issue an idToken that Supabase accepts.
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    nonce: hashedNonce,
  });

  await GoogleOneTapSignIn.checkPlayServices();
  let response = await GoogleOneTapSignIn.signIn();
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.createAccount();
  }
  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.presentExplicitSignIn();
  }
  if (!isSuccessResponse(response)) return false;

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.data.idToken,
    nonce: rawNonce,
  });
  if (error) throw error;
  return true;
}

export async function signOut() {
  await GoogleOneTapSignIn.signOut();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
