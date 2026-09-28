const STORAGE_KEY="autocentro_stock_v3";
const WHATSAPP_NUMBER=""; // Ejemplo: 5492364XXXXXX

const DEMO=[
{id:1,brand:"Toyota",model:"Corolla",version:"XEI 2.0",year:2023,km:64500,price:0,type:"Usado",category:"Auto",fuel:"Nafta",transmission:"Automática",description:"Unidad disponible. Consultar equipamiento y condiciones.",photos:[],available:true,featured:true},
{id:2,brand:"Ford",model:"Territory",version:"2023",year:2023,km:0,price:0,type:"Usado",category:"SUV",fuel:"Nafta",transmission:"Automática",description:"Consultar detalles de la unidad.",photos:[],available:true,featured:true},
{id:3,brand:"Chevrolet",model:"Tracker",version:"",year:2022,km:0,price:0,type:"Usado",category:"SUV",fuel:"Nafta",transmission:"Automática",description:"Consultar detalles de la unidad.",photos:[],available:true,featured:true},
{id:4,brand:"Volkswagen",model:"Passat",version:"",year:0,km:0,price:0,type:"Usado",category:"Auto",fuel:"Nafta",transmission:"Automática",description:"Consultar detalles de la unidad.",photos:[],available:true,featured:false},
{id:5,brand:"Fiat",model:"Siena",version:"",year:0,km:0,price:0,type:"Usado",category:"Auto",fuel:"Nafta",transmission:"",description:"Consultar detalles de la unidad.",photos:[],available:true,featured:false},
{id:6,brand:"Peugeot",model:"Partner",version:"",year:0,km:0,price:0,type:"Usado",category:"Utilitario",fuel:"Diésel",transmission:"",description:"Consultar detalles de la unidad.",photos:[],available:true,featured:false},
{id:7,brand:"Citroën",model:"Berlingo",version:"",year:0,km:0,price:0,type:"Usado",category:"Utilitario",fuel:"Diésel",transmission:"",description:"Consultar detalles de la unidad.",photos:[],available:true,featured:false},
{id:8,brand:"Toyota",model:"Corolla",version:"",year:2014,km:0,price:0,type:"Usado",category:"Auto",fuel:"Nafta",transmission:"",description:"Consultar detalles de la unidad.",photos:[],available:true,featured:false}
];

function getStock(){const raw=localStorage.getItem(STORAGE_KEY);if(!raw){localStorage.setItem(STORAGE_KEY,JSON.stringify(DEMO));return DEMO}try{return JSON.parse(raw)}catch{return DEMO}}
function money(n){return n?new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n):"Consultar precio"}
function card(v){
 const bg=v.photos?.[0]?`style="background-image:url('${v.photos[0]}')"`:"";
 return `<article class="vehicle-card"><div class="vehicle-photo" ${bg}>${v.photos?.[0]?"":"FOTO DEL VEHÍCULO"}<span>${v.type}</span></div><div class="vehicle-body"><small>${v.year||"Año a consultar"} · ${v.km?v.km.toLocaleString("es-AR")+" km":"KM a consultar"}</small><h3>${v.brand} ${v.model}</h3><p>${v.version||"Consultar versión"}</p><strong>${money(v.price)}</strong><div class="card-actions"><button class="btn blue" onclick="showVehicle(${v.id})">Ver vehículo</button><button class="btn white" onclick="whatsapp(${v.id})">WhatsApp</button></div></div></article>`
}
function render(){
 let a=getStock().filter(v=>v.available);
 const q=document.getElementById("search").value.toLowerCase().trim(),type=document.getElementById("type").value,cat=document.getElementById("category").value,sort=document.getElementById("sort").value;
 a=a.filter(v=>(`${v.brand} ${v.model} ${v.version}`).toLowerCase().includes(q)&&(!type||v.type===type)&&(!cat||v.category===cat));
 if(sort==="featured")a.sort((x,y)=>Number(y.featured)-Number(x.featured));
 if(sort==="priceAsc")a.sort((x,y)=>(x.price||Infinity)-(y.price||Infinity));
 if(sort==="priceDesc")a.sort((x,y)=>(y.price||0)-(x.price||0));
 if(sort==="year")a.sort((x,y)=>(y.year||0)-(x.year||0));
 document.getElementById("catalog").innerHTML=a.map(card).join("");
 document.getElementById("empty").classList.toggle("hidden",a.length!==0);
 document.getElementById("resultCount").textContent=`${a.length} vehículo${a.length===1?"":"s"}`;
 document.getElementById("stockCount").textContent=a.length;
}
function showVehicle(id){
 const v=getStock().find(x=>x.id===id), photo=document.getElementById("modalPhoto");
 photo.style.backgroundImage=v.photos?.[0]?`url('${v.photos[0]}')`:"";
 photo.textContent=v.photos?.[0]?"":"FOTO DEL VEHÍCULO";
 document.getElementById("modalBody").innerHTML=`<span class="eyebrow">${v.type} · ${v.category}</span><h2>${v.brand} ${v.model}</h2><p>${v.version||"Consultar versión"}</p><div class="specs"><span>${v.year||"Año a consultar"}</span><span>${v.km?v.km.toLocaleString("es-AR")+" km":"KM a consultar"}</span><span>${v.fuel||""}</span><span>${v.transmission||""}</span></div><h3>${money(v.price)}</h3><p>${v.description||""}</p><button class="btn blue" onclick="whatsapp(${id})">Consultar por WhatsApp</button>`;
 document.getElementById("vehicleModal").classList.remove("hidden");
}
function whatsapp(id){
 const v=getStock().find(x=>x.id===id);
 const msg=encodeURIComponent(`Hola, quiero consultar por el ${v.brand} ${v.model}${v.version?" "+v.version:""} que vi en el catálogo de Autocentro Multimarca.`);
 if(WHATSAPP_NUMBER)window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
 else alert("Configurá WHATSAPP_NUMBER en app.js para activar WhatsApp.");
}
["search","type","category","sort"].forEach(id=>document.getElementById(id).addEventListener("input",render));
document.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>document.getElementById("vehicleModal").classList.add("hidden"));
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("mainWhatsapp").onclick=e=>{e.preventDefault();if(WHATSAPP_NUMBER)window.open(`https://wa.me/${WHATSAPP_NUMBER}`,"_blank");else alert("Configurá WHATSAPP_NUMBER en app.js.");};
render();