export async function discordTokenExchange(code) {
  const params = new URLSearchParams();
  params.set("client_id", process.env.DISCORD_CLIENT_ID);
  params.set("client_secret", process.env.DISCORD_CLIENT_SECRET);
  params.set("grant_type", "authorization_code");
  params.set("code", code);
  params.set("redirect_uri", process.env.DISCORD_REDIRECT_URI);

  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });
  if (!res.ok) throw new Error(`Discord token exchange failed (${res.status})`);
  return await res.json();
}

export async function discordGetUser(accessToken) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error(`Discord /users/@me failed (${res.status})`);
  return await res.json();
}

export async function discordGetMemberRoles(discordUserId) {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/${discordUserId}`, {
    headers: { Authorization: `Bot ${botToken}` }
  });

  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Discord get member failed (${res.status})`);
  const member = await res.json();
  return Array.isArray(member.roles) ? member.roles : [];
}
