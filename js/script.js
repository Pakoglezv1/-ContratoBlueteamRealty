let requisitos = [];

/* ---------------------- INICIALIZACIÓN ---------------------- */
document.addEventListener("DOMContentLoaded", () => {
  requisitos = [
    { texto: "Identificación oficial o pasaporte", entregado: false },
    { texto: "Comprobante de domicilio", entregado: false },
  ];
  renderRequisitos();

  const hoy = new Date().toISOString().slice(0, 10);
  document.getElementById("fechaInicio").value = hoy;
  document.getElementById("fechaFirma").value = hoy;
  recalcularFechaFin();
  recalcularDeposito();

  const camposConLive = [
    "arrendador","arrendadorNacionalidad","arrendatario","arrendatarioNacionalidad",
    "direccionInmueble","reglamentoInterno","maxPersonas","mascotasPermitidas","usoInmueble",
    "notasEquipamiento","rentaMensual","moneda","depositoGarantia","fechaInicio","fechaFin",
    "diaPago","lugarPago","aumentoAnualPct","multaMoraPct","incrementoMinimoProrrogaPct",
    "municipio","estado","ciudadFirma","fechaFirma",
  ];
  camposConLive.forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("input", actualizarPreview);
    el.addEventListener("change", actualizarPreview);
  });

  document.getElementById("fechaInicio").addEventListener("change", () => {
    if (!document.getElementById("fechaFin").dataset.tocado) recalcularFechaFin();
  });
  document.getElementById("fechaFin").addEventListener("input", (e) => {
    e.target.dataset.tocado = "true";
  });
  document.getElementById("rentaMensual").addEventListener("input", () => {
    if (!document.getElementById("depositoGarantia").dataset.tocado) recalcularDeposito();
  });
  document.getElementById("depositoGarantia").addEventListener("input", (e) => {
    e.target.dataset.tocado = "true";
  });

  document.getElementById("btnAddRequisito").addEventListener("click", () => {
    requisitos.push({ texto: "", entregado: false });
    renderRequisitos();
  });

  document.getElementById("btnDescargarPDF").addEventListener("click", descargarPDF);
  document.getElementById("btnGuardarJSON").addEventListener("click", guardarJSON);
  document.getElementById("btnReset").addEventListener("click", reiniciarFormulario);

  actualizarPreview();
});

function recalcularFechaFin() {
  const inicio = document.getElementById("fechaInicio").value;
  if (!inicio) return;
  document.getElementById("fechaFin").value = sumarMeses(inicio, 12);
}

function recalcularDeposito() {
  const renta = parseFloat(document.getElementById("rentaMensual").value) || 0;
  document.getElementById("depositoGarantia").value = (renta * 2).toFixed(2);
}

/* ---------------------- REQUISITOS / CHECKLIST ---------------------- */
function renderRequisitos() {
  const wrap = document.getElementById("requisitosList");
  wrap.innerHTML = "";
  requisitos.forEach((r, i) => {
    const row = document.createElement("div");
    row.className = "dyn-row";
    row.innerHTML = `
      <label class="chk"><input type="checkbox" data-idx="${i}" data-field="entregado" ${r.entregado ? "checked" : ""}> Entregado</label>
      <input type="text" placeholder="Nombre del requisito" value="${r.texto}" data-idx="${i}" data-field="texto">
      <button type="button" class="remove-btn" data-idx="${i}" title="Quitar">×</button>
    `;
    wrap.appendChild(row);
  });

  wrap.querySelectorAll("input[type=text]").forEach((el) => {
    el.addEventListener("input", (e) => {
      requisitos[Number(e.target.dataset.idx)].texto = e.target.value;
    });
  });
  wrap.querySelectorAll("input[type=checkbox]").forEach((el) => {
    el.addEventListener("change", (e) => {
      requisitos[Number(e.target.dataset.idx)].entregado = e.target.checked;
      actualizarEstadoRequisitos();
    });
  });
  wrap.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      requisitos.splice(Number(e.target.dataset.idx), 1);
      renderRequisitos();
      actualizarEstadoRequisitos();
    });
  });

  actualizarEstadoRequisitos();
}

function actualizarEstadoRequisitos() {
  const total = requisitos.length;
  const entregados = requisitos.filter((r) => r.entregado).length;
  const faltan = total - entregados;
  const el = document.getElementById("estadoRequisitos");
  const badge = document.getElementById("previewEstado");
  if (faltan === 0 && total > 0) {
    el.textContent = "✓ Documentación completa";
    el.className = "estado-requisitos ok";
    badge.textContent = "Listo para generar";
    badge.className = "badge ok";
  } else {
    el.textContent = `Faltan ${faltan} de ${total} documento(s)`;
    el.className = "estado-requisitos faltan";
    badge.textContent = `Faltan ${faltan} documento(s)`;
    badge.className = "badge faltan";
  }
}

/* ---------------------- RECOLECTAR DATOS DEL FORM ---------------------- */
function recolectarDatos() {
  return {
    arrendador: document.getElementById("arrendador").value.trim(),
    arrendadorNacionalidad: document.getElementById("arrendadorNacionalidad").value.trim() || "MEXICANO",
    arrendatario: document.getElementById("arrendatario").value.trim(),
    arrendatarioNacionalidad: document.getElementById("arrendatarioNacionalidad").value.trim() || "Mexicano",
    direccionInmueble: document.getElementById("direccionInmueble").value.trim(),
    reglamentoInterno: document.getElementById("reglamentoInterno").value.trim(),
    maxPersonas: document.getElementById("maxPersonas").value || 1,
    mascotasPermitidas: document.getElementById("mascotasPermitidas").value === "si",
    usoInmueble: document.getElementById("usoInmueble").value,
    notasEquipamiento: document.getElementById("notasEquipamiento").value.trim(),
    rentaMensual: parseFloat(document.getElementById("rentaMensual").value) || 0,
    moneda: document.getElementById("moneda").value,
    depositoGarantia: parseFloat(document.getElementById("depositoGarantia").value) || 0,
    fechaInicio: document.getElementById("fechaInicio").value,
    fechaFin: document.getElementById("fechaFin").value,
    diaPago: document.getElementById("diaPago").value || 1,
    lugarPago: document.getElementById("lugarPago").value.trim(),
    aumentoAnualPct: document.getElementById("aumentoAnualPct").value || 0,
    multaMoraPct: document.getElementById("multaMoraPct").value || 0,
    incrementoMinimoProrrogaPct: document.getElementById("incrementoMinimoProrrogaPct").value || 0,
    municipio: document.getElementById("municipio").value.trim(),
    estado: document.getElementById("estado").value.trim(),
    ciudadFirma: document.getElementById("ciudadFirma").value.trim(),
    fechaFirma: document.getElementById("fechaFirma").value,
  };
}

/* ---------------------- VISTA PREVIA EN PANTALLA ---------------------- */
function actualizarPreview() {
  const data = recolectarDatos();
  const blocks = buildContractBlocks(data);
  const el = document.getElementById("preview");
  el.innerHTML = blocks
    .map((b) => {
      if (b.type === "firma") {
        return `<div class="b-firma"><div>${b.arrendador}<br><span style="font-weight:400">"EL ARRENDADOR"</span></div><div>${b.arrendatario}<br><span style="font-weight:400">"EL ARRENDATARIO"</span></div></div>`;
      }
      const cls = b.size >= 15 ? "b-title" : b.align === "center" ? "b-heading" : b.bold ? "b-clause-title" : "b-p";
      return `<div class="${cls}">${escapeHtml(b.text)}</div>`;
    })
    .join("");
}

function escapeHtml(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------------------- GENERAR PDF ---------------------- */
async function descargarPDF() {
  const btn = document.getElementById("btnDescargarPDF");
  const original = btn.textContent;
  btn.textContent = "Generando...";
  btn.disabled = true;

  try {
    const data = recolectarDatos();
    const blocks = buildContractBlocks(data);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "letter" });

    const marginX = 56;
    const marginTop = 56;
    const marginBottom = 56;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const usableW = pageW - marginX * 2;

    let y = marginTop;

    function ensureSpace(h) {
      if (y + h > pageH - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
    }

    blocks.forEach((b) => {
      if (b.type === "firma") {
        ensureSpace(70);
        y += b.spaceBefore || 20;
        const colW = usableW / 2 - 10;
        doc.setDrawColor(150);
        doc.line(marginX, y, marginX + colW, y);
        doc.line(marginX + usableW - colW, y, marginX + usableW, y);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.text(b.arrendador, marginX + colW / 2, y + 16, { align: "center", maxWidth: colW });
        doc.text(b.arrendatario, marginX + usableW - colW / 2, y + 16, { align: "center", maxWidth: colW });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.text('"EL ARRENDADOR"', marginX + colW / 2, y + 30, { align: "center" });
        doc.text('"EL ARRENDATARIO"', marginX + usableW - colW / 2, y + 30, { align: "center" });
        y += 46;
        return;
      }

      const size = b.size || 10;
      doc.setFont("helvetica", b.bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(b.text, usableW);
      const lineH = size * 1.32;
      const blockH = lines.length * lineH + (b.spaceBefore || 6);

      ensureSpace(blockH);
      y += b.spaceBefore || 6;

      lines.forEach((line) => {
        ensureSpace(lineH);
        if (b.align === "center") {
          doc.text(line, pageW / 2, y, { align: "center" });
        } else {
          doc.text(line, marginX, y, { maxWidth: usableW });
        }
        y += lineH;
      });
    });

    // Numeración de páginas
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Página ${i} de ${totalPages}`, pageW - marginX, pageH - 30, { align: "right" });
      doc.setTextColor(0);
    }

    const nombreArchivo = construirNombreArchivo(data);
    doc.save(nombreArchivo);
  } finally {
    btn.textContent = original;
    btn.disabled = false;
  }
}

function construirNombreArchivo(data) {
  const arrend = (data.arrendatario || "Contrato").replace(/\s+/g, "_");
  const dir = (data.direccionInmueble || "").split(",")[0].replace(/\s+/g, "_") || "Inmueble";
  return `Contrato_${dir}_${arrend}.pdf`.replace(/__+/g, "_");
}

/* ---------------------- GUARDAR REGISTRO JSON ---------------------- */
function guardarJSON() {
  const data = recolectarDatos();
  data.requisitos = requisitos;
  data.generadoEn = new Date().toISOString();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = construirNombreArchivo(data).replace(".pdf", ".json");
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------------- REINICIAR ---------------------- */
function reiniciarFormulario() {
  if (!confirm("¿Reiniciar el formulario? Se perderán los datos no guardados.")) return;
  [
    "arrendador","arrendatario","direccionInmueble","reglamentoInterno","notasEquipamiento",
    "rentaMensual","lugarPago",
  ].forEach((id) => (document.getElementById(id).value = ""));
  document.getElementById("depositoGarantia").dataset.tocado = "";
  document.getElementById("fechaFin").dataset.tocado = "";
  document.getElementById("maxPersonas").value = 3;
  document.getElementById("diaPago").value = 1;
  const hoy = new Date().toISOString().slice(0, 10);
  document.getElementById("fechaInicio").value = hoy;
  document.getElementById("fechaFirma").value = hoy;
  recalcularFechaFin();
  recalcularDeposito();
  requisitos = [
    { texto: "Identificación oficial o pasaporte", entregado: false },
    { texto: "Comprobante de domicilio", entregado: false },
  ];
  renderRequisitos();
  actualizarPreview();
}
