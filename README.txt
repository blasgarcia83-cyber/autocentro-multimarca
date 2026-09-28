AUTOCENTRO MULTIMARCA — WEB CATÁLOGO v3

Abrir index.html = catálogo público.
Abrir admin.html = panel para cargar el stock.

FUNCIONES DEL PANEL
- Alta de vehículos.
- Edición.
- Eliminación.
- Publicar / ocultar.
- Destacar.
- Año, KM, precio, versión, combustible, transmisión.
- Descripción.
- Varias fotos.
- Exportar stock a JSON.
- Importar stock desde JSON.

IMPORTANTE
Esta versión es una demo funcional y guarda la información en el navegador mediante localStorage.
Eso permite probar todo el sistema, pero NO sincroniza el stock entre distintas computadoras/celulares.

PARA HACER LA WEB REAL
El siguiente paso es conectar este mismo diseño a una base de datos online (por ejemplo Supabase) y publicarlo con dominio propio.
Así, desde la PC de Autocentro se carga un vehículo y el cambio aparece inmediatamente en la web pública desde cualquier teléfono.

WHATSAPP
En app.js cambiar:
const WHATSAPP_NUMBER="";
por el número de Autocentro sin +, espacios ni guiones.
Ejemplo:
const WHATSAPP_NUMBER="5492364XXXXXX";

No es necesario modificar el HTML para cargar vehículos: se hace desde admin.html.
