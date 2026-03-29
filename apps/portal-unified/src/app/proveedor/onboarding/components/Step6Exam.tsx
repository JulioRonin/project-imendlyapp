import React, { useState, useEffect } from 'react';
import { Button } from '@i-mendly/shared/components/Button';
import { Badge } from '@i-mendly/shared/components/Badge';
import { useOnboarding } from './OnboardingContext';

const MODS = [
  { id: 'mod-01', label: 'Valores I mendly', color: '#3DB87A', bg: 'bg-emerald-500', text: 'text-emerald-500' },
  { id: 'mod-02', label: 'Antes del servicio', color: '#0891B2', bg: 'bg-cyan-500', text: 'text-cyan-500' },
  { id: 'mod-03', label: 'Durante y después', color: '#7C3AED', bg: 'bg-violet-600', text: 'text-violet-600' },
  { id: 'mod-04', label: 'Situaciones difíciles', color: '#F59E0B', bg: 'bg-amber-500', text: 'text-amber-500' },
  { id: 'mod-05', label: 'Uso de la app', color: '#EF4444', bg: 'bg-red-500', text: 'text-red-500' },
];

const QS = [
  {id:'q01',m:'mod-01',t:'Un cliente te solicita un servicio de plomería y al revisar el trabajo encuentras que el problema es más complejo de lo indicado. El costo real sería el doble del cotizado. ¿Qué debes hacer?',o:[
    {l:'A',t:'Realizar el trabajo completo y cobrar el doble al final sin avisar — el cliente verá que era necesario.',ok:false,r:'Cobrar más de lo acordado sin consentimiento previo viola los valores de I mendly. El cliente tiene derecho a decidir antes de incurrir en costos adicionales.'},
    {l:'B',t:'Parar el trabajo, informar al cliente del hallazgo y el nuevo costo estimado, y esperar su aprobación antes de continuar.',ok:true,r:'La transparencia ante imprevistos es un valor fundamental. El cliente siempre debe aprobar cualquier costo adicional ANTES de que se realice. Usa el chat de la app para dejar registro escrito.'},
    {l:'C',t:'Hacer solo lo que cubre el presupuesto original y dejar el resto sin terminar.',ok:false,r:'Dejar un trabajo a medias sin comunicación puede causar daños adicionales y genera mala experiencia. La comunicación proactiva es siempre la solución correcta.'},
    {l:'D',t:'Terminar el trabajo y no cobrar la diferencia para mantener buena calificación.',ok:false,r:'Realizas trabajo extra sin compensación justa y sin el consentimiento informado del cliente. Lo correcto es siempre comunicar y acordar.'},
  ]},
  {id:'q02',m:'mod-01',t:'Un cliente satisfecho te pide tu número personal para contratarte directamente "para ahorrarse la comisión de I mendly". ¿Cómo respondes?',o:[
    {l:'A',t:'Le das tu número — es un buen cliente y la comisión es molesta para ambos.',ok:false,r:'Viola directamente la cláusula anti-derivación del Contrato de Proveedor. Puede resultar en baja definitiva y pérdida de pagos pendientes.'},
    {l:'B',t:'Explicas amablemente que no puedes dar tu contacto directo, pero que con gusto lo atiendes de nuevo a través de la app, donde además tiene la protección del escrow.',ok:true,r:'Rechazas la derivación con educación y resaltas el beneficio que tiene el cliente al usar la plataforma. Tu reputación en I mendly vale más que un servicio directo.'},
    {l:'C',t:'Dices que sí pero le pides que no lo comente con I mendly.',ok:false,r:'Solicitar discreción sobre una conducta prohibida agrava la infracción y puede resultar en consecuencias legales además de la baja de la plataforma.'},
    {l:'D',t:'Le das el contacto de un colega que no está en I mendly para que lo contraten directamente.',ok:false,r:'Facilitar que el cliente evite la plataforma también viola el espíritu del contrato, aunque sea a través de un tercero.'},
  ]},
  {id:'q03',m:'mod-01',t:'¿Cuál de los siguientes comportamientos puede resultar en la PÉRDIDA PERMANENTE de tu badge "Certificado I mendly"?',o:[
    {l:'A',t:'Llegar 20 minutos tarde a un servicio sin avisar.',ok:false,r:'Un retraso sin aviso es una falta, pero no causa pérdida del badge directamente. Genera una mala calificación y posiblemente una advertencia.'},
    {l:'B',t:'Recibir tres disputas resueltas en tu contra en un período de seis meses.',ok:true,r:'Tres disputas perdidas en seis meses activa la pérdida automática del badge. El sistema protege la confianza de los clientes: si consistentemente el trabajo no cumple, el badge no puede mantenerse.'},
    {l:'C',t:'No responder un mensaje del cliente durante las primeras 2 horas.',ok:false,r:'Un solo retraso en respuesta no causa pérdida del badge. El estándar de I mendly es responder en menos de 30 minutos durante un servicio activo.'},
    {l:'D',t:'Cobrar en efectivo de manera excepcional cuando la app presenta fallas técnicas.',ok:false,r:'Si la app falla, reportarlo a soporte y reprogramar es lo correcto. Cobrar fuera de la plataforma comprobadamente puede resultar en baja definitiva.'},
  ]},
  {id:'q04',m:'mod-01',t:'¿Qué certifica realmente el badge "Proveedor Certificado I mendly" ante los clientes?',o:[
    {l:'A',t:'Que I mendly garantiza que el proveedor siempre hace trabajos perfectos y sin errores.',ok:false,r:'I mendly no garantiza perfección absoluta. El badge certifica identidad, antecedentes y actitud de servicio — no la ausencia de errores.'},
    {l:'B',t:'Que el proveedor es empleado directo de I mendly.',ok:false,r:'Los proveedores son profesionales independientes. I mendly actúa como plataforma de intermediación, no como empleador.'},
    {l:'C',t:'Que el proveedor tiene identidad verificada, antecedentes limpios, portafolio revisado y fue evaluado en una entrevista de calidad.',ok:true,r:'Exactamente lo que certifica el badge: verificación en 6 pasos — identidad, antecedentes, portafolio, entrevista y examen. Eso diferencia a I mendly de cualquier directorio de servicios.'},
    {l:'D',t:'Que el proveedor tiene más de 10 años de experiencia en su oficio.',ok:false,r:'Los años de experiencia son un factor de evaluación, pero no un requisito mínimo absoluto para la certificación.'},
  ]},
  {id:'q05',m:'mod-01',t:'¿Cómo afecta tu calificación promedio tu posición en los resultados de búsqueda de I mendly?',o:[
    {l:'A',t:'No afecta — todos los proveedores aparecen en orden alfabético.',ok:false,r:'El algoritmo pondera múltiples factores: calificación promedio (40%), tasa de completados, tiempo de respuesta y antigüedad. No es orden alfabético.'},
    {l:'B',t:'Solo afecta si tienes menos de 4 estrellas.',ok:false,r:'El impacto es continuo y diferenciador en toda la escala. La diferencia entre 4.5 y 4.9 estrellas sí impacta significativamente en la visibilidad.'},
    {l:'C',t:'Una calificación más alta te posiciona más arriba en los resultados, lo que genera más solicitudes y mayores ingresos.',ok:true,r:'Correcto. La calificación tiene un peso del 40% en el ranking. Los proveedores mejor calificados aparecen primero y reciben más ingresos — el ciclo virtuoso de la excelencia.'},
    {l:'D',t:'La calificación solo importa para la renovación del badge, no para la visibilidad diaria.',ok:false,r:'La calificación afecta la visibilidad en tiempo real Y es criterio de renovación. Son dos impactos distintos del mismo factor.'},
  ]},
  {id:'q06',m:'mod-02',t:'Recibes una solicitud de instalación eléctrica y el cliente menciona que su tablero "chispeó" la semana pasada. ¿Cuál es el primer paso correcto?',o:[
    {l:'A',t:'Aceptar inmediatamente para no perder el trabajo — evaluarás el riesgo cuando llegues.',ok:false,r:'Aceptar sin entender el alcance es un error. Un tablero que "chispeó" puede indicar un problema grave de seguridad. Primero obtén más información.'},
    {l:'B',t:'Ignorar esa parte de la descripción — los clientes exageran los problemas.',ok:false,r:'Ignorar señales de alerta es falta de respeto al profesionalismo.'},
    {l:'C',t:'Usar el chat de la app para preguntar al cliente más detalles antes de aceptar, para evaluar si el trabajo está dentro de tu capacidad y cotizar correctamente.',ok:true,r:'Siempre es profesional pedir más información cuando hay complejidad técnica o riesgo. El chat deja registro oficial. Protege a ambas partes y garantiza una cotización justa.'},
    {l:'D',t:'Rechazar la solicitud — cualquier trabajo con riesgo eléctrico debe evitarse.',ok:false,r:'Rechazar sin investigar limita innecesariamente tus ingresos. Como electricista certificado, eres el profesional indicado.'},
  ]},
  {id:'q07',m:'mod-02',t:'Tienes un servicio confirmado a las 10:00 AM. A las 9:30 AM sabes que llegarás a las 10:45 AM por tráfico. ¿Qué debes hacer?',o:[
    {l:'A',t:'Llegar a las 10:45 AM y disculparte en persona — el tráfico le pasa a todos.',ok:false,r:'No avisar del retraso es una falta de respeto al tiempo del cliente.'},
    {l:'B',t:'Enviar un mensaje por el chat de la app en ese momento explicando el retraso y la hora estimada de llegada.',ok:true,r:'Avisar con anticipación, por el canal oficial, con la nueva hora estimada es exactamente el protocolo correcto. El cliente puede reorganizar su tiempo y queda registro.'},
    {l:'C',t:'Cancelar el servicio — si no puedes llegar puntual, mejor no ir.',ok:false,r:'Cancelar por un retraso de 45 minutos cuando puedes comunicarlo es una solución desproporcionada.'},
    {l:'D',t:'No hacer nada — el cliente entenderá cuando llegues.',ok:false,r:'Nunca asumas que el cliente "entenderá".'},
  ]},
  {id:'q08',m:'mod-02',t:'¿Cuál de estas acciones es parte del protocolo recomendado por I mendly ANTES de llegar al servicio?',o:[
    {l:'A',t:'Llamar al cliente por teléfono la noche anterior para confirmar.',ok:false,r:'Las comunicaciones deben hacerse a través del chat de la app, no por llamada, para mantener el registro oficial.'},
    {l:'B',t:'Enviar un mensaje por el chat de la app 30 minutos antes confirmando que estás en camino.',ok:true,r:'El protocolo I mendly establece enviar confirmación de llegada ~30 minutos antes por el chat oficial. Tranquiliza al cliente y demuestra el profesionalismo que diferencia a un proveedor 5 estrellas.'},
    {l:'C',t:'Verificar si el cliente publicó el servicio en otras plataformas para comparar precios.',ok:false,r:'Esta conducta no forma parte del protocolo y puede indicar intención de contactar al cliente fuera de la plataforma.'},
    {l:'D',t:'Esperar a que el cliente te contacte — si no lo hace, es que no necesita confirmación.',ok:false,r:'No esperes a que el cliente tome la iniciativa.'},
  ]},
  {id:'q09',m:'mod-02',t:'El cliente te envía un mensaje por el chat preguntando si puedes traer un material específico para el servicio. ¿En cuánto tiempo deberías responder?',o:[
    {l:'A',t:'24 horas — tienes un día completo de margen.',ok:false,r:'24 horas es demasiado tiempo para una consulta de un servicio activo o próximo.'},
    {l:'B',t:'Cuando termines tu trabajo actual — el cliente puede esperar.',ok:false,r:'Si estás en otro servicio, al menos envía un mensaje breve reconociendo que leíste y que responderás en X tiempo.'},
    {l:'C',t:'Máximo 30 minutos para mensajes relacionados con un servicio activo o próximo.',ok:true,r:'El estándar de I mendly es responder en máximo 30 minutos durante servicios activos o próximos. Este tiempo de respuesta rápida es uno de los factores que más impacta en las calificaciones de 5 estrellas.'},
    {l:'D',t:'No es necesario responder — si el material es necesario lo llevas, si no, no.',ok:false,r:'No responder mensajes del cliente es una falta grave al protocolo.'},
  ]},
  {id:'q10',m:'mod-02',t:'Revisas una solicitud y te das cuenta de que el trabajo supera tu nivel de conocimiento técnico. ¿Cuál es la acción más correcta?',o:[
    {l:'A',t:'Aceptar de todas formas y aprender en el camino — el cliente no sabrá la diferencia.',ok:false,r:'Aceptar trabajos fuera de tu capacidad técnica es peligroso.'},
    {l:'B',t:'Rechazar la solicitud con una explicación honesta de que ese trabajo está fuera de tu especialidad actual.',ok:true,r:'La honestidad protege al cliente y tu reputación. Un rechazo justificado y comunicado correctamente no impacta negativamente en tu historial. Es mucho mejor rechazar que generar una disputa.'},
    {l:'C',t:'Aceptar y luego subcontratar a otro profesional sin informar al cliente.',ok:false,r:'El cliente contrató TU servicio certificado. Subcontratar sin informar es un engaño.'},
    {l:'D',t:'Aceptar y cobrar el precio más alto para justificar el esfuerzo adicional.',ok:false,r:'Cobrar más por un trabajo que no dominas perjudica al cliente doblemente.'},
  ]},
  {id:'q11',m:'mod-03',t:'Al llegar para una reparación de plomería, el cliente quiere mostrarte "otros detalles" de la casa. ¿Cómo manejas esta situación?',o:[
    {l:'A',t:'Aceptar el recorrido completo y cotizar todos los trabajos extra en el momento.',ok:false,r:'La prioridad debe ser el trabajo contratado.'},
    {l:'B',t:'Agradecer y explicar que primero atenderás el trabajo contratado, y al terminar revisas los otros puntos si tienes tiempo.',ok:true,r:'Demuestra profesionalismo y gestión del tiempo. Priorizas lo acordado y mantienes la posibilidad de ampliar el alcance de forma ordenada con registro en la app si aplica.'},
    {l:'C',t:'Aceptar pero cobrar por el tiempo del recorrido.',ok:false,r:'Cobrar por un recorrido que el cliente propone de buena fe generaría una experiencia muy negativa.'},
    {l:'D',t:'Rechazar cualquier conversación adicional.',ok:false,r:'Ser inflexible y cerrado al diálogo es igualmente incorrecto.'},
  ]},
  {id:'q12',m:'mod-03',t:'Al terminar un trabajo de pintura, ¿cuál es OBLIGATORIO antes de marcar el servicio como completado en la app?',o:[
    {l:'A',t:'Marcar completado tan pronto el último trazo esté listo.',ok:false,r:'El trabajo no está verdaderamente terminado hasta que el área está limpia.'},
    {l:'B',t:'Limpiar el área de trabajo, mostrar el resultado al cliente, subir fotografías de evidencia a la app, y entonces marcar como completado.',ok:true,r:'Procedimiento completo y correcto: (1) limpiar, (2) mostrar al cliente, (3) subir fotos de evidencia, (4) marcar completado.'},
    {l:'C',t:'Pedir al cliente que firme un papel.',ok:false,r:'I mendly no utiliza firmas físicas para el cierre de servicios.'},
    {l:'D',t:'Cobrar en efectivo al cliente y luego marcar el servicio como completado.',ok:false,r:'Cobrar en efectivo viola el contrato.'},
  ]},
  {id:'q13',m:'mod-03',t:'Durante un servicio de limpieza, accidentalmente rompes un adorno del cliente. Nadie lo vio. ¿Qué haces?',o:[
    {l:'A',t:'Recoger los pedazos discretamente y no decir nada.',ok:false,r:'Ocultar un daño accidental es deshonesto.'},
    {l:'B',t:'Informar inmediatamente al cliente del accidente, disculparte y documentar el incidente en el chat de la app.',ok:true,r:'La honestidad ante accidentes es un valor crítico. Documentar en el chat protege a ambas partes y demuestra integridad.'},
    {l:'C',t:'Terminar el servicio y al final mencionarlo como algo "que ya estaba así".',ok:false,r:'Atribuir el daño a una condición preexistente cuando no es verdad es mentira.'},
    {l:'D',t:'Dejar dinero en efectivo al lado del objeto roto sin decir nada.',ok:false,r:'Evadir la conversación directa no es correcto.'},
  ]},
  {id:'q14',m:'mod-03',t:'Terminaste un trabajo de carpintería y el cliente quiere darte una propina en efectivo. ¿Puedes aceptarla?',o:[
    {l:'A',t:'No, nunca puedes aceptar dinero en efectivo — el contrato lo prohíbe absolutamente.',ok:false,r:'La prohibición aplica al Monto del Servicio acordado, no a una propina voluntaria.'},
    {l:'B',t:'Sí, una propina voluntaria del cliente es independiente del pago del servicio y puedes aceptarla con agradecimiento.',ok:true,r:'Correcto. La cláusula anti-derivación prohíbe acordar pagos alternativos al servicio. Una propina voluntaria y espontánea es diferente y no está prohibida.'},
    {l:'C',t:'Solo si es menor a $100 pesos.',ok:false,r:'No existe límite monetario en el monto de una propina voluntaria.'},
    {l:'D',t:'Sí, pero debes reportarla a I mendly para que la descuente de tu siguiente comisión.',ok:false,r:'No existe ningún mecanismo ni obligación de reportar propinas.'},
  ]},
  {id:'q15',m:'mod-03',t:'Al concluir el servicio, el cliente dice que el trabajo "quedó bien pero podría estar mejor". No abre disputa ni confirma. ¿Qué haces?',o:[
    {l:'A',t:'Esperar las 24 horas del timeout — si no abre disputa, el pago se libera solo.',ok:false,r:'No aprovechar la oportunidad de resolver la insatisfacción en ese momento es perder una calificación de 5 estrellas.'},
    {l:'B',t:'Preguntar al cliente qué específicamente podría mejorar y, si es algo rápido y dentro de lo acordado, corregirlo en ese momento.',ok:true,r:'Esta respuesta demuestra actitud de servicio genuina. Resolver en el momento convierte una experiencia de 3 estrellas en una de 5.'},
    {l:'C',t:'Decirle al cliente que si no está satisfecho debe abrir una disputa.',ok:false,r:'Invitar al cliente a abrir una disputa cuando hay una solución simple disponible es una mala práctica.'},
    {l:'D',t:'Ofrecer un descuento en el próximo servicio.',ok:false,r:'Un descuento futuro no resuelve el problema presente.'},
  ]},
  {id:'q16',m:'mod-04',t:'Un cliente abre una disputa alegando que dejaste manchas en el piso, lo cual es falso — colocaste protecciones antes de empezar. ¿Cómo respondes?',o:[
    {l:'A',t:'Responder con enojo explicando que el cliente miente y exigir que retire la disputa.',ok:false,r:'Responder con enojo es el peor abordaje posible.'},
    {l:'B',t:'Ignorar la disputa — si no tienes evidencia suficiente, no hay nada que hacer.',ok:false,r:'No responder en 24 horas resulta en que I mendly resuelva solo con la versión del cliente.'},
    {l:'C',t:'Responder de forma calmada dentro de 24 horas, describir el protocolo de protección que seguiste y adjuntar fotografías de evidencia tomadas antes y después.',ok:true,r:'Las fotografías tomadas ANTES del trabajo (protecciones colocadas) son tu mejor defensa. Responder calmado con evidencia es siempre la estrategia ganadora.'},
    {l:'D',t:'Contactar directamente al cliente por teléfono.',ok:false,r:'Una vez abierta la disputa, toda comunicación debe hacerse por el canal oficial.'},
  ]},
  {id:'q17',m:'mod-04',t:'Llegas a instalar un AC y encuentras un problema eléctrico previo que hace el trabajo inseguro. El cliente insiste en que lo hagas de todas formas. ¿Qué haces?',o:[
    {l:'A',t:'Hacer el trabajo como el cliente pide.',ok:false,r:'La seguridad no es negociable.'},
    {l:'B',t:'Negarte a realizar el trabajo mientras exista el riesgo, documentarlo en el chat de la app y sugerir al cliente resolver primero el problema eléctrico.',ok:true,r:'Tu seguridad y la del cliente son la prioridad absoluta. Documentar la situación en el chat protege a ambas partes y demuestra profesionalismo.'},
    {l:'C',t:'Hacer el trabajo rápido antes de que ocurra algo.',ok:false,r:'No existe una velocidad segura.'},
    {l:'D',t:'Pedir un precio más alto por el riesgo extra.',ok:false,r:'El riesgo no se compensa con dinero — se elimina.'},
  ]},
  {id:'q18',m:'mod-04',t:'Un cliente tiene actitud agresiva e intimidante desde el inicio del servicio. ¿Qué debes hacer?',o:[
    {l:'A',t:'Responder a la agresión con firmeza.',ok:false,r:'Escala el conflicto y puede terminar en una situación peligrosa.'},
    {l:'B',t:'Ignorar la actitud y concentrarte en terminar.',ok:false,r:'Si la situación es de intimidación activa, terminar rápido sin reportarlo puede exponerte a más riesgos.'},
    {l:'C',t:'Si sientes que tu seguridad está en riesgo, detener el trabajo, salir del domicilio de manera calmada y reportar la situación a I mendly a través del chat de la app.',ok:true,r:'Tu seguridad personal es la prioridad absoluta. Tienes derecho a retirarte. Reporta de inmediato y el equipo de I mendly intervendrá.'},
    {l:'D',t:'Llamar pruebas o testigos.',ok:false,r:'Llevar personas no autorizadas al domicilio viola la privacidad.'},
  ]},
  {id:'q19',m:'mod-04',t:'El cliente alega que la fumigación no funcionó porque vio una cucaracha tres días después. ¿Cuál es la respuesta más profesional?',o:[
    {l:'A',t:'Argumentar que una cucaracha no prueba falla.',ok:false,r:'Desestimar la preocupación sin escuchar es mala práctica.'},
    {l:'B',t:'Escuchar la situación, explicar los tiempos normales de efecto del producto y ofrecer una revisión si aplica en garantía.',ok:true,r:'Demuestra profesionalismo técnico y actitud de servicio. Explicar tiempos y ofrecer garantía diferencia a un proveedor de 5 estrellas.'},
    {l:'C',t:'Solicitar disputa.',ok:false,r:'Derivar a disputa algo evitable es ineficiente.'},
    {l:'D',t:'Ofrecer repetir el servicio gratis.',ok:false,r:'No ofrecer garantías ciegamente sin evaluar.'},
  ]},
  {id:'q20',m:'mod-04',t:'Descubres que otro proveedor certificado I mendly en tu zona está acordando trabajos directamente con clientes de la plataforma. ¿Qué debes hacer?',o:[
    {l:'A',t:'No hacer nada.',ok:false,r:'La derivación daña la plataforma de la que dependes.'},
    {l:'B',t:'Hacer lo mismo.',ok:false,r:'La infracción se castiga con baja definitiva.'},
    {l:'C',t:'Reportarlo al equipo de I mendly a través de canales oficiales.',ok:true,r:'Reportar conductas que violan el contrato protege la plataforma. Tu reporte puede ser anónimo.'},
    {l:'D',t:'Confrontar al proveedor.',ok:false,r:'Confrontaciones generan conflicto, escalar a soporte es la solución profesional.'},
  ]},
  {id:'q21',m:'mod-05',t:'¿En qué momento exacto se libera el pago del escrow al proveedor?',o:[
    {l:'A',t:'Inmediatamente al marcar como completado.',ok:false,r:'Marcar completado inicia el período de validación.'},
    {l:'B',t:'Cuando el cliente confirma su satisfacción en la app, O automáticamente si transcurren 24 horas sin respuesta.',ok:true,r:'Mecanismos de liberación: confirmación cliente y timeout 24hrs.'},
    {l:'C',t:'Todos los viernes.',ok:false,r:'Los flujos de escrow son independientes por orden.'},
    {l:'D',t:'Al calificar 4 o más estrellas.',ok:false,r:'Liberación y calificación son procesos separados.'},
  ]},
  {id:'q22',m:'mod-05',t:'¿Qué documentos necesitas mantener vigentes para conservar tu badge de certificación activo?',o:[
    {l:'A',t:'Solo el INE vigente.',ok:false,r:'Antecedentes también se vencen.'},
    {l:'B',t:'INE vigente + antecedentes no penales vigentes (no mayor a 3 meses al renovar).',ok:true,r:'Ambos documentos obligatorios para renovar y se piden actualizados.'},
    {l:'C',t:'No necesitas vigentes después del registro.',ok:false,r:'La verificación requiere actualizar periódicamente.'},
    {l:'D',t:'Todo certificado técnico vigente obligatoriamente.',ok:false,r:'Certificados técnicos suman puntaje extra pero no condicionan obligatoriamente.'},
  ]},
  {id:'q23',m:'mod-05',t:'Un cliente te califica con 2 estrellas sin dejar comentario después de un servicio que consideras que hiciste bien. ¿Cuál es la acción correcta?',o:[
    {l:'A',t:'Contactar al cliente directamente para pedirle que cambie la calificación.',ok:false,r:'Presionar para cambiar calificaciones está prohibido.'},
    {l:'B',t:'Aceptar la calificación, reflexionar, y enfocarte en mantener un promedio alto en futuros servicios.',ok:true,r:'Una baja calificación aislada no afecta gravemente si las demás son buenas. Resistencia y optimización son clave.'},
    {l:'C',t:'Reportar a soporte como injusta para eliminación.',ok:false,r:'Solo se borran por insultos o falsedad probada explícita.'},
    {l:'D',t:'Calificar con 1 estrella en represalia.',ok:false,r:'Sistemas antirrepresalias detectan esto y te penalizan.'},
  ]},
  {id:'q24',m:'mod-05',t:'¿Cuántas cancelaciones injustificadas puedes acumular antes de recibir una suspensión temporal de 30 días?',o:[
    {l:'A',t:'Cinco.',ok:false,r:'Esa es baja definitiva.'},
    {l:'B',t:'Diez.',ok:false,r:'Demasiadas.'},
    {l:'C',t:'Tres cancelaciones injustificadas resultan en suspensión temporal de 30 días.',ok:true,r:'Escala: (1) advertencia, (2) reducción 7 días, (3) 30 días.'},
    {l:'D',t:'No hay límite.',ok:false,r:'Falso. Existen límites estrictos.'},
  ]},
  {id:'q25',m:'mod-05',t:'Tu badge tiene vigencia de 6 meses. Si no completas el proceso de renovación en el plazo establecido, ¿qué ocurre?',o:[
    {l:'A',t:'Renueva automáticamente si tienes buenas calificaciones.',ok:false,r:'Nunca se renueva solo, requiere trámite activo.'},
    {l:'B',t:'El badge se suspende hasta que completes el proceso, perdiendo visibilidad.',ok:true,r:'Se inhabilita el estatus certificado hasta cumplir los requisitos, desplazándote de ranking preferencial.'},
    {l:'C',t:'Cuenta eliminada para siempre.',ok:false,r:'No te dan de baja, te quitan el badge temporalmente.'},
    {l:'D',t:'Tienes gracia de 6 meses más.',ok:false,r:'La plataforma avisa antes pero vencido, se congela la certificación.'},
  ]},
];

type ScreenState = 'cover' | 'exam' | 'results';

export const Step6Exam: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { data, updateData } = useOnboarding();
  const [screen, setScreen] = useState<ScreenState>('cover');
  const [cur, setCur] = useState(0);
  const [secsLeft, setSecsLeft] = useState(2400);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isExamActive, setIsExamActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExamActive && secsLeft > 0) {
      interval = setInterval(() => {
        setSecsLeft((prev) => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamActive]);

  const handleStart = () => {
    setScreen('exam');
    setIsExamActive(true);
  };

  const handleFinish = () => {
    setIsExamActive(false);
    setScreen('results');
    
    // Calculate results and save to context
    const scoreVal = Object.entries(answers).reduce((acc, [qid, sel]) => {
      const q = QS.find(q => q.id === qid);
      const o = q?.o.find(x => x.l === sel);
      return acc + (o?.ok ? 1 : 0);
    }, 0);
    const pctVal = Math.round((scoreVal / QS.length) * 100);
    const passedVal = pctVal >= 80;

    updateData({ 
      exam: { 
        score: pctVal, 
        passed: passedVal, 
        completed_at: new Date().toISOString() 
      } 
    });
  };

  const pick = (optLetter: string) => {
    if (answers[QS[cur].id]) return;
    setAnswers({ ...answers, [QS[cur].id]: optLetter });
  };

  const currentQ = QS[cur];
  const modInfo = MODS.find(m => m.id === currentQ.m)!;
  const hasAnswered = !!answers[currentQ.id];
  const selectedObj = currentQ.o.find(o => o.l === answers[currentQ.id]);

  const correctAnswers = Object.entries(answers).reduce((acc, [qid, sel]) => {
    const q = QS.find(q => q.id === qid);
    const o = q?.o.find(x => x.l === sel);
    return acc + (o?.ok ? 1 : 0);
  }, 0);

  const pct = Math.round((correctAnswers / QS.length) * 100);
  const passed = pct >= 80;

  return (
    <div className="w-full">
      {screen === 'cover' && (
        <div className="p-10 bg-white/5 rounded-[2rem] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-700">
           <Badge variant="default" className="text-[10px] uppercase font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-6">Certificación Oficial</Badge>
           <h2 className="text-4xl font-black mb-3 text-white tracking-tight">Examen de<br/><span className="text-emerald-500">Certificación</span></h2>
           <p className="text-white/60 text-sm mb-8">Demuestra que dominas los valores, protocolos y estándares de calidad que hacen de I mendly la plataforma de confianza para servicios del hogar.</p>
           
           <div className="grid grid-cols-3 gap-3 mb-8">
             <div className="bg-brand-night p-4 rounded-xl text-center border border-white/5">
                <p className="text-2xl font-black text-white">{QS.length}</p>
                <p className="text-[10px] text-white/40 uppercase font-black">Preguntas</p>
             </div>
             <div className="bg-brand-night p-4 rounded-xl text-center border border-white/5">
                <p className="text-2xl font-black text-white">80%</p>
                <p className="text-[10px] text-white/40 uppercase font-black">Aprobar</p>
             </div>
             <div className="bg-brand-night p-4 rounded-xl text-center border border-white/5">
                <p className="text-2xl font-black text-white">40m</p>
                <p className="text-[10px] text-white/40 uppercase font-black">Tiempo</p>
             </div>
           </div>

           <div className="flex gap-4">
             <Button variant="ghost" className="flex-1 text-white/40 hover:text-white" onClick={onBack}>
               Atrás
             </Button>
             <Button variant="primary" className="flex-[2] bg-emerald-600 hover:bg-emerald-500 border-none" onClick={handleStart}>
               Comenzar el examen
             </Button>
           </div>
        </div>
      )}

      {screen === 'exam' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${modInfo.bg}`}></div>
                 <span className={`text-xs font-black uppercase tracking-widest ${modInfo.text}`}>{modInfo.label}</span>
              </div>
              <div className={`px-4 py-1.5 rounded-full border text-xs font-black font-mono tracking-wider ${secsLeft < 300 ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-white/10 text-white/60 bg-brand-night'}`}>
                 {Math.floor(secsLeft / 60)}:{(secsLeft % 60).toString().padStart(2, '0')}
              </div>
           </div>

           <div className="h-2 w-full bg-white/5 rounded-full mb-8 overflow-hidden">
             <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(cur / QS.length) * 100}%` }}></div>
           </div>

           <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 mb-6">
             <p className="text-sm text-white/40 font-black uppercase tracking-widest mb-4">Pregunta {cur + 1} de {QS.length}</p>
             <h3 className="text-lg font-medium text-white mb-8 leading-relaxed">{currentQ.t}</h3>
             
             <div className="space-y-3">
               {currentQ.o.map((o) => {
                 const isSel = answers[currentQ.id] === o.l;
                 let stClass = "bg-[#1F1F1F] border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer text-white/80";
                 if (hasAnswered) {
                   stClass = "bg-[#1F1F1F] border-white/5 opacity-50 cursor-default text-white/60";
                   if (isSel && o.ok) stClass = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                   if (isSel && !o.ok) stClass = "bg-red-500/10 border-red-500 text-red-400";
                   if (!isSel && o.ok) stClass = "bg-emerald-500/5 border-emerald-500/50 text-emerald-400";
                 }

                 return (
                   <div key={o.l} onClick={() => pick(o.l)} className={`p-4 rounded-2xl border flex gap-4 transition-all ${stClass}`}>
                     <div className={`w-6 h-6 shrink-0 rounded-full border text-[10px] font-black flex items-center justify-center
                        ${hasAnswered ? (isSel ? (o.ok ? 'bg-emerald-500 border-emerald-500 text-brand-night' : 'bg-red-500 border-red-500 text-white') : (o.ok ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'border-white/10')) : 'border-white/20'}`}>
                       {o.l}
                     </div>
                     <span className="text-sm font-medium pt-0.5">{o.t}</span>
                   </div>
                 );
               })}
             </div>
           </div>

           {hasAnswered && selectedObj && (
             <div className={`p-5 rounded-2xl mb-6 text-sm font-medium ${selectedObj.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
               <p className="font-black uppercase tracking-widest mb-1 text-[10px] opacity-80">{selectedObj.ok ? 'Correcto' : 'Incorrecto'}</p>
               {selectedObj.r}
             </div>
           )}

           <div className="flex gap-4">
             <Button variant="ghost" className="flex-1 text-white/40 border border-white/5" onClick={() => { if(cur > 0) setCur(cur - 1); }} disabled={cur === 0}>
               Anterior
             </Button>
             <Button variant="primary" className="flex-[2] bg-white text-brand-night" onClick={() => { if(cur === QS.length - 1) handleFinish(); else setCur(cur + 1); }}>
               {cur === QS.length - 1 ? 'Finalizar Examen' : 'Siguiente'}
             </Button>
           </div>
        </div>
      )}

      {screen === 'results' && (
        <div className="animate-in zoom-in-95 duration-700 text-center">
           <div className={`w-32 h-32 mx-auto rounded-[2.5rem] flex items-center justify-center border-4 mb-8 shadow-2xl ${passed ? 'border-emerald-500 bg-emerald-500/10 shadow-emerald-500/20' : 'border-red-500 bg-red-500/10 shadow-red-500/20'}`}>
              <div className="text-center">
                 <p className={`text-4xl font-black ${passed ? 'text-emerald-400' : 'text-red-400'} tracking-tighter`}>{pct}%</p>
                 <p className="text-[9px] uppercase font-black text-white/40 tracking-widest">Puntaje</p>
              </div>
           </div>

           <h3 className="text-3xl font-black text-white mb-2">{passed ? '¡Aprobado!' : 'No aprobado'}</h3>
           <p className="text-white/50 text-sm font-medium mb-10">{passed ? `Obtuviste ${correctAnswers} de 25 respuestas correctas.` : 'Necesitas un 80% para aprobar.'}</p>

           <Button variant="primary" className="w-full mb-4 shadow-xl shadow-primary/20" onClick={() => passed ? onNext() : handleStart()}>
             {passed ? 'Continuar' : 'Reintentar Examen'}
           </Button>
        </div>
      )}
    </div>
  );
};
