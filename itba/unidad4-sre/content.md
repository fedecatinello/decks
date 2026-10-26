# Unidad 04 · Operar lo que se diseñó: SRE y Platform Engineering

Guion de contenido unificado para revisar antes de aplicar estilos y gráficos.
El build no publica este archivo (los `.md` se excluyen).

## Cómo leer este documento

Cada pantalla tiene:

- **Kicker**: la etiqueta chica de arriba.
- **Pantalla**: lo que se ve proyectado.
- **Visual**: idea de imagen o gráfico para la etapa de diseño. Entre corchetes, el asset que ya tenemos en `img/`, si aplica.
- **Notas**: lo que dice el docente, no se proyecta.

## Qué se unificó

Las dos clases anteriores (SRE y Platform Engineering) repetían varias cosas. En esta versión aparecen una sola vez:

| Antes (en las dos clases) | Ahora |
|---|---|
| Conflicto Dev/Ops y evolución de modelos operativos | Un solo bloque de apertura: el problema |
| Modelos de organizar SRE y Team Topologies | Un solo bloque de equipos |
| Releases (canary, rollback) y GitOps | Un solo bloque: cambiar sin romper |
| DORA en las dos clases | Una sola vez, en "Medir" |
| Dos grillas de productos | Una sola grilla por capa |
| Google, Netflix y Spotify mencionados varias veces | Un solo bloque de casos |
| Dos casos de cierre | Un caso integrador |
| Dos cierres | Un cierre |

Resultado: **45 pantallas** en el deck (antes 61), en **9 bloques**. El guion numera 42: en el deck, la pantalla 41 se partió en casos y productos, la 42 en caso y cierre, y se sumó la foto separadora del bloque 6. Si hay que dar la unidad en dos encuentros, el corte natural es después del bloque 4 (pantalla 24).

## Recorrido

| # | Bloque | Pantallas | Pregunta que responde |
|---|---|---|---|
| 0 | Apertura | 1–2 | ¿De qué se trata la unidad? |
| 1 | El problema | 3–7 | ¿Por qué operar a escala es difícil? |
| 2 | Confiabilidad como número | 8–15 | ¿Cuánta falla es aceptable y cómo se decide? |
| 3 | Ver lo que pasa | 16–17 | ¿Cómo sé que algo anda mal? |
| 4 | Cuando falla | 18–24 | ¿Qué hago durante y después de un incidente? |
| 5 | Equipos | 25–30 | ¿Cómo se organiza la gente para operar así? |
| 6 | La plataforma | 31–36 | ¿Qué se construye para que todos operen así? |
| 7 | Cambiar sin romper | 37–39 | ¿Cómo llega un cambio a producción con seguridad? |
| 8 | Medir, industria y cierre | 40–42 | ¿Funcionó? ¿Quién lo hace? ¿Qué me llevo? |

---

## 0 · Apertura

### 01 · Operar lo que se diseñó

- **Kicker**: Unidad 04
- **Pantalla**: *Operar lo que se diseñó.* Subtítulo: Las unidades anteriores diseñaron y empaquetaron el sistema. Esta unidad trata de lo que pasa después: mantenerlo andando, cambiarlo sin romperlo y lograr que muchos equipos puedan hacer las dos cosas.
- **Visual**: portada oscura con rayos, como la unidad 3.
- **Notas**: Enganchá con la unidad 3: ya sabemos empaquetar y orquestar. Ahora hay dos preguntas. Una técnica: ¿cómo sabemos que anda bien y qué hacemos cuando no? Otra organizacional: ¿cómo hacen veinte equipos para lograrlo sin que cada uno reinvente todo? SRE responde la primera; Platform Engineering, la segunda.

### 02 · Recorrido

- **Kicker**: Recorrido
- **Pantalla**: *De un número a una plataforma*
  1. **El problema**: Dev quiere cambiar, Ops quiere estabilidad, y nadie da abasto.
  2. **Confiabilidad como número**: SLI, SLO y error budget.
  3. **Ver y responder**: observabilidad, incidentes y postmortems.
  4. **Equipos**: Spotify, Team Topologies y la ley de Conway.
  5. **La plataforma**: golden paths, capas y GitOps.
  6. **Medir**: DORA, adopción y madurez.
  - Pie: Al final, un caso: la universidad del día de inscripción.
- **Visual**: agenda numerada.
- **Notas**: Si el tiempo aprieta, la calculadora de nueves, el error budget y Team Topologies no se saltean. FinOps y el modelo de madurez sí.

---

## 1 · El problema

### 03 · Dev quiere cambiar. Ops quiere que nada cambie.

- **Kicker**: El conflicto
- **Pantalla**: tres tarjetas.
  - **Desarrollo**: le pagan por sacar features. Cada release es progreso.
  - **Operaciones**: le pagan por estabilidad. Cada release es un riesgo.
  - **Sin un acuerdo**: la discusión es de poder. Gana el que grita más fuerte o el que tiene más jerarquía.
- **Visual**: dos columnas enfrentadas con una flecha de tensión al medio.
- **Notas**: Este es el problema organizacional que atraviesa toda la unidad. SRE lo va a resolver con un número; Platform Engineering, con un camino compartido.

### 04 · Miles de máquinas y un equipo chico

- **Kicker**: Origen
- **Pantalla**: *Miles de máquinas y un equipo chico. La única salida era escribir software.* Subtítulo: Si la operación crece al ritmo del servicio, no hay forma de contratar gente al ritmo de las máquinas.
- **Visual**: foto a pantalla completa [google-dc.jpg].
- **Notas**: Google, principios de los 2000. Ben Treynor Sloss arma el primer equipo de SRE en 2003 con la frase: *SRE es lo que pasa cuando le pedís a un ingeniero de software que diseñe la operación.* En 2016 Google publica el libro y el modelo sale de la empresa. Google lo resume como "class SRE implements interface DevOps": DevOps dice qué valores tener; SRE dice cómo medirlos.

### 05 · Toil

- **Kicker**: Toil
- **Pantalla**: *Toil: trabajo manual, repetitivo y automatizable, que crece con el servicio.*
  - **Cómo se reconoce**: no deja valor duradero. La undécima vez es igual a la décima.
  - **El límite**: Google pone un techo de 50% del tiempo en operación.
  - **Si se pasa**: el trabajo vuelve al equipo de desarrollo hasta que baje.
  - **Lo que no es**: ni las reuniones ni el diseño. Eso es overhead.
- **Visual**: un contador o una barra que crece con el servicio, frente a otra plana (la automatizada).
- **Notas**: Ejemplos: reiniciar a mano un proceso que se cuelga, crear usuarios por ticket, rotar certificados a mano. El techo del 50% protege la parte de ingeniería: sin él, SRE es un equipo de operaciones con otro nombre.

### 06 · "You build it, you run it" funcionó. Hasta que "it" fue todo.

- **Kicker**: Carga cognitiva
- **Pantalla**: lo que hoy tiene que saber un equipo para operar su servicio.
  - **Infraestructura**: cloud, red, Kubernetes, IaC.
  - **Entrega**: CI, CD, registry, firmas, ambientes.
  - **Operación**: observabilidad, SLOs, guardia, backups.
  - **Cumplimiento**: seguridad, secretos, auditoría, costos.
  - Abajo, tres tipos de carga: **intrínseca** (la del dominio, suma), **extraña** (la del entorno, sobra) y **germana** (la que construye entendimiento, se protege).
- **Visual**: una mochila o pila que se desborda; abajo, tres barras con la extraña resaltada.
- **Notas**: La frase es de Werner Vogels (Amazon, 2006). DevOps rompió la pared entre Dev y Ops, y eso fue bueno. Pero si cada equipo domina las cuatro cajas, se le va el tiempo en la plataforma y no en el producto. Los tipos de carga vienen de John Sweller y los tomaron Skelton y Pais en Team Topologies. El objetivo de todo lo que sigue cabe en una línea: bajar la carga extraña.

### 07 · Cada modelo operativo resolvió el problema del anterior

- **Kicker**: Evolución
- **Pantalla**: tabla.

| Modelo | Quién opera | La interfaz | El problema que deja |
|---|---|---|---|
| Ops tradicional | Un equipo de operaciones | El ticket | Semanas de espera. Dev no ve producción. |
| DevOps | Cada equipo, todo su stack | El equipo mismo | Carga cognitiva. Veinte soluciones a lo mismo. |
| SRE | Ingenieros de confiabilidad | SLOs y error budget | Escala con expertos, que son pocos. |
| Platform Engineering | Un equipo de plataforma | Self-service | Hay que tratarla como producto. Si no, vuelve el ticket. |

  - Pie: No se reemplazan. DevOps como cultura, SRE como práctica, la plataforma como vehículo.
- **Visual**: línea de tiempo horizontal con los cuatro modelos.
- **Notas**: Esta tabla es el mapa de la unidad. Los próximos bloques recorren las dos últimas filas. Remarcá la última: si para obtener una base hay que abrir un ticket, eso es ops tradicional aunque se llame plataforma.

---

## 2 · Confiabilidad como número

### 08 · 100% es el objetivo equivocado

- **Kicker**: Principio
- **Pantalla**: cuatro tarjetas sobre fondo oscuro.
  - **El usuario no lo nota**: entre 99,99% y 100% manda su wifi, su celular y su proveedor.
  - **Cuesta exponencial**: cada nueve extra multiplica redundancia, guardias y proceso.
  - **Congela el producto**: si no se tolera ninguna falla, no se puede cambiar nada.
  - **La pregunta correcta**: ¿qué confiabilidad necesita este usuario, para esta función?
- **Visual**: curva de costo exponencial contra los nueves.
- **Notas**: Preguntá: ¿qué disponibilidad necesita el campus virtual? ¿El cobro de cuotas? ¿Un marcapasos? Depende del negocio, no de la tecnología.

### 09 · Tres siglas que se confunden siempre

- **Kicker**: Vocabulario
- **Pantalla**: tabla.

| | Qué es | Ejemplo | Quién lo mira |
|---|---|---|---|
| SLI | Un indicador medido | % de requests 2xx en menos de 300 ms | El equipo |
| SLO | El objetivo interno | 99,9% de requests buenos en 30 días | El equipo y producto |
| SLA | Un contrato con consecuencias | Si baja de 99,5%, se devuelve el 10% | Legal, comercial, el cliente |

  - Pie: El SLO es más exigente que el SLA. El margen entre los dos evita pagar la multa.
- **Visual**: tres anillos concéntricos (SLA afuera, SLO adentro, SLI como la medición).
- **Notas**: Muchas empresas tienen SLA y no SLO: manejan mirando solo la multa. El orden es: elegir el SLI, fijar el SLO y, solo si un cliente lo exige, firmar un SLA más laxo.

### 10 · Un SLI es una proporción

- **Kicker**: SLI
- **Pantalla**: *Eventos buenos sobre eventos válidos.*
  - **Disponibilidad**: requests que no fallan / totales.
  - **Latencia**: requests más rápidos que un umbral / totales. En percentiles, no promedios.
  - **Calidad**: respuestas completas / totales.
  - **Frescura**: datos actualizados hace menos de X / totales.
  - **Durabilidad**: datos que se pueden leer / escritos.
- **Visual**: una fracción grande (buenos ⁄ válidos) con ejemplos alrededor.
- **Notas**: Un p50 de 100 ms puede esconder un p99 de 8 segundos. El SLI se mide lo más cerca posible del usuario: en el balanceador mejor que en el proceso.

### 11 · Cada nueve que se agrega divide por diez el margen para fallar

- **Kicker**: Los nueves
- **Pantalla**: calculadora interactiva. Botones 99%, 99,5%, 99,9%, 99,95%, 99,99%, 99,999%. Muestra el tiempo de caída permitido por día, semana, mes y trimestre, con una frase por nivel:
  - **99%**: siete horas al mes. Alcanza con un mantenimiento con ventana.
  - **99,5%**: tres horas y media. Típico de un sistema interno.
  - **99,9%**: 43 minutos. Hace falta alerta y guardia.
  - **99,95%**: 21 minutos. Un deploy malo sin rollback rápido se come el mes.
  - **99,99%**: 4 minutos. Ningún humano diagnostica en ese tiempo: rollback y failover automáticos.
  - **99,999%**: 26 segundos. Varias regiones, sin dependencias que no lo tengan.
- **Visual**: la calculadora actual.
- **Notas**: El salto entre tres y cuatro nueves no es técnico, es organizacional: no da el tiempo de despertar a nadie. Un servicio no puede ser más disponible que sus dependencias críticas.

### 12 · El error budget es 1 − SLO

- **Kicker**: Error budget
- **Pantalla**: *Es presupuesto: está para gastarse.*
  - **Si sobra**: se libera más rápido, se experimenta.
  - **Si se acaba**: se frenan los features y se trabaja en confiabilidad.
  - **Quién decide**: nadie en el momento. La política se acuerda antes.
  - **Lo que cambia**: Dev y Ops miran el mismo número. Se terminó el conflicto de la pantalla 3.
- **Visual**: una barra de presupuesto que se vacía.
- **Notas**: Con 99,9% en 30 días, el budget es 0,1%: 43 minutos, o 1 de cada 1.000 requests. Un budget que nunca se gasta también es una señal: el SLO es laxo o el equipo, demasiado conservador. Cerrá explícitamente el conflicto Dev/Ops de la apertura.

### 13 · La política dice qué pasa antes de que pase

- **Kicker**: Política
- **Pantalla**: tabla.

| Budget restante | Qué se hace | Quién se entera |
|---|---|---|
| Más de 50% | Releases normales. Experimentos. | Nadie: es lo esperado. |
| 25% a 50% | Se revisan cambios riesgosos. | El equipo. |
| Menos de 25% | Solo cambios chicos con rollback probado. | Producto y líder técnico. |
| Agotado | Freeze de features. Postmortem obligatorio. | La dirección. |

  - Pie: Los umbrales son un ejemplo. Lo importante es que estén escritos y firmados por producto.
- **Visual**: semáforo de cuatro estados.
- **Notas**: Agotar el budget escala a quien puede decidir aceptar más riesgo. Producto puede seguir lanzando, pero lo decide explícitamente y queda registrado.

### 14 · Alertá sobre el ritmo de gasto, no sobre la CPU

- **Kicker**: Alertas
- **Pantalla**:
  - **Burn rate**: velocidad a la que se consume el budget. 1x lo agota justo al final de la ventana.
  - **Quemado rápido**: 14,4x durante 1 hora = 2% del budget. Despierta a alguien.
  - **Quemado lento**: 6x durante 6 horas = 5%, page. 1x durante 3 días = 10%, ticket.
  - **Ventana corta**: cada alerta se confirma con 5 minutos, para que se apague sola al resolverse.
- **Visual**: gráfico de líneas del budget con dos pendientes (rápida y lenta) y los umbrales.
- **Notas**: Números del Site Reliability Workbook de Google. Se alerta por síntoma, no por causa: una CPU al 90% no es un problema si los usuarios no lo notan. Las causas van al dashboard, no al teléfono.

### 15 · El SLO se versiona como el resto del sistema

- **Kicker**: SLO as code
- **Pantalla**: YAML de Sloth (el actual) a la izquierda y la captura del dashboard que genera a la derecha. Tres datos señalados: objetivo, budget restante y burn rate.
- **Visual**: código + captura [sloth-dashboard.png].
- **Notas**: Fusiona las dos pantallas actuales (YAML y dashboard). Sloth genera reglas de Prometheus y alertas multiventana desde ese archivo. Alternativas: OpenSLO como especificación neutral, o los formatos de cada proveedor. El SLO vive en Git y pasa por code review: es el primer ejemplo de algo que la plataforma puede traer "de fábrica" (pantalla 34).

---

## 3 · Ver lo que pasa

### 16 · Tres listas cortas para saber qué medir

- **Kicker**: Observabilidad
- **Pantalla**:
  - **Golden signals (Google)**: latencia, tráfico, errores, saturación.
  - **RED (servicios)**: rate, errors, duration.
  - **USE (recursos)**: utilization, saturation, errors.
  - **Cómo se combinan**: RED en cada servicio, USE en cada nodo y cola. El SLI sale de RED; la causa, casi siempre, de USE.
- **Visual**: diagrama de un servicio (RED) parado sobre sus recursos (USE).
- **Notas**: RED es de Tom Wilkie; USE, de Brendan Gregg. Monitorear es elegir pocas señales que respondan "¿está roto?" y "¿por qué?".

### 17 · Métricas para saber que algo pasa. Trazas y logs para saber dónde.

- **Kicker**: Telemetría
- **Pantalla**:
  - **Métricas**: baratas, para alertar y para el SLO.
  - **Logs**: detalle, caros a escala.
  - **Trazas**: el camino de un request por todos los servicios.
  - **OpenTelemetry**: estándar de la CNCF para emitir las tres sin casarse con un proveedor.
- **Visual**: foto de torre de control [atc.jpg].
- **Notas**: La torre no mira los motores: mira señales y pide detalle cuando algo se desvía. Si cada servicio emite con OpenTelemetry, cambiar de backend es configuración. El trace_id une un log con una traza.

---

## 4 · Cuando falla

### 18 · Houston, tenemos un problema

- **Kicker**: Incidentes
- **Pantalla**: *Houston, tenemos un problema.* Subtítulo: Abril de 1970. Mission Control trajo de vuelta al Apollo 13 con un director de vuelo, roles claros y datos en cada consola.
- **Visual**: foto a pantalla completa [apollo13-room.jpg].
- **Notas**: Explota un tanque de oxígeno a 300.000 km. Nadie en la sala intenta averiguar por qué: todos trabajan en traer a la tripulación. Un director decide, cada consola tiene un dueño, un solo canal. Primero mitigar.

### 19 · Primero se mitiga. La causa raíz se busca después.

- **Kicker**: Incidentes
- **Pantalla**: flujo de cuatro etapas desde una alerta.
  - **Detectar**: suena la alerta de burn rate; alguien acusa recibo.
  - **Organizar**: se nombra un Incident Commander; un canal, un documento.
  - **Mitigar**: rollback, failover, desviar tráfico, escalar.
  - **Aprender**: postmortem sin culpables; acciones con dueño y fecha.
- **Visual**: flujo horizontal.
- **Notas**: Si hubo un deploy en la última hora, el primer movimiento es el rollback, no el debugger.

### 20 · En un incidente grande, nadie hace dos cosas a la vez

- **Kicker**: Roles
- **Pantalla**:
  - **Incident Commander**: coordina y decide. No toca la consola.
  - **Operations lead**: el único que ejecuta cambios en producción.
  - **Communications**: informa con frecuencia fija.
  - **Scribe**: escribe la línea de tiempo mientras pasa.
- **Visual**: foto del puesto de comando [fema-icp.jpg].
- **Notas**: Viene del Incident Command System, nacido en los 70 tras los incendios forestales de California. En un equipo chico, una persona puede tener dos roles, pero nunca IC y operaciones a la vez.

### 21 · El postmortem busca el mecanismo, no al culpable

- **Kicker**: Postmortem
- **Pantalla**:
  - **Blameless**: si alguien pudo romperlo con un comando, el sistema lo permitía.
  - **Qué tiene**: impacto, línea de tiempo, causas que contribuyeron, qué salió bien, acciones.
  - **Las acciones**: cada una con dueño y fecha.
  - **Se comparte**: el que aprende es el sistema.
- **Visual**: foto de los controladores del Apollo 13 [apollo13-directors.jpg].
- **Notas**: Cierre de la historia: la comisión encontró que el tanque tenía interruptores térmicos para 28 V, el equipo de tierra usaba 65 V, y una prueba meses antes los había dañado. Varias causas combinadas, ningún culpable. **Verificar el dato antes de la clase.**

### 22 · Una guardia que quema gente es un problema de confiabilidad

- **Kicker**: Guardia
- **Pantalla**:
  - **Carga**: no más de dos incidentes por turno de 12 horas.
  - **Rotación**: ocho personas para un sitio, o seis por sitio con dos.
  - **Runbooks**: cada alerta que despierta a alguien tiene un documento.
  - **Cada page cuenta**: una alerta que no requería acción es un bug de la alerta.
- **Visual**: calendario de rotación con turnos.
- **Notas**: Números de los libros de Google, como referencia. La fatiga de alertas hace que se ignore la importante.

### 23 · Romperlo a propósito, en horario laboral

- **Kicker**: Antes de que falle
- **Pantalla**:
  - **Capacity planning**: probar la carga antes del pico.
  - **Chaos engineering**: inyectar fallas controladas.
  - **Game days**: ensayar un incidente con roles y runbooks.
  - **DR**: un backup que nunca se restauró no es un backup.
- **Visual**: ilustración o logo de Chaos Monkey; o foto de simulacro.
- **Notas**: Netflix popularizó la idea con Chaos Monkey. No hace falta empezar en producción: un game day en staging ya encuentra runbooks rotos.

### 24 · Caso, parte 1: el día de inscripción

- **Kicker**: Caso
- **Pantalla**: *Día de inscripción. Ahora hay que prometer algo.*
  - **El SLI**: ¿qué cuenta como request bueno: que responda, que responda rápido o que el alta quede guardada?
  - **El SLO**: ¿99,9% alcanza? ¿Es igual el día de inscripción que un martes?
  - **El budget**: si en la primera hora se gastó la mitad, ¿qué se hace?
  - **La alerta**: ¿a quién despierta y con qué runbook?
- **Visual**: preguntas en tarjetas; quizás un contador de "inscriptos" de fondo.
- **Notas**: El SLI bueno es el alta guardada y confirmada en menos de un umbral, medida en el balanceador. 99,9% en 30 días son 43 minutos; si se pierden el día de inscripción, el daño es enorme: SLO específico para la ventana, o freeze esa semana. Mitad del budget en una hora es burn rate altísimo: page, mitigar, sin deploys. **Si la unidad se da en dos encuentros, se corta acá.**

---

## 5 · Equipos

### 25 · El modelo Spotify, contado por Henrik Kniberg

- **Kicker**: Spotify
- **Pantalla**: video embebido (Spotify Engineering Culture, parte 1).
- **Visual**: video [spotify-poster.jpg como respaldo sin internet].
- **Notas**: Pasá los primeros 3 o 4 minutos, hasta squads y tribes. La parte 2 es `vOt4BbWLWQw`.

### 26 · Autonomía en el squad, alineación en la tribe, oficio en el chapter

- **Kicker**: Spotify
- **Pantalla**: diagrama interactivo actual (Squad, Tribe, Chapter, Guild).
- **Visual**: el diagrama actual.
- **Notas**: Es una matriz: se trabaja en el squad (el qué) y se reporta al chapter (el cómo). Tribes de unas 100 personas por el número de Dunbar. El guild evita reinventar: es el antecedente cultural de la plataforma.

### 27 · Era una foto, no una receta

- **Kicker**: Spotify
- **Pantalla**:
  - **Una foto de 2012**: describía un momento de la empresa.
  - **Lo que falló**: según ex empleados, confusión de liderazgo y nadie dueño de coordinar entre squads.
  - **Lo que sirve**: autonomía con alineación, equipos chicos de punta a punta.
  - **Y nació Backstage**: para que cientos de squads no reinventaran todo.
- **Visual**: tarjetas; o la foto "antes/después".
- **Notas**: Paper original: "Scaling Agile @ Spotify" (2012). Crítica: Jeremiah Lee, "Spotify's Failed #SquadGoals" (2020). Copiar el organigrama no copia la cultura. Puente: demasiada autonomía sin camino común multiplica la carga cognitiva.

### 28 · Cuatro tipos de equipo. Ni uno más.

- **Kicker**: Team Topologies
- **Pantalla**:
  - **Stream-aligned**: alineado a un flujo de valor. La mayoría.
  - **Platform**: servicios internos para que los demás sean autónomos.
  - **Enabling**: expertos que ayudan a adquirir una capacidad, y se van.
  - **Complicated subsystem**: un componente que requiere especialistas.
  - Abajo: **dónde cae SRE**. Embebido en un stream-aligned, como enabling que enseña, o dentro del equipo de plataforma.
- **Visual**: los cuatro tipos con las formas y colores del libro (barras, rectángulos, círculos).
- **Notas**: Skelton y Pais, 2019. Fusiona la pantalla anterior de "modelos de organizar SRE": embebido = dentro de stream-aligned; consultor = enabling; de plataforma = platform. Lo útil es lo que prohíbe: no hay silos permanentes de DBAs o QA.

### 29 · Tres formas de trabajar entre equipos

- **Kicker**: Interacción
- **Pantalla**:
  - **Collaboration**: descubrir algo nuevo juntos. Intenso y acotado.
  - **X-as-a-Service**: consumir lo que otro ofrece. El modo normal con la plataforma.
  - **Facilitating**: ayudar a destrabar o aprender.
- **Visual**: diagrama de equipos con los tres tipos de líneas.
- **Notas**: Secuencia típica: collaboration con un equipo piloto; cuando la API se estabiliza, X-as-a-Service para todos. Si la colaboración nunca termina, el servicio no está bien definido.

### 30 · Los sistemas copian la estructura de comunicación de quien los diseña

- **Kicker**: Ley de Conway
- **Pantalla**:
  - **Conway, 1968**: cuatro equipos que construyen un compilador producen uno de cuatro pasadas.
  - **La consecuencia**: si arquitectura y organización no coinciden, gana la organización.
  - **Inverse Conway**: primero se diseñan los equipos.
  - **Para la plataforma**: su límite es el de un equipo.
- **Visual**: dos diagramas espejados (organigrama y arquitectura).
- **Notas**: Es la razón por la que una materia de arquitectura habla de equipos. Microservicios con un solo equipo gigante terminan en un monolito distribuido.

---

## 6 · La plataforma

### 31 · La plataforma es un producto. Sus clientes son los desarrolladores.

- **Kicker**: Producto
- **Pantalla**:
  - **Tiene un PM**: entrevista, prioriza y dice que no.
  - **Es opcional**: si es obligatoria, nadie se entera de que es mala.
  - **Thinnest viable**: puede empezar como una wiki y un template.
  - **Tiene roadmap**: documentación, soporte, deprecaciones.
- **Visual**: tarjetas.
- **Notas**: "Thinnest Viable Platform" es de Team Topologies. Antipatrón: un año construyendo sin usuarios y lanzada obligatoria. La adopción voluntaria es la mejor señal.

### 32 · Pavimentá los caminos que la gente ya usa

- **Kicker**: Golden path
- **Pantalla**: *Que lo fácil sea lo correcto.*
  - **Template**: un servicio nace con repo, pipeline, Dockerfile y manifiestos.
  - **Por defecto**: telemetría, SLO base, escaneo de seguridad, dueño en el catálogo.
  - **Opinado**: una forma recomendada, bien mantenida.
  - **Salida de emergencia**: se puede salir; quien sale, se hace cargo.
- **Visual**: foto de pavimentadora [paving.jpg] (mejorable) o de un sendero marcado en el pasto.
- **Notas**: Fusiona la foto separadora y la pantalla de golden path. "Golden path" es de Spotify; Netflix dice "paved road". Esperá a ver por dónde camina la gente y pavimentá esos senderos. Sin salida, el path es una jaula.

### 33 · Una plataforma son capas. El desarrollador ve solo la de arriba.

- **Kicker**: Anatomía
- **Pantalla**: stack interactivo actual: Portal, Orquestación, Entrega, Runtime, Observabilidad, Seguridad y políticas, Infraestructura. Cada capa con herramientas de ejemplo y explicación.
- **Visual**: el stack actual; foto del cruce de autopistas [interchange.jpg] como separador previo opcional.
- **Notas**: Lo que se diseña es la interfaz entre capas. Las herramientas son ejemplos, no recomendación.

### 34 · SRE de fábrica

- **Kicker**: SRE y plataforma
- **Pantalla**: *SRE define qué es confiable. La plataforma hace que sea el camino por defecto.*
  - **SRE aporta**: SLOs, error budgets, prácticas de incidentes y guardia.
  - **La plataforma aporta**: que eso venga incluido en cada servicio nuevo.
  - **Juntas**: un servicio nace con su SLO, sus alertas de burn rate, su dashboard y su runbook.
- **Visual**: un "paquete" de servicio nuevo abriéndose con SLO, alertas, dashboard y runbook adentro.
- **Notas**: Es la pantalla que une las dos mitades de la unidad. Se adelanta respecto de la versión anterior (estaba al final) porque explica para qué sirven las capas. El SRE pasa de operar servicios a mejorar el camino que usan todos.

### 35 · El portal es la vidriera. La plataforma es lo que está atrás.

- **Kicker**: Portal
- **Pantalla**:
  - **Catálogo**: qué servicios existen, dueño, dependencias, docs.
  - **Templates**: crear un servicio dentro del golden path.
  - **TechDocs**: la documentación vive con el código.
  - **Scorecards**: qué servicios cumplen los estándares.
- **Visual**: captura del catálogo de Backstage [backstage-catalog.png]; la imagen de presentación [backstage-hero.jpg] puede quedar como apoyo o eliminarse.
- **Notas**: Fusiona las dos pantallas de Backstage. Spotify lo liberó en 2020; hoy está en la CNCF. Alternativas: Port, Cortex, OpsLevel, Humanitec. Antipatrón: instalar Backstage y llamarlo plataforma. Primero la API, después el portal.

### 36 · Las reglas se evalúan solas, en cada cambio

- **Kicker**: Seguridad y costos
- **Pantalla**:
  - **Policy as code**: OPA o Kyverno rechazan lo que no cumple.
  - **Supply chain**: SBOM y firma de cada imagen (Sigstore); niveles SLSA.
  - **Secretos**: en un vault, no en el repo.
  - **Costos**: cada recurso con dueño y etiquetas; los ambientes de prueba se apagan solos.
- **Visual**: un pull request con checks automáticos (seguridad, política, costo) en verde y rojo.
- **Notas**: Fusiona seguridad y FinOps en una sola idea: las reglas de la organización se aplican en el golden path, no en una auditoría al final. Un request inflado en Kubernetes es plata (unidad 3).

---

## 7 · Cambiar sin romper

### 37 · Si no está en Git, no existe

- **Kicker**: Infra como código
- **Pantalla**:
  - **Declarativo**: se describe el estado deseado; la herramienta calcula el plan.
  - **Plan y apply**: el plan se revisa como un pull request.
  - **Drift**: lo cambiado a mano en la consola se detecta y se corrige.
  - **Módulos**: la plataforma publica módulos versionados.
- **Visual**: diagrama Git → plan → apply → cloud, con una flecha de drift de vuelta.
- **Notas**: Terraform es el estándar de facto; en 2023 cambió la licencia y nació OpenTofu en la Linux Foundation. Pulumi usa lenguajes generales.

### 38 · Git es el estado deseado. Un controlador lo reconcilia.

- **Kicker**: GitOps
- **Pantalla**: flujo PR → revisar → mergear → reconciliar → corregir, más el YAML de Argo CD y la captura del árbol de recursos (Synced y Healthy).
- **Visual**: flujo + código + captura [argocd-tree.png].
- **Notas**: Fusiona tres pantallas (flujo, YAML y captura). Es el loop de control de Kubernetes de la unidad 3, un nivel más arriba: el estado deseado está en Git y no en etcd. Synced y Healthy son preguntas distintas. Ojo con `prune` en producción.

### 39 · La mayoría de los incidentes empieza con un cambio

- **Kicker**: Releases
- **Pantalla**:
  - **Canary**: la versión nueva recibe un poco de tráfico. Si el SLI empeora, vuelve atrás sola.
  - **Blue/green**: dos ambientes; el corte es un cambio de ruta.
  - **Feature flags**: se separa el deploy del lanzamiento.
  - **Rollback probado**: si nunca se ensayó, no hay rollback.
- **Visual**: barra de tráfico que pasa de 5% a 100% hacia la versión nueva, con un "stop" automático si el SLI cae.
- **Notas**: Se mueve al final del bloque técnico porque cierra el círculo: el canary decide con el SLO del bloque 2, sobre la plataforma del bloque 6. Herramientas: Argo Rollouts, Flagger. El cambio de esquema en la base es lo que más rompe el rollback (expand and contract).

---

## 8 · Medir, industria y cierre

### 40 · Una plataforma se mide por lo que les pasa a sus usuarios

- **Kicker**: Medir
- **Pantalla**: tabla.

| Qué medir | Ejemplo | Por qué |
|---|---|---|
| Entrega (DORA) | Frecuencia, lead time, change failure rate, tiempo de recuperación | Velocidad y estabilidad no se oponen. |
| Adopción | % de servicios en el golden path | Voluntaria, es la señal de producto. |
| Onboarding | Tiempo hasta el primer deploy de alguien nuevo | Resume la carga cognitiva. |
| Experiencia | Encuestas DevEx / SPACE | Lo que las métricas no ven. |
| Confiabilidad | SLOs de la propia plataforma | Si cae, caen todos. |

  - Pie: medir actividad (commits, tickets) para comparar personas es un antipatrón. El modelo de madurez de la CNCF va de "provisional" a "optimizing".
- **Visual**: tabla; las cuatro métricas DORA como cuatro indicadores arriba.
- **Notas**: Fusiona DORA (antes en SRE), medición de plataforma y madurez. Hallazgo DORA: los que despliegan más seguido fallan menos. La cuarta métrica se llamaba time to restore service. Si sobra tiempo, mostrar los cuatro niveles de madurez de la CNCF (provisional, operational, scalable, optimizing).

### 41 · Quién lo hace, y con qué

- **Kicker**: Industria
- **Pantalla**: arriba, cuatro casos; abajo, una grilla única de productos por capa.
  - **Google**: SRE. Inventó la disciplina y publicó los libros.
  - **Netflix**: paved road y Chaos Monkey.
  - **Spotify**: golden paths y Backstage.
  - **nullplatform**: Fury fue la plataforma interna de Mercado Libre; hoy ese enfoque es un producto, nullplatform.
  - Productos: observabilidad (OpenTelemetry, Prometheus, Grafana, Datadog), incidentes (PagerDuty, incident.io), SLOs (Sloth, Nobl9), portales (Backstage, Port, nullplatform), IaC (Terraform, OpenTofu, Crossplane), entrega (GitHub Actions, Argo CD, Flux), runtime (Kubernetes), seguridad (Vault, OPA, Kyverno), chaos (Gremlin, Chaos Mesh).
- **Visual**: casos con logo + grilla de logos. Puede partirse en dos pantallas si queda densa.
- **Notas**: Fusiona las dos grillas y la pantalla de casos. Antipatrones para mencionar acá: ops con otro nombre, portal sin plataforma, construir todo, sin salida de emergencia, plataforma sin usuarios. **Verificar: discontinuación de Opsgenie.**

### 42 · Caso integrador y cierre

- **Kicker**: Cierre
- **Pantalla (caso)**: *La universidad tiene doce equipos. Cada uno despliega distinto, y el día de inscripción se cae.*
  - ¿Cuál es la carga extraña que más se repite?
  - Con tres personas y tres meses, ¿qué construyen primero?
  - ¿Cómo hacen que el SLO de inscripción venga de fábrica?
  - A los seis meses, ¿qué número les dice que funcionó?
- **Pantalla (cierre)**: *Confiabilidad es una decisión con un número. La plataforma hace que cumplirla sea lo fácil.*
- **Visual**: caso en tarjetas, cierre oscuro con rayos.
- **Notas**: Une los dos casos anteriores. Buena respuesta: entrevistar a los equipos; golden path para una API web con base, con pipeline, GitOps, telemetría y SLO base; un equipo piloto (inscripción) en modo collaboration; adopción voluntaria medida por % de servicios y tiempo al primer deploy. El portal viene después. Tres ideas finales: el 100% no existe; la carga cognitiva es un recurso escaso; la plataforma hace que lo correcto sea lo fácil.

---

## Pendientes para la etapa visual

- Gráficos nuevos sugeridos: curva de costo de los nueves (08), barra de budget (12), gráfico de burn rate (14), servicio sobre recursos RED/USE (16), formas de Team Topologies (28), espejo de Conway (30), "paquete" de servicio de fábrica (34), PR con checks (36), barra de canary (39).
- Fotos que podrían mejorar: la pavimentadora (32).
- Pantallas que se eliminan respecto de la versión actual: las dos de modelo operativo duplicadas, la de modelos de SRE, la de FinOps (fusionada), la de madurez (pasa a nota), la de antipatrones (pasa a nota), la imagen de presentación de Backstage (opcional) y la del cruce de autopistas (opcional).
- Datos a verificar: causa del Apollo 13, Opsgenie, números de guardia y de burn rate.
