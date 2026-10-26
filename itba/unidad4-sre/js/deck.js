(function () {
  const deck = window.DECK;
  const app = document.getElementById("app");
  const state = {
    moduleId: null,
    index: 0,
    beat: 0,
    notes: false,
    overlay: null,
    part: 0
  };

  function mod() {
    return deck.modules.find((m) => m.id === state.moduleId);
  }

  function slide() {
    const m = mod();
    return m ? m.slides[state.index] : null;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function rays() {
    let html = '<div class="rays" aria-hidden="true">';
    for (let i = 0; i < 14; i++) {
      html += `<span style="transform:rotate(${-70 + i * 8}deg)"></span>`;
    }
    return html + "</div>";
  }

  function readHash() {
    const m = location.hash.match(/^#\/([\w-]+)\/(\d+)$/);
    if (!m || !deck.modules.some((x) => x.id === m[1])) return;
    state.moduleId = m[1];
    state.index = Math.min(Number(m[2]), mod().slides.length - 1);
    state.beat = 0;
  }

  function writeHash() {
    const url = state.moduleId ? `#/${state.moduleId}/${state.index}` : location.pathname + location.search;
    history.replaceState(null, "", url);
  }

  function enter(id) {
    state.moduleId = id;
    state.index = 0;
    state.beat = 0;
    state.part = 0;
    state.overlay = null;
    writeHash();
    render();
  }

  function beatCount() {
    const s = slide();
    return s && s.layout === "beats" ? s.beats.length : 0;
  }

  function next() {
    const n = beatCount();
    if (n && state.beat < n - 1) {
      state.beat += 1;
      render();
      return;
    }
    const m = mod();
    if (state.index < m.slides.length - 1) {
      state.index += 1;
      state.beat = 0;
      state.part = 0;
      writeHash();
      render();
    }
  }

  function prev() {
    if (state.beat > 0) {
      state.beat -= 1;
      render();
      return;
    }
    if (state.index > 0) {
      state.index -= 1;
      const n = beatCount();
      state.beat = n ? n - 1 : 0;
      state.part = 0;
      writeHash();
      render();
    }
  }

  function home() {
    state.moduleId = null;
    state.overlay = null;
    state.notes = false;
    writeHash();
    render();
  }

  function cardsHtml(items) {
    return `<div class="cards${items.length === 4 ? " four" : ""}">${items
      .map(([t, p]) => `<article class="card"><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`)
      .join("")}</div>`;
  }

  function renderSlide(s, m) {
    const total = m.slides.length;
    const n = String(state.index + 1).padStart(2, "0");
    let main = "";

    if (s.layout === "title" || s.layout === "close") {
      main = `<div class="deck-title"><h2>${esc(s.title)}</h2><hr class="rule"><p class="sub">${esc(s.sub)}</p></div>`;
    } else if (s.layout === "agenda") {
      main = `<h2>${esc(s.title)}</h2><ol class="agenda">${s.items
        .map(([num, t, d]) => `<li><span class="n">${esc(num)}</span><div><strong>${esc(t)}</strong><span>${esc(d)}</span></div></li>`)
        .join("")}</ol><p class="muted" style="margin-top:14px">${esc(s.foot)}</p>`;
    } else if (s.layout === "statement" || s.layout === "dark-cards") {
      main = `<h2>${esc(s.title)}</h2><div style="height:18px"></div>${cardsHtml(s.cards)}`;
    } else if (s.layout === "figure") {
      main = `<h2 class="figure-title">${esc(s.title)}</h2><figure class="shot"><img src="${esc(s.image)}" alt="${esc(s.alt)}">${s.credit ? `<figcaption>${esc(s.credit)}</figcaption>` : ""}</figure>`;
    } else if (s.layout === "pair") {
      main = `<h2 class="figure-title">${esc(s.title)}</h2><div class="pair">${s.images
        .map((img) => `<figure><img src="${esc(img.src)}" alt="${esc(img.alt)}"><figcaption>${esc(img.credit)}</figcaption></figure>`)
        .join("")}</div>`;
    } else if (s.layout === "video") {
      const watch = `https://www.youtube.com/watch?v=${esc(s.video)}`;
      const player = location.protocol === "file:"
        ? `<a class="video-poster" href="${watch}" target="_blank" rel="noopener"><img src="${esc(s.poster)}" alt=""><span>Ver en YouTube</span></a>`
        : `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${esc(s.video)}?rel=0" title="${esc(s.title)}" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
      main = `<h2 class="figure-title">${esc(s.title)}</h2><p class="sub" style="color:var(--muted)">${esc(s.sub)}</p>${player}<p class="video-link"><a href="${watch}" target="_blank" rel="noopener">Abrir en YouTube</a></p>`;
    } else if (s.layout === "media") {
      main = `<div class="media"><figure><img src="${esc(s.image)}" alt="${esc(s.alt)}"><figcaption>${esc(s.credit)}</figcaption></figure><div><h2>${esc(s.title)}</h2><div class="choices">${s.points
        .map(([t, p]) => `<article class="choice"><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`)
        .join("")}</div></div></div>`;
    } else if (s.layout === "cards") {
      const cls = s.two ? "cards two" : s.cards.length === 4 ? "cards four" : "cards";
      main = `<h2>${esc(s.title)}</h2><div style="height:18px"></div><div class="${cls}">${s.cards
        .map(([t, p]) => `<article class="card"><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`)
        .join("")}</div>`;
    } else if (s.layout === "choices") {
      main = `<h2>${esc(s.title)}</h2><div style="height:16px"></div><div class="choices">${s.choices
        .map(([t, p]) => `<article class="choice"><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`)
        .join("")}</div>`;
    } else if (s.layout === "table") {
      main = `<h2>${esc(s.title)}</h2><div style="height:16px"></div><table class="matrix"><thead><tr>${s.headers
        .map((h) => `<th>${esc(h)}</th>`)
        .join("")}</tr></thead><tbody>${s.rows
        .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
        .join("")}</tbody></table><p class="muted" style="margin-top:10px">${esc(s.note)}</p>`;
    } else if (s.layout === "compare") {
      main = `<h2>${esc(s.title)}</h2><div style="height:16px"></div><div class="compare">${s.columns
        .map(
          (col) => `<section class="stack"><header>${esc(col.label)}</header>${col.layers
            .map(([b, t]) => `<div class="layer"><b>${esc(b)}</b><span>${esc(t)}</span></div>`)
            .join("")}</section>`
        )
        .join("")}</div>`;
    } else if (s.layout === "stacks") {
      const col = (c) => `<section class="stack"><header>${esc(c.label)}</header><div class="apps">${c.apps
        .map((a) => `<div class="app">${esc(a)}</div>`)
        .join("")}</div>${c.layers
        .map((layer, i) => `<div class="layer${c.shared === i ? " shared" : ""}"><b>${esc(layer[0])}</b><span>${esc(layer[1])}</span></div>`)
        .join("")}</section>`;
      main = `<h2>${esc(s.title)}</h2><div style="height:16px"></div><div class="compare">${col(s.left)}${col(s.right)}</div>`;
    } else if (s.layout === "flow") {
      main = `<h2>${esc(s.title)}</h2><div style="height:18px"></div><div class="flow"><div class="src">${esc(s.source)}</div><div class="lanes">${s.lanes
        .map(
          ([via, pills]) =>
            `<div class="lane"><div class="via">${esc(via)}</div><div class="pills">${pills
              .map((p) => `<span class="pill">${esc(p)}</span>`)
              .join("")}</div></div>`
        )
        .join("")}</div></div>`;
    } else if (s.layout === "factors") {
      main = `<h2>${esc(s.title)}</h2><div style="height:16px"></div><div class="factors">${s.groups
        .map(
          ([t, items]) =>
            `<section class="factor"><h3>${esc(t)}</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></section>`
        )
        .join("")}</div>`;
    } else if (s.layout === "cluster") {
      const all = s.parts;
      const btn = (name, wide) => {
        const i = all.findIndex((p) => p[1] === name);
        return `<button class="part${wide ? " part-wide" : ""}${state.part === i ? " is-on" : ""}" data-part="${i}" type="button">${esc(name)}</button>`;
      };
      const node = (label) =>
        `<section class="arch-node"><header>${label}</header><div class="arch-node-parts">${btn("kubelet")}${btn("kube-proxy")}${btn("Runtime")}</div><div class="arch-pods"><span>Pod</span><span>Pod</span></div></section>`;
      main = `<h2 class="figure-title">${esc(s.title)}</h2><div class="arch"><div class="arch-client"><span class="kicker">Client</span>${btn("kubectl")}</div><section class="arch-plane"><h3>Control plane</h3>${btn("API server", true)}<div class="arch-row">${btn("etcd")}${btn("Scheduler")}${btn("Controller manager")}</div></section><section class="arch-data"><h3>Data plane</h3><div class="arch-nodes">${node("Node 1")}${node("Node 2")}</div></section></div><p class="detail">${esc(all[state.part][2])}</p>`;
    } else if (s.layout === "gateway") {
      const all = s.parts;
      const box = (role, cls) => {
        const i = all.findIndex((p) => p[0] === role);
        const p = all[i];
        return `<button class="gw-box ${cls || ""}${state.part === i ? " is-on" : ""}" data-part="${i}" type="button">${esc(p[1])}</button>`;
      };
      main = `<h2 class="figure-title">${esc(s.title)}</h2><div class="gw"><div class="gw-tier">${box("client", "is-client")}</div><i class="gw-line"></i><div class="gw-tier">${box("gateway")}</div><i class="gw-line"></i><div class="gw-tier">${box("route")}</div><i class="gw-line"></i><div class="gw-tier">${box("service", "is-service")}</div><i class="gw-fork"></i><div class="gw-tier">${box("pod", "is-pod")}${box("pod", "is-pod")}</div></div><p class="detail">${esc(all[state.part][2])}</p>`;
    } else if (s.layout === "deploy") {
      const all = s.parts;
      const box = (role, cls) => {
        const i = all.findIndex((p) => p[0] === role);
        const p = all[i];
        const selected = all[state.part][0];
        const on = state.part === i || selected === role || "pod-" + selected === role;
        return `<button class="gw-box ${cls || ""}${on ? " is-on" : ""}" data-part="${i}" type="button">${esc(p[1])}</button>`;
      };
      const col = (role, cls) => `<div class="dep-col"><i class="gw-line"></i>${box(role, cls)}<i class="gw-line"></i><div class="gw-tier">${box("pod-" + role, "is-pod " + cls)}${box("pod-" + role, "is-pod " + cls)}</div></div>`;
      main = `<h2 class="figure-title">${esc(s.title)}</h2><div class="dep"><div class="gw-tier">${box("deployment")}</div><div class="dep-cols">${col("v1", "is-v1")}${col("v2", "is-v2")}${col("v3", "is-v3")}</div><i class="gw-line"></i><div class="dep-nodes">${box("node", "is-node")}${box("node", "is-node")}${box("node", "is-node")}</div></div><p class="detail">${esc(all[state.part][2])}</p>`;
    } else if (s.layout === "slo") {
      const target = s.targets[state.part];
      const budget = 1 - target[0] / 100;
      const fmt = (min) => {
        if (min >= 60) {
          const h = Math.floor(min / 60);
          const m = Math.round(min - h * 60);
          return m ? `${h} h ${m} min` : `${h} h`;
        }
        if (min >= 1) {
          const m = Math.floor(min);
          const sec = Math.round((min - m) * 60);
          return sec ? `${m} min ${sec} s` : `${m} min`;
        }
        return `${Math.round(min * 60)} s`;
      };
      const windows = [["Por día", 1440], ["Por semana", 10080], ["Por mes (30 días)", 43200], ["Por trimestre", 129600]];
      main = `<h2 class="figure-title">${esc(s.title)}</h2><div class="slo-targets">${s.targets
        .map(([t], i) => `<button type="button" class="part${state.part === i ? " is-on" : ""}" data-part="${i}">${esc(t)}%</button>`)
        .join("")}</div><div class="slo-windows">${windows
        .map(([label, min]) => `<div class="slo-win"><span class="kicker">${esc(label)}</span><strong>${esc(fmt(min * budget))}</strong></div>`)
        .join("")}</div><div class="slo-bar" aria-hidden="true"><i style="width:${Math.max(budget * 100 / (1 - s.targets[0][0] / 100), 0.6)}%"></i></div><p class="detail">${esc(target[1])}</p>`;
    } else if (s.layout === "explore") {
      const cur = s.parts[state.part];
      main = `<h2 class="figure-title">${esc(s.title)}</h2><div class="explore"><div class="explore-stack">${s.parts
        .map(([name, tools], i) => `<button type="button" class="ex-layer${state.part === i ? " is-on" : ""}" data-part="${i}"><b>${esc(name)}</b><span>${esc(tools)}</span></button>`)
        .join("")}</div><aside class="explore-detail"><span class="kicker">${esc(cur[0])}</span><p>${esc(cur[2])}</p></aside></div>`;
    } else if (s.layout === "beats") {
      const b = s.beats[state.beat];
      const pods = (list) =>
        list
          .map((p) => {
            const label = p.v === 1 ? "v1" : "v2";
            const traffic = s.service && p.state === "ready";
            const status = p.state === "ready" ? (traffic ? "tráfico" : "Ready") : p.state === "starting" ? "sin tráfico" : "Terminating";
            return `<div class="pod v${p.v} ${p.state}${traffic ? " traffic" : ""}">${label} · ${esc(status)}</div>`;
          })
          .join("");
      const readyCount = s.service
        ? b.nodes.reduce((n, node) => n + node[1].filter((p) => p.state === "ready").length, 0)
        : 0;
      const lastBeat = state.beat === s.beats.length - 1;
      main = `<div class="beats-meta"><p class="caption">${esc(b.caption)}</p><div class="stepper"><button type="button" class="step" data-action="beat-prev"${state.beat === 0 ? " disabled" : ""}>Paso anterior</button><div class="dots">${s.beats
        .map((_, i) => `<button type="button" class="${i === state.beat ? "on" : ""}" data-beat="${i}" aria-label="Paso ${i + 1}"></button>`)
        .join("")}</div><button type="button" class="step" data-action="beat-next">${lastBeat ? "Siguiente pantalla" : "Siguiente paso"}</button></div></div>${
        s.service ? `<div class="service-bar"><span>Service ${esc(s.service)}</span><span>reparte a ${readyCount} Pod${readyCount === 1 ? "" : "s"} Ready</span></div>` : `<div class="beats-meta" style="margin-top:-8px"><span class="kicker">${esc(s.desiredLabel || "Versión")} ${esc(b.desired)}</span></div>`
      }<div class="board">${b.nodes
        .map(
          ([name, list, down]) =>
            `<section class="node${down ? " is-down" : ""}"><header>${esc(name)}${down ? " · down" : ""}</header>${pods(list)}</section>`
        )
        .join("")}</div>`;
    } else if (s.layout === "yaml") {
      const lines = s.code
        .map((line) => esc(line).replace(/^(\s*)([\w-]+:)/, '$1<span class="k">$2</span>'))
        .join("\n");
      main = `<h2>${esc(s.title)}</h2><pre class="yaml" style="margin-top:16px">${lines}</pre>`;
    }

    const dark = s.layout === "title" || s.layout === "close" || s.layout === "dark-cards";
    return `<section class="slide${dark ? " slide--dark" : ""}">${dark ? rays() : ""}<header class="topbar"><span class="kicker">${esc(s.kicker)}</span><span class="muted">${esc(m.unit)}</span></header><div class="body">${main}</div><footer class="footer"><span>${n} / ${String(total).padStart(2, "0")}</span><span><button type="button" data-action="index">Índice</button> · <button type="button" data-action="notes">${state.notes ? "Ocultar notas" : "Notas"}</button> · <button type="button" data-action="home">Inicio</button></span></footer></section>${
      state.notes ? `<aside class="notes"><span class="stamp">Nota del docente</span><p>${esc(s.notes)}</p></aside>` : ""
    }`;
  }

  function renderHome() {
    app.innerHTML = `<main class="home">${rays()}<div><p class="stamp">${esc(deck.course)}</p><h1>${esc(deck.unit)}</h1><p class="lead">${esc(deck.lead)}</p></div><div class="modules">${deck.modules
      .map(
        (m) =>
          `<button class="module-card" type="button" data-enter="${m.id}"><span class="stamp">${esc(m.unit)} · ${m.slides.length} pantallas</span><strong>${esc(m.title)}</strong><p>${esc(m.blurb)}</p><span class="go">Empezar →</span></button>`
      )
      .join("")}</div><div class="keys"><span><b>←</b><b>→</b> avanzar</span><span><b>I</b> índice</span><span><b>N</b> notas</span><span><b>H</b> inicio</span><span><b>?</b> ayuda</span></div></main>`;
  }

  function renderOverlay() {
    if (!state.overlay) return "";
    if (state.overlay === "help") {
      return `<div class="overlay" data-action="close"><div class="panel" role="dialog"><h2>En el aula</h2><div class="choices" style="margin-top:12px"><article class="choice"><h3>Flechas o espacio</h3><p>Siguiente pantalla. En las pantallas interactivas, hacé clic en cada pieza para ver el detalle.</p></article><article class="choice"><h3>N</h3><p>Notas del docente, abajo. Dejalas cerradas si proyectás esta misma ventana.</p></article><article class="choice"><h3>I y H</h3><p>Índice de la unidad. H vuelve a elegir clase.</p></article></div></div></div>`;
    }
    const m = mod();
    return `<div class="overlay" data-action="close"><div class="panel" role="dialog"><h2>${esc(m.title)}</h2><ol class="index-list">${m.slides
      .map(
        (s, i) =>
          `<li><button type="button" data-goto="${i}" class="${i === state.index ? "is-current" : ""}"><span class="n">${String(i + 1).padStart(2, "0")}</span><span>${esc(s.title)}</span></button></li>`
      )
      .join("")}</ol></div></div>`;
  }

  function render() {
    if (!state.moduleId) {
      renderHome();
      return;
    }
    const m = mod();
    const s = slide();
    const pct = ((state.index + (beatCount() ? (state.beat + 1) / beatCount() : 1)) / m.slides.length) * 100;
    app.innerHTML = `<div class="deck${state.notes ? " notes-on" : ""}"><div class="progress"><i style="width:${pct}%"></i></div>${renderSlide(s, m)}</div>${renderOverlay()}`;
    document.title = `${s.kicker} · ${deck.course}`;
  }

  app.addEventListener("click", (ev) => {
    const t = ev.target.closest("[data-enter],[data-action],[data-goto],[data-part],[data-beat]");
    if (ev.target.closest("a, iframe, .video-frame, .shot, .pair")) return;
    if (!t) {
      if (state.overlay) return;
      if (!state.moduleId) return;
      const x = ev.clientX / window.innerWidth;
      if (x > 0.82) next();
      else if (x < 0.12) prev();
      return;
    }
    ev.stopPropagation();
    if (t.dataset.enter) enter(t.dataset.enter);
    else if (t.dataset.goto) {
      state.index = Number(t.dataset.goto);
      state.beat = 0;
      state.part = 0;
      state.overlay = null;
      writeHash();
      render();
    } else if (t.dataset.part) {
      state.part = Number(t.dataset.part);
      render();
    } else if (t.dataset.beat !== undefined) {
      state.beat = Number(t.dataset.beat);
      render();
    } else if (t.dataset.action === "beat-next") next();
    else if (t.dataset.action === "beat-prev") prev();
    else if (t.dataset.action === "notes") {
      state.notes = !state.notes;
      render();
    } else if (t.dataset.action === "index") {
      state.overlay = state.overlay === "index" ? null : "index";
      render();
    } else if (t.dataset.action === "home") home();
    else if (t.dataset.action === "close" && ev.target === t) {
      state.overlay = null;
      render();
    }
  });

  document.addEventListener("keydown", (ev) => {
    const key = ev.key;
    if (key === "?" || (ev.shiftKey && key === "/")) {
      state.overlay = state.overlay === "help" ? null : "help";
      render();
      return;
    }
    if (key === "Escape") {
      if (state.overlay) state.overlay = null;
      else if (state.notes) state.notes = false;
      else return home();
      render();
      return;
    }
    if (key === "h" || key === "H") return home();
    if (!state.moduleId) return;
    if (key === "i" || key === "I") {
      state.overlay = state.overlay === "index" ? null : "index";
      render();
      return;
    }
    if (key === "n" || key === "N") {
      state.notes = !state.notes;
      render();
      return;
    }
    if (state.overlay) return;
    if (["ArrowRight", "PageDown", " "].includes(key)) {
      ev.preventDefault();
      next();
    } else if (["ArrowLeft", "PageUp", "Backspace"].includes(key)) {
      ev.preventDefault();
      prev();
    } else if (key === "Home") {
      state.index = 0;
      state.beat = 0;
      writeHash();
      render();
    } else if (key === "End") {
      state.index = mod().slides.length - 1;
      state.beat = 0;
      writeHash();
      render();
    }
  });

  readHash();
  render();
})();
