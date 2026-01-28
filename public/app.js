const chatEl=document.getElementById("chat");
const form=document.getElementById("form");
const input=document.getElementById("input");
const modelSel=document.getElementById("model");
const loginBtn=document.getElementById("login");
const logoutBtn=document.getElementById("logout");
const accountEl=document.getElementById("account");
const planEl=document.getElementById("plan");
const featuresEl=document.getElementById("features");
let messages=[];

function addMsg(role,text){
  const wrap=document.createElement("div");
  wrap.className=`msg ${role==="user"?"user":"ai"}`;
  const meta=document.createElement("div");
  meta.className="meta";
  meta.textContent=role==="user"?"You":"KruigerLabs AI";
  const body=document.createElement("div");
  body.textContent=text;
  wrap.appendChild(meta);wrap.appendChild(body);
  chatEl.appendChild(wrap);
  chatEl.scrollTop=chatEl.scrollHeight;
}
async function getMe(){const res=await fetch("/.netlify/functions/me");return await res.json();}
function setUI(me){
  if(!me.authed){
    accountEl.textContent="Not logged in";
    planEl.textContent=me.plan||"guest";
    featuresEl.textContent="chat: off";
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    return;
  }
  const u=me.user||{};
  accountEl.textContent=`${u.username}${u.discriminator?"#"+u.discriminator:""}`;
  planEl.textContent=me.plan||"guest";
  const f=me.features||{};
  featuresEl.textContent=Object.entries(f).map(([k,v])=>`${k}: ${v?"on":"off"}`).join(" • ");
  loginBtn.classList.add("hidden");logoutBtn.classList.remove("hidden");
}
loginBtn.addEventListener("click",()=>window.location.href="/.netlify/functions/auth_start");
logoutBtn.addEventListener("click",()=>window.location.href="/.netlify/functions/logout");
(async()=>setUI(await getMe()))();

async function sendToAI(){
  const res=await fetch("/.netlify/functions/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:modelSel.value,messages})});
  const data=await res.json();
  if(!res.ok) throw new Error(data?.error||"Request failed");
  return data.text||"";
}
form.addEventListener("submit",async(e)=>{
  e.preventDefault();
  const text=input.value.trim(); if(!text) return;
  input.value=""; addMsg("user",text); messages.push({role:"user",content:text});
  addMsg("assistant","…");
  try{const reply=await sendToAI(); chatEl.lastChild.remove(); addMsg("assistant",reply); messages.push({role:"assistant",content:reply});}
  catch(err){chatEl.lastChild.remove(); addMsg("assistant",`Error: ${err.message}`);}
});
