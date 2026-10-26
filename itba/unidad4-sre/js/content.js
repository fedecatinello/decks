window.DECK = {
  course: "Arquitectura de Soluciones Digitales",
  unit: "Unidad 04",
  lead: "Operar lo que se diseñó: confiabilidad y plataforma",
  modules: [
    {
      id: "sre",
      unit: "Clase 01",
      title: "Site Reliability Engineering",
      blurb: "Cuánta falla es aceptable, cómo se mide y qué se hace cuando se gasta.",
      slides: [
        {
          layout: "title",
          kicker: "Unidad 04",
          title: "Site Reliability Engineering",
          sub: "Tratar la operación como un problema de software. Y decidir con números cuánta falla es aceptable.",
          notes: "Enganchá con la unidad anterior: ya sabemos empaquetar y orquestar. La pregunta ahora es otra: ¿cómo sabemos que el sistema anda bien, y qué hacemos cuando no? SRE es la respuesta de Google a esa pregunta, hoy adoptada en toda la industria."
        },
        {
          layout: "agenda",
          kicker: "Recorrido",
          title: "Medir, gastar, operar y aprender",
          items: [
            ["01", "El origen", "Por qué Dev y Ops tiran para lados opuestos."],
            ["02", "Medir", "SLI, SLO y SLA. Qué es confiable para el usuario."],
            ["03", "Gastar", "El error budget como herramienta de decisión."],
            ["04", "Operar", "Toil, observabilidad, alertas e incidentes."]
          ],
          foot: "Al final: definir el SLO del sistema de inscripción de la unidad anterior.",
          notes: "Si el tiempo aprieta, la calculadora de nueves y el error budget no se saltean: son el corazón de la clase. Release engineering y chaos se pueden contar en un minuto."
        },
        {
          layout: "statement",
          kicker: "Origen",
          title: "SRE es lo que pasa cuando le pedís a un ingeniero de software que diseñe la operación.",
          cards: [
            ["2003", "Ben Treynor Sloss arma el primer equipo de SRE en Google."],
            ["2016", "Google publica el libro. El modelo sale de la empresa."],
            ["DevOps", "Una cultura. SRE es una forma concreta de implementarla."],
            ["La regla", "Si la operación crece con el servicio, se automatiza."]
          ],
          notes: "La frase es de Treynor Sloss. Google la resume como 'class SRE implements interface DevOps': DevOps dice qué valores tener; SRE dice cómo medirlos y qué prácticas usar. No abras una guerra DevOps vs SRE: son complementarios."
        },
        {
          layout: "cards",
          kicker: "El conflicto",
          title: "Dev quiere cambiar. Ops quiere que nada cambie.",
          cards: [
            ["Desarrollo", "Le pagan por sacar features. Cada release es progreso."],
            ["Operaciones", "Le pagan por estabilidad. Cada release es un riesgo."],
            ["SRE", "Reemplaza la discusión por un número acordado: cuánta falla se tolera. Mientras haya margen, se cambia."]
          ],
          notes: "Este es el problema organizacional que SRE resuelve. Sin un número, la discusión es de poder: gana el que grita más fuerte o el que tiene más jerarquía. Con un número, la discusión es de datos."
        },
        {
          layout: "dark-cards",
          kicker: "Principio",
          title: "100% es el objetivo equivocado.",
          cards: [
            ["El usuario no lo nota", "Entre 99,99% y 100% manda su wifi, su celular y su ISP."],
            ["Cuesta exponencial", "Cada nueve extra multiplica redundancia, guardias y proceso."],
            ["Congela el producto", "Si no se tolera ninguna falla, no se puede cambiar nada."],
            ["La pregunta correcta", "¿Qué nivel de confiabilidad necesita este usuario, para esta función?"]
          ],
          notes: "Preguntá a la clase: ¿qué disponibilidad necesita el campus virtual? ¿Y el sistema de cobro de cuotas? ¿Y un marcapasos? La respuesta depende del negocio, no de la tecnología. Ese es el mensaje."
        },
        {
          layout: "table",
          kicker: "Vocabulario",
          title: "Tres siglas que se confunden siempre.",
          headers: ["", "Qué es", "Ejemplo", "Quién lo mira"],
          rows: [
            ["SLI", "Un indicador medido", "% de requests con respuesta 2xx en menos de 300 ms", "El equipo, en el dashboard"],
            ["SLO", "El objetivo interno para ese indicador", "99,9% de requests buenos en 30 días", "El equipo y el producto"],
            ["SLA", "Un contrato con consecuencias", "Si baja de 99,5% en el mes, se devuelve el 10%", "Legal, comercial y el cliente"]
          ],
          note: "El SLO es más exigente que el SLA: el margen entre los dos es lo que evita pagar la multa.",
          notes: "Muchas empresas tienen SLA y no tienen SLO. Es manejar mirando solo la multa. El orden correcto es: elegir el SLI, fijar el SLO, y solo si hay un cliente que lo exige, firmar un SLA más laxo."
        },
        {
          layout: "choices",
          kicker: "SLI",
          title: "Un SLI es una proporción: eventos buenos sobre eventos válidos.",
          choices: [
            ["Disponibilidad", "Requests que no fallan / requests totales. Lo básico de un servicio web."],
            ["Latencia", "Requests más rápidos que un umbral / requests totales. Se mide en percentiles, no en promedios."],
            ["Calidad", "Respuestas completas / respuestas totales. Una página sin recomendaciones no es un error, pero es peor."],
            ["Frescura", "Datos actualizados hace menos de X / datos totales. Para pipelines y reportes."],
            ["Durabilidad", "Datos que se pueden leer / datos escritos. Para storage."]
          ],
          notes: "Insistí con el promedio: un p50 de 100 ms puede esconder un p99 de 8 segundos. Y el SLI se mide lo más cerca posible del usuario: en el load balancer, mejor que en el proceso; en el cliente, mejor todavía si se puede."
        },
        {
          layout: "slo",
          kicker: "Los nueves",
          title: "Cada nueve que se agrega divide por diez el margen para fallar.",
          targets: [
            ["99", "Dos nueves. Siete horas al mes: alcanza para un mantenimiento con ventana y alguien que lo resuelva al otro día."],
            ["99.5", "Tres horas y media al mes. Típico de un sistema interno de back office."],
            ["99.9", "Tres nueves: 43 minutos al mes. Ya no alcanza con que alguien se entere por mail; hace falta alerta y guardia."],
            ["99.95", "21 minutos al mes. Un solo deploy malo sin rollback rápido se come el mes entero."],
            ["99.99", "Cuatro nueves: 4 minutos al mes. Ningún humano diagnostica en ese tiempo. El rollback y el failover tienen que ser automáticos."],
            ["99.999", "Cinco nueves: 26 segundos al mes. Redundancia en varias regiones, sin dependencias que no la tengan. Muy pocos sistemas lo necesitan."]
          ],
          notes: "Hacé clic de izquierda a derecha y dejá que lean. El punto: el salto entre tres y cuatro nueves no es técnico, es organizacional. Con cuatro nueves no da el tiempo de despertar a nadie. Y recordá: un servicio no puede ser más disponible que la suma de sus dependencias críticas."
        },
        {
          layout: "statement",
          kicker: "Error budget",
          title: "El error budget es 1 − SLO. Es presupuesto: está para gastarse.",
          cards: [
            ["Si sobra", "Se libera más rápido, se experimenta, se hace el cambio riesgoso."],
            ["Si se acaba", "Se frenan los features y el equipo trabaja en confiabilidad."],
            ["Quién decide", "Nadie en el momento. La política se acuerda antes del incidente."],
            ["Lo que cambia", "Dev y Ops dejan de negociar. Miran el mismo número."]
          ],
          notes: "Con un SLO de 99,9% en 30 días, el budget es 0,1%: unos 43 minutos, o 1 de cada 1.000 requests. Un budget que nunca se gasta también es una señal: el SLO es demasiado laxo o el equipo es demasiado conservador."
        },
        {
          layout: "table",
          kicker: "Política",
          title: "La política de error budget dice qué pasa antes de que pase.",
          headers: ["Budget restante", "Qué se hace", "Quién se entera"],
          rows: [
            ["Más de 50%", "Releases normales. Lugar para experimentos.", "Nadie: es el estado esperado."],
            ["Entre 25% y 50%", "Se revisan los cambios riesgosos. Se prioriza el bug de confiabilidad.", "El equipo, en la retro."],
            ["Menos de 25%", "Solo cambios chicos y con rollback probado.", "Producto y el líder técnico."],
            ["Agotado", "Freeze de features hasta recuperar. Postmortem obligatorio.", "La dirección. Es una decisión de negocio."]
          ],
          note: "Los umbrales son un ejemplo. Lo importante es que estén escritos y firmados por producto.",
          notes: "Lo central es la última columna: agotar el budget escala a quien puede decidir aceptar más riesgo. Si producto quiere seguir lanzando con el budget agotado, puede; pero lo decide explícitamente y queda registrado."
        },
        {
          layout: "cards",
          kicker: "Alertas",
          title: "Alertá sobre el ritmo de gasto, no sobre la CPU.",
          cards: [
            ["Burn rate", "Velocidad a la que se consume el budget. 1x lo agota justo al fin de la ventana."],
            ["Quemado rápido", "14,4x durante 1 hora = 2% del budget del mes. Despierta a alguien."],
            ["Quemado lento", "6x durante 6 horas = 5%. También page. 1x durante 3 días = 10%: ticket."],
            ["Ventana corta", "Cada alerta se confirma con una ventana de 5 minutos para que se apague sola al resolverse."]
          ],
          notes: "Los números son los del Site Reliability Workbook de Google. La idea fuerte: una CPU al 90% no es un problema si los usuarios no lo notan. Se alerta por síntoma, no por causa. Las causas van al dashboard, no al teléfono del que está de guardia."
        },
        {
          layout: "yaml",
          kicker: "SLO as code",
          title: "El SLO se versiona como el resto del sistema.",
          code: [
            "version: \"prometheus/v1\"",
            "service: \"inscripciones\"",
            "slos:",
            "  - name: \"requests-availability\"",
            "    objective: 99.9",
            "    description: \"Altas de inscripción respondidas sin error 5xx.\"",
            "    sli:",
            "      events:",
            "        error_query: sum(rate(http_requests_total{job=\"inscripciones\",code=~\"5..\"}[{{.window}}]))",
            "        total_query: sum(rate(http_requests_total{job=\"inscripciones\"}[{{.window}}]))",
            "    alerting:",
            "      name: InscripcionesHighErrorRate",
            "      page_alert:",
            "        labels:",
            "          severity: critical",
            "      ticket_alert:",
            "        labels:",
            "          severity: warning"
          ],
          notes: "Es el formato de Sloth, una herramienta open source que genera las reglas de Prometheus y las alertas multi-ventana a partir de esto. No es el único: OpenSLO es una especificación neutral, y los proveedores de observabilidad tienen la suya. El punto es que el SLO vive en Git y pasa por code review."
        },
        {
          layout: "statement",
          kicker: "Toil",
          title: "Toil: trabajo manual, repetitivo y automatizable, que crece con el servicio.",
          cards: [
            ["Cómo se reconoce", "No deja valor duradero. Si lo hacés diez veces, la undécima es igual."],
            ["El límite", "Google pone un techo: no más del 50% del tiempo de un SRE en operación."],
            ["Si se pasa", "El trabajo vuelve al equipo de desarrollo hasta que baje."],
            ["Lo que no es", "Ni las reuniones ni el trabajo de diseño. Eso es overhead, no toil."]
          ],
          notes: "Ejemplos: reiniciar a mano un proceso que se cuelga, crear usuarios por ticket, rotar certificados a mano. El techo del 50% es lo que protege la parte de ingeniería: sin él, el equipo de SRE se convierte en un equipo de operaciones con otro nombre."
        },
        {
          layout: "factors",
          kicker: "Observabilidad",
          title: "Tres listas cortas para saber qué medir.",
          groups: [
            ["Golden signals (Google)", ["Latencia: cuánto tarda, separando éxitos de errores.", "Tráfico: cuánta demanda hay.", "Errores: cuánto falla, explícito o no.", "Saturación: qué tan lleno está el recurso más escaso."]],
            ["RED (para servicios)", ["Rate: requests por segundo.", "Errors: requests que fallan.", "Duration: distribución de la latencia."]],
            ["USE (para recursos)", ["Utilization: % del tiempo ocupado.", "Saturation: trabajo encolado.", "Errors: fallas del dispositivo."]],
            ["Cómo se combinan", ["RED en cada servicio, USE en cada nodo, disco y cola.", "Los golden signals los cubren a los dos.", "El SLI sale de RED. La causa, casi siempre, de USE."]]
          ],
          notes: "RED es de Tom Wilkie; USE, de Brendan Gregg. No hace falta que memoricen las siglas. Lo que tiene que quedar: monitorear es elegir pocas señales que respondan '¿está roto?' y '¿por qué?'."
        },
        {
          layout: "cards",
          kicker: "Telemetría",
          title: "Métricas para saber que algo pasa. Trazas y logs para saber dónde.",
          cards: [
            ["Métricas", "Números agregados en el tiempo. Baratas, ideales para alertar y para el SLO."],
            ["Logs", "Eventos con detalle. Caros a escala; útiles cuando ya sabés qué buscar."],
            ["Trazas", "El camino de un request por todos los servicios. Muestran dónde se fue el tiempo."],
            ["OpenTelemetry", "Un estándar de la CNCF para emitir las tres, sin casarse con un proveedor."]
          ],
          notes: "La pregunta de arquitectura es: ¿la telemetría es parte del diseño o se agrega después? Si cada servicio emite con OpenTelemetry, cambiar de backend (Prometheus, Grafana, Datadog, el que sea) es configuración, no reescritura. El trace_id que viaja entre servicios es lo que permite unir un log con una traza."
        },
        {
          layout: "flow",
          kicker: "Incidentes",
          title: "Primero se mitiga. La causa raíz se busca después.",
          source: "Alerta",
          lanes: [
            ["Detectar", ["La alerta de burn rate suena", "Alguien acusa recibo"]],
            ["Organizar", ["Se nombra un Incident Commander", "Un canal, un documento"]],
            ["Mitigar", ["Rollback", "Failover", "Desviar tráfico", "Escalar"]],
            ["Aprender", ["Postmortem sin culpables", "Acciones con dueño y fecha"]]
          ],
          notes: "El error típico es diagnosticar mientras el usuario sigue sin servicio. Si hubo un deploy en la última hora, el primer movimiento es el rollback, no el debugger. Entender por qué falló viene después, con el servicio arriba."
        },
        {
          layout: "choices",
          kicker: "Roles",
          title: "En un incidente grande, nadie hace dos cosas a la vez.",
          choices: [
            ["Incident Commander", "Coordina y decide. No toca la consola. Si toca la consola, deja de coordinar."],
            ["Operations lead", "El único grupo que ejecuta cambios en producción."],
            ["Communications", "Informa a usuarios, soporte y dirección, con frecuencia fija."],
            ["Scribe", "Escribe la línea de tiempo mientras pasa. Es la materia prima del postmortem."]
          ],
          notes: "El modelo viene del Incident Command System, usado por bomberos y defensa civil. En un equipo chico, una persona puede tener dos roles, pero nunca IC y operaciones a la vez. La regla práctica: si nadie es el IC, el IC sos vos hasta que lo pases."
        },
        {
          layout: "cards",
          kicker: "Postmortem",
          title: "El postmortem busca el mecanismo, no al culpable.",
          cards: [
            ["Blameless", "Si alguien pudo romperlo con un comando, el sistema dejaba. Eso es lo que se arregla."],
            ["Qué tiene", "Impacto, línea de tiempo, causas que contribuyeron, qué salió bien y acciones."],
            ["Las acciones", "Cada una con dueño y fecha. Un postmortem sin acciones es un relato."],
            ["Se comparte", "Lo lee toda la organización. El que aprende es el sistema, no solo el equipo."]
          ],
          notes: "Si el postmortem busca culpables, la próxima vez la gente esconde información y el incidente dura más. 'Causa raíz' en singular suele ser una simplificación: casi siempre hay varias causas que se combinan. Por eso se habla de causas que contribuyeron."
        },
        {
          layout: "cards",
          kicker: "Guardia",
          title: "Una guardia que quema gente es un problema de confiabilidad.",
          cards: [
            ["Carga", "Google apunta a no más de dos incidentes por turno de 12 horas. Más que eso, no hay tiempo de hacer bien el postmortem."],
            ["Rotación", "Ocho personas para un solo sitio, o seis por sitio con dos. Menos, y la guardia llega demasiado seguido."],
            ["Runbooks", "Cada alerta que despierta a alguien tiene un documento que dice qué mirar primero."],
            ["Cada page cuenta", "Si una alerta no requería acción, es un bug de la alerta. Se arregla o se borra."]
          ],
          notes: "Los números son de los libros de Google y son una referencia, no una ley. Lo que importa: la guardia se diseña y se mide. La fatiga de alertas hace que la alerta importante se ignore."
        },
        {
          layout: "cards",
          kicker: "Releases",
          title: "La mayoría de los incidentes empieza con un cambio.",
          cards: [
            ["Canary", "La versión nueva recibe un poco de tráfico. Si el SLI empeora, se vuelve atrás sola."],
            ["Blue/green", "Dos ambientes completos. El corte es un cambio de ruta, y el rollback también."],
            ["Feature flags", "Se separa el deploy del lanzamiento. El código está, pero apagado."],
            ["Rollback probado", "Si nunca se ensayó volver atrás, no hay rollback. Hay una esperanza."]
          ],
          notes: "Conectá con el rolling update de la unidad 3: es la forma básica. Canary agrega una decisión automática basada en métricas; herramientas como Argo Rollouts o Flagger lo hacen sobre Kubernetes. El cambio de esquema en la base es lo que más suele romper el rollback."
        },
        {
          layout: "cards",
          kicker: "Antes de que falle",
          title: "Romperlo a propósito, en horario laboral.",
          cards: [
            ["Capacity planning", "Proyectar la demanda orgánica y la de eventos. Probar la carga antes del pico, no durante."],
            ["Chaos engineering", "Inyectar fallas controladas para comprobar que el sistema aguanta lo que dice el diseño."],
            ["Game days", "Ensayar un incidente con el equipo: roles, runbooks, comunicación."],
            ["DR", "Un backup que nunca se restauró no es un backup. Se ensaya la restauración."]
          ],
          notes: "Netflix popularizó la idea con Chaos Monkey, que apagaba instancias en producción. No hace falta empezar en producción: un game day en staging ya encuentra runbooks rotos y alertas que no suenan."
        },
        {
          layout: "table",
          kicker: "Medir la entrega",
          title: "DORA: velocidad y estabilidad no se oponen.",
          headers: ["Métrica", "Qué mide", "Lado"],
          rows: [
            ["Deployment frequency", "Cada cuánto llega un cambio a producción", "Velocidad"],
            ["Lead time for changes", "Del commit a producción", "Velocidad"],
            ["Change failure rate", "% de deploys que generan una falla", "Estabilidad"],
            ["Failed deployment recovery time", "Cuánto tarda en recuperarse de un deploy fallido", "Estabilidad"]
          ],
          note: "Fuente: programa DORA (hoy en Google Cloud). Los mejores equipos son buenos en las cuatro a la vez.",
          notes: "El hallazgo central de más de una década de investigación DORA: los equipos que despliegan más seguido también fallan menos y se recuperan más rápido. Despliegues chicos y frecuentes son menos riesgosos que despliegues grandes y raros. La cuarta métrica antes se llamaba time to restore service. Y advertencia: usadas para comparar equipos o para ranking individual, se corrompen."
        },
        {
          layout: "choices",
          kicker: "Modelo",
          title: "Cómo se organiza SRE depende del tamaño de la organización.",
          choices: [
            ["Embebido", "Un SRE dentro de cada equipo de producto. Mucho contexto, poca escala."],
            ["Centralizado", "Un equipo de SRE opera los servicios críticos. Escala, pero puede volverse un cuello de botella."],
            ["Consultor", "SRE asesora y enseña; el equipo de producto opera. Bueno para arrancar."],
            ["De plataforma", "SRE construye las herramientas que todos usan. Es el puente a la próxima clase."]
          ],
          notes: "No hay uno correcto. Muchas organizaciones arrancan con consultoría, embeben SREs en los servicios críticos y terminan construyendo una plataforma. Esa última evolución es Platform Engineering, la clase que sigue."
        },
        {
          layout: "choices",
          kicker: "Caso",
          title: "Día de inscripción, otra vez. Ahora hay que prometer algo.",
          choices: [
            ["El SLI", "¿Qué cuenta como un request bueno: que responda, que responda rápido o que el alta quede guardada?"],
            ["El SLO", "¿99,9% alcanza? ¿Es el mismo objetivo el día de inscripción que un martes cualquiera?"],
            ["El budget", "Si en la primera hora del día de inscripción se gastó la mitad del budget, ¿qué se hace?"],
            ["La alerta", "¿A quién despierta y con qué runbook?"],
            ["El rollback", "¿Se puede volver atrás un deploy que cambió el esquema de la base?"]
          ],
          notes: "Dejá que contesten. El SLI bueno es el alta guardada y confirmada en menos de un umbral, medida en el balanceador: que la web responda 200 no alcanza. 99,9% en 30 días son 43 minutos; si pasan todos el día de inscripción, el daño es enorme. Una opción válida es un SLO específico para la ventana del evento, o freeze de cambios esa semana. Con la mitad del budget gastada en una hora, el burn rate es altísimo: page, mitigar, y nada de deploys. El esquema se cambia en pasos compatibles hacia atrás (expand y contract) para que el rollback de la app no rompa."
        },
        {
          layout: "close",
          kicker: "Cierre",
          title: "Confiabilidad es una decisión de producto, con un número.",
          sub: "SLO para acordar, error budget para decidir, postmortem para aprender. El resto es automatizar lo que se repite.",
          notes: "Si tuviera que quedar una sola idea: el 100% no existe, y el nivel correcto se elige con el negocio. La próxima clase: cómo hacer que todos los equipos puedan operar así sin que cada uno reinvente todo."
        }
      ]
    },
    {
      id: "platform",
      unit: "Clase 02",
      title: "Platform Engineering",
      blurb: "Del modelo operativo a la tecnología: la plataforma como producto interno.",
      slides: [
        {
          layout: "title",
          kicker: "Platform Engineering",
          title: "La plataforma como producto",
          sub: "Si cada equipo opera todo, nadie diseña nada. Una plataforma convierte la operación repetida en un servicio interno.",
          notes: "Enganchá con el final de la clase anterior: SRE nos dio prácticas. Ahora la pregunta es organizacional: ¿quién construye las herramientas para que veinte equipos las apliquen sin ser expertos en todo?"
        },
        {
          layout: "agenda",
          kicker: "Recorrido",
          title: "De la organización a la tecnología",
          items: [
            ["01", "El problema", "Carga cognitiva: lo que un equipo puede sostener."],
            ["02", "Modelo operativo", "Team Topologies y la plataforma como producto."],
            ["03", "La plataforma", "Capas, golden paths, GitOps y el portal."],
            ["04", "Medir y evolucionar", "Cómo saber si la plataforma sirve."]
          ],
          foot: "Al final: diseñar la plataforma mínima para una universidad con doce equipos.",
          notes: "La mitad de la clase es organizacional a propósito. El error más común en Platform Engineering es empezar por la herramienta. Si el tiempo aprieta, recortá FinOps y el modelo de madurez."
        },
        {
          layout: "statement",
          kicker: "El problema",
          title: "'You build it, you run it' funcionó. Hasta que 'it' fue todo.",
          cards: [
            ["Infraestructura", "Cloud, red, Kubernetes, IaC."],
            ["Entrega", "CI, CD, registry, firmas, ambientes."],
            ["Operación", "Observabilidad, SLOs, guardia, backups."],
            ["Cumplimiento", "Seguridad, secretos, auditoría, costos."]
          ],
          notes: "La frase es de Werner Vogels, CTO de Amazon, en 2006. DevOps rompió la pared entre Dev y Ops, y eso fue bueno. Pero si cada equipo de producto tiene que dominar las cuatro cajas, se le va el tiempo en la plataforma y no en el producto. Y cada equipo resuelve lo mismo, distinto."
        },
        {
          layout: "table",
          kicker: "Evolución",
          title: "Cada modelo operativo resolvió el problema del anterior.",
          headers: ["Modelo", "Quién opera", "La interfaz", "El problema que deja"],
          rows: [
            ["Ops tradicional", "Un equipo de operaciones", "El ticket", "Semanas de espera. Dev no ve producción."],
            ["DevOps", "Cada equipo, todo su stack", "El equipo mismo", "Carga cognitiva. Veinte soluciones a lo mismo."],
            ["SRE", "Ingenieros de confiabilidad", "SLOs y error budget", "Escala con personas expertas, que son pocas."],
            ["Platform Engineering", "Un equipo de plataforma", "Self-service: API, portal, templates", "Hay que tratarla como un producto. Si no, vuelve el ticket."]
          ],
          note: "No se reemplazan: una organización madura usa DevOps como cultura, SRE como práctica y una plataforma como vehículo.",
          notes: "Remarcá la última fila: la plataforma no es un equipo de ops con otro nombre. La diferencia es la interfaz. Si para obtener una base de datos hay que abrir un ticket, eso es ops tradicional, aunque se llame plataforma."
        },
        {
          layout: "cards",
          kicker: "Carga cognitiva",
          title: "Un equipo tiene una capacidad limitada de entender cosas a la vez.",
          cards: [
            ["Intrínseca", "La del dominio: cómo funciona una inscripción, un cobro, una historia clínica. Esa es la que suma."],
            ["Extraña", "La del entorno: cómo se pide un certificado, qué flag lleva el pipeline. Esa es la que sobra."],
            ["Germana", "La que construye entendimiento nuevo y reutilizable. Se protege."]
          ],
          notes: "Viene de la psicología cognitiva (John Sweller) y la tomaron Skelton y Pais en Team Topologies. El objetivo de la plataforma se resume en una línea: bajar la carga extraña para que el equipo use su capacidad en el dominio."
        },
        {
          layout: "choices",
          kicker: "Team Topologies",
          title: "Cuatro tipos de equipo. Ni uno más.",
          choices: [
            ["Stream-aligned", "Alineado a un flujo de valor: un producto, un journey. Es la mayoría de los equipos."],
            ["Platform", "Ofrece servicios internos para que los stream-aligned sean autónomos."],
            ["Enabling", "Expertos que ayudan a otro equipo a adquirir una capacidad, y se van."],
            ["Complicated subsystem", "Un componente que requiere especialistas: un motor de cálculo, un modelo, un códec."]
          ],
          notes: "Libro de Matthew Skelton y Manuel Pais, 2019. Lo útil del modelo es lo que prohíbe: no hay 'equipo de DBAs' o 'equipo de QA' como silo permanente. Esas capacidades son enabling (temporal) o parte de la plataforma (como servicio)."
        },
        {
          layout: "cards",
          kicker: "Interacción",
          title: "Tres formas de trabajar entre equipos. Se eligen a propósito.",
          cards: [
            ["Collaboration", "Dos equipos trabajan juntos para descubrir algo nuevo. Intenso, y por un tiempo acotado."],
            ["X-as-a-Service", "Uno consume lo que el otro ofrece, con poca coordinación. El modo normal con la plataforma."],
            ["Facilitating", "Un equipo ayuda a otro a destrabarse o aprender. El modo de los enabling."]
          ],
          notes: "La secuencia típica de una capacidad nueva: primero collaboration entre plataforma y un equipo piloto; cuando la API se estabiliza, pasa a X-as-a-Service para todos. Si la colaboración nunca termina, el servicio no está bien definido."
        },
        {
          layout: "dark-cards",
          kicker: "Ley de Conway",
          title: "Los sistemas copian la estructura de comunicación de quien los diseña.",
          cards: [
            ["Conway, 1968", "Cuatro equipos que construyen un compilador producen un compilador de cuatro pasadas."],
            ["La consecuencia", "Si la arquitectura y la organización no coinciden, gana la organización."],
            ["Inverse Conway", "Primero se diseñan los equipos que producirán la arquitectura que se quiere."],
            ["Para la plataforma", "Su límite es el límite de un equipo. Si nadie la tiene a cargo, no hay plataforma."]
          ],
          notes: "Este es el puente entre arquitectura y modelo operativo, y es la razón por la que una materia de arquitectura habla de equipos. Un diseño de microservicios con un solo equipo gigante termina siendo un monolito distribuido."
        },
        {
          layout: "cards",
          kicker: "Producto",
          title: "La plataforma es un producto. Sus clientes son los desarrolladores.",
          cards: [
            ["Tiene un PM", "Alguien que entrevista a los equipos, prioriza y dice que no."],
            ["Es opcional", "Si es obligatoria, nadie se entera de que es mala. Tiene que ganar la adopción."],
            ["Thinnest viable", "La plataforma mínima puede ser una wiki con decisiones y un template. Se empieza ahí."],
            ["Tiene roadmap", "Y documentación, soporte y deprecaciones anunciadas. Como cualquier producto."]
          ],
          notes: "'Thinnest Viable Platform' es de Team Topologies. El antipatrón contrario: el equipo de plataforma que pasa un año construyendo algo sin usuarios y lo lanza obligatorio. Preguntá: ¿cómo sabe un equipo de plataforma que su producto es bueno? Adopción voluntaria es la mejor señal."
        },
        {
          layout: "statement",
          kicker: "Golden path",
          title: "El camino pavimentado: que lo fácil sea lo correcto.",
          cards: [
            ["Template", "Un servicio nuevo nace con repo, pipeline, Dockerfile y manifiestos."],
            ["Por defecto", "Telemetría, SLO base, escaneo de seguridad y dueño en el catálogo."],
            ["Opinado", "Una forma recomendada, bien mantenida. No todas las formas posibles."],
            ["Salida de emergencia", "Se puede salir del camino. Quien sale, se hace cargo."]
          ],
          notes: "'Golden path' es el término de Spotify; Netflix dice 'paved road'. La clave es la última tarjeta: si no hay escape, el golden path se vuelve una jaula y los equipos más capaces se van por fuera. El path se gana la adopción porque ahorra trabajo, no porque esté impuesto."
        },
        {
          layout: "explore",
          kicker: "Anatomía",
          title: "Una plataforma son capas. El desarrollador ve solo la de arriba.",
          parts: [
            ["Portal", "Backstage · Port", "La cara de la plataforma: catálogo de servicios, templates para crear uno nuevo, documentación y scorecards. No es la plataforma; es su vidriera."],
            ["Orquestación", "Crossplane · Kratix · APIs", "Traduce un pedido de alto nivel ('quiero una base Postgres chica para staging') en los recursos concretos. Es donde vive la abstracción."],
            ["Entrega", "CI · Argo CD · Flux", "Del commit a producción. CI construye y firma la imagen; un controlador GitOps lleva al cluster lo que dice Git."],
            ["Runtime", "Kubernetes · serverless", "Donde corre la aplicación. La unidad anterior: el control plane reconcilia lo declarado con lo que hay."],
            ["Observabilidad", "OpenTelemetry · Prometheus · Grafana", "Métricas, logs y trazas por defecto, con los SLOs de la clase anterior ya cableados."],
            ["Seguridad y políticas", "OPA · Kyverno · Vault", "Reglas que se evalúan automáticamente: qué imagen puede correr, qué recursos se pueden pedir, dónde están los secretos."],
            ["Infraestructura", "Terraform · OpenTofu · cloud", "Redes, clusters, cuentas y bases, declaradas como código y versionadas."]
          ],
          notes: "Hacé clic de arriba hacia abajo. Las herramientas son ejemplos de la CNCF y del mercado, no una recomendación: cada capa tiene alternativas. Lo que se diseña es la interfaz entre capas. El desarrollador debería poder trabajar solo con la de arriba, y bajar si lo necesita."
        },
        {
          layout: "cards",
          kicker: "Infraestructura como código",
          title: "Si no está en Git, no existe.",
          cards: [
            ["Declarativo", "Se describe el estado deseado. La herramienta calcula el plan para llegar."],
            ["Plan y apply", "Antes de cambiar, se ve qué va a cambiar. El plan se revisa como un pull request."],
            ["Drift", "Lo que alguien cambió a mano en la consola se detecta y se corrige."],
            ["Módulos", "La plataforma publica módulos versionados. Los equipos los usan, no los copian."]
          ],
          notes: "Terraform es el estándar de facto. En 2023 HashiCorp cambió la licencia y la comunidad hizo un fork abierto, OpenTofu, en la Linux Foundation. Pulumi usa lenguajes generales en vez de HCL. El concepto es el mismo: la infraestructura se revisa, se versiona y se puede volver a crear."
        },
        {
          layout: "flow",
          kicker: "GitOps",
          title: "Git es el estado deseado. Un controlador lo reconcilia.",
          source: "Pull request",
          lanes: [
            ["Revisar", ["Code review", "Políticas automáticas", "Plan visible"]],
            ["Mergear", ["Git registra quién, qué y cuándo"]],
            ["Reconciliar", ["Argo CD o Flux leen el repo", "Aplican la diferencia en el cluster"]],
            ["Corregir", ["Un cambio manual se revierte solo", "Rollback = revert del commit"]]
          ],
          notes: "Es el mismo loop de control de Kubernetes que vieron en la unidad 3, aplicado un nivel más arriba: el estado deseado ya no está en etcd sino en Git. Nadie hace kubectl apply a producción; el controlador corre adentro del cluster y tira (pull) los cambios. Argo CD y Flux son proyectos graduados de la CNCF."
        },
        {
          layout: "yaml",
          kicker: "GitOps",
          title: "Así se declara que una app tiene que estar en un cluster.",
          code: [
            "apiVersion: argoproj.io/v1alpha1",
            "kind: Application",
            "metadata:",
            "  name: inscripciones",
            "  namespace: argocd",
            "spec:",
            "  project: default",
            "  source:",
            "    repoURL: https://git.example.com/inscripciones/deploy.git",
            "    targetRevision: main",
            "    path: overlays/prod",
            "  destination:",
            "    server: https://kubernetes.default.svc",
            "    namespace: inscripciones",
            "  syncPolicy:",
            "    automated:",
            "      prune: true",
            "      selfHeal: true"
          ],
          notes: "Leelo en voz alta: esta app vive en este repo, en esta carpeta, y tiene que estar en este cluster y namespace. prune borra lo que ya no está en Git; selfHeal revierte un cambio manual. Ojo con prune en producción: si alguien borra la carpeta por error, el controlador borra la app."
        },
        {
          layout: "cards",
          kicker: "Seguridad",
          title: "Las reglas se evalúan solas, en cada cambio.",
          cards: [
            ["Policy as code", "OPA o Kyverno rechazan lo que no cumple: imagen sin firma, contenedor como root, sin límites."],
            ["Supply chain", "Cada imagen tiene SBOM y firma (Sigstore). SLSA define niveles de garantía del build."],
            ["Secretos", "Viven en un vault, no en el repo. External Secrets los sincroniza al cluster."],
            ["Shift left", "La regla falla en el pull request, no en producción. Lo barato es enterarse temprano."]
          ],
          notes: "El cambio de modelo: seguridad deja de ser una revisión manual al final y pasa a ser parte del golden path. El equipo de seguridad escribe políticas; la plataforma las aplica a todos por igual. Conectá con la clase anterior: el Secret de Kubernetes no es un vault."
        },
        {
          layout: "cards",
          kicker: "Portal",
          title: "El portal es la vidriera. La plataforma es lo que está atrás.",
          cards: [
            ["Catálogo", "Qué servicios existen, quién es el dueño, de qué dependen y dónde están sus docs."],
            ["Templates", "Crear un servicio nuevo en minutos, ya dentro del golden path."],
            ["TechDocs", "La documentación vive con el código y se publica sola."],
            ["Scorecards", "Qué servicios cumplen los estándares: dueño, SLO, versión soportada."]
          ],
          notes: "Backstage lo creó Spotify, lo liberó en 2020 y hoy está en la CNCF. El antipatrón más común: instalar Backstage y llamarlo plataforma. Un portal sin automatización detrás es una página linda que abre tickets. Primero la API, después el portal."
        },
        {
          layout: "cards",
          kicker: "FinOps",
          title: "El costo también es una señal de la plataforma.",
          cards: [
            ["Visibilidad", "Cada recurso tiene dueño y etiquetas. Sin eso, la factura es un número sin nombre."],
            ["Showback", "Cada equipo ve lo que gasta. Chargeback: además, lo paga de su presupuesto."],
            ["Requests correctos", "Lo que se reserva en Kubernetes y no se usa se paga igual."],
            ["Por defecto", "Los ambientes de prueba se apagan solos de noche. El golden path ahorra."]
          ],
          notes: "Conectá con requests y limits de la unidad 3: un request inflado es plata. La FinOps Foundation (Linux Foundation) define el marco. No hace falta profundizar: lo importante es que el costo se diseña en la plataforma y no se audita a fin de mes."
        },
        {
          layout: "table",
          kicker: "Medir",
          title: "Una plataforma se mide por lo que les pasa a sus usuarios.",
          headers: ["Qué medir", "Ejemplo", "Por qué"],
          rows: [
            ["Entrega (DORA)", "Lead time, frecuencia, change failure rate", "Si la plataforma no acelera la entrega, no está sirviendo."],
            ["Adopción", "% de servicios en el golden path", "Voluntaria, es la mejor señal de producto."],
            ["Onboarding", "Tiempo hasta el primer deploy de alguien nuevo", "Resume la carga cognitiva en un solo número."],
            ["Experiencia (DevEx/SPACE)", "Encuestas: flujo, feedback, carga", "Lo que las métricas de sistema no ven."],
            ["Confiabilidad", "SLOs de la propia plataforma", "Si la plataforma cae, caen todos."]
          ],
          note: "Medir actividad (commits, tickets cerrados) para comparar personas es un antipatrón documentado.",
          notes: "SPACE (2021) y DevEx (2023) son marcos que vienen de investigadores de GitHub, Microsoft y la academia. La idea común: combinar métricas del sistema con lo que dicen los desarrolladores. La última fila conecta con SRE: la plataforma es un servicio y necesita su propio SLO."
        },
        {
          layout: "table",
          kicker: "Madurez",
          title: "De la plataforma accidental a la plataforma como producto.",
          headers: ["Nivel", "Inversión", "Adopción", "Interfaz"],
          rows: [
            ["Provisional", "Voluntarios, en sus ratos libres", "Por casualidad", "Scripts y wikis"],
            ["Operational", "Un equipo dedicado", "Por mandato", "Procesos estándar, con tickets"],
            ["Scalable", "Se gestiona como producto", "Porque conviene", "Self-service"],
            ["Optimizing", "Equipos habilitadores", "Los usuarios participan", "Integrada en las herramientas de todos"]
          ],
          note: "Adaptado del Platform Engineering Maturity Model de la CNCF (2023). Simplificado: el original tiene cinco aspectos.",
          notes: "El modelo original agrega operación y medición. No hace falta llegar al último nivel: la mayoría de las organizaciones medianas están bien en 'scalable'. Preguntá a la clase en qué nivel está la organización donde trabajan."
        },
        {
          layout: "dark-cards",
          kicker: "Antipatrones",
          title: "Cuatro formas de llamar plataforma a algo que no lo es.",
          cards: [
            ["Ops con otro nombre", "Se renombró el equipo. Se sigue pidiendo todo por ticket."],
            ["Portal sin plataforma", "Un Backstage lindo. Atrás, el mismo proceso manual."],
            ["Construir todo", "Un año desarrollando lo que un servicio gestionado ya hacía."],
            ["Sin escape", "El golden path es la única forma. Los mejores equipos se van por fuera."]
          ],
          notes: "Hay un quinto, que no entra en la pantalla y es el más caro: la plataforma sin usuarios. Se diseñó en una sala, sin hablar con los equipos, y se lanzó obligatoria."
        },
        {
          layout: "cards",
          kicker: "SRE y plataforma",
          title: "SRE define qué es confiable. La plataforma hace que sea el camino por defecto.",
          cards: [
            ["SRE aporta", "SLOs, error budgets, prácticas de incidentes y guardia."],
            ["La plataforma aporta", "Que esas prácticas vengan de fábrica en cada servicio nuevo."],
            ["Juntas", "Un servicio nace con su SLO, sus alertas y su runbook, sin que nadie lo pida."]
          ],
          notes: "Cerrá el arco de la unidad: en la clase 1 un SRE definía el SLO a mano para un servicio. En una plataforma madura, el template ya trae un SLO base, las alertas de burn rate y el dashboard. El SRE pasa de operar servicios a mejorar el camino que usan todos."
        },
        {
          layout: "choices",
          kicker: "Caso",
          title: "Una universidad con doce equipos de desarrollo. Cada uno despliega distinto.",
          choices: [
            ["El problema", "¿Cuál es la carga extraña que más se repite entre los doce equipos?"],
            ["La plataforma mínima", "Si tuvieran tres meses y tres personas, ¿qué construyen primero?"],
            ["El modelo", "¿Quién es el equipo de plataforma? ¿Quién es su product manager?"],
            ["La adopción", "¿Obligatoria o voluntaria? ¿Cómo convencen al equipo que ya tiene su propio pipeline?"],
            ["La medición", "A los seis meses, ¿qué número les dice que funcionó?"]
          ],
          notes: "Dejá que discutan en grupos. Una buena respuesta: entrevistar a los equipos primero; arrancar con un golden path para el tipo de servicio más común (una API web con base de datos), con pipeline, GitOps y observabilidad por defecto; un equipo piloto en modo collaboration; adopción voluntaria, medida por porcentaje de servicios y tiempo hasta el primer deploy. El portal viene después, no primero."
        },
        {
          layout: "close",
          kicker: "Cierre",
          title: "Una plataforma no se compra. Se diseña con sus usuarios.",
          sub: "Equipos con límites claros, un camino fácil y correcto, y la operación de SRE incorporada desde el primer commit.",
          notes: "Tres ideas para cerrar la unidad: la confiabilidad se acuerda con un número; la carga cognitiva es un recurso escaso; y la plataforma es el producto que hace que lo correcto sea lo fácil. Gracias y preguntas."
        }
      ]
    }
  ]
};
