const WA_NUMBER="919938348982";
const getData=()=>JSON.parse(sessionStorage.getItem("parichayaData")||"{}");
const saveData=(d)=>sessionStorage.setItem("parichayaData",JSON.stringify(d));
const $=(s)=>document.querySelector(s);
function toast(msg){alert(msg)}
function nameOrEmpty(){return ($("#studentName")?.value||"").trim()}
function loadDataIntoPage(){
 const d=getData();
 if($("#studentName")) $("#studentName").value=d.name||"";
 if($("#seniorMessage")) {$("#seniorMessage").value=d.message||""; updateCount();}
}
function updateCount(){if($("#charCount")) $("#charCount").textContent=`${($("#seniorMessage").value||"").length} / 500`}
document.addEventListener("DOMContentLoaded",()=>{
 loadDataIntoPage();

 $("#studentName")?.addEventListener("input",()=>{
   const d=getData(); d.name=nameOrEmpty(); saveData(d);
   if($("#miniName")) $("#miniName").textContent=d.name||"Your Name";
   if($("#cardName")) $("#cardName").textContent=(d.name||"YOUR NAME").toUpperCase();
 });

 $("#photoInput")?.addEventListener("change",e=>{
   const f=e.target.files?.[0]; if(!f)return;
   if(!f.type.startsWith("image/"))return toast("Please choose an image.");
   const r=new FileReader();r.onload=ev=>{
     const d=getData();d.photo=ev.target.result;saveData(d);
     if($("#miniAvatar"))$("#miniAvatar").innerHTML=`<img src="${d.photo}" alt="Selected photo">`;
     if($("#cardPhoto")){$("#cardPhoto").src=d.photo;$("#cardPhoto").style.display="block";$("#photoPlaceholder")?.remove();}
   };r.readAsDataURL(f);
 });

 const d=getData();
 if(d.photo){
   if($("#miniAvatar"))$("#miniAvatar").innerHTML=`<img src="${d.photo}" alt="Selected photo">`;
   if($("#cardPhoto")){$("#cardPhoto").src=d.photo;$("#cardPhoto").style.display="block";$("#photoPlaceholder")?.remove();}
 }
 if($("#cardName")&&d.name)$("#cardName").textContent=d.name.toUpperCase();
 if($("#miniName")&&d.name)$("#miniName").textContent=d.name;

 $("#continueBtn")?.addEventListener("click",()=>{
   const n=nameOrEmpty();if(!n)return toast("Please enter your name first.");
   const d=getData();d.name=n;saveData(d);location.href="invitation.html";
 });
 $("#downloadBtn")?.addEventListener("click",async()=>{
   if(typeof html2canvas==="undefined")return toast("Please check your internet connection and try again.");
   const n=getData().name||"Fresher";const btn=$("#downloadBtn");btn.textContent="Preparing…";
   try{const c=await html2canvas($("#invitationCard"),{scale:3,backgroundColor:"#1a080c",useCORS:true});
   const a=document.createElement("a");a.download=`Parichaya_2026_${n.replace(/[^\w\s-]/g,"").replace(/\s+/g,"_")||"Fresher"}.png`;a.href=c.toDataURL("image/png");a.click();toast("Invitation downloaded.");}
   catch(e){console.error(e);toast("Could not create the image. Please try again.");}
   btn.textContent="↓ Download Invitation";
 });
 $("#shareBtn")?.addEventListener("click",async()=>{
   try{await navigator.share({title:"ପରିଚୟ 2026",text:"ପରିଚୟ 2026 — Freshers' celebration",url:location.origin+location.pathname.replace(/\/[^/]*$/,"/")});}
   catch(e){try{await navigator.clipboard.writeText(location.origin+location.pathname.replace(/\/[^/]*$/,"/"));toast("Website link copied.");}catch(_){}}
 });
 $("#seniorMessage")?.addEventListener("input",updateCount);
 $("#sendWhatsAppBtn")?.addEventListener("click",()=>{
   const d=getData();const m=$("#seniorMessage").value.trim();if(!m)return toast("Please write a message first.");
   d.message=m;saveData(d);
   const text=`🎓 *A Message from a Fresher*\\n\\n*Name:* ${d.name||"Fresher"}\\n\\n💌 *Message:*\\n${m}\\n\\n— *ପରିଚୟ 2026*\\nNabakrushna Choudhury College of Teacher Education, Anugola`;
   location.href=`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
 });
});