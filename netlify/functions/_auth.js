import jwt from "jsonwebtoken";

function parseCookies(cookieHeader = "") {
  const out = {};
  cookieHeader.split(";").forEach(part => {
    const [k, ...v] = part.trim().split("=");
    if (!k) return;
    out[k] = decodeURIComponent(v.join("=") || "");
  });
  return out;
}

export function getUserFromRequest(req) {
  const cookies = parseCookies(req.headers.get("cookie") || "");
  const token = cookies["kl_session"];
  if (!token) return null;
  try { return jwt.verify(token, process.env.JWT_SECRET); }
  catch { return null; }
}

export function signSession(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "14d" });
}

export function requireEnv(names = []) {
  const missing = names.filter(n => !process.env[n]);
  if (missing.length) {
    return new Response(JSON.stringify({ error: `Missing environment variables: ${missing.join(", ")}` }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
  return null;
}

export function setCookieHeader(token) {
  const secure = "Secure; ";
  const sameSite = "SameSite=Lax; ";
  const httpOnly = "HttpOnly; ";
  const path = "Path=/; ";
  const maxAge = "Max-Age=1209600; "; // 14 days
  const domain = process.env.COOKIE_DOMAIN ? `Domain=${process.env.COOKIE_DOMAIN}; ` : "";
  return `kl_session=${encodeURIComponent(token)}; ${maxAge}${path}${domain}${httpOnly}${sameSite}${secure}`;
}
