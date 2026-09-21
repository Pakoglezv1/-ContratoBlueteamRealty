/**
 * Plantilla del Contrato Privado de Arrendamiento — Blue Team Realty
 * Convierte los datos del formulario en una lista de bloques de texto
 * (título / encabezado / párrafo) que usan tanto la vista previa en
 * pantalla como el generador de PDF, para que ambos siempre coincidan.
 *
 * Cada bloque: { bold, size, align, spaceBefore, text }
 */

function up(s) {
  return (s || "").toUpperCase();
}

function letrasEnteroSimple(n) {
  // Reutiliza el motor de numero-a-letras.js, sin moneda, en minúsculas.
  return enteroALetras(Number(n) || 0);
}

function formatFechaLarga(fechaISO) {
  if (!fechaISO) return "____________";
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const d = new Date(fechaISO + "T00:00:00");
  if (isNaN(d)) return fechaISO;
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

function sumarMeses(fechaISO, meses) {
  if (!fechaISO) return "";
  const d = new Date(fechaISO + "T00:00:00");
  d.setMonth(d.getMonth() + meses);
  d.setDate(d.getDate() - 1); // vigencia inclusiva, como en el contrato original (16 sep - 15 sep)
  return d.toISOString().slice(0, 10);
}

function buildContractBlocks(data) {
  const B = [];
  const p = (text, opts = {}) => B.push({ bold: false, size: 10, align: "left", spaceBefore: 6, text, ...opts });
  const clause = (titulo, cuerpo) => {
    B.push({ bold: true, size: 10.5, align: "left", spaceBefore: 12, text: titulo });
    B.push({ bold: false, size: 10, align: "left", spaceBefore: 3, text: cuerpo });
  };
  const heading = (text) => B.push({ bold: true, size: 12, align: "center", spaceBefore: 16, text });

  const nombreMonedaLegal = data.moneda === "USD" ? "Moneda Americana" : "Moneda Nacional";
  const rentaLetras = window.montoALetras(data.rentaMensual, data.moneda).replace(new RegExp(data.moneda + "$"), nombreMonedaLegal);
  const depositoLetras = window.montoALetras(data.depositoGarantia, data.moneda).replace(new RegExp(data.moneda + "$"), nombreMonedaLegal);
  const mascotasTexto = data.mascotasPermitidas
    ? "Se permiten mascotas en dicho inmueble, sujeto a las condiciones adicionales que ambas partes acuerden por separado."
    : "No se permite ningún tipo de mascotas en dicho inmueble.";
  const fechaInicioLarga = formatFechaLarga(data.fechaInicio);
  const fechaFinLarga = formatFechaLarga(data.fechaFin);
  const aumentoLetras = letrasEnteroSimple(data.aumentoAnualPct);
  const incrementoProrrogaLetras = letrasEnteroSimple(data.incrementoMinimoProrrogaPct);
  const maxPersonasLetras = letrasEnteroSimple(data.maxPersonas);

  // ---- TÍTULO ----
  B.push({ bold: true, size: 15, align: "center", spaceBefore: 0, text: "CONTRATO PRIVADO DE ARRENDAMIENTO" });

  p(`CONTRATO PRIVADO DE ARRENDAMIENTO QUE CELEBRAN POR UNA PARTE ${up(data.arrendador)}, POR SU PROPIO DERECHO, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ COMO EL "ARRENDADOR", Y POR LA OTRA PARTE POR SU PROPIO DERECHO, ${up(data.arrendatario)}, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ COMO EL "ARRENDATARIO", QUIEN AVALARÁ POR LA DURACIÓN DEL ARRENDAMIENTO Y/O CUALQUIER DAÑO DE LA PROPIEDAD; AMBAS PARTES SE SUJETAN A LAS SIGUIENTES DECLARACIONES Y CLÁUSULAS:`, { spaceBefore: 14 });

  heading("DECLARACIONES");

  p(`I. Declara el "ARRENDADOR" por su propio derecho que:`, { bold: true, spaceBefore: 12 });
  p(`a) Es ciudadano ${up(data.arrendadorNacionalidad)}, mayor de edad, con la capacidad legal para obligarse en los términos establecidos en el presente instrumento, siendo legítimo propietario del inmueble objeto de arrendamiento ubicado en ${data.direccionInmueble}.`);
  p(`b) Cuenta con domicilio en el mismo inmueble de arrendamiento para notificaciones, según se indica en el inciso a).`);
  p(`c) Conforme a lo establecido en el artículo 18 de la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita, solicitó al "ARRENDATARIO" la documentación oficial requerida para la celebración del presente Contrato de Arrendamiento.`);
  p(`d) Señala como domicilio para efectos de cualquier notificación relacionada con el presente contrato el ubicado en la misma dirección del inmueble puesto en arrendamiento.`);
  p(`e) Declara identificarse con su credencial oficial INE para efectos del presente contrato.`);

  p(`II. Declara el "ARRENDATARIO" por su propio derecho y bajo protesta de decir verdad que:`, { bold: true, spaceBefore: 12 });
  p(`a) De conformidad con lo establecido por los artículos 18 y 23 de la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita, manifiesta Bajo Protesta de Decir Verdad que no existe Dueño Beneficiario diverso.`);
  p(`b) Es mayor de edad, con la capacidad económica para pagar la renta mensual de $${Number(data.rentaMensual).toLocaleString("en-US",{minimumFractionDigits:2})} ${data.moneda} (${rentaLetras}).`);
  p(`c) Conoce el Inmueble, en virtud de que le fue mostrado previamente a la firma de este contrato, tanto en su exterior como en su interior, y en tal virtud, reconoce y acepta que dicho inmueble se encuentra en excelentes condiciones para el uso propuesto en este contrato.`);
  p(`d) Es ciudadano ${data.arrendatarioNacionalidad}.`);
  p(`e) Señala como domicilio para notificaciones y efectos legales el mismo inmueble objeto del arrendamiento.`);
  p(`f) Declara identificarse con su credencial oficial INE para términos del presente contrato.`);

  p(`DECLARAN LAS PARTES:`, { bold: true, spaceBefore: 12 });
  p(`Después de haber libremente negociado los términos de este contrato, manifiestan que en su celebración no existe dolo, error, lesión, mala fe, coacción, o la existencia de algún vicio en el consentimiento que pudiese invalidarlo y expresamente aceptan someterse a lo dispuesto en las siguientes:`);

  heading("CLÁUSULAS");

  clause("PRIMERA.- OBJETO.", `Ambas partes acuerdan que el objeto del presente contrato es el otorgamiento del uso y goce temporal del Inmueble ubicado en ${data.direccionInmueble}. Por lo anterior, en este acto, el "ARRENDADOR" da el Inmueble en arrendamiento, libre de embargos definitivos o precautorios, aseguramientos de carácter ministerial o judicial, o decomisos, al corriente en el pago de todas las contribuciones que le son aplicables y libre de cualesquiera ocupaciones, permisos, autorizaciones o concesiones otorgadas a favor de terceros o reclamadas por terceros, y libre de compromiso, responsabilidad u obligación de cualquier tipo que pudiese restringir o excluir su uso o posesión, al "ARRENDATARIO", y este último lo recibe a su entera satisfacción.`);

  clause("SEGUNDA.- VIGENCIA.", `La vigencia de este contrato será de hasta 12 (doce) meses forzosos para ambas partes, contados a partir de la fecha de firma. El periodo de arrendamiento comprende del ${fechaInicioLarga} al ${fechaFinLarga}.`);
  p(`Siendo esta última fecha término fatal e irrevocable sin necesidad de notificación o interpelación judicial; para continuar con la ocupación del lugar es necesario celebrar una prórroga o renovación a instancias del ARRENDADOR. En caso de no celebrarse la prórroga o renovación, el ARRENDATARIO está obligado a retirar las instalaciones y desocupar de forma inmediata.`);
  p(`La prórroga se dará siempre y cuando el "ARRENDATARIO" lo solicite por escrito, con una anticipación no menor a sesenta días anteriores a la conclusión del término de vigencia y se encuentre al corriente en el cumplimiento de sus obligaciones de "ARRENDATARIO" y el "ARRENDADOR" esté de acuerdo y lo manifieste por escrito. En ese supuesto, para la prórroga de que se trate regirán las mismas condiciones y términos que se estipulan en el presente contrato, salvo la renta básica aplicable a esa prórroga, la cual se incrementará aplicando el 100% (cien por ciento) del incremento porcentual del índice de inflación que determine el Banco de México, tomando como mínimo de incremento un ${data.incrementoMinimoProrrogaPct}% (${incrementoProrrogaLetras} por ciento), además del porcentaje de incremento de la renta básica que fije el ARRENDADOR para dicha prórroga, de acuerdo con el artículo 2359 del Código Civil para el Estado de ${data.estado}.`);
  p(`En caso de que el ARRENDATARIO pretenda dar por concluido el arrendamiento antes de su vencimiento, cualquiera que sea la causa, pagará como pena convencional el importe de los meses de renta que resten al 100% (cien por ciento) o el importe de los meses que falten para el vencimiento de este contrato, lo que resulte menor, debiendo desocupar en un plazo no mayor a diez días posteriores a dicho pago, obligándose a acudir al domicilio del ARRENDADOR o de quien sus derechos represente para recabar sus firmas y la constancia de finiquito correspondiente; en caso contrario, este contrato seguirá produciendo sus efectos en todas y cada una de sus cláusulas.`);

  clause("TERCERA.- PRECIO Y FORMA DE PAGO.", `Las partes acuerdan que la renta mensual es por la cantidad de $${Number(data.rentaMensual).toLocaleString("en-US",{minimumFractionDigits:2})} ${data.moneda} (${rentaLetras}). La renta mensual la pagará el ARRENDATARIO al ARRENDADOR por mensualidades adelantadas completas, cada día ${data.diaPago} del mes en ${data.lugarPago}. En dicho domicilio se le emitirá su recibo de pago correspondiente.`);
  p(`La recepción que pudiera realizar el ARRENDADOR del importe de la renta en un lugar o forma distinta a la señalada no libera al ARRENDATARIO de cumplir con su obligación de pago en dichos términos. La recepción del pago parcial o extemporáneo de la renta o de los intereses no implicará autorización expresa o tácita para que el ARRENDATARIO haga sus pagos en forma distinta a la señalada en esta cláusula.`);
  p(`Las partes están de acuerdo en que, en caso de incurrir en mora por el atraso del pago de la renta a partir del día 3 (tres) de demora, el ARRENDATARIO se obliga a pagar una multa por este concepto consistente en el ${data.multaMoraPct}% de intereses moratorios sobre el precio de la renta mensual estipulada. La multa empezará a correr a partir del día siguiente en que debió pagarse la renta; esta multa será acumulable y dejará de correr en el momento en que se liquide la totalidad del adeudo (monto de la renta atrasada más el importe de multas). Los pagos efectuados se abonarán en primer término para cubrir las multas y posteriormente las rentas atrasadas.`);
  p(`Si a consecuencia de las actividades del ARRENDATARIO se iniciase un Juicio de Extinción de Dominio, el ARRENDATARIO asumirá la responsabilidad penal, civil o de cualquier otra índole por esas acciones y exime al ARRENDADOR, a la propiedad y a los agentes o corredores inmobiliarios de dichas actividades, siendo el ARRENDATARIO responsable del pago al ARRENDADOR por cualquier pérdida monetaria o de la propiedad, siendo pagadero de inmediato.`);
  p(`Las partes acuerdan que el pago mensual estipulado en esta cláusula, una vez cumplido un año, tendrá un aumento del ${data.aumentoAnualPct}% (${aumentoLetras} por ciento) en el pago mensual.`);

  clause("CUARTA.- DEPÓSITO, PAGOS Y DAÑOS.", `El ARRENDATARIO entrega a la firma del presente contrato, en calidad de depósito en garantía, la cantidad de $${Number(data.depositoGarantia).toLocaleString("en-US",{minimumFractionDigits:2})} ${data.moneda} (${depositoLetras}).`);
  p(`a) Daños: Corresponde al ARRENDATARIO el pago total de la reparación de los daños que tuviera el Inmueble arrendado. Quedan exceptuados los daños naturales o desgastes normales ajenos a la negligencia en la propiedad.`);
  p(`b) Adeudos de servicios: El ARRENDATARIO cubrirá los adeudos en los servicios de agua, luz, teléfono, gas, internet y cualquier otro, así como la limpieza del Inmueble que hayan quedado pendientes al desocuparlo.`);
  p(`c) Devolución del depósito: En su caso, el saldo del depósito será devuelto al ARRENDATARIO 30 días naturales después de que el ARRENDADOR reciba a su entera satisfacción el Inmueble y constate que no existen daños ni adeudos de cualquier índole (agua, luz, teléfono, etc.), y que el Inmueble sea devuelto en condiciones iguales a las que fue entregado, sin más deterioro que el causado por el uso natural y prudente. De presentar adeudos en los servicios o daños, el depósito no se devolverá y se aplicará para cubrir dichos conceptos, sin que ello libere al ARRENDATARIO de responsabilidad adicional si el depósito resultara insuficiente. Por ningún motivo se considerará este depósito como pago de mensualidades de renta ni generará interés alguno.`);
  p(`En cumplimiento a lo establecido en el artículo 32 de la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita, el depósito en garantía únicamente se realizará mediante: (i) cheque, (ii) transferencia electrónica, o (iii) pago en efectivo. Tras efectuar el pago, será responsabilidad del ARRENDATARIO entregar copia de los comprobantes al ARRENDADOR.`);
  p(`Ambas partes acuerdan que con un solo día que el ARRENDATARIO ocupe el inmueble dado en arrendamiento o haga uso de sus accesorios, el pago deberá ser íntegro por el mes completo de renta.`);

  clause("QUINTA.- USO E INVENTARIO DE EQUIPAMIENTO.", `El Inmueble se destinará exclusivamente a uso ${data.usoInmueble}, para un máximo de ${data.maxPersonas} (${maxPersonasLetras}) personas. ${mascotasTexto}`);
  p(`Queda estrictamente prohibido utilizar el Inmueble como domicilio fiscal o procesal, o para actividades públicas, comerciales, políticas, sociales o religiosas de cualquier índole. El incumplimiento rescindirá este contrato de forma inmediata sin necesidad de declaración judicial, notificando a las autoridades correspondientes y quedando obligado el ARRENDATARIO a la desocupación inmediata y al pago de las rentas por la vigencia del contrato.`);
  p(`El ARRENDATARIO recibe el Inmueble en óptimas condiciones en ventanas, pisos, baños e instalaciones eléctricas, hidráulicas y de drenaje. Asimismo, el Inmueble se entrega plenamente equipado con los sistemas tecnológicos y de automatización descritos a continuación: se anexa al contrato el equipamiento.`);
  p(`El ARRENDATARIO se obliga a conservar dicho equipamiento en perfecto estado de funcionamiento y a devolverlo al término de la vigencia. Se entregará la posesión en la fecha convenida y deberá ser regresado al ARRENDADOR al concluir el arrendamiento.`);
  p(`El ARRENDATARIO se obliga a entregar el Inmueble precisamente el día del vencimiento sin necesidad de requerimiento previo, debiendo comunicarlo por escrito con 30 días naturales de anticipación y entregando las llaves correspondientes. Renuncia a las facultades que le conceden los artículos 2286 fracción V y 2295 del Código Civil para el Estado de ${data.estado}.`);

  heading("EQUIPAMIENTO E INVENTARIO INCLUIDO EN EL INMUEBLE");
  p(data.notasEquipamiento || "SE ANEXA DOCUMENTO CON ROLLO FOTOGRÁFICO INVENTARIO FIRMADO", { align: "center", spaceBefore: 10 });

  clause("SEXTA.- DE LAS MEJORAS.", `El ARRENDATARIO no podrá realizar adecuaciones, adaptaciones, modificaciones o mejoras de cualquier naturaleza sobre el Inmueble (techos, ventanas, pisos interiores o exteriores) sin previo aviso y autorización por escrito del ARRENDADOR.`);
  p(`Si las realiza sin autorización escrita, será responsable en los términos del artículo 2315 del Código Civil para el Estado de ${data.estado}, debiendo restituir el Inmueble al estado prístino o pagar la pena convencional equivalente al costo de reparación. Si las mejoras son autorizadas por escrito, quedarán en beneficio del Inmueble sin derecho a indemnización ni reembolso, debiendo ser supervisadas por un arquitecto designado por el ARRENDADOR.`);

  clause("SÉPTIMA.- MANTENIMIENTO Y REPARACIONES.", `El ARRENDATARIO es responsable de mantener la propiedad en excelentes condiciones y dar el uso correcto a las instalaciones. El ARRENDADOR no será responsable de daños o reparaciones causados por el ARRENDATARIO, sus familiares o visitantes. El ARRENDATARIO debe notificar de inmediato cualquier desperfecto para su atención oportuna, respondiendo por los daños que la omisión de aviso ocasione.`);

  clause("OCTAVA.- DE LOS DAÑOS SUFRIDOS POR EL INMUEBLE.", `En caso de daños graves o destrucción total/parcial del Inmueble por causas no imputables al ARRENDATARIO que impidan su uso, las partes acordarán dentro de los 10 días naturales siguientes si se puede rehabilitar dentro de los 3 meses posteriores. Si no es posible, se podrá terminar anticipadamente el contrato sin pago de rentas durante dicho periodo. Si los daños ocurren por negligencia imputable al ARRENDATARIO, este deberá reparar los daños de inmediato o reembolsar íntegramente los gastos incurridos por el ARRENDADOR, sin eximirse del pago de las rentas mensuales.`);

  clause("NOVENA.- LIBERACIÓN DE RESPONSABILIDAD.", `El ARRENDATARIO libera al ARRENDADOR de toda responsabilidad por daños o pérdidas en sus pertenencias ocasionados por agentes naturales, incendios, robos o caso fortuito, así como por reparaciones estructurales o de servicios generales, salvo que sean por culpa o negligencia directa del ARRENDADOR.`);

  clause("DÉCIMA.- EXTINCIÓN DE DOMINIO.", `Si por actos del ARRENDATARIO se aplicara al Inmueble la Ley de Extinción de Dominio (Federal o Local), el ARRENDATARIO se obliga a indemnizar al ARRENDADOR con el valor comercial de venta de la propiedad dentro de los 15 días naturales posteriores a la sentencia ejecutoriada, con un interés moratorio del 10% mensual sobre saldos insolutos en caso de demora.`);

  clause("DÉCIMA PRIMERA.- OBLIGACIONES GENERALES.", `El ARRENDADOR garantiza el uso y goce pacífico del inmueble. El ARRENDATARIO se obliga a: (i) conservar el inmueble en óptimas condiciones de higiene y limpieza, (ii) no realizar ni permitir actos contrarios a la ley o las buenas costumbres, (iii) entregar el inmueble en las mismas condiciones recibidas al término del contrato, (iv) no afectar la estabilidad y seguridad de la estructura, (v) dar aviso escrito en máximo 5 días sobre desperfectos estructurales, (vi) permitir el acceso al ARRENDADOR para verificación del cumplimiento, y (vii) pagar los gastos de remodelaciones o reparaciones por daños ocasionados por su cuenta.`);

  clause("DÉCIMA SEGUNDA.- SUBARRENDAMIENTO Y CESIÓN.", `El ARRENDATARIO no podrá subarrendar total o parcialmente el Inmueble, ni ceder o transferir sus derechos y obligaciones contractuales sin el consentimiento previo y por escrito del ARRENDADOR.`);

  clause("DÉCIMA TERCERA.- SERVICIOS Y REGLAMENTO.", `Los pagos de electricidad, teléfono, agua, gas y mantenimiento no estructural corresponden al ARRENDATARIO, así como contrataciones, excesos y penalizaciones. El ARRENDATARIO se obliga a acatar el Reglamento Interno de ${data.reglamentoInterno}, haciéndose responsable de las multas por incumplimiento.`);

  clause("DÉCIMA CUARTA.- INCUMPLIMIENTO DEL ARRENDADOR.", `Si el ARRENDADOR incumple sus obligaciones, tendrá 10 días naturales para subsanarlo tras ser notificado; de lo contrario, el ARRENDATARIO podrá terminar anticipadamente el contrato conforme a lo pactado.`);

  clause("DÉCIMA QUINTA.- CAUSAS DE RESCISIÓN.", `El ARRENDADOR podrá rescindir el contrato por las causas del artículo 2363 del Código Civil del Estado de ${data.estado}, o por incumplimientos no subsanados en 30 días naturales tras notificación. Serán causas inmediatas de rescisión: a) Falta de pago de renta o gastos por más de 5 días; b) Incumplimiento de términos no remediado en 10 días; c) Procedimiento de quiebra del ARRENDATARIO; d) Desocupación o abandono del inmueble; e) Almacenamiento de sustancias peligrosas o ilegales; f) Modificaciones sin autorización escrita; g) Uso de combustibles no autorizados (salvo gas natural).`);

  clause("DÉCIMA SEXTA.- ACTIVIDADES ILÍCITAS.", `Queda prohibido cualquier uso ilícito (tráfico de drogas, armas, vehículos robados, secuestro, etc.). La detección de actividades ilícitas causará la rescisión inmediata y denuncia ante las autoridades, exonerando al ARRENDADOR de responsabilidad.`);

  clause("DÉCIMA OCTAVA.- DEVOLUCIÓN DE DEPÓSITO.", `El depósito se devolverá en un plazo no mayor a 30 días posteriores a la terminación del contrato, previa verificación de la inexistencia de daños o adeudos pendientes.`);

  clause("DÉCIMA NOVENA.- TERMINACIÓN DEL CONTRATO.", `Concluido el plazo de vigencia, el ARRENDATARIO deberá desocupar el inmueble sin requerimiento previo, renunciando expresamente al artículo 2359 del Código Civil para el Estado de ${data.estado}.`);

  clause("VIGÉSIMA.- PENA CONVENCIONAL.", `En caso de terminación anticipada por parte del ARRENDATARIO, este pagará como pena convencional la totalidad de los meses de renta pendientes acordados en la Cláusula Tercera.`);

  clause("VIGÉSIMA PRIMERA.- INTERPRETACIÓN Y NULIDAD PARCIAL.", `La nulidad o inaplicabilidad de alguna cláusula no afectará la validez del resto del instrumento legal.`);

  clause("VIGÉSIMA SEGUNDA Y VIGÉSIMA SEXTA.- JURISDICCIÓN Y LEY APLICABLE.", `Para la interpretación y cumplimiento de este contrato, las partes se someten a la legislación aplicable del Estado de ${data.estado} y a la jurisdicción de los Tribunales competentes del Municipio de ${data.municipio}, ${data.estado}, renunciando a cualquier otro fuero presente o futuro.`);

  clause("VIGÉSIMA TERCERA Y VIGÉSIMA CUARTA.- CONFIDENCIALIDAD Y ACUERDO TOTAL.", `Las partes mantendrán confidencialidad sobre los datos contractuales. Este instrumento contiene el acuerdo total entre las partes y sustituye cualquier convenio verbal previo.`);

  p(`ANEXOS: Inventario de Equipamiento e Instalaciones (integrado en el presente documento) y Reglamento Interno de ${data.reglamentoInterno}.`, { bold: true, spaceBefore: 14 });

  p(`El presente documento fue firmado conforme a lo dispuesto en la Ley de Firma Electrónica Avanzada y el Código de Comercio utilizando certificados emitidos por un Prestador de Servicios de Certificación (PSC). Confiere la misma validez jurídica que una firma autógrafa.`, { spaceBefore: 20 });
  p(`${data.ciudadFirma} a ${formatFechaLarga(data.fechaFirma)}.`, { bold: true, spaceBefore: 4 });

  B.push({ type: "firma", spaceBefore: 40, arrendador: up(data.arrendador), arrendatario: up(data.arrendatario) });

  return B;
}
