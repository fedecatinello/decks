window.DECK = {
  course: "Arquitectura de Soluciones Digitales",
  unit: "Unidad 04",
  lead: "Operar lo que se diseñó: SRE y Platform Engineering",
  modules: [
    {
      id: "unidad4",
      unit: "Unidad 04",
      title: "SRE y Platform Engineering",
      blurb: "De un número que define la confiabilidad a una plataforma que hace que cumplirlo sea lo fácil.",
      blocks: ["El problema", "Confiabilidad como número", "Ver lo que pasa", "Cuando falla", "Equipos", "La plataforma", "Cambiar sin romper", "Medir e industria"],
      slides: [
        // ---------------------------------------------------------------- 0 · Apertura
        {
          layout: "title",
          kicker: "Unidad 04",
          title: "Operar lo que se diseñó",
          sub: "Mantener el sistema andando, cambiarlo sin romperlo, y lograr que muchos equipos puedan hacer las dos cosas.",
          notes: "Enganchá con la unidad 3: ya sabemos empaquetar y orquestar. Ahora hay dos preguntas. Una técnica: ¿cómo sabemos que anda bien y qué hacemos cuando no? Otra organizacional: ¿cómo hacen veinte equipos para lograrlo sin que cada uno reinvente todo? SRE responde la primera; Platform Engineering, la segunda."
        },
        {
          layout: "agenda",
          kicker: "Recorrido",
          title: "De un número a una plataforma",
          items: [
            ["01", "El problema", "Dev quiere cambiar, Ops quiere estabilidad, y nadie da abasto."],
            ["02", "Confiabilidad como número", "SLI, SLO y error budget."],
            ["03", "Ver y responder", "Observabilidad, incidentes y postmortems."],
            ["04", "Equipos", "Spotify, Team Topologies y la ley de Conway."],
            ["05", "La plataforma", "Golden paths, capas y GitOps."],
            ["06", "Medir", "DORA, adopción y quién lo hace en la industria."]
          ],
          foot: "Al final: la universidad del día de inscripción, otra vez.",
          notes: "Si el tiempo aprieta, la calculadora de nueves, el error budget y Team Topologies no se saltean. Si la unidad se da en dos encuentros, el corte natural es después del caso de la primera parte (pantalla 24)."
        },

        // ---------------------------------------------------------------- 1 · El problema
        {
          layout: "cards",
          kicker: "El conflicto",
          title: "Dev quiere cambiar. Ops quiere que nada cambie.",
          cards: [
            ["Desarrollo", "Le pagan por sacar features. Cada release es progreso."],
            ["Operaciones", "Le pagan por estabilidad. Cada release es un riesgo."],
            ["Sin un acuerdo", "La discusión es de poder. Gana el que grita más fuerte o el que tiene más jerarquía."]
          ],
          notes: "Este es el problema organizacional que atraviesa toda la unidad. SRE lo va a resolver con un número; Platform Engineering, con un camino compartido. Volvemos a este conflicto en el error budget."
        },
        {
          layout: "photo",
          kicker: "Origen",
          image: "img/google-dc.jpg",
          alt: "Datacenter de Google en Council Bluffs, Iowa, visto desde el aire al atardecer",
          credit: "Google, Council Bluffs · Chad Davis · CC BY 2.0",
          title: "Miles de máquinas y un equipo chico. La única salida era escribir software.",
          sub: "SRE es lo que pasa cuando le pedís a un ingeniero de software que diseñe la operación.",
          notes: "La frase es de Ben Treynor Sloss, que armó el primer equipo de SRE en Google en 2003. En 2016 Google publicó el libro y el modelo salió de la empresa. Google lo resume como 'class SRE implements interface DevOps': DevOps dice qué valores tener; SRE dice cómo medirlos. Si la operación crece al ritmo del servicio, no hay forma de contratar gente al ritmo de las máquinas."
        },
        {
          layout: "chart",
          kicker: "Toil",
          title: "Toil: trabajo manual y repetitivo que crece con el servicio.",
          chart: {
            x: ["1", "", "3", "", "5", "", "7", "", "9", "10"],
            xLabel: "servicios operados",
            yMax: 40,
            yFormat: "{} h",
            aria: "Horas semanales de operación: la manual crece en línea recta, la automatizada arranca más alta y se aplana",
            series: [
              { name: "Manual", tone: "red", data: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40] },
              { name: "Automatizada", tone: "blue", data: [9, 10, 10.5, 11, 11.3, 11.6, 12, 12.2, 12.4, 12.6] }
            ],
            marks: [[20, "techo 50%"]]
          },
          points: [
            ["Cómo se reconoce", "Manual, repetitivo, automatizable, sin valor duradero."],
            ["El límite", "Google pone un techo: no más del 50% del tiempo en operación."],
            ["Si se pasa", "El trabajo vuelve al equipo de desarrollo hasta que baje."]
          ],
          notes: "El gráfico es ilustrativo: la operación manual crece linealmente con cada servicio; la automatizada cuesta más al principio y después casi no crece. Ejemplos de toil: reiniciar a mano un proceso que se cuelga, crear usuarios por ticket, rotar certificados a mano. Reuniones y diseño no son toil: son overhead. El techo del 50% protege la parte de ingeniería; sin él, SRE es un equipo de operaciones con otro nombre."
        },
        {
          layout: "load",
          kicker: "Carga cognitiva",
          title: "'You build it, you run it' funcionó. Hasta que 'it' fue todo.",
          boxes: [
            ["Infraestructura", "Cloud, red, Kubernetes, IaC."],
            ["Entrega", "CI, CD, registry, firmas, ambientes."],
            ["Operación", "Observabilidad, SLOs, guardia, backups."],
            ["Cumplimiento", "Seguridad, secretos, auditoría, costos."]
          ],
          types: [
            ["Intrínseca", "La del dominio: inscripciones, cobros, historias clínicas. Es la que suma.", "is-intr", 50],
            ["Extraña", "La del entorno: cómo se pide un certificado, qué flag lleva el pipeline. Es la que sobra.", "is-extra", 85],
            ["Germana", "La que construye entendimiento reutilizable. Se protege.", "is-germane", 30]
          ],
          notes: "La frase es de Werner Vogels (Amazon, 2006). DevOps rompió la pared entre Dev y Ops, y eso fue bueno. Pero si cada equipo domina las cuatro cajas, se le va el tiempo en la plataforma y no en el producto. Los tipos de carga vienen de John Sweller y los tomaron Skelton y Pais en Team Topologies. El objetivo de todo lo que sigue cabe en una línea: bajar la carga extraña (la barra roja)."
        },
        {
          layout: "table",
          kicker: "Evolución",
          title: "Cada modelo operativo resolvió el problema del anterior.",
          headers: ["Modelo", "Quién opera", "La interfaz", "El problema que deja"],
          rows: [
            ["Ops tradicional", "Un equipo de operaciones", "El ticket", "Semanas de espera. Dev no ve producción."],
            ["DevOps", "Cada equipo, todo su stack", "El equipo mismo", "Carga cognitiva. Veinte soluciones a lo mismo."],
            ["SRE", "Ingenieros de confiabilidad", "SLOs y error budget", "Escala con expertos, que son pocos."],
            ["Platform Engineering", "Un equipo de plataforma", "Self-service: API, portal, templates", "Hay que tratarla como producto. Si no, vuelve el ticket."]
          ],
          note: "No se reemplazan: DevOps como cultura, SRE como práctica y la plataforma como vehículo.",
          notes: "Esta tabla es el mapa de la unidad: los próximos bloques recorren las dos últimas filas. Remarcá la última: si para obtener una base hay que abrir un ticket, eso es ops tradicional, aunque se llame plataforma."
        },

        // ---------------------------------------------------------------- 2 · Confiabilidad como número
        {
          layout: "chart",
          dark: true,
          kicker: "Principio",
          title: "100% es el objetivo equivocado.",
          chart: {
            x: ["99%", "99,9%", "99,99%", "99,999%"],
            xLabel: "disponibilidad objetivo",
            yMax: 100,
            yFormat: "{}x",
            aria: "Costo relativo según la disponibilidad: crece de forma exponencial con cada nueve",
            series: [{ name: "Costo", tone: "blue", data: [1, 6, 28, 100] }]
          },
          points: [
            ["El usuario no lo nota", "Entre 99,99% y 100% mandan su wifi, su celular y su proveedor."],
            ["Congela el producto", "Si no se tolera ninguna falla, no se puede cambiar nada."],
            ["La pregunta correcta", "¿Qué confiabilidad necesita este usuario, para esta función?"]
          ],
          notes: "La curva es ilustrativa: cada nueve multiplica redundancia, guardias y proceso. Preguntá a la clase: ¿qué disponibilidad necesita el campus virtual? ¿El cobro de cuotas? ¿Un marcapasos? La respuesta depende del negocio, no de la tecnología."
        },
        {
          layout: "table",
          kicker: "Vocabulario",
          title: "Tres siglas que se confunden siempre.",
          headers: ["", "Qué es", "Ejemplo", "Quién lo mira"],
          rows: [
            ["SLI", "Un indicador medido", "% de requests 2xx en menos de 300 ms", "El equipo, en el dashboard"],
            ["SLO", "El objetivo interno para ese indicador", "99,9% de requests buenos en 30 días", "El equipo y producto"],
            ["SLA", "Un contrato con consecuencias", "Si baja de 99,5% en el mes, se devuelve el 10%", "Legal, comercial y el cliente"]
          ],
          note: "El SLO es más exigente que el SLA: el margen entre los dos es lo que evita pagar la multa.",
          notes: "Muchas empresas tienen SLA y no tienen SLO: manejan mirando solo la multa. El orden correcto es elegir el SLI, fijar el SLO y, solo si un cliente lo exige, firmar un SLA más laxo."
        },
        {
          layout: "fraction",
          kicker: "SLI",
          title: "Un SLI es una proporción.",
          top: "eventos buenos",
          bottom: "eventos válidos",
          choices: [
            ["Disponibilidad", "Requests que no fallan."],
            ["Latencia", "Requests más rápidos que un umbral. En percentiles, no promedios."],
            ["Calidad", "Respuestas completas, no degradadas."],
            ["Frescura", "Datos actualizados hace menos de X."],
            ["Durabilidad", "Datos que se pueden leer, de los escritos."]
          ],
          notes: "Siempre la misma forma: buenos sobre válidos. Insistí con el promedio: un p50 de 100 ms puede esconder un p99 de 8 segundos. Y el SLI se mide lo más cerca posible del usuario: en el balanceador, mejor que en el proceso."
        },
        {
          layout: "slo",
          kicker: "Los nueves",
          title: "Cada nueve que se agrega divide por diez el margen para fallar.",
          targets: [
            ["99", "Dos nueves. Siete horas al mes: alcanza con un mantenimiento con ventana y alguien que lo resuelva al otro día."],
            ["99.5", "Tres horas y media al mes. Típico de un sistema interno de back office."],
            ["99.9", "Tres nueves: 43 minutos al mes. Ya no alcanza con enterarse por mail: hace falta alerta y guardia."],
            ["99.95", "21 minutos al mes. Un solo deploy malo sin rollback rápido se come el mes entero."],
            ["99.99", "Cuatro nueves: 4 minutos al mes. Ningún humano diagnostica en ese tiempo: rollback y failover automáticos."],
            ["99.999", "Cinco nueves: 26 segundos al mes. Varias regiones, sin dependencias que no lo tengan. Muy pocos sistemas lo necesitan."]
          ],
          notes: "Hacé clic de izquierda a derecha y dejá que lean. El salto entre tres y cuatro nueves no es técnico, es organizacional: con cuatro nueves no da el tiempo de despertar a nadie. Un servicio no puede ser más disponible que sus dependencias críticas."
        },
        {
          layout: "budget",
          kicker: "Error budget",
          title: "El error budget es 1 − SLO. Está para gastarse.",
          good: "99,9% de los requests: buenos",
          zoom: "0,1% = 43 min al mes · el budget",
          cards: [
            ["Si sobra", "Se libera más rápido, se experimenta, se hace el cambio riesgoso."],
            ["Si se acaba", "Se frenan los features y el equipo trabaja en confiabilidad."],
            ["Quién decide", "Nadie en el momento. La política se acuerda antes del incidente."],
            ["Lo que cambia", "Dev y Ops miran el mismo número. Se terminó el conflicto del principio."]
          ],
          notes: "Con 99,9% en 30 días, el budget es 0,1%: unos 43 minutos, o 1 de cada 1.000 requests. Cerrá explícitamente el conflicto Dev/Ops de la pantalla 3: ya no se discute por poder, se mira el budget. Un budget que nunca se gasta también es una señal: el SLO es laxo o el equipo, demasiado conservador."
        },
        {
          layout: "table",
          dots: true,
          kicker: "Política",
          title: "La política dice qué pasa antes de que pase.",
          headers: ["Budget restante", "Qué se hace", "Quién se entera"],
          rows: [
            ["Más de 50%", "Releases normales. Lugar para experimentos.", "Nadie: es el estado esperado."],
            ["Entre 25% y 50%", "Se revisan los cambios riesgosos. Se prioriza el bug de confiabilidad.", "El equipo, en la retro."],
            ["Menos de 25%", "Solo cambios chicos y con rollback probado.", "Producto y el líder técnico."],
            ["Agotado", "Freeze de features hasta recuperar. Postmortem obligatorio.", "La dirección. Es una decisión de negocio."]
          ],
          note: "Los umbrales son un ejemplo. Lo importante es que estén escritos y firmados por producto.",
          notes: "Lo central es la última columna: agotar el budget escala a quien puede decidir aceptar más riesgo. Producto puede seguir lanzando con el budget agotado, pero lo decide explícitamente y queda registrado."
        },
        {
          layout: "chart",
          kicker: "Alertas",
          title: "Alertá sobre el ritmo de gasto, no sobre la CPU.",
          chart: {
            x: ["0", "", "", "", "", "5", "", "", "", "", "10", "", "", "", "", "15", "", "", "", "", "20", "", "", "", "", "25", "", "", "", "", "30"],
            xLabel: "días de la ventana",
            yMax: 100,
            yFormat: "{}%",
            legend: true,
            aria: "Budget restante según el burn rate: a 1x llega a cero el día 30, a 6x el día 5 y a 14,4x en dos días",
            series: [
              { name: "1x · normal", tone: "ink", data: [100, 96.7, 93.3, 90, 86.7, 83.3, 80, 76.7, 73.3, 70, 66.7, 63.3, 60, 56.7, 53.3, 50, 46.7, 43.3, 40, 36.7, 33.3, 30, 26.7, 23.3, 20, 16.7, 13.3, 10, 6.7, 3.3, 0] },
              { name: "6x · page", tone: "orange", data: [100, 80, 60, 40, 20, 0, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] },
              { name: "14,4x · page ya", tone: "red", data: [100, 52, 4, 0, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null] }
            ]
          },
          points: [
            ["Burn rate", "Velocidad de gasto. 1x agota el budget justo al final de la ventana."],
            ["Quemado rápido", "14,4x durante 1 hora = 2% del budget. Despierta a alguien."],
            ["Quemado lento", "6x durante 6 horas = 5%: page. 1x durante 3 días = 10%: ticket."]
          ],
          notes: "Números del Site Reliability Workbook de Google. Cada alerta se confirma con una ventana corta de 5 minutos para que se apague sola al resolverse. Se alerta por síntoma, no por causa: una CPU al 90% no es un problema si los usuarios no lo notan. Las causas van al dashboard, no al teléfono del que está de guardia."
        },
        {
          layout: "codeshot",
          kicker: "SLO as code",
          title: "El SLO se versiona, y el dashboard sale solo.",
          code: [
            "version: \"prometheus/v1\"",
            "service: \"inscripciones\"",
            "slos:",
            "  - name: \"altas-disponibilidad\"",
            "    objective: 99.9",
            "    sli:",
            "      events:",
            "        error_query: sum(rate(",
            "          http_requests_total{code=~\"5..\"}[{{.window}}]))",
            "        total_query: sum(rate(",
            "          http_requests_total[{{.window}}]))",
            "    alerting:",
            "      name: InscripcionesErrorBudget",
            "      page_alert:",
            "        labels: { severity: critical }",
            "      ticket_alert:",
            "        labels: { severity: warning }"
          ],
          image: "img/sloth-dashboard.png",
          alt: "Dashboard de Grafana generado por Sloth con objetivo, budget restante y burn rate",
          credit: "Sloth · dashboard de ejemplo · Apache 2.0",
          points: [
            ["Objetivo:", "el SLO acordado."],
            ["Budget restante:", "el número que mira producto."],
            ["Burn rate:", "el que dispara la alerta."]
          ],
          notes: "Formato de Sloth, open source: a partir de ese archivo genera las reglas de Prometheus, las alertas multiventana de la pantalla anterior y el dashboard. Alternativas: OpenSLO como especificación neutral, o el formato de cada proveedor. El SLO vive en Git y pasa por code review: es el primer ejemplo de algo que la plataforma puede traer de fábrica, como vamos a ver más adelante."
        },

        // ---------------------------------------------------------------- 3 · Ver lo que pasa
        {
          layout: "factors",
          kicker: "Observabilidad",
          title: "Tres listas cortas para saber qué medir.",
          groups: [
            ["Golden signals (Google)", ["Latencia: cuánto tarda, separando éxitos de errores.", "Tráfico: cuánta demanda hay.", "Errores: cuánto falla, explícito o no.", "Saturación: qué tan lleno está el recurso más escaso."]],
            ["RED (para servicios)", ["Rate: requests por segundo.", "Errors: requests que fallan.", "Duration: distribución de la latencia."]],
            ["USE (para recursos)", ["Utilization: % del tiempo ocupado.", "Saturation: trabajo encolado.", "Errors: fallas del dispositivo."]],
            ["Cómo se combinan", ["RED en cada servicio, USE en cada nodo, disco y cola.", "El SLI sale de RED.", "La causa, casi siempre, de USE."]]
          ],
          notes: "RED es de Tom Wilkie; USE, de Brendan Gregg. No hace falta que memoricen las siglas. Monitorear es elegir pocas señales que respondan '¿está roto?' y '¿por qué?'."
        },
        {
          layout: "media",
          kicker: "Telemetría",
          title: "Métricas para saber que algo pasa. Trazas y logs para saber dónde.",
          image: "img/atc.jpg",
          alt: "Controladores aéreos en una torre de control, uno de ellos mirando con binoculares",
          credit: "Torre de control · Axel Péju · CC BY 2.0",
          points: [
            ["Métricas", "Números agregados en el tiempo. Baratas, ideales para alertar y para el SLO."],
            ["Logs", "Eventos con detalle. Caros a escala; útiles cuando ya sabés qué buscar."],
            ["Trazas", "El camino de un request por todos los servicios. Muestran dónde se fue el tiempo."],
            ["OpenTelemetry", "Estándar de la CNCF para emitir las tres sin casarse con un proveedor."]
          ],
          notes: "La torre de control no mira los motores: mira señales (posición, altura, velocidad) y pide detalle cuando algo se desvía. Si cada servicio emite con OpenTelemetry, cambiar de backend es configuración, no reescritura. El trace_id que viaja entre servicios es lo que une un log con una traza."
        },

        // ---------------------------------------------------------------- 4 · Cuando falla
        {
          layout: "photo",
          kicker: "Incidentes",
          image: "img/apollo13-room.jpg",
          alt: "Sala de control de misión de la NASA durante el Apollo 13, con consolas y la pantalla principal",
          credit: "Mission Control durante el Apollo 13 · NASA · dominio público",
          title: "Houston, tenemos un problema.",
          sub: "Abril de 1970. Mission Control trajo de vuelta al Apollo 13 con un director de vuelo, roles claros y datos en cada consola.",
          notes: "Contalo como historia, en un minuto: explota un tanque de oxígeno a 300.000 km de la Tierra. Nadie en la sala intenta averiguar por qué explotó; todos trabajan en traer a la tripulación de vuelta. Un director de vuelo decide, cada consola tiene un dueño y hay un solo canal. Primero mitigar."
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
          notes: "El error típico es diagnosticar mientras el usuario sigue sin servicio. Si hubo un deploy en la última hora, el primer movimiento es el rollback, no el debugger."
        },
        {
          layout: "media",
          kicker: "Roles",
          title: "En un incidente grande, nadie hace dos cosas a la vez.",
          image: "img/fema-icp.jpg",
          alt: "Brigadistas reunidos en un puesto de comando de incendio forestal durante la reunión de la mañana",
          credit: "Puesto de comando de incendio, Georgia · FEMA · dominio público",
          points: [
            ["Incident Commander", "Coordina y decide. No toca la consola."],
            ["Operations lead", "El único que ejecuta cambios en producción."],
            ["Communications", "Informa a usuarios, soporte y dirección, con frecuencia fija."],
            ["Scribe", "Escribe la línea de tiempo mientras pasa."]
          ],
          notes: "El modelo viene del Incident Command System, que nació en los años 70 después de los grandes incendios forestales de California, cuando varias agencias no lograban coordinarse. En un equipo chico, una persona puede tener dos roles, pero nunca IC y operaciones a la vez. Si nadie es el IC, el IC sos vos hasta que lo pases."
        },
        {
          layout: "media",
          kicker: "Postmortem",
          title: "El postmortem busca el mecanismo, no al culpable.",
          image: "img/apollo13-directors.jpg",
          alt: "Controladores de vuelo de la NASA discuten el regreso del Apollo 13 junto a una consola",
          credit: "Controladores discuten el regreso del Apollo 13 · NASA · dominio público",
          points: [
            ["Blameless", "Si alguien pudo romperlo con un comando, el sistema lo permitía."],
            ["Qué tiene", "Impacto, línea de tiempo, causas que contribuyeron y acciones."],
            ["Las acciones", "Cada una con dueño y fecha. Sin acciones, es un relato."],
            ["Se comparte", "Lo lee toda la organización. Aprende el sistema."]
          ],
          notes: "Cerrá la historia del Apollo 13: la NASA armó una comisión de revisión. La causa no fue una persona: el tanque tenía interruptores térmicos pensados para 28 voltios, el equipo de tierra usaba 65, y una prueba meses antes los había dañado. Varias causas combinadas, ningún culpable. Si el postmortem busca culpables, la próxima vez la gente esconde información y el incidente dura más."
        },
        {
          layout: "cards",
          kicker: "Guardia",
          title: "Una guardia que quema gente es un problema de confiabilidad.",
          cards: [
            ["Carga", "No más de dos incidentes por turno de 12 horas. Más, y no hay tiempo de hacer bien el postmortem."],
            ["Rotación", "Ocho personas para un sitio, o seis por sitio con dos. Menos, y la guardia llega demasiado seguido."],
            ["Runbooks", "Cada alerta que despierta a alguien tiene un documento que dice qué mirar primero."],
            ["Cada page cuenta", "Una alerta que no requería acción es un bug de la alerta. Se arregla o se borra."]
          ],
          notes: "Los números son de los libros de Google y son una referencia, no una ley. La guardia se diseña y se mide: la fatiga de alertas hace que se ignore la importante."
        },
        {
          layout: "cards",
          kicker: "Antes de que falle",
          title: "Romperlo a propósito, en horario laboral.",
          cards: [
            ["Capacity planning", "Proyectar la demanda y probar la carga antes del pico, no durante."],
            ["Chaos engineering", "Inyectar fallas controladas para comprobar que el sistema aguanta lo que dice el diseño."],
            ["Game days", "Ensayar un incidente con el equipo: roles, runbooks, comunicación."],
            ["DR", "Un backup que nunca se restauró no es un backup. Se ensaya la restauración."]
          ],
          notes: "Netflix popularizó la idea con Chaos Monkey, que apagaba instancias en producción. No hace falta empezar en producción: un game day en staging ya encuentra runbooks rotos y alertas que no suenan."
        },
        {
          layout: "choices",
          kicker: "Caso · parte 1",
          title: "Día de inscripción. Ahora hay que prometer algo.",
          choices: [
            ["El SLI", "¿Qué cuenta como request bueno: que responda, que responda rápido o que el alta quede guardada?"],
            ["El SLO", "¿99,9% alcanza? ¿Es el mismo objetivo el día de inscripción que un martes cualquiera?"],
            ["El budget", "Si en la primera hora se gastó la mitad del budget, ¿qué se hace?"],
            ["La alerta", "¿A quién despierta y con qué runbook?"]
          ],
          notes: "Dejá que contesten. El SLI bueno es el alta guardada y confirmada en menos de un umbral, medida en el balanceador: que la web responda 200 no alcanza. 99,9% en 30 días son 43 minutos; si se pierden el día de inscripción, el daño es enorme: un SLO específico para la ventana del evento, o freeze de cambios esa semana. La mitad del budget en una hora es un burn rate altísimo: page, mitigar y nada de deploys. Si la unidad se da en dos encuentros, se corta acá."
        },

        // ---------------------------------------------------------------- 5 · Equipos
        {
          layout: "video",
          kicker: "Spotify",
          title: "El modelo Spotify, contado por Henrik Kniberg.",
          sub: "2014. Squads, tribes, chapters y guilds: cómo escalar sin perder autonomía. Con los primeros minutos alcanza.",
          video: "Yvfz4HGtoPc",
          poster: "img/spotify-poster.jpg",
          notes: "Es la parte 1 de 'Spotify Engineering Culture' (la parte 2 es vOt4BbWLWQw). Dura unos 13 minutos: pasá los primeros 3 o 4, hasta que explique squads y tribes, y pausá. La pantalla que sigue es el mismo modelo en un diagrama."
        },
        {
          layout: "spotify",
          kicker: "Spotify",
          title: "Autonomía en el squad, alineación en la tribe, oficio en el chapter.",
          parts: [
            ["squad", "Squad", "Un equipo chico, de punta a punta, con su product owner. Elige cómo construir; la misión la fija el negocio."],
            ["tribe", "Tribe", "Varios squads en un área relacionada. Kniberg la acota a unas 100 personas, para que todos se conozcan."],
            ["chapter", "Chapter", "La misma especialidad dentro de una tribe. El chapter lead es el jefe de línea: cuida el oficio, la carrera y los estándares."],
            ["guild", "Guild", "Una comunidad de interés que cruza tribes. Voluntaria y sin jerarquía: comparte prácticas, herramientas y código."]
          ],
          notes: "Hacé clic en cada pieza. Es una matriz: se trabaja todos los días en el squad (el qué) y se reporta al chapter (el cómo). Las tribes de 100 personas toman el número de Dunbar. El guild evita que cada squad reinvente lo mismo: es el antecedente cultural de la plataforma."
        },
        {
          layout: "cards",
          kicker: "Spotify",
          title: "Era una foto, no una receta.",
          cards: [
            ["Una foto de 2012", "Kniberg e Ivarsson describieron un momento de la empresa. Spotify siguió cambiando."],
            ["Lo que falló", "Según ex empleados, la matriz generó confusión de liderazgo y nadie era dueño de coordinar entre squads."],
            ["Lo que sirve", "Autonomía con alineación, equipos chicos de punta a punta, comunidades que cruzan la organización."],
            ["Y nació Backstage", "Para que cientos de squads autónomos no reinventaran todo, Spotify construyó un portal interno. Hoy es open source."]
          ],
          notes: "El paper original es 'Scaling Agile @ Spotify' (2012). En 2020 Jeremiah Lee, ex Spotify, publicó 'Spotify's Failed #SquadGoals'. Copiar el organigrama de otra empresa no copia su cultura. El puente a lo que sigue: demasiada autonomía sin un camino común multiplica la carga cognitiva."
        },
        {
          layout: "topologies",
          kicker: "Team Topologies",
          title: "Cuatro tipos de equipo. Ni uno más.",
          teams: [
            ["stream", "Stream-aligned", "Alineado a un flujo de valor: un producto, un journey. Es la mayoría de los equipos."],
            ["platform", "Platform", "Ofrece servicios internos para que los stream-aligned sean autónomos."],
            ["enabling", "Enabling", "Expertos que ayudan a otro equipo a adquirir una capacidad, y se van."],
            ["complicated", "Complicated subsystem", "Un componente que requiere especialistas: un motor de cálculo, un modelo."]
          ],
          foot: "¿Y SRE? Embebido en un stream-aligned, como enabling que enseña a operar, o dentro del equipo de plataforma construyendo el camino.",
          notes: "Libro de Matthew Skelton y Manuel Pais, 2019. Las formas y colores son los del libro. Lo útil del modelo es lo que prohíbe: no hay 'equipo de DBAs' o 'de QA' como silo permanente; esas capacidades son enabling (temporal) o parte de la plataforma (como servicio). La franja de abajo responde dónde cae SRE: muchas organizaciones arrancan con SRE como enabling, lo embeben en los servicios críticos y terminan construyendo una plataforma."
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
          notes: "Es la razón por la que una materia de arquitectura habla de equipos. Un diseño de microservicios con un solo equipo gigante termina siendo un monolito distribuido."
        },

        // ---------------------------------------------------------------- 6 · La plataforma
        {
          layout: "photo",
          kicker: "La plataforma",
          image: "img/interchange.jpg",
          alt: "Vista aérea de un cruce de autopistas rodeado de bosque",
          credit: "Autobahnkreuz Köln-Nord · El Grafo · CC BY-SA 3.0",
          title: "Muchos equipos, una sola red de caminos.",
          sub: "La plataforma es la infraestructura vial: nadie la ve cuando funciona, y todos la sufren cuando no.",
          notes: "Separador: del modelo operativo a lo que se construye. Cada equipo maneja su auto (su servicio); la plataforma es la red: autopistas, señalización, reglas."
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
          notes: "'Thinnest Viable Platform' es de Team Topologies. El antipatrón contrario: un año construyendo algo sin usuarios y lanzado obligatorio. Adopción voluntaria es la mejor señal de que el producto es bueno."
        },
        {
          layout: "media",
          kicker: "Golden path",
          title: "Pavimentá los caminos que la gente ya usa.",
          image: "img/paving.jpg",
          alt: "Una pavimentadora extiende asfalto sobre un camino",
          credit: "Pavimentadora · Thomas Nugent · CC BY-SA 2.0",
          points: [
            ["Template", "Un servicio nuevo nace con repo, pipeline, Dockerfile y manifiestos."],
            ["Por defecto", "Telemetría, SLO base, escaneo de seguridad y dueño en el catálogo."],
            ["Opinado", "Una forma recomendada, bien mantenida. No todas las formas posibles."],
            ["Salida de emergencia", "Se puede salir del camino. Quien sale, se hace cargo."]
          ],
          notes: "'Golden path' es el término de Spotify; Netflix dice 'paved road'. La imagen de los urbanistas: esperá a ver por dónde camina la gente y pavimentá esos senderos. Sin salida de emergencia, el golden path es una jaula y los mejores equipos se van por fuera."
        },
        {
          layout: "explore",
          kicker: "Anatomía",
          title: "Una plataforma son capas. El desarrollador ve solo la de arriba.",
          parts: [
            ["Portal", "Backstage · Port · nullplatform", "La cara de la plataforma: catálogo de servicios, templates para crear uno nuevo, documentación y scorecards. No es la plataforma; es su vidriera."],
            ["Orquestación", "Crossplane · Kratix · APIs", "Traduce un pedido de alto nivel ('quiero una base Postgres chica para staging') en los recursos concretos. Es donde vive la abstracción."],
            ["Entrega", "CI · Argo CD · Flux", "Del commit a producción. CI construye y firma la imagen; un controlador GitOps lleva al cluster lo que dice Git."],
            ["Runtime", "Kubernetes · serverless", "Donde corre la aplicación. La unidad 3: el control plane reconcilia lo declarado con lo que hay."],
            ["Observabilidad", "OpenTelemetry · Prometheus · Grafana", "Métricas, logs y trazas por defecto, con los SLOs ya cableados."],
            ["Seguridad y políticas", "OPA · Kyverno · Vault", "Reglas que se evalúan solas: qué imagen puede correr, qué recursos se pueden pedir, dónde están los secretos."],
            ["Infraestructura", "Terraform · OpenTofu · cloud", "Redes, clusters, cuentas y bases, declaradas como código y versionadas."]
          ],
          notes: "Hacé clic de arriba hacia abajo. Las herramientas son ejemplos, no una recomendación. Lo que se diseña es la interfaz entre capas: el desarrollador debería poder trabajar solo con la de arriba, y bajar si lo necesita."
        },
        {
          layout: "factory",
          kicker: "SRE y plataforma",
          title: "SRE define qué es confiable. La plataforma lo trae de fábrica.",
          source: "Template de servicio",
          target: "inscripciones-api · recién creado",
          items: ["Repo y pipeline", "Manifiestos y GitOps", "Dueño en el catálogo", "SLO base de 99,9%", "Alertas de burn rate", "Dashboard RED", "Runbook inicial", "Políticas aplicadas"],
          points: [
            ["SRE aporta", "SLOs, error budgets, prácticas de incidentes y guardia."],
            ["La plataforma aporta", "Que todo eso venga incluido en cada servicio nuevo."],
            ["Juntas", "Nadie tiene que acordarse de pedirlo: es el camino por defecto."]
          ],
          notes: "Esta es la pantalla que une las dos mitades de la unidad. En la primera parte un SRE definía a mano el SLO de un servicio. En una plataforma madura, el template ya trae el SLO base, las alertas de burn rate, el dashboard y el runbook. El SRE pasa de operar servicios a mejorar el camino que usan todos."
        },
        {
          layout: "media",
          contain: true,
          kicker: "Portal",
          title: "El portal es la vidriera. La plataforma es lo que está atrás.",
          image: "img/backstage-catalog.png",
          alt: "Catálogo de servicios de Backstage con servicios, dueño, ciclo de vida y descripción",
          credit: "Backstage · catálogo de software · Apache 2.0",
          points: [
            ["Catálogo", "Qué servicios existen, quién es el dueño, de qué dependen y dónde están sus docs."],
            ["Templates", "Crear un servicio nuevo en minutos, ya dentro del golden path."],
            ["TechDocs", "La documentación vive con el código y se publica sola."],
            ["Scorecards", "Qué servicios cumplen los estándares: dueño, SLO, versión soportada."]
          ],
          notes: "Backstage nació adentro de Spotify, se liberó en 2020 y hoy está en la CNCF. Alternativas comerciales: Port, Cortex, OpsLevel, Humanitec o nullplatform. El antipatrón más común: instalar Backstage y llamarlo plataforma. Un portal sin automatización detrás es una página linda que abre tickets. Primero la API, después el portal."
        },
        {
          layout: "pr",
          kicker: "Seguridad y costos",
          title: "Las reglas se evalúan solas, en cada cambio.",
          pr: "feat(inscripciones): nueva API de altas #142",
          checks: [
            ["ok", "Build y tests", "142 tests en 3 minutos"],
            ["ok", "Firma de imagen", "Sigstore · SBOM adjunto"],
            ["fail", "Política", "Kyverno: el contenedor corre como root"],
            ["ok", "Secretos", "Ningún secreto en el diff"],
            ["warn", "Costo", "+ US$ 120 por mes: tres réplicas nuevas"],
            ["ok", "SLO", "El servicio declara su SLO"]
          ],
          verdict: "No se puede mergear: una política falla.",
          points: [
            ["Policy as code", "OPA o Kyverno rechazan lo que no cumple."],
            ["Supply chain", "Cada imagen con SBOM y firma. SLSA define niveles de garantía."],
            ["Secretos y costos", "Secretos en un vault; cada recurso con dueño, etiqueta y precio visible."]
          ],
          notes: "Seguridad y FinOps son la misma idea: las reglas de la organización se aplican en el golden path, en el pull request, y no en una auditoría al final. El equipo de seguridad escribe políticas; la plataforma las aplica a todos por igual. Un request inflado en Kubernetes es plata (unidad 3). El Secret de Kubernetes no es un vault."
        },

        // ---------------------------------------------------------------- 7 · Cambiar sin romper
        {
          layout: "cards",
          kicker: "Infra como código",
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
          layout: "codeshot",
          kicker: "GitOps",
          title: "Git es el estado deseado. Un controlador lo reconcilia.",
          steps: ["Pull request", "Revisión y políticas", "Merge", "Argo CD reconcilia", "Synced y Healthy"],
          code: [
            "apiVersion: argoproj.io/v1alpha1",
            "kind: Application",
            "metadata:",
            "  name: inscripciones",
            "spec:",
            "  source:",
            "    repoURL: https://git.example.com/inscripciones.git",
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
          image: "img/argocd-tree.png",
          alt: "Pantalla de Argo CD con la aplicación guestbook en estado Healthy y Synced, y su árbol de recursos",
          credit: "Argo CD · captura de la documentación · Apache 2.0",
          points: [
            ["Synced:", "lo que corre coincide con el commit."],
            ["Healthy:", "los recursos están sanos."],
            ["Rollback:", "un revert del commit."]
          ],
          notes: "Es el loop de control de Kubernetes de la unidad 3, un nivel más arriba: el estado deseado ya no está en etcd sino en Git. Nadie hace kubectl apply a producción; el controlador corre adentro del cluster y tira los cambios. Synced y Healthy son preguntas distintas: algo puede estar sincronizado y no sano (la imagen nueva no arranca), o sano y desincronizado (alguien lo cambió a mano). selfHeal revierte cambios manuales; ojo con prune en producción. Argo CD y Flux son proyectos graduados de la CNCF."
        },
        {
          layout: "canary",
          kicker: "Releases",
          title: "La mayoría de los incidentes empieza con un cambio.",
          steps: [
            ["5%", 5, "99,95% · dentro del SLO", false, "Canary: la versión nueva recibe una porción chica del tráfico. Si algo sale mal, lo nota poca gente."],
            ["25%", 25, "99,94% · dentro del SLO", false, "El controlador sube el tráfico por pasos, solo si el SLI de la versión nueva sigue dentro del SLO."],
            ["50%", 50, "99,95% · dentro del SLO", false, "A mitad de camino. Nadie aprobó nada a mano: decide la métrica."],
            ["100%", 100, "99,96% · dentro del SLO", false, "Promoción completa. La versión vieja queda lista para volver atrás en segundos."],
            ["SLI cae", 25, "98,7% · fuera del SLO", true, "En 25% el SLI de la versión nueva cae por debajo del SLO. El controlador devuelve todo el tráfico a v1 sin despertar a nadie."]
          ],
          notes: "Hacé clic en orden y terminá en 'SLI cae'. Cierra el círculo de la unidad: el canary decide con el SLO del bloque 2, sobre la plataforma del bloque 6. Herramientas: Argo Rollouts, Flagger. Otras técnicas: blue/green (dos ambientes, el corte es un cambio de ruta) y feature flags (separar el deploy del lanzamiento). Si nunca se ensayó volver atrás, no hay rollback. El cambio de esquema en la base es lo que más rompe el rollback: se hace en pasos compatibles (expand and contract)."
        },

        // ---------------------------------------------------------------- 8 · Medir, industria y cierre
        {
          layout: "table",
          kicker: "Medir",
          title: "Una plataforma se mide por lo que les pasa a sus usuarios.",
          headers: ["Qué medir", "Ejemplo", "Por qué"],
          rows: [
            ["Entrega (DORA)", "Frecuencia de deploy, lead time, change failure rate, tiempo de recuperación", "Velocidad y estabilidad no se oponen."],
            ["Adopción", "% de servicios en el golden path", "Voluntaria, es la mejor señal de producto."],
            ["Onboarding", "Tiempo hasta el primer deploy de alguien nuevo", "Resume la carga cognitiva en un número."],
            ["Experiencia", "Encuestas DevEx / SPACE: flujo, feedback, carga", "Lo que las métricas de sistema no ven."],
            ["Confiabilidad", "SLOs de la propia plataforma", "Si la plataforma cae, caen todos."]
          ],
          note: "Medir actividad (commits, tickets cerrados) para comparar personas es un antipatrón documentado.",
          notes: "Hallazgo central de una década de investigación DORA: los equipos que despliegan más seguido también fallan menos y se recuperan más rápido. La cuarta métrica antes se llamaba time to restore service. Si sobra tiempo, el modelo de madurez de la CNCF (2023) tiene cuatro niveles: provisional, operational, scalable y optimizing; la mayoría de las organizaciones medianas están bien en scalable."
        },
        {
          layout: "cases",
          kicker: "Industria",
          title: "Quién lo hace, y qué se aprendió de ellos.",
          cases: [
            ["google", "Google", "SRE", "Inventó la disciplina y publicó los libros. Los SLOs y el error budget salen de ahí."],
            ["netflix", "Netflix", "Paved road y chaos", "Un camino pavimentado opcional, y Chaos Monkey apagando instancias para probar que todo aguanta."],
            ["spotify", "Spotify", "Golden paths y Backstage", "Squads autónomos con caminos recomendados, y un portal para encontrar todo lo que existe."],
            ["nullplatform.png", "nullplatform", "De Fury a producto", "Fury fue la plataforma interna de Mercado Libre. Hoy ese enfoque es un producto: nullplatform, una plataforma interna para otras empresas."]
          ],
          notes: "Cuatro ejemplos con un patrón común: la plataforma nació para resolver un problema de escala propio. nullplatform es el caso regional: la experiencia de Fury en Mercado Libre convertida en producto. En su sitio muestran clientes de la región como Banco Galicia y Falabella: buen ejemplo de 'comprar la plataforma' en lugar de construirla. Antipatrones para mencionar acá: ops con otro nombre, portal sin plataforma, construir todo desde cero, golden path sin salida y plataforma sin usuarios."
        },
        {
          layout: "logos",
          kicker: "Industria",
          title: "Cada capa tiene opciones, abiertas y comerciales.",
          groups: [
            ["Observabilidad", [["opentelemetry", "OpenTelemetry"], ["prometheus", "Prometheus"], ["grafana", "Grafana"], ["datadog", "Datadog"], ["newrelic", "New Relic"], ["dynatrace", "Dynatrace"]]],
            ["Incidentes y SLOs", [["pagerduty", "PagerDuty"], [null, "incident.io"], ["opsgenie", "Opsgenie"], [null, "Sloth"], [null, "Nobl9"], [null, "Gremlin"]]],
            ["Portales", [["backstage", "Backstage"], [null, "Port"], [null, "Cortex"], [null, "Humanitec"], ["nullplatform.png", "nullplatform"]]],
            ["Infra y entrega", [["terraform", "Terraform"], ["opentofu", "OpenTofu"], [null, "Crossplane"], ["githubactions", "GitHub Actions"], ["argo", "Argo CD"], ["flux", "Flux"]]],
            ["Runtime y seguridad", [["kubernetes", "Kubernetes"], ["istio", "Istio"], ["vault", "Vault"], [null, "OPA"], [null, "Kyverno"], [null, "Sigstore"]]]
          ],
          note: "No es una recomendación: son ejemplos conocidos. El mapa completo de lo open source: landscape.cncf.io.",
          notes: "Mostrá el CNCF Landscape en el navegador si hay tiempo: son cientos de proyectos, y esa es justamente la carga cognitiva que la plataforma tiene que absorber. El equipo de plataforma elige una opción por capa para que los equipos de producto no tengan que hacerlo. Ojo con Opsgenie: Atlassian anunció su discontinuación; buen ejemplo de por qué conviene que alertas y SLOs vivan en formatos abiertos."
        },
        {
          layout: "choices",
          kicker: "Caso integrador",
          title: "Doce equipos, doce formas de desplegar, y el día de inscripción se cae.",
          choices: [
            ["El problema", "¿Cuál es la carga extraña que más se repite entre los doce equipos?"],
            ["Lo primero", "Con tres personas y tres meses, ¿qué construyen primero?"],
            ["De fábrica", "¿Cómo hacen que el SLO de inscripción venga incluido en el template?"],
            ["Comprar o construir", "¿Construyen la plataforma, o adoptan una como nullplatform o Backstage gestionado?"],
            ["La medición", "A los seis meses, ¿qué número les dice que funcionó?"]
          ],
          notes: "Dejá que discutan en grupos. Una buena respuesta: entrevistar a los equipos primero; un golden path para el tipo de servicio más común (una API web con base de datos), con pipeline, GitOps, telemetría y SLO base; el equipo de inscripción como piloto en modo collaboration; adopción voluntaria, medida por porcentaje de servicios en el path y tiempo hasta el primer deploy. Comprar vs construir depende de si la plataforma es diferencial para la universidad: casi nunca lo es. El portal viene después, no primero."
        },
        {
          layout: "close",
          kicker: "Cierre",
          title: "Confiabilidad es una decisión con un número.",
          sub: "La plataforma es lo que hace que cumplirla sea el camino fácil, para todos los equipos.",
          notes: "Tres ideas para cerrar: el 100% no existe y el nivel correcto se elige con el negocio; la carga cognitiva es un recurso escaso; y la plataforma hace que lo correcto sea lo fácil. Gracias y preguntas."
        }
      ]
    }
  ]
};
