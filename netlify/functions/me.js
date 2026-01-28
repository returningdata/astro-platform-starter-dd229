import { getUserFromRequest, requireEnv } from "./_auth.js";
import { discordGetMemberRoles } from "./_discord.js";
import { computePlanFromRoles, getFeatures } from "./_plans.js";

export default async (req) => {
  const missing = requireEnv(["JWT_SECRET","DISCORD_GUILD_ID","DISCORD_BOT_TOKEN"]);
  if (missing) return missing;

  const user = getUserFromRequest(req);
  if (!user) {
    return new Response(JSON.stringify({ authed:false, plan:"guest", features:getFeatures("guest") }), { status:200, headers:{ "Content-Type":"application/json" }});
  }

  const roles = await discordGetMemberRoles(user.discord_id);
  const plan = computePlanFromRoles(roles);
  const features = getFeatures(plan);

  return new Response(JSON.stringify({
    authed:true,
    user:{ discord_id:user.discord_id, username:user.username, discriminator:user.discriminator, avatar:user.avatar },
    plan, roles, features
  }), { status:200, headers:{ "Content-Type":"application/json" }});
};
