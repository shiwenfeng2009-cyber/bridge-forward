type SignOutClient = { auth: { signOut: () => Promise<{ error: unknown }> } };

export async function signOutSession(client: SignOutClient) {
  const { error } = await client.auth.signOut();
  if (error) throw new Error("Unable to sign out.");
}
