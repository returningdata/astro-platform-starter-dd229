import OpenAI from "openai";
import { getUserFromRequest, requireEnv } from "./_auth.js";
import { discordGetMemberRoles } from "./_discord.js";
import { computePlanFromRoles, getFeatures, comparePlans } from "./_plans.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const buckets = new Map();
function allow(discordId, maxPerMinute) {
  const now = Date.now();
  const key = discordId || "guest";
  const b = buckets.get(key) || { t: now, c: 0 };
  if (now - b.t > 60000) { b.t = now; b.c = 0; }
  b.c++;
  buckets.set(key, b);
  return b.c <= maxPerMinute;
}

export default async (req) => {
  const missing = requireEnv(["OPENAI_API_KEY","JWT_SECRET","DISCORD_GUILD_ID","DISCORD_BOT_TOKEN"]);
  if (missing) return missing;

  if (req.method !== "POST") return new Response(JSON.stringify({ error:"Use POST" }), { status:405, headers:{ "Content-Type":"application/json" }});

  const user = getUserFromRequest(req);
  if (!user) return new Response(JSON.stringify({ error:"Not logged in. Click Login with Discord." }), { status:401, headers:{ "Content-Type":"application/json" }});

  const roles = await discordGetMemberRoles(user.discord_id);
  const plan = computePlanFromRoles(roles);
  const features = getFeatures(plan);
  if (!features.chat) return new Response(JSON.stringify({ error:"Your plan does not include chat access." }), { status:403, headers:{ "Content-Type":"application/json" }});

  if (plan !== "owner") {
    const maxPerMinute = (plan === "free") ? 10 : (plan === "starter" ? 20 : 60);
    if (!allow(user.discord_id, maxPerMinute)) {
      return new Response(JSON.stringify({ error:"Rate limited. Try again in a moment." }), { status:429, headers:{ "Content-Type":"application/json" }});
    }
  }

  const body = await req.json();
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const model = body.model || "gpt-4.1-mini";

  if (plan !== "owner" && comparePlans(plan, "pro") < 0 && model !== "gpt-4.1-mini") {
    return new Response(JSON.stringify({ error:"Upgrade required for that model." }), { status:403, headers:{ "Content-Type":"application/json" }});
  }

  const sys = { role:"system", content:[
    "You are KruigerLabs AI — a helpful, capable assistant for bots, Discord servers, websites, and gaming communities.",
    "Be direct, generate complete usable outputs, and ask minimal questions.",
    "If the user requests anything unsafe/illegal, refuse and offer safe alternatives."
  ].join("\n")};

  const finalMessages = [sys, ...messages.filter(m => m && m.role && typeof m.content === "string")];

  const completion = await client.chat.completions.create({
    model,
    messages: finalMessages,
    temperature: typeof body.temperature === "number" ? body.temperature : 0.7
  });

  const text = completion.choices?.[0]?.message?.content ?? "";
  return new Response(JSON.stringify({ text, plan, features }), { status:200, headers:{ "Content-Type":"application/json" }});
};
