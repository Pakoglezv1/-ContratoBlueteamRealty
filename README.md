# Generador de Contratos de Arrendamiento — Blue Team Realty

Borrador web (sin backend) que llena la plantilla del "Contrato Privado de
Arrendamiento" con los datos de cada cliente, muestra una vista previa en
vivo, y genera el contrato completo en PDF listo para subir a DocuSign.

## Qué cambia y qué no cambia entre contratos

Analicé el contrato de Landmark Torre 2 Unidad 2703 que me compartiste. Casi
todo el texto legal (las 24 cláusulas) es fijo — aplica igual a cualquier
inquilino. Lo que identifiqué como variable, y por eso quedó como campo en
el formulario:

- Arrendador y arrendatario (nombre y nacionalidad)
- Dirección del inmueble
- Reglamento interno (de qué torre/fraccionamiento)
- Renta mensual y moneda (USD/MXN)
- Depósito en garantía (se autocalcula como 2x la renta, editable)
- Fechas de inicio y fin de vigencia (fin se autocalcula a +12 meses, editable)
- Día y lugar de pago
- Máximo de personas y si se permiten mascotas
- Uso del inmueble (habitacional / comercial / mixto)
- Porcentajes de aumento anual, multa por mora e incremento mínimo de
  prórroga (los dejé en los valores del contrato original — 5%, 10%, 5% —
  pero son editables en "Términos avanzados" por si algún propietario pide
  otros términos)
- Municipio y estado (por si en el futuro manejan propiedades fuera de
  Tijuana/Baja California)
- Ciudad y fecha de firma

**Supuesto que hice:** dejé "Notas de equipamiento / inventario" como un
campo de texto libre, no como una lista generada — en el contrato original
esa sección remite a un documento anexo con fotos ("SE ANEXA DOCUMENTO CON
ROLLO FOTOGRÁFICO INVENTARIO FIRMADO"), que sigue siendo un PDF/anexo
aparte que subes tú mismo a DocuSign junto con este contrato. Si prefieres
que el campo tome el inventario directo de la pestaña "Inventario de
Propiedades" del spreadsheet, se puede conectar más adelante.

## Checklist de documentos

La sección 1 del formulario es una lista editable (no solo los dos que
mencionaste): empieza con "Identificación oficial o pasaporte" y
"Comprobante de domicilio", con checkbox de "Entregado" cada uno. Puedes
agregar más renglones según me compartas el resto de los requisitos. El
checklist **no bloquea** la generación del contrato — solo te avisa con un
aviso ("Faltan X de Y documentos") para que no se te pase nada antes de
mandarlo a firmar.

## Uso

Abre `index.html` en el navegador, llena el formulario (la vista previa se
actualiza sola), y da clic en **"Descargar contrato en PDF"**. El archivo se
descarga ya paginado y con numeración, listo para subir a DocuSign.

## DocuSign

No integré la firma electrónica todavía porque conectar la API de DocuSign
requiere que ya tengas una cuenta de DocuSign con acceso a su API (no es
algo que se configure solo con código). Por ahora el flujo es:

1. Generas el PDF aquí.
2. Lo subes manualmente a DocuSign para mandarlo a firmar.

Cuando tengas la cuenta de DocuSign lista, se puede automatizar el
paso 2 (que el botón mande el PDF directo a un sobre de DocuSign) — el
patrón sería igual al webhook de GoHighLevel que dejamos listo en el
generador de recibos.

## Publicarlo en GitHub

Mismo procedimiento que los otros dos borradores (recibos y dashboard):

1. Sube `index.html`, la carpeta `css/` y la carpeta `js/` completas a un
   repositorio (o a una carpeta dentro del mismo repo de recibos/dashboard).
2. Settings → Pages → rama `main` → carpeta `/(root)` → Save.
3. Tu URL queda en `https://tu-usuario.github.io/tu-repo/`.

## Registro de cada contrato

El botón **"Guardar registro (JSON)"** descarga una copia de todos los
datos del contrato (incluyendo el checklist de documentos) como respaldo
local. Igual que con los recibos, el spreadsheet maestro (pestaña "Rentas
Activas") sigue siendo la fuente de verdad del equipo — copia ahí los datos
clave (inquilino, propiedad, renta, fechas) una vez generado el contrato.

## Personalizar

- **Cláusulas fijas**: están en `js/contract-template.js`, función
  `buildContractBlocks`. Si cambia la redacción legal, se edita ahí.
- **Valores por defecto** (aumento anual, multa, etc.): en el HTML,
  sección "5. Términos avanzados".
- **Colores**: variables al inicio de `css/style.css`.
