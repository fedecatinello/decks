# Graph Engineering: sistemas multiagente predecibles, observables y listos para escalar

**Charla virtual · Congreso de Informática, Innovación e Investigación · Hospital Italiano de Buenos Aires**
**25 minutos máx. (objetivo 24:30) · 26 slides · template: `Base presentacion (1).pptx`**

---

## Lineamientos generales

- **Gancho (del copy):** *"Tu agente de IA funcionó perfecto con tu modelo local. En producción, no tanto."*
- **Tesis:** el problema casi nunca es el modelo, es el sistema que lo rodea. El **harness** lo contiene, el **loop** hace que una unidad de trabajo salga bien sin vos y el **graph** decide qué unidades existen, en qué orden y dónde decide un humano. El modelo es solo un nodo.
- **Promesa (del copy):** sistemas multiagente **predecibles, observables y listos para escalar**. Cada bloque vuelve a alguno de esos tres adjetivos. **Observable** tiene slide propia (19) y reaparece en el caso Mount Sinai, con su cita sobre el logging.
- **Frase ancla:** *"Funcionó en la demo" es donde termina el amateur y empieza el arquitecto* (Khairallah). Une el gancho con el cierre.
- **Público:** congreso de informática en salud con perfiles técnicos, investigadores y clínicos. Definir cada término la primera vez. En salud el error tiene costo real, así que el human-in-the-loop y el "radio de impacto" (blast radius) son el corazón de la charla, no un apéndice.
- **Ejemplos en clave salud:** triage de consultas, resumen de historia clínica (HC), epicrisis. Nunca afirmar que el Hospital Italiano usa algo que no sepamos.
- **Casos reales = casos públicos de medicina.** El caso principal es Mount Sinai (hospital académico, *npj Health Systems*, mar. 2026). Lo acompaña Microsoft MAI-DxO (diagnóstico). **Solo estos dos**, para no dispersar: MAI-DxO se anticipa en la slide de supervisor y ambos se desarrollan en el bloque 05. Al presentarlos, decir siempre el tipo de evidencia: con revisión por pares o no, benchmark o práctica clínica, aprobado para uso clínico o no. Una audiencia del HIBA lo va a preguntar.
- **Fuentes:** los artículos de X sirven para el encuadre y las frases. Para las cifras, citar la fuente primaria (Anthropic, LangChain, martinfowler.com). Ante una audiencia académica conviene decir explícitamente que "Graph Engineering" es un nombre nuevo para ideas de sistemas distribuidos y workflows que tienen décadas.
- **Formato virtual:** un diagrama por idea, poco texto y un cambio visual cada 60–90 s. Usar el chat dos veces: en la apertura y en el cierre.
- **Agenda = los 5 bullets del post.** Cambia un solo punto del orden: *Harness vs Loops vs Graph* va primero porque el gancho habla del harness.
- **Lenguaje visual común:** todos los diagramas usan la misma gramática. Se presenta en las slides 8 y 12 y después no se explica más.
  - **Agente:** rectángulo redondeado; si tiene un loop, una flecha ↻ adentro.
  - **Código:** cuadrado gris sin redondear.
  - **Verificador o compuerta:** rombo.
  - **Humano:** ícono de persona, en color de acento.
  - **Arista:** flecha con una etiqueta que nombra el dato que cruza (`labs.json`).
  - **Aristas falsas o fallas:** en rojo.
  - Diagramas conceptuales, nada de capturas de herramientas. Las slides que no llevan diagrama (tablas, lecciones, checklist) dejan el texto como protagonista.
- **Reutilizar del deck "Harness, Loop y Graph" (Prompteala):** la definición de Böckeler, el dato de LangChain, el diagrama de tres capas, la cita de Osmani y "LLM as graph vs Code as graph". Esta charla dedica poco tiempo a Harness y Loop y mucho a Graph.

---

## Estructura y tiempos

| # | Bloque (bullet del post) | Slides | Tiempo | Acumulado |
|---|---|---|---|---|
| — | Apertura | 1–4 | 2:25 | 2:25 |
| 01 | Harness vs Loops vs Graph | 5–9 | 4:15 | 6:40 |
| 02 | Cuándo conviene uno o varios agentes | 10–11 | 2:35 | 9:15 |
| 03 | Patrones: routing, paralelización, supervisor | 12–15 | 4:20 | 13:35 |
| 04 | Estado compartido, errores, observabilidad y human-in-the-loop | 16–20 | 5:50 | 19:25 |
| 05 | Herramientas, casos reales y lecciones aprendidas | 21–24 | 4:00 | 23:25 |
| — | Cierre | 25–26 | 1:05 | 24:30 |

---

## Apertura (0:00 → 2:25)

### 01 · Portada
- **Graph Engineering**
- Bajada: *Sistemas multiagente predecibles, observables y listos para escalar*
- Federico Catinello · Head of Delivery · Ingenia · Congreso HIBA

### 02 · Speaker
- Foto, **Federico Catinello**, *Head of Delivery · Ingenia*.
- Bio corta: más de una década en Arquitectura de Software, desde soluciones de alto nivel hasta plataforma e infraestructura. Docente universitario, divulgador tecnológico y speaker de ARQConf.
- **Hitos (línea de nodos, en clave de grafo):** UTN (Ing. en Sistemas de Información) → ITBA (Profesor) → Ingenia (Head of Delivery) → **IA en un Sorbo** (podcast sobre IA con colegas, marcado como "ahora").

### 03 · Gancho *(slide partida)*
- Izquierda **"Local" ✅** / derecha **"Producción" 🤔**: respuestas inconsistentes, pasos que esperan sin motivo, costos que suben y nadie que sepa por qué falló.
- Remate: **El problema casi nunca es el modelo. Es la forma del sistema que lo rodea.**
- Pregunta al chat: *¿Qué se les rompió primero cuando pasaron a producción?* (20 s)

### 04 · Agenda *(los 5 bullets del post)*
1. Harness vs Loops vs Graph
2. Cuándo conviene uno o varios agentes
3. Patrones de orquestación: supervisor, routing, paralelización
4. Estado compartido, control de errores y human-in-the-loop
5. Casos reales y lecciones aprendidas

---

## Bloque 01 · Harness vs Loops vs Graph (2:25 → 6:40)

### 05 · Separador
**01 · HARNESS VS LOOPS VS GRAPH**: el modelo es solo un nodo

### 06 · La escalera *(diagrama en escalones)*
**Diagrama (opcional):** cinco escalones ascendentes de izquierda a derecha: Prompt → Context → Harness → Loop → **Graph**. El último escalón resaltado con el color de acento y los anteriores en gris.
**Prompt → Context → Harness → Loop → Graph**
| Disciplina | Qué mejora |
|---|---|
| Prompt engineering | La instrucción |
| Context engineering | Lo que el modelo ve |
| Harness engineering | El entorno alrededor del modelo |
| Loop engineering | Una unidad de trabajo, con feedback |
| Graph engineering | El trabajo completo |
- Fuente: 0xwhrrari, *Graph Engineering: How to Build AI Agent Systems That Don't Break at Scale* (ago. 2026).
- Tiempo: 30 s. Mostrar la escalera y pasar; no leer la tabla.
- Nota para el speaker: los nombres cambian, la habilidad de fondo es la misma: **diseñar sistemas confiables alrededor de modelos no confiables** (Khairallah).

### 07 · Las tres capas *(reutilizar diagrama apilado)*
**Diagrama:** reutilizar las tres capas apiladas del deck de Prompteala: Harness abajo, Loop en el medio y Graph arriba, cada una con su verbo (Contener, Converger, Repartir) a la derecha. Una flecha vertical al costado dice *"cada capa se apoya en la de abajo"*.
| Capa | Pregunta | Verbo |
|---|---|---|
| **Harness** | ¿Qué *puede* hacer el agente? | Contener |
| **Loop** | ¿*Cuándo* terminó de verdad? | Converger |
| **Graph** | ¿*Quién* hace cada parte? | Repartir |
- **Harness:** *Agent = Model + Harness.* Con el mismo modelo y cambiando solo el harness, LangChain sumó **+13.7 puntos** en Terminal Bench 2.0 y pasó del top 30 al top 5. Fuentes: Böckeler, martinfowler.com (abr. 2026); LangChain Blog (feb. 2026).
- **Loop:** producir → verificar → corregir → repetir hasta que pase. *"Terminado es una afirmación, no una prueba."* (Addy Osmani)
- Cada capa se apoya en la de abajo.

### 08 · Loop vs Graph *(la distinción clave)*
**Diagrama (imprescindible, el central de la charla):** tres nodos en línea unidos por aristas etiquetadas con el dato que cruza. Cada nodo tiene una flecha circular ↻ *adentro*. Debajo, dos llaves: una que abarca el interior de un nodo, rotulada **"loop = adentro"**, y otra que abarca las flechas entre nodos, rotulada **"grafo = entre"**. Este diagrama presenta el lenguaje visual que se repite en el resto de la charla.
```
 ┌──────────┐   hallazgos   ┌──────────┐   borrador   ┌──────────┐
 │ Analiza ↻│ ────────────▶ │ Redacta ↻│ ───────────▶ │ Revisa  ↻│
 └──────────┘               └──────────┘              └──────────┘
   loop = adentro            grafo = entre los nodos
```
- **"El loop vive dentro de un nodo. El grafo vive entre los nodos."** (hanakoxbt)
- El loop hace bien *una* unidad de trabajo, pero no puede decidir qué unidades existen, en qué orden ni cuáles no necesitaban esperarse.
- Un grafo **de control**, no un knowledge graph:
  - **Nodo:** un trabajo acotado, con una entrada y una salida.
  - **Arista:** una dependencia real, donde la salida de un nodo es la entrada de otro.
  - **Estado:** lo que pasa de nodo en nodo y sobrevive a la sesión.
- Sin loops adentro, un grafo produce trabajo sin verificar en paralelo, que es peor que en serie porque hay más. Sin grafo alrededor, un loop es un paso muy bueno en una fila que nadie diseñó.

### 09 · Nada nuevo bajo el sol *(desmitificar el término)*
**Diagrama:** línea de tiempo horizontal con seis hitos. Cada uno lleva el año grande, el nombre y una línea que lo conecta con la charla. Una flecha punteada vuelve del último hito (Pregel, 2010) al primero (Euler, 1736) con la etiqueta *"Pregel: el río de los puentes de Euler"*. Abajo, el remate en una banda verde.
| Año | Hito | Qué nos dejó |
|---|---|---|
| **1736** | Euler, los puentes de Königsberg | Nace la teoría de grafos: puntos y líneas, nodos y aristas |
| **1854** | Boole, *Las leyes del pensamiento* | La lógica se vuelve álgebra: cada condición de routing (cada `if`) es una expresión booleana |
| **1937** | Shannon, tesis de maestría en el MIT | El álgebra de Boole se vuelve circuito: compuertas que deciden por dónde pasa la señal |
| **1958** | PERT / CPM (Marina de EE. UU., DuPont) | El proyecto como red de dependencias y camino crítico: *secuencia no es dependencia* |
| **1970s** | Algoritmos clínicos y árboles de decisión | La medicina ya razona en grafos: guías, flujogramas y protocolos |
| **2010** | Pregel (Google) | Cómputo distribuido sobre grafos. LangGraph declara que se inspira en él |
- Dato para el remate: Google llamó **Pregel** a su sistema en honor a Euler, porque **Pregel es el río que cruzaban los puentes de Königsberg**. El framework de agentes "de moda" lleva el nombre del problema de 1736.
- Mensaje: los grafos dirigidos, los árboles de decisión y el álgebra de Boole son materia de matemática discreta de primer año. **Lo nuevo no es el grafo. Lo nuevo es que algunos nodos ahora son un LLM.**
- Para esta audiencia: el algoritmo clínico que usan en la guardia ya es un grafo dirigido con nodos de decisión. Graph engineering es aplicar esa disciplina a sistemas con modelos.
- Tiempo: 45 s. Sin leer la línea de tiempo: señalar 1736, 1958 y la flecha de vuelta.
- Fuentes: Euler, *Solutio problematis ad geometriam situs pertinentis* (1736); Boole, *An Investigation of the Laws of Thought* (1854); Shannon, *A Symbolic Analysis of Relay and Switching Circuits* (MIT, 1937); PMI, *Project network models: past, present and future*; JAMA, serie *Toward Optimal Laboratory Use* (1975); Malewicz et al., *Pregel: A System for Large-Scale Graph Processing* (SIGMOD 2010); documentación de LangGraph.

---

## Bloque 02 · Cuándo conviene uno o varios agentes (6:40 → 9:15)

### 10 · El test de la arista falsa *(ejemplo en vivo, muy visual)*
**Diagrama (imprescindible):** antes y después. Arriba, la cadena lineal con las aristas falsas tachadas en rojo, cada una con la etiqueta *"no cruza ningún dato"*. Abajo, los tres nodos en paralelo que confluyen en Resumen, con las aristas reales etiquetadas (`labs`, `imágenes`, `evoluciones`). Si el template lo permite, animar el paso de una versión a la otra.
```
ANTES    Labs ──✗──▶ Imágenes ──✗──▶ Evoluciones ──▶ Resumen
DESPUÉS  Labs ────────┐
         Imágenes ────┼──▶ Resumen
         Evoluciones ─┘
```
- Casi todos escriben agentes como una línea: *hacé A, después B, después C*. Pero **secuencia no es dependencia**.
- La pregunta para cada flecha: **¿el paso siguiente lee de verdad la salida del anterior?** Si no podés nombrar el dato que cruza, no hay arista y la espera es pura pérdida.
- Ejemplo de salud: *"resumí el laboratorio, después las imágenes, después las evoluciones"*. Ninguno lee al otro, así que pueden correr en paralelo y solo el resumen final necesita los tres.
- Un workflow lineal de 40 pasos tiene 40 puntos de falla en serie. El mismo trabajo como grafo suele tener 3–5 dependencias reales. Fuente: Kopadze, *Graph Engineering explained* (jul. 2026).
- Frase: **"El modelo nunca fue el cuello de botella. La línea que dibujaste, sí."**

### 11 · ¿Uno o varios? *(tabla de decisión)*
| Un agente, un loop, cuando… | Un grafo, cuando… |
|---|---|
| La tarea es corta y cabe en un contexto | El trabajo se puede paralelizar |
| No hay ramas independientes | Distintos nodos necesitan distintas herramientas o permisos |
| Fallar es barato | La salida requiere verificación independiente |
| Es exploratorio y querés dirigirlo vos | Tiene que poder retomarse tras una interrupción |
| Un humano revisa el final rápido | El costo y la autoridad se controlan por ruta |
- **"Un grafo compra amplitud, no mejor criterio."** (Kopadze)
- La habilidad más senior es saber decir *"esto no necesita un grafo"* (Khairallah).
- Regla: **arrancá con un loop y dibujá el grafo solo cuando las dependencias te obliguen.** Coincide con Anthropic, *Building effective agents* (dic. 2024).

---

## Bloque 03 · Patrones de orquestación (9:15 → 13:35)

> Un mismo caso de salud atraviesa los tres patrones: **asistente para el equipo de salud que procesa consultas y arma resúmenes clínicos.** Cada patrón lleva un diagrama, un ejemplo y una línea de "cuándo".

### 12 · Separador + anatomía de un nodo
**Diagrama:** a la izquierda, una *tarjeta de contrato* de un nodo: entrada → [un solo trabajo] → salida estructurada, con una salida lateral roja para el estado de falla. A la derecha, la leyenda de los 4 tipos de nodo con su forma (splitter, worker con ↻, cuadrado gris de código y rombo de gate). Es el glosario visual del resto de la charla.
**03 · PATRONES**
- Cuatro tipos de nodo: **splitter** (parte el trabajo), **worker** (hace una unidad), **code node** (une, ordena, deduplica) y **gate** (verifica o aprueba). Fuente: hanakoxbt (ago. 2026).
- **No todo nodo es un LLM.** Si podés describir la transformación sin las palabras *juzgar, decidir, evaluar o resumir*, es código.
- Cada nodo tiene un **contrato**: un trabajo, una entrada explícita, una salida estructurada y un estado de falla claro.
- Frase: **"Un grafo donde cada arista es un agente paga tokens por su propio cableado."**

### 13 · Routing
**Diagrama (imprescindible, misma gramática y tamaño que 13 y 14):** una entrada que pasa por un rombo clasificador y se abre en tres ramas (Turnos, Laboratorio, Administrativa). Una cuarta rama roja, "urgencia / no sé", termina en el ícono de persona. Rótulo: *el modelo elige, el grafo limita las opciones*.
- Un clasificador mira la entrada y elige solo la ruta que hace falta.
- **El clasificador es probabilístico; las rutas permitidas son determinísticas.** El modelo juzga y el grafo limita lo que ese juicio puede disparar.
- Ejemplo: la consulta se deriva a turnos, laboratorio o administrativa, mientras que **urgencia o "no sé"** va directo a un humano.
- Lo simple queda barato y lo riesgoso entra a un grafo más profundo.

### 14 · Paralelización: el diamante *(fan-out → reduce → synthesize)*
**Diagrama (imprescindible):** forma de diamante. Un splitter se abre en tres workers en paralelo (Labs, Imágenes, Evoluciones), que convergen en un cuadrado gris de código (dedupe / normalizar), después en un nodo de síntesis y al final en un rombo verificador. Rótulos arriba: *fan-out → reduce → synthesize*.
- Se reparte el trabajo, varios workers investigan en paralelo, un **código** comprime y un agente final sintetiza.
- Ejemplo: el resumen de un paciente, con un nodo para laboratorio, otro para imágenes y otro para evoluciones, seguido de dedupe y normalización en código, una síntesis y un verificador.
- Es el patrón de la función de research de Claude. Fuente: Anthropic, *How we built our multi-agent research system* (jun. 2025).
- Unir resultados solo cuando el siguiente nodo necesita el conjunto completo; si no, que el flujo siga.

### 15 · Supervisor + ciclo controlado
**Diagrama (imprescindible):** un supervisor en el centro con tres workers alrededor (Reúne, Redacta, Valida). Desde el rombo de validación sale una flecha de vuelta hacia Redacta, rotulada `máx. 3 · presupuesto`, y una salida lateral "escalar" hacia el ícono de persona. Así el ciclo controlado se ve con sus topes.
- **Supervisor (orquestador–workers):** decide dinámicamente qué subtareas crear y a quién delegarlas. Ejemplo: en una epicrisis, un nodo reúne la información, otro redacta y otro valida contra la HC.
- Es el patrón más flexible y el menos predecible.
- **Ciclo controlado (evaluador–optimizador):** se repite solo si hay evidencia de que falta algo. *"Repetir hasta que esté bien" no es una condición de parada.* Todo ciclo necesita:
  - un test de completitud
  - un máximo de rondas
  - un presupuesto
  - el registro de intentos previos
  - una salida de escalamiento
- Anticipo: el caso MAI-DxO del bloque 05 es exactamente este patrón aplicado al diagnóstico.
- Implementación: **LLM as graph** (el procedimiento en texto, como skill) vs **Code as graph** (un script que orquesta: LangGraph, Agent SDK, workflows de Claude Code).

---

## Bloque 04 · Estado compartido, control de errores, observabilidad y human-in-the-loop (13:35 → 19:25)

### 16 · Estado compartido → *predecible*
**Diagrama:** contraste en dos filas. Arriba (✗): un nodo le pasa al siguiente una masa enorme de texto ("transcripción completa"). Abajo (✓): le pasa una etiqueta pequeña `ID: resumen_042` que apunta a un archivo guardado, con un ícono de checkpoint 💾 sobre la arista.
- **Mover referencias a artefactos, no transcripciones gigantes.** Cada nodo guarda su resultado y devuelve un path, un ID o un resumen estructurado. Así cada transición es auditable.
- Cada nodo recibe el estado mínimo necesario.
- **Checkpoints** después de los nodos caros: si se corta, retoma donde quedó.
- El grafo tiene que poder responder en todo momento qué corrió, qué está pendiente y por qué tomó cada ruta. Si no puede, sigue siendo una demo.

### 17 · El verificador es todo el truco
**Diagrama:** dos escenas. A la izquierda (✗), las burbujas de contexto del worker y del verificador superpuestas, con el verificador rotulado "asiente 👍". A la derecha (✓), burbujas separadas y el verificador apoyado en un ancla ⚓ ("test que corrió" / "registro real de la HC").
- Los modelos se pierden la mayoría de sus propios errores. **Quien hizo el trabajo no lo verifica.**
- El verificador tiene **contexto limpio**. Si comparte el chat del worker, no verifica: asiente.
- Necesita **anclas**: señales que no se pueden discutir, como un test que corrió o un dato que coincide con la fuente. En salud, que la cita apunte al registro real de la HC.
- *"Un loop con un verificador real le gana a un grafo sin ninguno."* (AI Builder Club)

### 18 · Control de errores → *falla local, no sistémica*
| Falla | Antídoto |
|---|---|
| **Colapso de contexto:** mil salidas a una síntesis | Fan-in por capas: resumir lotes y después combinar |
| **Falsa independencia:** dos nodos escriben el mismo recurso | Espacios aislados por worker; auditar recursos compartidos |
| **Falla silenciosa:** un nodo muere y el informe "parece completo" | Cada merge cuenta sus entradas contra las esperadas |
| **Devolver el lote entero** cuando falla una parte | Devolver solo la unidad que falló; tope de 3 intentos (después el problema es el plan) |
| Reintento que duplica efectos | Escrituras idempotentes |
- Fuentes: Kopadze; hanakoxbt; 0xwhrrari.
- Frase: **"La confiabilidad no sale de esperar que cada nodo funcione, sino de decidir qué hace el grafo cuando uno no funciona."**

### 19 · Observabilidad → *observable* *(slide dedicada: es la promesa del post)*
**Diagrama (imprescindible):** una traza en cascada. Cada nodo de una corrida es una barra horizontal sobre un eje de tiempo y al costado de cada barra van tokens, costo y latencia. La barra del verificador muestra un ❌ y un reintento, y la de la persona muestra "aprobó: Dra. X". Rótulo: *una traza por corrida, un span por nodo*.
- La prueba: **ante un resultado raro, ¿podés reconstruir en 5 minutos qué pasó?** Si no, el sistema no está listo para producción.
- **Una traza por corrida y un span por nodo.** Qué registrar en cada nodo:
  - entrada y salida (como referencia al artefacto, no el texto completo)
  - herramientas llamadas y lo que devolvieron
  - **decisión de ruta y el estado que la produjo**
  - veredicto del verificador y motivo del rechazo
  - tokens, costo y latencia
  - versión del prompt y del modelo
- **Tres usos de la misma traza:**
  - **Debug:** reproducir una corrida exacta.
  - **Evals:** por nodo *y* de punta a punta. Optimizar cada nodo por separado no garantiza que el sistema mejore.
  - **Costo:** ver en qué rama se va la plata (anticipa el 65× de Mount Sinai).
- **Métricas para el tablero:**
  - tasa de rechazo del verificador por nodo
  - reintentos
  - escalamientos a humano
  - costo por corrida
  - latencia p95
  
  Si sube el rechazo en un nodo, el problema está ahí y no "en la IA".
- **En salud, la traza es el audit trail:** qué agente, con qué modelo y versión, leyó qué dato, qué propuso y **qué profesional lo aprobó**.
- **Herramientas** (mencionar, no vender):
  - el estándar abierto **OpenTelemetry** (convenciones semánticas para GenAI)
  - plataformas como LangSmith, **Langfuse** (open source y auto-hosteable, relevante para datos sensibles) o Arize Phoenix
- Frase: **"Sin trazas no hay producción. Un grafo que no podés auditar es una caja negra con más pasos."**

### 20 · Human-in-the-loop: la compuerta por radio de impacto *(slide clave para salud)*
**Diagrama (imprescindible, el más fuerte para salud):** tres carriles tipo autopista, de arriba abajo. Verde abierto, amarillo con un rombo de control en el medio y rojo con una barrera cerrada y el ícono de persona en ese único punto. El rótulo del rojo dice: *no es un umbral alto, es un carril cerrado*.
```
 Borrador interno      ══════════════════▶   ✅ abierto
 Plantilla compartida  ════════◇═════════▶   ⚠️ checks + revisión
 HC / paciente         ════════▐█▌ 👤         ⛔ no se abre
```
- No abrir la compuerta por la **confianza** del modelo, que es la única variable que el modelo puede influir. Abrirla según **lo que cuesta deshacer el error**:

| Carril | Ejemplo en salud | Compuerta |
|---|---|---|
| Reversible y acotado | Borrador de resumen para uso interno | Se abre con verificación automática |
| Reversible pero amplio | Cambio en una plantilla que usan muchos servicios | Checks determinísticos y revisión |
| **Difícil de revertir** | Escribir en la HC, comunicar al paciente, indicaciones | **Este carril no se abre. Nunca.** |

- Un carril cerrado no es "un umbral muy alto": los umbrales se ajustan y los carriles cerrados no.
- **Poner al humano en un solo paso**, el de mayor consecuencia y menor reversibilidad. *"Un humano en el medio del grafo se vuelve el nodo más lento."* Fuente: hanakoxbt (ago. 2026).
- Frase: **"Human-in-the-loop no es un parche. Es una arista que se diseña."**

---

## Bloque 05 · Casos reales y lecciones aprendidas (19:25 → 23:25)

> Primero, un puente: dónde vive hoy el grafo (herramientas, protocolos y HL7). Después, dos casos públicos de medicina, con un mensaje cada uno: Mount Sinai muestra que el grafo **escala** y MAI-DxO que el grafo **se diseña**.

### 21 · El grafo ya está en todas partes *(puente hacia los casos, 0:45)*
**Diagrama:** tres tarjetas en fila, cada una con un mini-grafo de 3 nodos y su "dónde vive el grafo". Abajo, una tarjeta ancha resaltada para salud (HL7) y la banda verde con el mensaje. No hacer capturas de las herramientas: logo textual y una línea.
| Dónde | Ejemplos | Qué parte del grafo resuelven |
|---|---|---|
| **Frameworks de agentes (código)** | LangGraph | Nodos, aristas, estado y checkpoints como primitivas del framework. Se inspira en Pregel (slide 9) |
| **Automatización low-code** | n8n, Make | El canvas *es* el grafo: nodos (n8n) o módulos (Make) unidos por conexiones y routers. n8n tiene un nodo *AI Agent*: el LLM es literalmente un nodo más |
| **Protocolos abiertos** | MCP (agente ↔ herramientas), A2A (agente ↔ agente) | Estandarizan **las aristas**. Ambos están bajo la Agentic AI Foundation de la Linux Foundation (MCP desde dic. 2025, A2A desde ago. 2026) |
- **En salud, HL7 ya modela grafos y ahora se ocupa de la IA:**
  - **CPG on FHIR** (Clinical Practice Guidelines, STU2): la guía clínica como `PlanDefinition` computable. Acciones (nodos), condiciones en CQL (aristas condicionales) y `relatedAction` *before/after* (dependencias). Es un grafo dirigido estandarizado.
  - **CDS Hooks:** puntos de entrada en el workflow de la HCE donde un servicio externo (hoy, un agente) puede intervenir. Son las compuertas del grafo clínico.
  - **AI Transparency on FHIR** (ballot STU1, ene. 2026): marca qué dato fue generado o modificado por IA y, vía `Provenance`, qué modelo, qué entradas y qué humano participó. Es el audit trail de la slide 19, como estándar.
  - **HL7 AI Office** (jul. 2025): oficina dedicada a estándares de IA confiable en salud.
- Mensaje: **no hace falta inventar el grafo; hace falta diseñarlo bien.** Las piezas (orquestación, protocolos y semántica clínica) ya existen y son abiertas.
- Para esta audiencia: si ya trabajan con FHIR, la guía clínica en `PlanDefinition` es el mapa natural del grafo, y los agentes son nodos que se enchufan en él.
- Cuidado al presentarlo: no decir que HL7 tiene "un framework de agentes". Lo que existe son estándares que el grafo puede usar (guías computables, puntos de enganche, trazabilidad de IA). El ballot de AI Transparency todavía no es versión publicada.
- Tiempo: 45 s. Señalar las tres tarjetas en una frase cada una y detenerse en HL7.
- Fuentes: LangGraph docs; n8n docs (AI Agent node); Linux Foundation / AAIF (MCP, A2A); HL7 CPG IG STU2; CDS Hooks; HL7 *AI Transparency on FHIR* (2026Jan ballot); HL7, lanzamiento del AI Office (jul. 2025); Velamuri, *Relevance of HL7 FHIR Standards in the Age of Agentic AI*, HL7 News (ene. 2026).

### 22 · Caso 1 · Mount Sinai: un agente vs. un orquestador *(caso principal, 1:30)*
**Diagrama (opcional):** a la izquierda, un solo agente desbordado por 80 tareas apiladas, con el número grande **16%**. A la derecha, un orquestador que reparte las tareas en carriles entre agentes especializados, con el número grande **65× menos cómputo**. **No dibujar una curva:** solo hay dos datos publicados y una curva inventaría el resto.
- **Qué es:** un estudio del Windreich Department of AI and Human Health de Mount Sinai (Nueva York), publicado en *npj Health Systems* el 9 de marzo de 2026: *"Orchestrated multi agents sustain accuracy under clinical scale workloads compared to a single agent"*. Lead author: Eyal Klang; senior author: Girish Nadkarni.
- **El experimento:** tareas clínicas de recuperación de información, extracción de datos y **cálculo de dosis de medicación**, bajo carga creciente de hasta **80 tareas simultáneas**. Compararon un agente único que hace todo contra un **orquestador que reparte el trabajo entre agentes especializados**.
- **Resultado:**
  - Con 80 tareas, el agente único cayó a **16% de precisión** y consumió **hasta 65× más cómputo**.
  - El orquestado mantuvo la precisión estable.
- **Por qué es el caso perfecto para esta charla:** demuestra los tres adjetivos del post:
  - **Predecible:** la precisión se sostiene bajo carga.
  - **Observable** (callback a la slide 19): *"Cada paso queda registrado: qué herramienta se llamó, qué devolvió y cómo se armó la respuesta"* (Mahmud Omar).
  - **Escalable:** 65× menos cómputo.
- **Tipo de evidencia:** revista con revisión por pares, en condiciones simuladas. El próximo paso declarado es probarlo con datos de pacientes en tiempo real.
- Frase de Klang: *"Cuando un orquestador divide el trabajo entre agentes especializados, el sistema se mantiene preciso, ágil y mucho más eficiente."*

### 23 · Caso 2 · Microsoft MAI-DxO: un grafo con roles médicos *(1:00)*
**Diagrama:** mapeo en dos columnas unidas por líneas. A la izquierda, los roles médicos (Dr. Hypothesis, Dr. Test-Chooser, Dr. Challenger, Dr. Stewardship, Dr. Checklist). A la derecha, la pieza del grafo con su forma: supervisor, worker, rombo verificador, presupuesto del ciclo y compuerta. Muestra sin explicarlo que todo lo que vimos ya existe en medicina.
- **Qué es:** *MAI Diagnostic Orchestrator* (Microsoft AI, jun. 2025; paper *Sequential Diagnosis with Language Models*). Resuelve casos clínicos **paso a paso**: pregunta, pide estudios y propone diagnóstico.
- **El grafo (diagrama del panel):** el mismo modelo juega cinco roles:
  - **Dr. Hypothesis:** mantiene el diagnóstico diferencial (el *supervisor*).
  - **Dr. Test-Chooser:** elige el estudio más informativo.
  - **Dr. Challenger:** abogado del diablo contra el sesgo (el *verificador*).
  - **Dr. Stewardship:** controla el costo (el *presupuesto del ciclo*).
  - **Dr. Checklist:** control de calidad antes de avanzar (la *compuerta*).
- **Resultado:** sobre **304 casos del NEJM** (benchmark SDBench), MAI-DxO con o3 llegó al **85,5%** de diagnósticos correctos. **21 médicos** con 5–20 años de experiencia promediaron **~20%**. Además, pidió estudios más baratos.
- **Tipo de evidencia (decirlo en voz alta):**
  - Preprint, sin revisión por pares.
  - Los médicos no podían consultar colegas, libros ni IA.
  - Son casos raros del NEJM, no consultas cotidianas.
  - **No está aprobado para uso clínico.**
- Mensaje: **la mejora vino del diseño del grafo (roles, verificador, presupuesto), no de un modelo nuevo.** Es el mismo argumento del +13.7 de LangChain, ahora en medicina.

### 24 · Lecciones aprendidas *(0:30)*
1. **Empezá con un loop.** Dibujá el grafo cuando las dependencias te obliguen.
2. **Cortá las aristas falsas. Lo que puede ser código, que sea código.**
3. **Construí el verificador primero**, con contexto limpio y anclas reales.
4. **Evaluá el sistema entero**, no solo cada nodo. **Sin trazas no hay producción.**
5. **El humano va en un solo paso**: el irreversible.

---

## Cierre (23:25 → 24:30)

### 25 · Checklist para llevarse
Antes de dibujar un grafo:
1. ¿Puedo nombrar el dato que cruza cada arista?
2. ¿Qué nodos son código y cuáles necesitan un modelo?
3. ¿Dónde está el verificador y qué ancla usa?
4. ¿Qué pasa cuando falla cada nodo? ¿Puedo reconstruir una corrida desde la traza?
5. ¿Dónde decide un humano y qué carril no se abre nunca?

### 26 · Cierre + CTA
- Volver al gancho: **"Funcionó en local" es donde termina la demo. Predecible, observable y escalable es donde empieza el sistema.**
- Resumen en tres verbos: **Contener. Converger. Repartir.**
- Contacto, LinkedIn y QR a las referencias. Abrir preguntas en el chat.

---

## Para el Q&A
- **Si preguntan "¿la IA reemplaza al médico?":** los dos casos dicen lo mismo. MAI-DxO no está aprobado para uso clínico y Mount Sinai todavía no probó con pacientes reales. **El humano sigue siendo el nodo que decide en el carril irreversible.**

---

## Referencias
**Casos de medicina**
- Klang E., Nadkarni G. N. et al., *Orchestrated multi agents sustain accuracy under clinical scale workloads compared to a single agent*, npj Health Systems (9 mar. 2026). Nota de prensa: https://www.mountsinai.org/about/newsroom/2026/orchestrated-multi-agent-ai-systems-outperforms-single-agents-in-health-care
- Microsoft AI, *The Path to Medical Superintelligence* (30 jun. 2025): https://microsoft.ai/news/the-path-to-medical-superintelligence/. Paper: *Sequential Diagnosis with Language Models*, arXiv 2506.22405

**Observabilidad**
- OpenTelemetry, *Semantic conventions for generative AI*: https://opentelemetry.io/docs/specs/semconv/gen-ai/
- Langfuse (open source, auto-hosteable): https://langfuse.com · LangSmith: https://www.langchain.com/langsmith · Arize Phoenix: https://phoenix.arize.com

**Primarias (para citar cifras)**
- Böckeler, B., martinfowler.com (abr. 2026): *Agent = Model + Harness*
- LangChain Blog (feb. 2026): +13.7 en Terminal Bench 2.0 con el mismo modelo
- Osmani, A., *Loop Engineering* (jun. 2026)
- Anthropic, *Building effective agents* (dic. 2024)
- Anthropic Engineering, *How we built our multi-agent research system* (jun. 2025)

**Historia de los grafos (slide 9)**
- Euler, L., *Solutio problematis ad geometriam situs pertinentis* (1736): https://en.wikipedia.org/wiki/Seven_Bridges_of_K%C3%B6nigsberg
- Boole, G., *An Investigation of the Laws of Thought* (1854)
- Shannon, C., *A Symbolic Analysis of Relay and Switching Circuits*, tesis de maestría, MIT (1937)
- PMI, *Project network models: past, present, and future* (PERT/CPM, 1957–58): https://www.pmi.org/learning/library/project-network-models-past-present-future-5685
- JAMA, serie *Toward Optimal Laboratory Use* (1975): algoritmos clínicos y tablas de decisión
- Malewicz, G. et al., *Pregel: A System for Large-Scale Graph Processing*, SIGMOD (2010)
- LangGraph, documentación oficial (inspiración en Pregel y Apache Beam): https://reference.langchain.com/python/langgraph/

**Herramientas y estándares (slide 21)**
- LangGraph, documentación oficial: https://reference.langchain.com/python/langgraph/
- n8n, *AI Agent node*: https://docs.n8n.io · Make: https://www.make.com
- Linux Foundation, Agentic AI Foundation (MCP, dic. 2025; A2A, ago. 2026): https://axios.com/2026/08/17/a2a-agentic-ai-foundation-open-ai-standards
- HL7, *Clinical Practice Guidelines (CPG on FHIR)* STU2: https://www.hl7.org/fhir/uv/cpg/StructureDefinition-cpg-pathwaydefinition.html
- HL7, *CDS Hooks*: https://cds-hooks.hl7.org
- HL7, *AI Transparency on FHIR* (ballot 2026Jan): https://hl7.org/fhir/uv/aitransparency/2026Jan/index.html
- HL7, *HL7 International Launches AI Office* (jul. 2025): https://blog.hl7.org/hl7-international-launches-ai-office-to-set-global-standards-for-healthcares-ai-revolution
- Velamuri, S., *Relevance of HL7 FHIR Standards in the Age of Agentic AI*, HL7 News (7 ene. 2026): https://hl7news.hl7.org/2026/01/07/relevance-of-hl7-fhir-standards-in-the-age-of-agentic-ai/

**Encuadre (artículos en X)**
- Kopadze, A., *Graph Engineering explained: what it is, when to use it and when not to* (24 jul. 2026): https://x.com/AnatoliKopadze/status/2080668775796314331
- hanakoxbt, *Loops and Graphs: how to stop babysitting agents and only approve the last step* (23 ago. 2026): https://x.com/hanakoxbt/status/2091515787366306154
- 0xwhrrari, *Graph Engineering: How to Build AI Agent Systems That Don't Break at Scale* (10 ago. 2026): https://x.com/0xwhrrari/status/2086784668003598356
- Khairallah, *How to Become a Graph Architect With Zero Experience* (31 jul. 2026): https://x.com/eng_khairallah1/status/2083131009986396282

**Interno**
- Deck *Harness, Loop y Graph: el modelo ya no es el problema* (Prompteala 2026): `../harness-loop-graph.html`

## Plan B de tiempos (si vas atrasado)
- Slide 9: nombrar solo Euler, el algoritmo clínico y el río Pregel (−20 s).
- Slide 21: nombrar las tres tarjetas en una frase y quedarse solo con AI Transparency de HL7 (−20 s).
- Slide 12: nombrar los 4 tipos de nodo y saltear el contrato (−30 s).
- Slide 18: desarrollar solo 3 de las 5 fallas (−45 s).
- Slide 19: nombrar los tres usos de la traza y el audit trail, sin la lista de métricas (−30 s).
- Slide 23: mostrar el diagrama del panel MAI-DxO y nombrar los roles sin desarrollarlos (−20 s).
- Slide 24: quedarse con las lecciones 3, 4 y 5 (−15 s).
