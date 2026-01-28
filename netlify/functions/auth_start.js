import { requireEnv } from "./_auth.js";

export default async () => {
  const missing = requireEnv(["DISCORD_CLIENT_ID", "DISCORD_REDIRECT_URI"]);
  if (missing) return missing;

  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
  const scope = encodeURIComponent("identify");
  const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  return new Response(null, { status: 302, headers: { Location: url } });
};
