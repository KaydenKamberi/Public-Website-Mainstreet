// Admin page (CR-004): team login, leads backup view, marketing dashboard.
// Lead data is always written with textContent, never as HTML.

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const statusLine = $("[data-status]");
const TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
});

let currentFilter = "all";
let currentRange = "30d";

function setStatus(message) {
  statusLine.textContent = message;
  statusLine.hidden = !message;
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) if (child) node.append(child);
  return node;
}

async function api(path, options = {}) {
  const init = { credentials: "same-origin", headers: {}, ...options };
  if (options.body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body);
  }
  const response = await fetch(path, init);
  if (response.status === 401) {
    showView("login");
    throw new Error("login required");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || "request failed"), { status: response.status });
  return data;
}

function showView(name) {
  $$("[data-view]").forEach((view) => { view.hidden = view.dataset.view !== name; });
  $("[data-logout]").hidden = name !== "app";
  if (name === "login") $("#admin-password").focus();
}

function formatTime(value) {
  return value ? TIME_FORMAT.format(new Date(value)) : "";
}

// ---------- Leads ----------

function hubBadge(lead) {
  if (lead.forwarded) return el("span", { class: "badge badge-ok", text: `In the team hub · ${formatTime(lead.forwarded_at)}` });
  if (lead.forward_rejected) return el("span", { class: "badge badge-warn", text: "Hub refused it, check the hub" });
  return el("span", { class: "badge badge-wait", text: "Not in the hub yet" });
}

function contactLine(lead) {
  if (lead.contact_method === "email" && lead.email) {
    return el("a", { href: `mailto:${encodeURIComponent(lead.email).replace("%40", "@")}`, text: lead.email });
  }
  if (lead.phone) return el("a", { href: `tel:${lead.phone.replace(/[^\d+]/g, "")}`, text: lead.phone });
  return el("span", { text: "No contact given" });
}

function leadCard(lead) {
  const statusSelect = el("select", { id: `status-${lead.id}` },
    el("option", { value: "new", text: "New" }),
    el("option", { value: "responded", text: "Responded" }));
  statusSelect.value = lead.status;
  const note = el("textarea", { id: `note-${lead.id}`, rows: "2", maxlength: "2000" });
  note.value = lead.response_note || "";
  const saved = el("span", { class: "small", role: "status" });

  const save = el("button", { class: "button button-primary", type: "button", text: "Save" });
  save.addEventListener("click", async () => {
    save.disabled = true;
    try {
      const { lead: updated } = await api(`/api/admin/leads/${lead.id}`, {
        method: "PATCH", body: { status: statusSelect.value, responseNote: note.value },
      });
      card.replaceWith(leadCard(updated));
    } catch (err) {
      saved.textContent = "Could not save. Try again.";
      save.disabled = false;
    }
  });

  const remove = el("button", { class: "admin-delete", type: "button", text: "Delete" });
  remove.addEventListener("click", async () => {
    if (!confirm(`Delete ${lead.name}'s lead from this site? This can't be undone. (The team hub keeps its own copy.)`)) return;
    try {
      await api(`/api/admin/leads/${lead.id}`, { method: "DELETE", body: {} });
      card.remove();
    } catch (err) {
      saved.textContent = "Could not delete. Try again.";
    }
  });

  const card = el("li", { class: `lead-card${lead.status === "responded" ? " is-responded" : ""}` },
    el("div", { class: "lead-head" },
      el("div", {},
        el("h2", { text: lead.name }),
        el("p", { class: "small", text: `${lead.business_type} · ${formatTime(lead.created_at)} · source: ${lead.source}` })),
      el("span", { class: `badge ${lead.status === "responded" ? "badge-ok" : "badge-new"}`, text: lead.status === "responded" ? "Responded" : "New" })),
    el("dl", { class: "lead-facts" },
      el("dt", { text: "Info doc by" }), el("dd", { text: lead.contact_method === "text" ? "Text" : "Email" }),
      el("dt", { text: "Contact" }), el("dd", {}, contactLine(lead)),
      el("dt", { text: "Consent" }), el("dd", { text: lead.consent ? "Yes" : "No" }),
      el("dt", { text: "Team hub" }), el("dd", {}, hubBadge(lead)),
      lead.responded_at ? el("dt", { text: "Responded" }) : null,
      lead.responded_at ? el("dd", { text: formatTime(lead.responded_at) }) : null),
    lead.message ? el("p", { class: "lead-message", text: lead.message }) : null,
    el("div", { class: "lead-actions" },
      el("div", { class: "field" }, el("label", { for: statusSelect.id, text: "Status" }), statusSelect),
      el("div", { class: "field lead-note" }, el("label", { for: note.id, text: "Response note" }), note),
      el("div", { class: "lead-buttons" }, save, remove, saved)));
  return card;
}

async function loadLeads() {
  const list = $("[data-lead-list]");
  setStatus("Loading leads…");
  try {
    const { leads } = await api(`/api/admin/leads?filter=${currentFilter}`);
    list.replaceChildren(...leads.map(leadCard));
    setStatus(leads.length ? "" : "No leads here yet.");
  } catch (err) {
    if (err.message !== "login required") setStatus("Could not load leads. Refresh to try again.");
  }
}

// ---------- Marketing ----------

function percent(value) {
  return value === null ? "—" : `${value}%`;
}

async function loadStats() {
  setStatus("Loading numbers…");
  try {
    const { sources, total } = await api(`/api/admin/stats?range=${currentRange}`);
    $("[data-totals]").replaceChildren(
      ...[["Visits", total.visits], ["Leads", total.leads], ["Conversion", percent(total.conversion)]]
        .map(([label, value]) => el("div", { class: "stat-tile" }, el("span", { class: "small", text: label }), el("strong", { text: String(value) }))));
    $("[data-stats]").replaceChildren(...(sources.length
      ? sources.map((row) => el("tr", {},
        el("th", { scope: "row", text: row.source }),
        el("td", { text: String(row.visits) }),
        el("td", { text: String(row.leads) }),
        el("td", { text: percent(row.conversion) })))
      : [el("tr", {}, el("td", { colspan: "4", text: "No visits or leads yet." }))]));
    setStatus("");
  } catch (err) {
    if (err.message !== "login required") setStatus("Could not load the numbers. Refresh to try again.");
  }
}

function setupLinkMaker() {
  const form = $("[data-link-form]");
  const error = $("[data-link-error]");
  const result = $("[data-link-result]");
  const output = $("[data-link-text]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const source = $("#link-source").value.trim().toLowerCase();
    const ok = /^[a-z0-9_-]{1,40}$/.test(source);
    error.hidden = ok;
    error.textContent = ok ? "" : "Use lowercase letters, numbers, - and _ only.";
    result.hidden = !ok;
    if (ok) output.textContent = `${location.origin}/?utm_source=${source}`;
  });
  $("[data-link-copy]").addEventListener("click", async (event) => {
    try {
      await navigator.clipboard.writeText(output.textContent);
      event.target.textContent = "Copied";
      setTimeout(() => { event.target.textContent = "Copy"; }, 1500);
    } catch (err) {
      event.target.textContent = "Select and copy";
    }
  });
}

// ---------- Wiring ----------

function pressOnly(buttons, active) {
  buttons.forEach((button) => button.setAttribute("aria-pressed", String(button === active)));
}

function setupApp() {
  const tabs = $$("[data-tab]");
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    pressOnly(tabs, tab);
    $$("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== tab.dataset.tab; });
    if (tab.dataset.tab === "marketing") loadStats(); else loadLeads();
  }));
  const filters = $$("[data-filter]");
  filters.forEach((chip) => chip.addEventListener("click", () => {
    pressOnly(filters, chip);
    currentFilter = chip.dataset.filter;
    loadLeads();
  }));
  const ranges = $$("[data-range]");
  ranges.forEach((chip) => chip.addEventListener("click", () => {
    pressOnly(ranges, chip);
    currentRange = chip.dataset.range;
    loadStats();
  }));
  setupLinkMaker();
  $("[data-logout]").addEventListener("click", async () => {
    await api("/api/admin/logout", { method: "POST", body: {} }).catch(() => {});
    showView("login");
    setStatus("You're logged out.");
  });
}

function setupLogin() {
  const form = $("[data-login-form]");
  const error = $("[data-login-error]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;
    const response = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: $("#admin-password").value }),
    }).catch(() => null);
    if (response && response.ok) {
      form.reset();
      showView("app");
      loadLeads();
      return;
    }
    error.textContent = response && response.status === 429
      ? "Too many tries. Wait 15 minutes, then try again."
      : "That password didn't work.";
    error.hidden = false;
  });
}

async function start() {
  setupLogin();
  setupApp();
  const response = await fetch("/api/admin/session", { credentials: "same-origin" }).catch(() => null);
  if (!response) return setStatus("Can't reach the server. Refresh to try again.");
  if (response.status === 503) {
    setStatus("");
    return showView("setup");
  }
  const { loggedIn } = await response.json();
  setStatus("");
  if (loggedIn) {
    showView("app");
    loadLeads();
  } else {
    showView("login");
  }
}

start();
