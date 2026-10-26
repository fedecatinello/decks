window.DECK = {
  course: "Arquitectura de Soluciones Digitales",
  modules: [
    {
      id: "infra",
      unit: "Clase 01",
      title: "Infraestructura, virtualización y containers",
      blurb: "Del edificio al proceso. Qué se diseña antes de hablar de un cluster.",
      slides: [
        {
          layout: "title",
          kicker: "Unidad 03",
          title: "Infraestructura, virtualización y containers",
          sub: "La aplicación no corre en el aire. Esta clase recorre el stack que la sostiene, hasta el proceso empaquetado.",
          notes: "Abrí con la pila completa, no con el edificio. El edificio es la primera capa. El cierre de la clase es el container, y la clase que viene es quién opera muchos de esos containers."
        },
        {
          layout: "agenda",
          kicker: "Recorrido",
          title: "Cuatro estaciones, un cierre",
          items: [
            ["01", "Site y datacenter", "Dónde está y qué tiene que seguir encendido."],
            ["02", "Sizing", "Cómo se estima el equipo antes de pedirlo."],
            ["03", "Virtualización", "Varios sistemas sobre el mismo hardware."],
            ["04", "Containers", "La imagen, el proceso y el contrato de una app portable."]
          ],
          foot: "Al final: qué cambia si la carga es un modelo.",
          notes: "No prometas un curso de cloud ni de modelos. La capa de nube y la de IA son un cierre, no un desvío. Si el tiempo aprieta, recortá storage y la matriz, no la comparación VM/container ni el cierre."
        },
        {
          layout: "statement",
          kicker: "Definición",
          title: "Infraestructura es todo lo que sostiene a la aplicación, y sin lo cual no corre.",
          cards: [
            ["Site", "Datacenter, power, cooling, access."],
            ["Conectividad", "WAN, red del datacenter, storage."],
            ["Cómputo", "Servidor, VM o container."],
            ["Plataforma", "Lo que opera esas piezas cuando dejan de ser una."]
          ],
          notes: "La frase es la definición de la unidad. Si alguien dice que infraestructura es el datacenter, devolvé la pila: el datacenter es la capa de abajo."
        },
        {
          layout: "media",
          kicker: "Datacenter",
          title: "Primero se elige el site. Después se acondiciona.",
          image: "img/aisle.jpg",
          alt: "Racks de un datacenter, vistos de atrás, con el cableado a la vista",
          credit: "Unsplash",
          points: [
            ["Site", "Riesgo del lugar, acceso y margen para crecer. No se elige por el precio del metro."],
            ["Facility", "Power y agua continuas, access control, carga estructural, y un lugar para combustible y descarga."],
            ["Fire", "Detección temprana, sensores por aspiración, agente limpio, y gente de guardia."]
          ],
          notes: "Frame de una sala real, no de un checklist. Agente limpio: no usa agua sobre el equipo. FM-200 es el ejemplo histórico; hoy también se ven otros agentes. No abras normativa si no te la piden. La pantalla que sigue es el video: dale play y no hables encima del primer minuto."
        },
        {
          layout: "video",
          kicker: "Datacenter",
          title: "Así se ve por dentro.",
          sub: "Un recorrido por la sala, el power y el cooling. Mirá el video y después volvé a las capas.",
          video: "FsxthdQ_sL4",
          poster: "img/src/datacenter-tour.jpg",
          notes: "Es un tour de datacenter. No lo narres entero: play, un minuto de sala, pausá en power o en el pasillo y retomá con la pantalla de UPS. Si el proyector no tiene internet, el link de abajo abre YouTube en el teléfono."
        },
        {
          layout: "flow",
          kicker: "Energía",
          title: "La IT va detrás de la UPS. El cooling, no.",
          source: "Utility",
          lanes: [
            ["Backup", ["Generators redundantes", "Transformers y tableros en N+1 o 2(N+1)"]],
            ["IT", ["UPS redundante", "Power estabilizada para el cómputo"]],
            ["Cooling", ["Desde utility", "No cuelga del mismo UPS que los servers"]]
          ],
          notes: "N+1 es un equipo de más respecto de lo que hace falta para funcionar. 2(N+1) duplica ese esquema. El punto fino: climatización e informática no comparten el mismo camino de respaldo. Si cae la UPS, no querés que el aire y los servidores mueran por la misma causa sin haberlo diseñado."
        },
        {
          layout: "figure",
          kicker: "Cooling",
          title: "El aire entra por el cold aisle y sale por el hot aisle.",
          image: "img/src/hot-cold-aisle.png",
          alt: "Diagrama de pasillos frío y caliente con raised floor y equipos de precision cooling",
          notes: "Señalá el raised floor y las perforated tiles. El azul sube al frente del rack; el rojo vuelve al cooling. Mencioná PUE en una frase. El puente a IA: una GPU cambia este dibujo cuando el aire no alcanza."
        },
        {
          layout: "figure",
          kicker: "WAN",
          title: "Cómo se conectan los edificios.",
          image: "img/src/wan-topology.png",
          alt: "Topología de red entre edificios, con MAN, Frame Relay y MPLS",
          notes: "El dibujo dice Fame Relay: es Frame Relay, y es la parte histórica. Lo que sigue vigente es la MAN y el MPLS, con un router core primario y otro secundario. No actualices el gráfico en vivo: decí que la nube agrega una red privada al lado, no en lugar, de esto."
        },
        {
          layout: "figure",
          kicker: "Datacenter network",
          title: "Del perimeter al storage, adentro de la sala.",
          image: "img/src/dc-topology.png",
          alt: "Topología del datacenter: internet, firewall, core, load balancer, servers y storage",
          notes: "Recorré de arriba hacia abajo: internet, cluster de firewall, switches core, load balancer, servers, y abajo el storage por fibra. El dibujo tiene typos (swithces, balanceador). No los corrijas en voz alta salvo que alguien los marque. IPS, WAF y SIEM no están dibujados: nombrálos como lo que se suma en el perimeter."
        },
        {
          layout: "compare",
          kicker: "Storage",
          title: "File y block no resuelven el mismo problema.",
          columns: [
            {
              label: "NAS",
              layers: [
                ["Qué ve el servidor", "Un sistema de archivos compartido"],
                ["Por dónde viaja", "Ethernet"],
                ["Cuándo encaja", "Compartir archivos entre varios equipos"]
              ]
            },
            {
              label: "SAN",
              layers: [
                ["Qué ve el servidor", "Un disco, como si fuera local"],
                ["Por dónde viaja", "Fibre Channel o iSCSI"],
                ["Cuándo encaja", "Bases y cargas que miden throughput, no solo espacio"]
              ]
            }
          ],
          notes: "El sizing de disco sale de dos números: espacio y throughput de lectura o escritura. RAID o réplica se eligen por ese throughput y por cuánta falla se tolera. No son un default."
        },
        {
          layout: "statement",
          kicker: "Sizing",
          title: "Sizing es una estimación con datos. No es un pedido de servidor.",
          cards: [
            ["Antes", "Tipo de aplicación, usuarios, concurrencia, transacciones."],
            ["Durante", "Simular, medir y ajustar. El número de catálogo no alcanza."],
            ["Después", "Crecimiento. El equipo de hoy no es el de dentro de tres años."],
            ["Comparar", "CPU entre marcas con una métrica publicada, no con el GHz."]
          ],
          notes: "Métricas que podés nombrar: SPEC, SAPS, TPC. El hábito que querés dejar es medir. El anti-patrón es copiar el servidor del proyecto anterior."
        },
        {
          layout: "table",
          kicker: "Sizing",
          title: "Cada tipo de aplicación empuja un recurso distinto.",
          headers: ["", "CPU", "Memory", "Disk", "Network"],
          rows: [
            ["Static", "Baja", "Baja", "Lectura, espacio medio", "Bandwidth"],
            ["SSR", "Media", "Media", "Poco estado local", "Latency y bandwidth"],
            ["App server", "Alta", "Alta", "Bajo", "Latency entre servicios"],
            ["OLTP", "Media-alta", "Alta", "Escritura y espacio", "Latency muy baja"],
            ["OLAP", "Alta", "Muy alta", "Mucho espacio, lectura", "Throughput sostenido"]
          ],
          note: "Tendencias, no una tabla de compra. Cada caso se mide.",
          notes: "Leé una fila, no las cinco. La de OLTP contra la de analítica alcanza para mostrar que disco y red no son un solo número. Si preguntan por IA, decí que entra como otra fila y que la ves al final: el recurso nuevo es la memoria del acelerador."
        },
        {
          layout: "cards",
          kicker: "CPU",
          title: "El nombre del procesador importa menos que con qué lo comparás.",
          cards: [
            ["x86 de datacenter", "Intel Xeon Scalable y AMD EPYC. El segundo ganó sitio por cores y precio."],
            ["ARM de provider y de datacenter", "Graviton en AWS. Ampere cuando el ARM está on-prem."],
            ["El lab del alumno", "Apple Silicon sirve para desarrollar. No es el criterio de un servidor."]
          ],
          notes: "No actualices el catálogo en vivo: las generaciones cambian de nombre todos los años. El criterio estable es la métrica y el tipo de carga. Graviton es un ejemplo de que el cloud también elige CPU, no un sponsor."
        },
        {
          layout: "cards",
          two: true,
          kicker: "Escala",
          title: "Disco, red y la decisión de crecer para arriba o para el costado.",
          cards: [
            ["Disk", "Espacio para el dato y su crecimiento. Throughput para decir qué disco y qué protección."],
            ["Network", "Bandwidth es cuánto entra. Latency es cuánto tarda un paquete. Una app puede llenar una y fallar por la otra."],
            ["Scale up", "Más CPU o memory en el mismo equipo. El hardware que lo permite sale más caro, y tiene techo."],
            ["Scale out", "Más equipos. Exige que la aplicación se deje partir. Ahí aparecen la VM y el container."]
          ],
          notes: "Este es el puente. Si no pueden partir la app, escalar para el costado es un deseo. No lo resuelvas todavía con Kubernetes."
        },
        {
          layout: "statement",
          kicker: "Virtualización",
          title: "Varios servidores lógicos en un solo hardware.",
          cards: [
            ["Comparte", "CPU, memory, disk e IO del host."],
            ["Type 1", "El hypervisor es el sistema del server. KVM, ESXi, Hyper-V."],
            ["Type 2", "Corre arriba de un OS de uso general. El caso del lab."],
            ["Farm", "Con shared storage, si cae un host otro levanta sus VMs."]
          ],
          notes: "Sacá de la lista vieja Sun Containers, Virtual Server, OpenVZ y Xen como recomendación actual. Podés decir que existieron. Hoy el mapa es KVM, los hipervisores comerciales y el hipervisor del proveedor cloud."
        },
        {
          layout: "figure",
          kicker: "Consolidation",
          title: "Tres servers ociosos caben en uno.",
          image: "img/src/consolidation.png",
          alt: "Tres servidores al 20, 12 y 30 por ciento de CPU consolidados en uno al 62 por ciento",
          notes: "Leé los números: 20, 12 y 30 por ciento de CPU, y memoria 4, 2 y 7 sobre 16, pasan a un solo equipo al 62 por ciento y 13 de 16. Eso es consolidar. El overcommit es otra cosa: prometer más memoria de la física. Si las VMs la piden juntas, hay swap, ballooning o un OOM. No lo presentes como ventaja gratis."
        },
        {
          layout: "pair",
          kicker: "VM vs container",
          title: "La VM repite el guest OS. El container no.",
          images: [
            { src: "img/src/vm-stack.png", alt: "Tres aplicaciones, cada una con su guest OS, sobre un hypervisor", credit: "Virtual machine" },
            { src: "img/src/container-stack.png", alt: "Tres aplicaciones con sus librerías sobre un container runtime y un solo OS", credit: "Container" }
          ],
          notes: "Parate en la franja gris. A la izquierda hay un guest OS por app. A la derecha hay un solo operating system y el runtime encima. Ese es el ahorro de RAM y de disco. El límite es el mismo: el kernel es compartido, así que a veces la VM sigue siendo la respuesta."
        },
        {
          layout: "figure",
          kicker: "VM vs container",
          title: "Menos RAM, arranque más corto, aislamiento distinto.",
          image: "img/src/containers-vs-vms.png",
          alt: "Comic de Julia Evans que compara containers y virtual machines",
          credit: "Julia Evans",
          notes: "No leas los seis cuadros. Alcanza con tres: un container es un grupo de procesos, una VM es una computadora falsa, y por eso el container usa menos RAM y arranca antes. El cuadro de seguridad lo dejás para la pregunta de isolation."
        },
        {
          layout: "figure",
          kicker: "12-factor",
          title: "El contrato para que la imagen sea portable.",
          image: "img/src/twelve-factor.png",
          alt: "Los doce factores: codebase, dependencies, config, backing services, build release run, processes, port binding, concurrency, disposability, dev/prod parity, logs y admin processes",
          notes: "No recites los doce. Señalá config (sale de la imagen), processes (stateless) y disposability (se puede matar). El póster dice baking services: es backing services. Si te piden la lista completa, está en el dibujo."
        },
        {
          layout: "media",
          kicker: "Containers",
          title: "Segundos, un cambio en un archivo, y un runtime que ya no es Docker.",
          image: "img/containers.jpg",
          alt: "Containers de carga vistos desde arriba en una terminal",
          credit: "Unsplash",
          points: [
            ["Provisioning", "De minutos a segundos. La imagen ya trae el proceso y sus dependencias."],
            ["El cambio", "Queda en el Dockerfile. La imagen que corre es immutable."],
            ["Runtime", "containerd o CRI-O. Docker construye imágenes. LXC es el antepasado."]
          ],
          notes: "Esta corrección vale oro: en Kubernetes, Docker no es el runtime desde que salió dockershim. El alumno puede seguir usando docker build. El nodo corre otra cosa. CoreOS rkt: nombralo solo si alguien lo trae, y como discontinuado."
        },
        {
          layout: "choices",
          kicker: "Decisión",
          title: "El container no es el default. Estas cinco preguntas lo frenan.",
          choices: [
            ["El equipo", "Si ya operan VMs y la app no justifica el salto, el cambio de herramienta es costo."],
            ["La forma de la app", "Si no se deja configurar por entorno ni partir, la imagen esconde un monolito."],
            ["Licensing", "Algunos vendors cuentan instancias de un modo que cierra mejor en una VM."],
            ["Isolation", "Kernel compartido no alcanza si hace falta otro OS o un límite más duro."],
            ["Bottleneck", "Si el problema es scale up y el hypervisor ya lo resuelve, el container no lo agranda."]
          ],
          notes: "Esta era la mejor slide de la PPT. Dejala como cierre del bloque técnico, antes de la nube y de IA. La respuesta madura es un mapa, no una moda."
        },
        {
          layout: "cards",
          kicker: "Nube",
          title: "El provider te alquila el datacenter. No te diseña la aplicación.",
          cards: [
            ["El node", "El sizing pasa de marca de server a instance type. CPU, memory y disk siguen siendo tu estimación."],
            ["La network", "Aparece la red privada del provider y el link para llegar. Latency y bandwidth no se tercerizan."],
            ["El state", "El disk de la VM no es el dato de la aplicación. Lo que tiene que sobrevivir vive fuera de la imagen."]
          ],
          notes: "Una pantalla, tres decisiones. No nombres diez productos. Si querés un ejemplo, alcanza con decir que una VM en un proveedor sigue pidiendo el mismo método de sizing de hace un rato."
        },
        {
          layout: "media",
          kicker: "IA",
          title: "Una carga de IA cambia el sizing. No reemplaza el stack.",
          image: "img/gpu.jpg",
          alt: "Dos placas GPU, el recurso que el sizing de CPU no ve",
          credit: "Unsplash",
          points: [
            ["Training", "Muchos aceleradores, mucho dato, un batch que termina. No es un servicio eterno."],
            ["Serving", "Pocos aceleradores, latency y replicas. Un app server con otro recurso."],
            ["Qué no entra en la imagen", "Ni la GPU ni el dataset. Se estiman GPU memory y el disco de los pesos."]
          ],
          notes: "No des una clase de modelos. La distinción entrenar/servir es la única que necesitás. Cerrá el círculo con clima y sizing: la GPU calienta el rack y no entra en la tabla de recién sin una fila nueva."
        },
        {
          layout: "close",
          kicker: "Cierre",
          title: "El container no apaga el datacenter. Lo esconde debajo.",
          sub: "La clase que viene toma muchos de esos procesos y declara cuántos tienen que estar corriendo, y en qué versión.",
          notes: "Si te queda un minuto, mostrá la pila al revés: proceso, VM o container, servidor, red, sala. Kubernetes entra porque esa última capa, el proceso, se volvió demasiada para operarla a mano."
        }
      ]
    },
    {
      id: "k8s",
      unit: "Clase 02",
      title: "Kubernetes - Cluster de contenedores",
      blurb: "Quién mantiene el número, la versión y la entrada de los containers.",
      slides: [
        {
          layout: "title",
          kicker: "Kubernetes",
          title: "Introducción a Kubernetes",
          sub: "Un sistema para declarar cuántas copias corren, en qué nodo, y cómo se reemplazan sin bajar el nombre del servicio.",
          notes: "Enganchalo con la clase anterior: el container ya existe. Esta clase es la operación de muchos. Kubernetes salió de Google y está en la CNCF. Corre en un datacenter propio o en cualquier provider. No abras la historia más de treinta segundos."
        },
        {
          layout: "agenda",
          kicker: "Recorrido",
          title: "Del problema a los objetos",
          items: [
            ["01", "El hueco", "El container no se reinicia, no se balancea y no se actualiza solo."],
            ["02", "El cluster", "Control plane y nodos. Quién decide y quién ejecuta."],
            ["03", "Los objetos", "Pod, Deployment, Service, config y el entrypoint."],
            ["04", "El diseño", "Qué sigue siendo tuyo cuando el cluster es gestionado."]
          ],
          foot: "Al final: servir un modelo sin confundirlo con el control plane.",
          notes: "Las dos animaciones —reconciliar y rolling update— son el corazón. Si vas justo, no saltees esas dos. Salteá el YAML si ya lo vieron en la animación."
        },
        {
          layout: "statement",
          kicker: "El hueco",
          title: "Un container solo no es una plataforma.",
          cards: [
            ["Si muere", "Nadie lo vuelve a crear."],
            ["Si hay que crecer", "Nadie reparte las copias."],
            ["Si hay que cambiar la versión", "El corte lo hacés vos, a mano."],
            ["Si hay que encontrarlo", "La IP del proceso no es un contrato."]
          ],
          notes: "Orquestar es cerrar esos cuatro huecos: sanar, escalar, actualizar y nombrar. La lista de la PPT vieja —monitor, provisioning, autoscaling, load balancing, rolling update— entra acá, sin diapositiva aparte."
        },
        {
          layout: "cluster",
          kicker: "Anatomía",
          title: "Una puerta de entrada, un estado, y nodos que ejecutan.",
          parts: [
            ["control", "API server", "Toda orden entra por acá. kubectl habla con este proceso, no con los nodos."],
            ["control", "etcd", "Ahí vive el estado: qué nodos hay y qué se declaró. Si se pierde, el cluster no sabe qué es."],
            ["control", "Scheduler", "Elige nodo para un Pod nuevo. No lo ejecuta."],
            ["control", "Controller manager", "Mira lo declarado y lo que hay, y pide corregir la diferencia."],
            ["node", "kubelet", "En el nodo, hace correr lo que se decidió y reporta si sigue vivo."],
            ["node", "kube-proxy", "Programa el camino para que un Service llegue a los Pods."],
            ["node", "Runtime", "containerd o CRI-O. Prende y apaga containers. Docker, en el cluster, no."],
            ["client", "kubectl", "El cliente. Toda orden sale de acá y entra solo por el API server."]
          ],
          notes: "Hacé clic en etcd y en el scheduler: son los dos que más se confunden. etcd guarda; el scheduler ubica; el kubelet ejecuta. Minions era el nombre viejo de los workers: si aparece en un apunte, traducilo a nodo."
        },
        {
          layout: "cards",
          kicker: "Pod",
          title: "El Pod es la unidad que se despliega. El container, no.",
          cards: [
            ["Uno o varios", "Procesos que arrancan juntos, se ven por localhost y mueren juntos."],
            ["Una IP", "El Pod tiene dirección propia. Los containers de adentro la comparten."],
            ["Volumen", "Si necesita disco, se lo declara. El disco no vive dentro de la imagen."],
            ["Efímero", "No se repara un Pod roto. Se crea otro con la misma spec."]
          ],
          notes: "Resistí el ejemplo de varios containers por Pod salvo sidecar. El caso base de la materia es un container por Pod. La IP del Pod no se le entrega a un cliente: para eso está el Service, dos pantallas más adelante."
        },
        {
          layout: "beats",
          kicker: "Desired state",
          title: "El controller empuja el cluster hacia lo declarado.",
          desiredLabel: "Replicas",
          beats: [
            {
              caption: "Pedís una replica. Hay un Pod. Declarado y real coinciden.",
              desired: "1",
              nodes: [
                ["Node 1", [{ v: 1, state: "ready" }]],
                ["Node 2", []],
                ["Node 3", []]
              ]
            },
            {
              caption: "Alguien cambia el manifest a 3. El cluster todavía tiene una.",
              desired: "3",
              nodes: [
                ["Node 1", [{ v: 1, state: "ready" }]],
                ["Node 2", []],
                ["Node 3", []]
              ]
            },
            {
              caption: "El controlador crea las que faltan. Le importa el número, no el nodo.",
              desired: "3",
              nodes: [
                ["Node 1", [{ v: 1, state: "ready" }]],
                ["Node 2", [{ v: 1, state: "ready" }]],
                ["Node 3", [{ v: 1, state: "ready" }]]
              ]
            },
            {
              caption: "Cae un node. La replica que vivía ahí desaparece.",
              desired: "3",
              nodes: [
                ["Node 1", [{ v: 1, state: "ready" }]],
                ["Node 2", [], true],
                ["Node 3", [{ v: 1, state: "ready" }]]
              ]
            },
            {
              caption: "El controlador ve 2 y crea la tercera. Eso es reconciliar.",
              desired: "3",
              nodes: [
                ["Node 1", [{ v: 1, state: "ready" }, { v: 1, state: "starting" }]],
                ["Node 2", [], true],
                ["Node 3", [{ v: 1, state: "ready" }]]
              ]
            }
          ],
          notes: "Avanzá con la flecha: esta pantalla tiene pasos adentro. No expliques el bucle en abstracto y después la animación. La animación es la explicación. Frase para cerrar el último paso: Kubernetes no configura el servidor a mano; insiste hasta que el número coincide."
        },
        {
          layout: "deploy",
          kicker: "Deployment",
          title: "Un Deployment, un ReplicaSet por versión.",
          parts: [
            ["deployment", "Deployment", "No corre Pods. Guarda un ReplicaSet por revisión y señala cuál es la actual."],
            ["v1", "ReplicaSet V1", "La revisión anterior. Queda para volver atrás. Sus Pods ya no son los activos."],
            ["v2", "ReplicaSet V2", "Otra revisión guardada. El Deployment puede tener varias; una sola recibe réplicas."],
            ["v3", "ReplicaSet V3", "La revisión actual. Es la que mantiene el número de Pods declarados."],
            ["pod-v1", "Pod", "Pertenece al ReplicaSet V1, no a un Node."],
            ["pod-v2", "Pod", "Pertenece al ReplicaSet V2, no a un Node."],
            ["pod-v3", "Pod", "Pertenece al ReplicaSet V3. El scheduler lo ubica en cualquier Node con lugar."],
            ["node", "Node", "Los Pods no están atados a un Node. Las líneas cruzan porque el scheduler elige."]
          ],
          notes: "Clic de arriba hacia abajo. El Deployment no corre nada: tiene un ReplicaSet por versión y solo uno está activo. Los otros quedan para el rollback. Después señalá un Node: el Pod no le pertenece, por eso puede caer en cualquiera. El YAML viene en la pantalla siguiente."
        },
        {
          layout: "yaml",
          kicker: "Deployment",
          title: "El Deployment declara el template. El ReplicaSet cuenta.",
          code: [
            "apiVersion: apps/v1",
            "kind: Deployment",
            "metadata:",
            "  name: demo",
            "spec:",
            "  replicas: 3",
            "  selector:",
            "    matchLabels:",
            "      app: demo",
            "  template:",
            "    metadata:",
            "      labels:",
            "        app: demo",
            "    spec:",
            "      containers:",
            "        - name: demo",
            "          image: ghcr.io/ejemplo/demo:1.4.0",
            "          ports:",
            "            - containerPort: 8080"
          ],
          notes: "No leas el YAML línea por línea. Marcá tres cosas: replicas, la label que une selector y template, y la imagen con versión. El ReplicaSet es el objeto que garantiza el número; el Deployment es el que sabés cambiar cuando sale una versión nueva."
        },
        {
          layout: "cards",
          kicker: "Service",
          title: "Los Pods cambian de IP. El Service no.",
          cards: [
            ["Un nombre", "DNS dentro del cluster. La aplicación no busca Pods por dirección."],
            ["Varios destinos", "El Service reparte entre los Pods que hoy coinciden con su selector."],
            ["Ready", "No manda tráfico a un Pod que todavía no pasó el probe."],
            ["Estable", "Se reemplazan los Pods de atrás y el cliente sigue hablando con el mismo nombre."]
          ],
          notes: "Es el contrato de red de la materia. No hace falta abrir ClusterIP, NodePort y LoadBalancer salvo que pregunten. Si preguntan: ClusterIP es interno; los otros publican hacia afuera, y hoy la puerta seria es Gateway, no un NodePort de producción."
        },
        {
          layout: "beats",
          kicker: "Rolling update",
          title: "La versión cambia de a una. El nombre del Service queda quieto.",
          service: "demo",
          beats: [
            {
              caption: "Tres Pods v1 detrás del Service.",
              desired: "v1",
              nodes: [
                ["Node 1", [{ v: 1, state: "ready" }]],
                ["Node 2", [{ v: 1, state: "ready" }]],
                ["Node 3", [{ v: 1, state: "ready" }]]
              ]
            },
            {
              caption: "Aparece un v2. Hasta que no está Ready, no recibe tráfico.",
              desired: "v2",
              nodes: [
                ["Node 1", [{ v: 1, state: "ready" }]],
                ["Node 2", [{ v: 1, state: "ready" }]],
                ["Node 3", [{ v: 1, state: "ready" }, { v: 2, state: "starting" }]]
              ]
            },
            {
              caption: "El v2 entra. Sale un v1. Nunca se bajan todos juntos.",
              desired: "v2",
              nodes: [
                ["Node 1", [{ v: 1, state: "leaving" }]],
                ["Node 2", [{ v: 1, state: "ready" }]],
                ["Node 3", [{ v: 2, state: "ready" }]]
              ]
            },
            {
              caption: "Se repite. Siempre queda capacidad de la versión que todavía responde.",
              desired: "v2",
              nodes: [
                ["Node 1", [{ v: 2, state: "ready" }]],
                ["Node 2", [{ v: 1, state: "ready" }]],
                ["Node 3", [{ v: 2, state: "ready" }]]
              ]
            },
            {
              caption: "Quedan tres v2. El cliente no cambió de dirección.",
              desired: "v2",
              nodes: [
                ["Node 1", [{ v: 2, state: "ready" }]],
                ["Node 2", [{ v: 2, state: "ready" }]],
                ["Node 3", [{ v: 2, state: "ready" }]]
              ]
            }
          ],
          notes: "Misma tecla que la reconciliación, o los botones de la pantalla. El Service solo pinta los Pods Ready: el que está Starting no recibe tráfico, y el que sale deja de recibirlo. El nombre del Service no cambia. Blue/green lo podés nombrar como la otra estrategia. Si un paso falla, el Deployment puede frenar."
        },
        {
          layout: "compare",
          kicker: "Configuración",
          title: "La config sale de la imagen. El Secret no se commitea.",
          columns: [
            {
              label: "ConfigMap",
              layers: [
                ["Qué guarda", "Configuración que no es un secreto"],
                ["Para qué", "La misma imagen corre en más de un entorno"],
                ["Dónde no va", "Adentro del Dockerfile"]
              ]
            },
            {
              label: "Secret",
              layers: [
                ["Qué guarda", "Una key, un token, un certificado"],
                ["Para qué", "Sacarlo de la spec y del repositorio"],
                ["Límite", "Es pequeño. No es el lugar de un modelo ni de un dump"]
              ]
            }
          ],
          notes: "Decí en voz alta que un Secret de Kubernetes no es una bóveda: se puede leer con acceso al cluster y etcd tiene que estar cifrado para que el disco no lo muestre en claro. Alcanza como advertencia. No des un procedimiento de ataque ni de extracción."
        },
        {
          layout: "gateway",
          kicker: "Gateway",
          title: "La puerta, el camino y el nombre estable.",
          parts: [
            ["client", "Client", "Llama desde afuera. No conoce Pods ni direcciones de adentro."],
            ["gateway", "Gateway", "El entrypoint. Ahí viven los listeners, el puerto y dónde termina TLS."],
            ["route", "HTTPRoute", "El camino: host, path y hacia qué Service. Se cambia sin tocar la puerta."],
            ["service", "Service", "El nombre estable. La route no apunta a un Pod."],
            ["pod", "Pod", "El destino. El Service reparte entre los que están Ready."]
          ],
          notes: "Recorré de arriba hacia abajo con un clic en cada caja. La frase: Ingress metía la puerta y el camino en un solo objeto. Acá el Gateway y la HTTPRoute tienen ciclos distintos, y ninguno reemplaza al Service. No bajes a GatewayClass salvo que pregunten."
        },
        {
          layout: "cards",
          two: true,
          kicker: "Entrada",
          title: "Ingress junta todo. Gateway separa el entrypoint del route.",
          cards: [
            ["Ingress", "Sigue existiendo. Congelado como diseño: una sola objeto para la entrada y las reglas. La clase vieja lo daba por reemplazado; es legado, no un interruptor apagado."],
            ["Gateway", "El Gateway es el entrypoint. HTTPRoute es el camino hacia el Service. Se cambian con ciclos distintos."],
            ["Qué no es", "Ninguno de los dos reemplaza al Service. Publican hacia afuera algo que adentro ya tiene nombre."],
            ["Qué diseñás", "Quién termina TLS, qué host entra y hacia qué Service sale. El resto es implementación del controlador."]
          ],
          notes: "Corregí la slide vieja sin pelearte con ella: Ingress no fue borrado. La evolución es Gateway API. No bajes a GatewayClass salvo una pregunta de implementación."
        },
        {
          layout: "choices",
          kicker: "Diseño",
          title: "Tres decisiones que el dibujo del cluster no muestra.",
          choices: [
            ["Namespace", "Agrupa nombres, cuota y acceso. Sin eso, todo el cluster es un solo ambiente."],
            ["Requests y limits", "El request es lo que el scheduler reserva. El limit es lo que el nodo no deja pasar."],
            ["Probes", "Kubernetes no adivina si el proceso está sano. Liveness, readiness y startup se declaran."]
          ],
          notes: "Una pantalla, no un tutorial de YAML. Request sin limit, o readiness ausente, explica la mayoría de los incidentes de una primera app en el cluster. Atá readiness con el rolling update: sin esa prueba, el Service manda tráfico a un Pod que todavía no responde."
        },
        {
          layout: "cards",
          kicker: "Nube",
          title: "En un cluster gestionado, el control plane no es tuyo. El diseño sí.",
          cards: [
            ["De ellos", "API server, etcd, scheduler y controllers. GKE, EKS o AKS son el mismo patrón."],
            ["Tuyo", "Tipo y cantidad de nodos, red de Pods, Gateway, requests y el lugar del estado."],
            ["Lo que no se delega", "La aplicación sigue teniendo que ser movable. El provider no arregla un proceso que guarda el dato en el disco local."]
          ],
          notes: "Cerrá el círculo con la unidad anterior: el provider alquila el datacenter y, acá, también opera el control plane. El método de diseño no se achica. Se achica la operación del control plane."
        },
        {
          layout: "dark-cards",
          kicker: "Cierre de IA",
          title: "El modelo se sirve como una app. El nodo tiene que anunciar el recurso.",
          cards: [
            ["El objeto", "Un Deployment y un Service. La forma es la de cualquier proceso sin estado."],
            ["El recurso", "El Pod pide una GPU. El scheduler solo lo ubica en un nodo que la anuncia."],
            ["Los pesos", "Van en un registry o en un volumen. No entran en un Secret ni en etcd."],
            ["Training", "Es un Job que termina, no un Service. No lo dibujes como el Deployment de recién."]
          ],
          notes: "Podés nombrar el recurso extendido, por ejemplo nvidia.com/gpu, como ilustración. No des el procedimiento de instalar el device plugin. La frase que tiene que quedar: el control plane no corre el modelo."
        },
        {
          layout: "choices",
          kicker: "Caso",
          title: "Día de inscripción. La web atiende el pico. La base guarda cada alta.",
          choices: [
            ["VM o container", "La web no guarda la inscripción. La base sí. ¿Cuál de las dos se empaqueta?"],
            ["El estado", "Si se pierde el Pod, ¿se pierde la inscripción?"],
            ["Las copias", "¿Cuántas, y qué falla tienen que aguantar: el Pod, el node o el datacenter?"],
            ["El control plane", "¿Lo operan ustedes o lo opera el provider?"],
            ["La carga", "¿Esto es training, serving, o ninguna de las dos?"]
          ],
          notes: "Dejá que contesten antes de cerrar. La web se empaqueta: es stateless y entra en el mapa de 12-factor. La base no: tiene estado, y suele cerrar mejor en un servicio o en una VM. La inscripción vive en la base, fuera de la imagen; perder el Pod no la pierde. Dos o más réplicas de la web, en nodes distintos, aguantan un Pod o un node caído. No aguantan el datacenter apagado. Si el equipo no opera etcd, el control plane es gestionado; requests, Gateway y la base siguen siendo de ustedes. No es training ni serving: no hay GPU. Si más adelante hay un recomendador, es otro Deployment, no se mezcla con la inscripción."
        },
        {
          layout: "close",
          kicker: "Cierre",
          title: "Diseñar acá es declarar estado, y decir qué queda afuera.",
          sub: "Afuera quedan el disk que importa, el Secret de verdad, la GPU y quién opera el control plane.",
          notes: "Cierre en cuatro palabras si hace falta repetir: número, versión, nombre, puerta. Y lo que no cabe en etcd. Gracias y preguntas."
        }
      ]
    }
  ]
};
