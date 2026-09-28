const KEY="autocentro_stock_v3";
let stock=JSON.parse(localStorage.getItem(KEY)||"[]");
const $=id=>document.getElementById(id);
const money=n=>n?new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n):"Consultar";
let pendingPhotos=[];

function save(){localStorage.setItem(KEY,JSON.stringify(stock))}
function render(){
 const pub=stock.filter(v=>v.available).length;
 $("stats").innerHTML=`<div><b>${stock.length}</b><span>Total cargados</span></div><div><b>${pub}</b><span>Publicados</span></div><div><b>${stock.length-pub}</b><span>Ocultos / vendidos</span></div>`;
 $("stockRows").innerHTML=stock.map(v=>`<tr><td><div class="thumb" ${v.photos?.[0]?`style="background-image:url('${v.photos[0]}')"`:""}>${v.photos?.[0]?"":"—"}</div></td><td><b>${v.brand} ${v.model}</b><small>${v.version||""}</small></td><td>${v.year||"—"}</td><td>${v.km?v.km.toLocaleString("es-AR"):"—"}</td><td>${money(v.price)}</td><td><span class="status ${v.available?"on":"off"}">${v.available?"PUBLICADO":"OCULTO"}</span></td><td><button onclick="editVehicle(${v.id})">Editar</button> <button onclick="toggleVehicle(${v.id})">${v.available?"Ocultar":"Publicar"}</button> <button class="danger-text" onclick="deleteVehicle(${v.id})">Eliminar</button></td></tr>`).join("");
}
function resetForm(){
 ["vehicleId","brand","model","version","year","km","price","fuel","transmission","description"].forEach(id=>$(id).value="");
 $("vehicleType").value="Usado";$("vehicleCategory").value="Auto";$("available").checked=true;$("featured").checked=false;$("photos").value="";$("photoPreview").innerHTML="";pendingPhotos=[];$("editorTitle").textContent="Nuevo vehículo";
}
function openEditor(v){
 resetForm();
 if(v){
   $("editorTitle").textContent="Editar vehículo";
   ["vehicleId","brand","model","version","year","km","price","fuel","transmission","description"].forEach(id=>{
     const key=id==="vehicleId"?"id":id;$(id).value=v[key]??"";
   });
   $("vehicleType").value=v.type;$("vehicleCategory").value=v.category;$("available").checked=!!v.available;$("featured").checked=!!v.featured;
   pendingPhotos=[...(v.photos||[])];renderPhotos();
 }
 $("editor").classList.remove("hidden");
}
function renderPhotos(){
 $("photoPreview").innerHTML=pendingPhotos.map((p,i)=>`<div class="preview-item"><img src="${p}"><button type="button" onclick="removePhoto(${i})">×</button></div>`).join("");
}
function removePhoto(i){pendingPhotos.splice(i,1);renderPhotos()}
$("photos").addEventListener("change",e=>{
 [...e.target.files].forEach(file=>{
   const r=new FileReader();r.onload=()=>{pendingPhotos.push(r.result);renderPhotos()};r.readAsDataURL(file);
 });
});
$("newVehicle").onclick=()=>openEditor();
window.editVehicle=id=>openEditor(stock.find(v=>v.id===id));
window.toggleVehicle=id=>{const v=stock.find(x=>x.id===id);v.available=!v.available;save();render()};
window.deleteVehicle=id=>{if(confirm("¿Eliminar definitivamente este vehículo?")){stock=stock.filter(v=>v.id!==id);save();render()}};

$("vehicleForm").addEventListener("submit",e=>{
 e.preventDefault();
 const id=Number($("vehicleId").value);
 const v={id:id||Date.now(),brand:$("brand").value.trim(),model:$("model").value.trim(),version:$("version").value.trim(),year:Number($("year").value)||0,km:Number($("km").value)||0,price:Number($("price").value)||0,type:$("vehicleType").value,category:$("vehicleCategory").value,fuel:$("fuel").value.trim(),transmission:$("transmission").value.trim(),description:$("description").value.trim(),photos:pendingPhotos,available:$("available").checked,featured:$("featured").checked};
 stock=id?stock.map(x=>x.id===id?v:x):[...stock,v];
 save();$("editor").classList.add("hidden");render();
});

$("closeEditor").onclick=$("cancel").onclick=()=>$("editor").classList.add("hidden");

$("exportBtn").onclick=()=>{
 const blob=new Blob([JSON.stringify(stock,null,2)],{type:"application/json"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="autocentro-stock.json";a.click();URL.revokeObjectURL(a.href);
};
$("importFile").addEventListener("change",e=>{
 const file=e.target.files[0];if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{
   try{
     let incoming;
     if(file.name.toLowerCase().endsWith(".csv")){alert("Para esta versión, la importación rápida utiliza JSON. El CSV se incorpora en la próxima versión.");return}
     incoming=JSON.parse(reader.result);
     if(!Array.isArray(incoming))throw new Error();
     stock=incoming;save();render();alert("Stock importado correctamente.");
   }catch{alert("El archivo no tiene un formato válido.")}
 };
 reader.readAsText(file);
});
$("resetBtn").onclick=()=>{
 if(confirm("Esto reemplazará el stock actual por los vehículos de demostración. ¿Continuar?")){
   localStorage.removeItem(KEY);location.reload();
 }
};
render();