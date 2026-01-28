import { requireEnv, signSession, setCookieHeader } from "./_auth.js";
import { discordTokenExchange, discordGetUser } from "./_discord.js";

export default async (req) => {
  const missing = requireEnv(["DISCORD_CLIENT_ID","DISCORD_CLIENT_SECRET","DISCORD_REDIRECT_URI","JWT_SECRET"]);
  if (missing) return missing;

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response(JSON.stringify({ error: "Missing code" }), { status: 400, headers: { "Content-Type": "application/json" }});

  try {
    const token = await discordTokenExchange(code);
    const user = await discordGetUser(token.access_token);
    const session = signSession({
      discord_id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      iat: Math.floor(Date.now() / 1000)
    });

    return new Response(null, {
      status: 302,
      headers: { "Set-Cookie": setCookieHeader(session), "Location": "/" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Auth failed" }), { status: 500, headers: { "Content-Type": "application/json" }});
  }
};
