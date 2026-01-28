export default async () => new Response(null,{status:302,headers:{'Set-Cookie':'kl_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure','Location':'/'}});
