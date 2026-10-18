# Guion: Graph Engineering. Sistemas multiagente predecibles, observables y listos para escalar

**Congreso de Informática, Innovación e Investigación · Hospital Italiano de Buenos Aires · charla virtual**
**Duración objetivo: 25:00** (sin margen sobre los 25: aplicar al menos un recorte del Plan B) · 27 slides · deck: `graph-engineering.html`
Ritmo de referencia: ~130 palabras por minuto (~3.100 palabras en total). Los tiempos por slide salen del largo de cada texto, más ~15 s de chat en la slide 3. El texto está para estudiar la idea y decirla con tus palabras, no para leerlo.

---

## Antes de empezar

**La tesis en 30 segundos:**
> Un agente que funciona en local y falla en producción casi nunca tiene un problema de modelo: tiene un problema de forma. El **harness** contiene al agente, el **loop** hace que una unidad de trabajo salga bien sin vos y el **graph** decide qué unidades existen, en qué orden, quién las verifica y dónde decide un humano. Diseñar ese grafo explícitamente es lo que hace a un sistema multiagente predecible, observable y escalable.

**Frases para memorizar:**
1. **"El loop vive dentro de un nodo. El grafo vive entre los nodos."** (slide 8)
2. **"El modelo nunca fue el cuello de botella. La línea que dibujaste, sí."** (slide 10)
3. **"Quien hizo el trabajo no lo verifica."** (slide 17)
4. **"Sin trazas no hay producción."** (slide 19)
5. **"Human-in-the-loop no es un parche. Es una arista que se diseña."** (slide 21)
6. Cierre: **"Contener. Converger. Repartir."**

**Cronómetro por bloque:**

| Bloque | Slides | Termina en |
|---|---|---|
| Apertura | 1–4 | 2:25 |
| 01 Harness vs Loops vs Graph | 5–9 | 6:40 |
| 02 ¿Uno o varios? | 10–11 | 9:15 |
| 03 Patrones | 12–15 | 13:35 |
| 04 Estado, errores, observabilidad y HITL | 16–21 | 19:55 |
| 05 Herramientas, casos y lecciones | 22–25 | 23:55 |
| Cierre | 26–27 | 25:00 |

**Si vas atrasado:**
- **Slide 9:** nombrá solo Euler, el algoritmo clínico y el río Pregel (−20 s).
- **Slide 22:** nombrá las tres tarjetas en una frase y quedate solo con AI Transparency de HL7 (−20 s).
- **Slide 20:** mostrá el header y los saltos rojos, sin el AuditEvent (−15 s).
- **Slide 12:** nombrá los 4 tipos de nodo y saltá el contrato (−30 s).
- **Slide 18:** desarrollá solo 3 de las 5 fallas (−45 s).
- **Slide 19:** nombrá los tres usos de la traza y el audit trail, sin las métricas (−30 s).
- **Slide 24:** mostrá el panel y nombrá los roles sin explicarlos (−20 s).

**Checklist técnico (virtual):**
- Abrir el deck con internet una vez antes, para que carguen las tipografías.
- Compartir **la ventana del navegador**, no la pantalla entera. Tecla **P** para pantalla completa; navegar con las flechas.
- Tener el chat a la vista: se usa en la slide 3 y en la 27.

**Convenciones:** *[clic]* = avanzar slide · *[señalar]* = mover el cursor sobre el diagrama · *[pausa]* = un segundo de silencio.

---

## APERTURA (0:00 → 2:25)

### Slide 1 · Portada — 0:00 → 0:20
"Buenas a todos y gracias al Hospital Italiano por la invitación. En los próximos veinte minutos vamos a hablar de Graph Engineering: cómo diseñar sistemas con varios agentes de IA que sean predecibles, observables y estén listos para escalar."

### Slide 2 · Speaker — 0:20 → 0:55
"Soy Federico Catinello, Head of Delivery en Ingenia, una consultora de arquitectura de TI. Estudié Ingeniería en Sistemas en la UTN, doy clases en el ITBA y, junto con unos colegas, hago *IA en un Sorbo*, un podcast sobre inteligencia artificial. *[señalar la línea de hitos]* Fíjense que les presenté mi recorrido como nodos conectados. No es casualidad: de eso va la charla. Todo lo que les voy a mostrar sale de llevar agentes a producción, no de la teoría."

### Slide 3 · Gancho — 0:55 → 2:05
"Arranco con una escena que seguramente conocen. *[señalar la tarjeta verde]* Armaste un agente, lo probaste en local y anduvo perfecto: la demo salió impecable. *[señalar la tarjeta roja]* Lo pasaste a producción y empezaron los problemas: respuestas que cambian de un día para otro, pasos que esperan sin motivo, costos que suben y, lo peor, nadie sabe explicar por qué falló.

La reacción típica es culpar al modelo y probar otro. *[pausa]* Mi argumento de hoy es que **el problema casi nunca es el modelo. Es la forma del sistema que lo rodea.**

Les dejo una pregunta en el chat: **¿qué se les rompió primero cuando pasaron algo a producción?** Escriban mientras sigo; al final retomo algunas respuestas."

### Slide 4 · Agenda — 2:05 → 2:25
"El recorrido tiene cinco paradas, las mismas que anuncié en la convocatoria. Primero, la diferencia entre harness, loop y graph. Después, cuándo conviene uno o varios agentes. Los patrones de orquestación. Estado, errores, observabilidad y humanos en el circuito. Y cerramos con dos casos reales de medicina."

---

## BLOQUE 01 · HARNESS VS LOOPS VS GRAPH (2:25 → 6:40)

### Slide 5 · Separador — 2:25 → 2:35
"Primera parada. Y una idea para tener presente toda la charla: **el modelo es solo un nodo.**"

### Slide 6 · La escalera — 2:35 → 3:15
"Seguramente vieron pasar todos estos nombres. *[señalar de izquierda a derecha]* Prompt engineering mejoraba la instrucción; context engineering, lo que el modelo ve; harness, el entorno; loop, una unidad de trabajo con feedback; y graph, el trabajo completo. Los nombres cambian cada pocos meses, pero la habilidad de fondo es la misma: **diseñar sistemas confiables alrededor de modelos que no lo son.** Y para una audiencia como esta vale aclararlo: no es una idea nueva. Es diseño de workflows y de sistemas distribuidos, con nombre nuevo. En un ratito les muestro cuán vieja es."

### Slide 7 · Tres capas — 3:15 → 4:15
"Las últimas tres capas se apilan, y cada una se apoya en la de abajo. *[señalar Harness]*

Abajo está el **harness**: todo lo que rodea al modelo. Instrucciones, herramientas, permisos, validaciones. Responde a qué *puede* hacer el agente. El verbo es **contener**.

*[señalar el +13.7]* Un dato para dimensionarlo: LangChain tomó **el mismo modelo**, cambió solamente el harness y mejoró casi 14 puntos en un benchmark de agentes. Pasó del puesto 30 al top 5. El modelo no cambió.

*[señalar Loop]* Arriba está el **loop**: producir, verificar, corregir y repetir hasta que algo confirme que está bien. Responde *cuándo* terminó de verdad. Addy Osmani lo dice muy bien: *'terminado es una afirmación, no una prueba'*. El verbo es **converger**.

*[señalar Graph]* Y arriba de todo, el **graph**: *quién* hace cada parte. El verbo es **repartir**. Esa es la capa que nos ocupa hoy."

### Slide 8 · Loop vs. Graph — 4:15 → 5:55
"La distinción más importante de la charla está en esta frase: **el loop vive dentro de un nodo; el grafo vive entre los nodos.**

*[señalar un nodo y su flecha circular]* Cada caja es un trabajo acotado: analizar, redactar, revisar. Adentro de cada caja hay un loop que hace ese trabajo bien: lo intenta, lo chequea y lo corrige.

*[señalar las flechas verdes]* Pero un loop, por bueno que sea, no puede decidir qué cajas existen, en qué orden van ni cuáles no necesitaban esperarse. Eso lo decide el grafo, y el grafo vive en las flechas.

Fíjense que las flechas tienen nombre: *hallazgos*, *borrador*. Eso importa, ahora vamos a ver por qué.

*[señalar las tres tarjetas]* Tres palabras y nada más. **Nodo**: un trabajo con una entrada y una salida. **Arista**: una dependencia real, donde la salida de uno es la entrada del otro. **Estado**: lo que viaja entre nodos y sobrevive a la sesión.

Una aclaración para evitar confusiones: hablamos de un grafo **de control**, del flujo de trabajo. No es un knowledge graph ni una base de grafos.

Y las dos cosas se necesitan. Un grafo sin loops adentro produce trabajo sin verificar, y en paralelo, o sea, más trabajo sin verificar. Un loop sin grafo alrededor es un paso excelente dentro de una fila que nadie diseñó."

### Slide 9 · Nada nuevo bajo el sol — 5:55 → 6:40
"Antes de seguir, bajemos un cambio con la palabra *grafo*, que suena a tendencia del mes. *[señalar 1736]* Los grafos tienen casi trescientos años: Euler los inventó para resolver un acertijo sobre los puentes de una ciudad, Königsberg. Después vinieron Boole, que convirtió la lógica en álgebra, y Shannon, que la convirtió en circuitos. *[señalar 1958]* En los cincuenta, la Marina de Estados Unidos y DuPont ya planificaban proyectos como redes de dependencias. Y ustedes lo usan todos los días: un algoritmo clínico es un grafo dirigido con nodos de decisión.

*[señalar la flecha de vuelta]* Un detalle que me encanta: LangGraph se inspira en Pregel, un sistema de Google de 2010. ¿Y por qué se llama Pregel? Porque es el río que cruzaban los puentes de Euler. **Lo nuevo no es el grafo. Lo nuevo es que algunos nodos ahora son un LLM.**"

---

## BLOQUE 02 · ¿UNO O VARIOS? (6:40 → 9:15)

### Slide 10 · El test de la arista falsa — 6:40 → 8:10
"¿Cómo sabemos si necesitamos un grafo? Hay un test muy simple que les recomiendo hacer mañana mismo.

Casi todos escribimos agentes como una lista: *hacé A, después B, después C*. *[señalar la fila de ANTES]* Por ejemplo, para resumir un paciente: leé el laboratorio, después las imágenes, después las evoluciones, después resumí.

Para cada flecha, la pregunta es: **¿el paso siguiente lee de verdad la salida del anterior?** ¿Las imágenes necesitan el resultado del laboratorio? No. ¿Las evoluciones necesitan las imágenes? Tampoco. *[señalar las cruces rojas]* Esas flechas son falsas: están ahí porque así lo escribimos, no porque haya un dato que cruce. Cada una es una espera inútil.

*[señalar DESPUÉS]* Si las cortamos, el dibujo cambia: los tres trabajos corren en paralelo y solo el resumen los espera a todos. Ahora cada flecha tiene nombre, el dato que transporta. **Si no podés nombrar el dato que cruza, no hay arista.**

*[señalar 40 → 4]* Esto escala mucho: un workflow de 40 pasos en línea suele tener solo tres a cinco dependencias reales. La diferencia en tiempo y en puntos de falla es enorme. Como dice Kopadze: *'el modelo nunca fue el cuello de botella. La línea que dibujaste, sí.'*"

### Slide 11 · ¿Un agente o un grafo? — 8:10 → 9:15
"Ojo, que esto no es una invitación a hacer grafos para todo. *[señalar la columna izquierda]* Quédense con un solo agente cuando la tarea es corta y entra en un contexto, cuando no hay ramas independientes, cuando fallar es barato o cuando están explorando y quieren dirigirlo ustedes.

*[señalar la derecha]* El grafo se justifica cuando hay trabajo paralelizable, cuando distintos nodos necesitan distintos permisos, cuando la salida necesita una verificación independiente o cuando tiene que poder retomarse después de una interrupción.

La frase para llevarse: **un grafo compra amplitud, no mejor criterio.** No hace al modelo más inteligente; le permite hacer más cosas a la vez y controlarlas mejor. Así que arranquen con un loop y dibujen el grafo cuando las dependencias los obliguen. Saber decir *'esto no necesita un grafo'* es la habilidad más senior de todo esto."

---

## BLOQUE 03 · PATRONES (9:15 → 13:35)

### Slide 12 · Anatomía de un nodo — 9:15 → 10:35
"Antes de los patrones, las piezas. *[señalar el contrato]* Cada nodo tiene un contrato: una entrada explícita, **un solo trabajo** y una salida estructurada, un JSON con un esquema y no texto libre. Y un estado de falla claro, para que el grafo sepa qué hacer cuando algo sale mal. Un nodo que devuelve un párrafo suelto solo lo puede leer un humano; uno que devuelve un esquema lo puede consumir el siguiente nodo sin adivinar.

*[señalar la leyenda]* Hay cuatro tipos de nodo más el humano. El **splitter** parte el trabajo. El **worker** hace una unidad, con su loop adentro. El **código**, el cuadrado gris, une, ordena y deduplica. El **rombo** verifica o aprueba. Y la **persona**, que es un nodo más. Esta gramática se repite en todos los diagramas que siguen.

*[señalar la tarjeta inferior]* Una regla práctica: si podés describir una transformación sin usar las palabras *juzgar, decidir, evaluar* o *resumir*, es código, no un agente. Deduplicar o calcular una dosis con fórmula es código. Ponerle un modelo solo suma costo, latencia y variabilidad."

### Slide 13 · Routing — 10:35 → 11:25
"Primer patrón: **routing**. Entra una consulta, *[señalar el rombo]* un clasificador decide qué tipo es y la manda solo por la ruta que hace falta: turnos, laboratorio o administrativa.

La clave es esta: **el modelo elige, pero el grafo limita las opciones.** El clasificador es probabilístico; las rutas posibles están escritas de antemano. El modelo no puede inventar un camino nuevo.

*[señalar la rama roja]* Y miren esta rama: urgencia, o 'no sé'. Cuando el clasificador no está seguro, o cuando el riesgo es alto, la consulta va directo a una persona. La rama del 'no sé' también se diseña. Lo simple queda barato y lo riesgoso va a un camino más profundo."

### Slide 14 · Paralelización: el diamante — 11:25 → 12:25
"Segundo patrón, probablemente el más útil: **el diamante**. *[recorrer de izquierda a derecha]* Un splitter reparte, varios workers trabajan en paralelo, cada uno con su propio contexto, *[señalar el cuadrado gris]* un paso de **código** comprime y deduplica, un agente sintetiza y un verificador controla antes de entregar. Fan-out, reduce, synthesize.

Es el mismo ejemplo del resumen de paciente: laboratorio, imágenes y evoluciones en paralelo, que confluyen en un resumen verificado.

Y no es teórico: es la arquitectura que Anthropic publicó para el research multiagente de Claude. Un líder planifica, los subagentes investigan en paralelo y hay una etapa dedicada a verificar las citas antes de responder.

Un detalle de diseño: unan resultados solo cuando el siguiente nodo necesita el conjunto completo. Si no, cada rama puede seguir sola."

### Slide 15 · Supervisor + ciclo controlado — 12:25 → 13:35
"Tercer patrón: el **supervisor**. *[señalar el nodo oscuro]* Acá un nodo decide sobre la marcha qué subtareas crear y a quién delegarlas. Por ejemplo, para una epicrisis: uno reúne la información, otro redacta y otro valida contra la historia clínica.

Es el patrón más flexible y, por lo mismo, el menos predecible. Por eso casi siempre viene con un **ciclo controlado**. *[señalar la flecha roja]* Si la validación falla, el trabajo vuelve a redactar, pero con topes: máximo tres intentos y un presupuesto. *[señalar la persona]* Y si no converge, se escala a una persona.

*[señalar la tarjeta]* Todo ciclo necesita cinco cosas: un test de completitud, un máximo de rondas, un presupuesto, el registro de intentos previos y una salida de escalamiento. Porque *'repetir hasta que esté bien'* no es una condición de parada: es una forma elegante de quemar presupuesto.

Guarden este patrón: en un rato vamos a ver un sistema de diagnóstico de Microsoft que es exactamente esto."

---

## BLOQUE 04 · ESTADO, ERRORES, OBSERVABILIDAD Y HITL (13:35 → 19:55)

### Slide 16 · Estado compartido — 13:35 → 14:35
"Ahora, lo que los diagramas suelen esconder: el **estado**. *[señalar la fila roja]* El error clásico es que cada nodo le pase al siguiente toda la conversación: miles de tokens donde lo importante se pierde, y cada salto lo degrada un poco más.

*[señalar la fila verde]* Lo que funciona es pasar **una referencia**. El nodo guarda su resultado como artefacto y le pasa al siguiente un identificador. El siguiente lee el original, no un resumen de un resumen.

Tres reglas: cada nodo recibe el estado mínimo que necesita; después de los nodos caros, un checkpoint, para retomar donde se cortó y no empezar de cero; y el grafo tiene que poder decir en todo momento qué corrió, qué falta y por qué tomó cada ruta. **Si no puede responder eso, sigue siendo una demo.**"

### Slide 17 · El verificador — 14:35 → 15:35
"Si tuviera que quedarme con una sola pieza, es esta. Los modelos se pierden la mayoría de sus propios errores. Entonces, regla de oro: **quien hizo el trabajo no lo verifica.**

*[señalar la escena roja]* Y hay una trampa sutil: si el verificador comparte el contexto del worker, si ve la misma conversación, no verifica nada: asiente. Es el mismo razonamiento con otra letra.

*[señalar la escena verde]* El verificador necesita dos cosas: **contexto limpio** y un **ancla**, una señal que no se pueda discutir. En software, un test que corrió de verdad. En salud, que cada afirmación apunte a un registro real de la historia clínica, no a algo que el modelo 'recuerda'.

Y una frase que resume esto: *'un loop con un verificador real le gana a un grafo sin ninguno'*."

### Slide 18 · Control de errores — 15:35 → 16:40
"Los grafos se rompen de formas distintas a un agente solo. Les dejo las cinco más comunes. *[recorrer la tabla]*

**Colapso de contexto**: juntar cientos de salidas en una sola síntesis desborda la ventana. Se resuelve uniendo por capas.

**Falsa independencia**: dos nodos que parecen independientes pero escriben el mismo recurso. Espacios aislados.

**Falla silenciosa**, la más peligrosa: un nodo muere y el informe final *parece* completo. Cada paso que une resultados tiene que contar cuántos esperaba y cuántos llegaron.

**Devolver el lote entero** cuando falla una parte: se rehace trabajo que estaba bien. Se devuelve solo la unidad que falló, con tope de intentos.

Y **reintentos que duplican efectos**: escrituras idempotentes.

La idea de fondo: *[señalar el banner]* la confiabilidad no sale de esperar que cada nodo funcione, sino de **decidir qué hace el grafo cuando uno no funciona.**"

### Slide 19 · Observabilidad — 16:40 → 17:45
"Segunda promesa del título: **observable**. La prueba es simple: ante un resultado raro, ¿pueden reconstruir en cinco minutos qué pasó?

*[señalar la traza]* Esto es una traza; los datos son ilustrativos. Una barra por nodo, en el tiempo. Se ve qué corrió en paralelo, cuántos tokens y cuánto tiempo usó cada uno, *[señalar la barra roja]* que el verificador rechazó una cita sin fuente, que hubo un reintento y *[señalar el final]* quién aprobó al final.

*[señalar las tarjetas]* La misma traza sirve para tres cosas: **debug**, reproducir exactamente una corrida; **evals**, medir cada nodo y el sistema completo, porque optimizar cada pieza por separado no garantiza que el conjunto mejore; y **costo**, ver en qué rama se va la plata.

*[señalar la tarjeta verde]* Y en salud hay un plus: la traza **es el audit trail**. Qué agente, con qué modelo, leyó qué dato, qué propuso y qué profesional lo aprobó.

**Sin trazas no hay producción.**"

### Slide 20 · Correlación: un trace_id de punta a punta — 17:45 → 18:30
"Pero ojo: tener trazas no alcanza si cada servicio arma la suya. En un incidente terminás con cinco trazas sueltas y nadie que las una. *[señalar el header]* La clave es **un solo `trace_id` por corrida** que viaje por todo el grafo. Ya hay estándar: el header `traceparent` de W3C, y OpenTelemetry lo propaga solo en cada llamada HTTP.

*[recorrer el flujo]* El problema son los saltos que no son HTTP. *[señalar MCP]* Cuando el agente llama a una herramienta por MCP, el contexto tiene que ir en el campo `_meta`; el protocolo ya lo define. *[señalar la espera humana]* Y cuando la aprobación de un profesional llega tres horas después, hay que guardar el contexto en el checkpoint para retomar la misma traza.

*[señalar el AuditEvent]* El cierre en salud: ese mismo `traceparent` se guarda en el `AuditEvent` de FHIR. Desde la auditoría de la historia clínica llegás a la traza completa del agente. **Un trace_id que se corta en un salto es un audit trail con un agujero.**"

### Slide 21 · Human-in-the-loop — 18:30 → 19:55
"Y llegamos a la slide que más me importa para esta audiencia. ¿Dónde ponemos al humano?

La respuesta habitual es: cuando el modelo tiene poca confianza. El problema es que la confianza es justamente la variable que el modelo puede manipular. **La compuerta no se abre por la confianza del modelo, sino por lo que cuesta deshacer el error.**

*[señalar el carril verde]* Un borrador interno es reversible y acotado: si la verificación automática pasa, sigue. *[carril gris]* Un cambio en una plantilla que usan muchos servicios es reversible pero amplio: checks determinísticos y revisión. *[carril rojo]* Escribir en la historia clínica, comunicarle algo al paciente o una indicación es difícil de revertir. **Ese carril no se abre. Nunca.** Ahí decide un profesional.

Y fíjense la diferencia: un carril cerrado no es un umbral muy alto. Los umbrales se ajustan con el tiempo; los carriles cerrados no.

Un último detalle: el humano va en **un solo paso**, el de mayor consecuencia. Si lo ponemos a revisar cada paso intermedio, se convierte en el nodo más lento del grafo. **Human-in-the-loop no es un parche: es una arista que se diseña.**"

---

## BLOQUE 05 · CASOS REALES Y LECCIONES (19:55 → 23:55)

### Slide 22 · El grafo ya está en todas partes — 19:55 → 20:40
"Antes de los casos, una pregunta práctica: ¿con qué se construye esto hoy? *[señalar las tres tarjetas]* Si programan, frameworks como **LangGraph** traen nodos, aristas y estado como piezas del lenguaje. Si no programan, **n8n** o **Make** son literalmente un grafo en pantalla, y n8n tiene un nodo de *AI Agent*: el LLM es un nodo más. Y los protocolos abiertos, **MCP** y **A2A**, estandarizan las aristas: cómo un agente habla con sus herramientas y con otros agentes.

*[señalar HL7]* Y en salud, HL7 ya hace años que modela grafos: una guía clínica en FHIR, un `PlanDefinition`, son acciones, condiciones y dependencias. CDS Hooks define dónde engancharse en el flujo de la historia clínica. Y lo más nuevo: **AI Transparency on FHIR**, todavía en ballot, estandariza cómo marcar qué dato tocó la IA y con qué modelo. Es el audit trail del que hablamos, como estándar. **No hace falta inventar el grafo; hace falta diseñarlo bien.**"

### Slide 23 · Caso 1 · Mount Sinai — 20:40 → 22:05
"Ahora sí, dos casos publicados. El primero es de un hospital académico, Mount Sinai, en Nueva York. Publicado en marzo de este año en *npj Health Systems*, con revisión por pares.

*[señalar el diagrama]* Compararon dos diseños en tareas clínicas: buscar información, extraer datos y calcular dosis de medicación. A la izquierda, un único agente que hace todo. A la derecha, un orquestador que reparte el trabajo entre agentes especializados.

Y los sometieron a carga, hasta 80 tareas simultáneas. *[señalar el 16%]* Con 80 tareas, el agente único cayó al **16% de precisión**. *[señalar el 65×]* Y consumió hasta **65 veces más cómputo**. El orquestado mantuvo la precisión estable.

*[señalar las tres tarjetas]* Lo que me gusta de este caso es que muestra los tres adjetivos del título. **Predecible**: la precisión se sostiene bajo carga. **Observable**, y cito a uno de los autores: *'cada paso queda registrado: qué herramienta se llamó, qué devolvió y cómo se armó la respuesta'*. Y **escalable**: 65 veces menos cómputo.

Una aclaración honesta: fueron condiciones simuladas. El próximo paso que declaran es probarlo con datos de pacientes en tiempo real."

### Slide 24 · Caso 2 · Microsoft MAI-DxO — 22:05 → 23:30
"El segundo caso es de Microsoft: MAI-DxO, un orquestador de diagnóstico. Resuelve casos clínicos paso a paso: pregunta, pide estudios y propone un diagnóstico.

*[señalar el mapeo]* Lo interesante es su diseño: un panel de cinco 'médicos virtuales', y cada uno es una pieza del grafo que vimos. Dr. Hypothesis mantiene el diferencial: es el supervisor. Dr. Challenger es el abogado del diablo: el verificador. Dr. Stewardship controla costos: el presupuesto del ciclo. Dr. Checklist es la compuerta de calidad.

*[señalar los números]* En 304 casos complejos del New England Journal, llegó al **85%** de diagnósticos correctos, contra un **20%** promedio de 21 médicos con experiencia, y pidiendo estudios más baratos.

Ahora, y esto hay que decirlo con todas las letras: es un preprint sin revisión por pares; los médicos trabajaron sin poder consultar colegas, libros ni IA; son casos raros, no consultas cotidianas; y **no está aprobado para uso clínico.**

*[señalar el banner]* Lo que sí nos enseña es que la mejora vino del diseño del grafo (roles, verificador, presupuesto), no de un modelo nuevo. Es el mismo argumento del +13.7 del principio, ahora en medicina."

### Slide 25 · Lecciones aprendidas — 23:30 → 23:55
"Cinco lecciones, rápido. **Uno**: empiecen con un loop. **Dos**: corten las aristas falsas, y lo que puede ser código, que sea código. **Tres**: construyan el verificador primero, con contexto limpio y anclas reales. **Cuatro**: evalúen el sistema entero; sin trazas no hay producción. **Cinco**: el humano va en un solo paso, el irreversible."

---

## CIERRE (23:55 → 25:00)

### Slide 26 · Checklist — 23:55 → 24:30
"Si se llevan una sola slide, que sea esta. Antes de dibujar un grafo, cinco preguntas. ¿Puedo nombrar el dato que cruza cada arista? ¿Qué nodos son código y cuáles necesitan un modelo? ¿Dónde está el verificador y qué ancla usa? ¿Qué pasa cuando falla cada nodo, y puedo reconstruir una corrida desde la traza? ¿Y dónde decide un humano, y qué carril no se abre nunca?"

### Slide 27 · Cierre — 24:30 → 25:00
"Volvamos al principio. *'Funcionó en local'* es donde termina la demo. Predecible, observable y escalable es donde empieza el sistema.

Y si tienen que resumirlo en tres verbos: el harness **contiene**, el loop **converge** y el grafo **reparte**.

Muchas gracias. Me encuentran en LinkedIn y en *IA en un Sorbo*. Ahora sí, vamos al chat: *[leer 1 o 2 respuestas de la slide 3 y abrir preguntas]*."

---

## Preguntas probables (Q&A)

**"¿La IA reemplaza al médico?"**
"Los dos casos dicen lo mismo: MAI-DxO no está aprobado para uso clínico y Mount Sinai todavía no lo probó con pacientes reales. En el diseño que propongo, el humano es el nodo que decide en el carril irreversible. No es un adorno: es la arista más importante del grafo."

**"¿Qué framework recomendás?"**
"El que su equipo pueda sostener. LangGraph es el punto de partida más común; también están el Agent SDK de Anthropic y los workflows de Claude Code. Los conceptos (nodos, aristas, estado, compuertas) se trasladan a cualquiera. Mi consejo: elijan uno y armen tres grafos reales antes de mirar otro."

**"¿Esto no es caro?"**
"Puede serlo. Un grafo consume más tokens que un chat; la topología es tu modelo de costos. Por eso: modelos chicos en nodos simples, código donde no hace falta juicio, presupuesto por rama y el grafo completo solo cuando la tarea lo vale. Y la traza te dice exactamente dónde se va la plata."

**"¿Cómo se maneja la privacidad de los datos de pacientes?"**
"Pasando referencias en lugar de transcripciones, dando a cada nodo solo el estado mínimo, con permisos por nodo y con observabilidad que se pueda alojar en infraestructura propia. El audit trail no es un extra: es parte del diseño."

**"¿No es 'Graph Engineering' un buzzword?"**
"Probablemente el nombre pase. La habilidad no: diseñar sistemas confiables alrededor de modelos no confiables. Son ideas de workflows y sistemas distribuidos que tienen décadas; lo nuevo es que ahora los nodos razonan."
