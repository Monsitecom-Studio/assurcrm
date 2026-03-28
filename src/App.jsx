import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Landing from "./Landing.jsx";

const supabase = createClient(
  "https://mwmgbputepupsmxmkeco.supabase.co",
  "sb_publishable_WsdtYK8PqBNCaliPt8Z1yA_YUqhtlVf"
);

const DEV_TOOLS = false;

const today = () => new Date().toISOString().slice(0, 10);
const euro = (n) => Number(n || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");
const lower = (v) => String(v ?? "").toLowerCase();

const STAGES = [
  { id: "lead", label: "Lead", color: "#94a3b8" },
  { id: "contact", label: "Contacté", color: "#60a5fa" },
  { id: "devis", label: "Devis envoyé", color: "#fbbf24" },
  { id: "nego", label: "Négociation", color: "#fb923c" },
  { id: "gagne", label: "Gagné", color: "#34d399" },
  { id: "perdu", label: "Perdu", color: "#f87171" },
];

const MENU = [
  ["dashboard", "Tableau de bord"],
  ["clients", "Clients"],
  ["contracts", "Contrats"],
  ["tasks", "Tâches"],
  ["pipeline", "Pipeline"],
  ["claims", "Sinistres"],
  ["craft", "Création artisan"],
  ["reports", "Reporting"],
];

const CSS = `
:root{
  --bg:#07101f;--bg2:#0b1328;--panel:#10182d;--panel2:#151f39;--line:#273454;--line2:#32446c;
  --txt:#f8fafc;--soft:#96a7c8;--brand:#6366f1;--brand2:#8b5cf6;--ok:#22c55e;--warn:#f59e0b;--bad:#ef4444;
  --radius:18px;--shadow:0 18px 45px rgba(0,0,0,.25)
}
*{box-sizing:border-box}
html,body,#root{height:100%;width:100%;max-width:100%;overflow-x:hidden}
body{margin:0;background:radial-gradient(circle at top left,#0b1838 0%,#08111f 34%,#050b15 100%);color:var(--txt);font-family:Inter,system-ui,sans-serif}
button,input,select,textarea{font:inherit}
a{color:inherit;text-decoration:none}
.app{display:grid;grid-template-columns:280px minmax(0,1fr);min-height:100vh;width:100%;max-width:100vw;overflow-x:hidden}
.sidebar{background:rgba(7,13,25,.92);backdrop-filter:blur(10px);border-right:1px solid var(--line);padding:18px;position:sticky;top:0;height:100vh;overflow:auto}
.brand{display:flex;gap:12px;align-items:center;padding:10px 8px 18px;border-bottom:1px solid var(--line);margin-bottom:14px}
.logo{width:46px;height:46px;border-radius:16px;background:linear-gradient(135deg,var(--brand),var(--brand2));display:grid;place-items:center;font-weight:900;font-size:22px;box-shadow:0 10px 30px rgba(99,102,241,.35)}
.nav{display:flex;flex-direction:column;gap:8px}.nav button{background:transparent;color:#cad5eb;border:none;padding:13px 14px;border-radius:14px;text-align:left;cursor:pointer;font-weight:700}.nav button.active,.nav button:hover{background:#182445;color:#fff}
.side-footer{margin-top:18px;padding:14px;background:linear-gradient(180deg,rgba(21,31,57,.95),rgba(15,24,45,.95));border:1px solid var(--line);border-radius:18px}
.main{padding:24px 26px 36px;min-width:0;overflow-x:hidden}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:20px}
.title{font-size:34px;font-weight:900;letter-spacing:-.03em;line-height:1.05}
.subtitle{color:var(--soft);margin-top:6px}
.row{display:flex;gap:12px;flex-wrap:wrap}.col{display:flex;flex-direction:column;gap:12px}
.input,.select,.textarea{background:rgba(16,24,45,.95);border:1px solid var(--line);color:#fff;border-radius:14px;padding:12px 13px;width:100%;max-width:100%}.input:focus,.select:focus,.textarea:focus{outline:none;border-color:#4f67a5;box-shadow:0 0 0 3px rgba(99,102,241,.12)}
.textarea{min-height:96px;resize:vertical}
.btn{background:#1a2747;color:#fff;border:1px solid var(--line2);padding:10px 14px;border-radius:14px;cursor:pointer;font-weight:800;transition:.18s transform,.18s opacity,.18s background}.btn:hover{transform:translateY(-1px)}
.btn.primary{background:linear-gradient(135deg,var(--brand),#4f46e5);border:none}.btn.good{background:#143722;border:1px solid #23633c}.btn.danger{background:#3b1620;border:1px solid #702433}.btn.light{background:#10203b;border:1px solid #24456d;color:#bfdbfe}
.grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.card{background:linear-gradient(180deg,rgba(16,24,45,.96),rgba(14,22,41,.96));border:1px solid var(--line);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow);min-width:0}
.stat .label{color:var(--soft);font-size:12px;text-transform:uppercase;letter-spacing:.08em}.stat .value{font-size:30px;font-weight:900;margin-top:8px}.stat .delta{margin-top:8px;font-size:12px;color:#c7d2fe}
.notice{background:#10203b;border:1px solid #21406a;color:#cde1ff;padding:11px 13px;border-radius:14px;font-size:13px;margin-bottom:14px}
.kpi-icon{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:rgba(99,102,241,.13);border:1px solid rgba(99,102,241,.25)}
.tablewrap{overflow:auto;border:1px solid var(--line);border-radius:18px;background:rgba(16,24,45,.9);max-width:100%}
.table{width:100%;border-collapse:collapse}.table th,.table td{padding:12px 14px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}.table th{font-size:12px;color:var(--soft);text-transform:uppercase;letter-spacing:.08em}.table td.name{font-weight:800;color:#fff}
.badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:800}
.metricline{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--line);gap:12px}.metricline:last-child{border-bottom:none}
.filterbar{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.searchbar{min-width:260px}.actions{display:flex;gap:8px;flex-wrap:wrap}.muted{color:var(--soft)}.small{font-size:12px;color:var(--soft)}
.modalbg{position:fixed;inset:0;background:rgba(2,6,23,.72);display:grid;place-items:center;padding:16px;z-index:60}.modal{width:min(920px,100%);max-height:90vh;overflow:auto;background:#0f172a;border:1px solid var(--line);border-radius:22px;box-shadow:0 25px 60px rgba(0,0,0,.4)}.modal header{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--line)}.modal .body{padding:20px}
.formgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.kgrid{display:grid;grid-template-columns:repeat(6,minmax(260px,1fr));gap:12px;overflow:auto;max-width:100%}.kcol{min-width:260px;background:rgba(16,24,45,.96);border:1px solid var(--line);border-radius:18px}.khead{padding:12px 14px;border-bottom:1px solid var(--line);font-weight:900;font-size:13px;display:flex;justify-content:space-between}.kbody{padding:10px;display:flex;flex-direction:column;gap:10px;min-height:320px}.kcard{background:#192645;border:1px solid var(--line);border-radius:16px;padding:12px;cursor:grab}.kcard:hover{border-color:#405a91}
.toaststack{position:fixed;top:18px;right:18px;display:flex;flex-direction:column;gap:10px;z-index:80}.toast{min-width:240px;max-width:340px;padding:12px 14px;border-radius:14px;border:1px solid var(--line);background:#101a31;box-shadow:var(--shadow);font-size:13px}.toast.ok{border-color:#235b3b}.toast.err{border-color:#6e2430}.toast.info{border-color:#21406a}
.spark{width:100%;height:80px}.spark path.line{fill:none;stroke:#7c88ff;stroke-width:3}.spark path.fill{fill:rgba(99,102,241,.12)}
.progress{width:100%;height:10px;background:#0c1325;border-radius:999px;overflow:hidden;border:1px solid var(--line)}.progress > span{display:block;height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6)}
.helper{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border:1px dashed var(--line2);border-radius:16px;background:rgba(16,24,45,.65)}
@media (max-width:1180px){.grid4,.grid3,.grid2,.formgrid{grid-template-columns:1fr}.app{grid-template-columns:1fr}.sidebar{position:relative;height:auto}.kgrid{grid-template-columns:1fr;overflow:visible}.main{padding:18px}}
`;

function seedSample() {
  return {
    clients: [
      { prenom: "Jean", nom: "Martin", email: "jean.martin@mail.fr", tel: "0611223344", ville: "Toulouse", statut: "Client actif" },
      { prenom: "Sophie", nom: "Durand", email: "sophie.durand@mail.fr", tel: "0622334455", ville: "Bordeaux", statut: "Prospect" },
    ],
    contracts: [{ police: "AUTO-2026-001", compagnie: "AXA", prime: 890, commission: 125, statut: "Actif" }],
    tasks: [{ titre: "Relance devis auto", echeance: today(), priorite: "Haute", done: false }],
    deals: [{ titre: "Pack auto", montant: 980, stage: "devis" }],
    claims: [{ description: "Choc arrière", statut: "Ouvert", montant: 2100 }],
    artisans: [{ nom: "Rachid Benali", activite: "Électricien", statut_juridique: "SASU", avancement: "Dossier en cours", besoin_decennale: true, besoin_rcpro: true, inpi_status: "À préparer", notes: "Accompagnement jusqu'aux attestations." }],
  };
}

function statusStyle(txt) {
  if (["Actif", "Client actif", "Gagné", "Clos", "Transformé en client", "Immatriculé"].includes(txt)) return { background: "#123321", color: "#86efac" };
  if (["Prospect", "Ouvert", "À qualifier", "En attente"].includes(txt)) return { background: "#172554", color: "#93c5fd" };
  if (["Haute", "Urgente", "Perdu", "Résilié"].includes(txt)) return { background: "#3b1219", color: "#fca5a5" };
  return { background: "#3a2a08", color: "#fde68a" };
}

function Badge({ children }) { return <span className="badge" style={statusStyle(children)}>{children}</span>; }
function clientName(c) { return c ? `${c.prenom || ""} ${c.nom || ""}`.trim() : "—"; }

function exportCSV(filename, rows) {
  const csv = rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function Toasts({ items, remove }) {
  return <div className="toaststack">{items.map((t) => <div key={t.id} className={`toast ${t.type || "info"}`} onClick={() => remove(t.id)}>{t.message}</div>)}</div>;
}

function Modal({ title, onClose, children }) {
  return <div className="modalbg" onClick={onClose}><div className="modal" onClick={(e) => e.stopPropagation()}><header><strong>{title}</strong><button className="btn" onClick={onClose}>Fermer</button></header><div className="body">{children}</div></div></div>;
}

function ConfirmDialog({ title, message, onClose, onConfirm }) {
  return <Modal title={title} onClose={onClose}>
    <div className="col">
      <div>{message}</div>
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn" onClick={onClose}>Annuler</button>
        <button className="btn danger" onClick={onConfirm}>Supprimer</button>
      </div>
    </div>
  </Modal>;
}

function MiniSpark({ values }) {
  const width = 300;
  const height = 80;
  const safe = values.length ? values : [0, 0, 0, 0, 0, 0];
  const max = Math.max(...safe, 1);
  const points = safe.map((v, i) => {
    const x = (i / Math.max(safe.length - 1, 1)) * width;
    const y = height - (v / max) * 60 - 8;
    return [x, y];
  });
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const fill = `${line} L ${width},${height} L 0,${height} Z`;
  return <svg className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"><path className="fill" d={fill} /><path className="line" d={line} /></svg>;
}

function monthKeyFromDate(value) {
  const d = value ? new Date(value) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}


function useCRMCloud(currentOrgId) {
  const [data, setData] = useState({ clients: [], contracts: [], tasks: [], deals: [], claims: [], artisans: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]);

  const notify = (message, type = "info") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const loadAll = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const [clients, contracts, tasks, deals, claims, artisans] = await Promise.all([
        supabase.from("clients").select("*").order("created_at", { ascending: false }),
        supabase.from("contracts").select("*").order("created_at", { ascending: false }),
        supabase.from("tasks").select("*").order("echeance", { ascending: true }),
        supabase.from("deals").select("*").order("id", { ascending: false }),
        supabase.from("claims").select("*").order("id", { ascending: false }),
        supabase.from("artisans").select("*").order("created_at", { ascending: false }),
      ]);

      const err = [clients, contracts, tasks, deals, claims, artisans].find((r) => r.error)?.error;
      if (err) throw err;

      setData({
        clients: clients.data || [],
        contracts: contracts.data || [],
        tasks: tasks.data || [],
        deals: deals.data || [],
        claims: claims.data || [],
        artisans: artisans.data || [],
      });
    } catch (e) {
      setError(e.message || "Erreur de chargement Supabase");
      notify(e.message || "Erreur de chargement", "err");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    let channel = null;
    const hasWebSocket = typeof window !== "undefined" && typeof window.WebSocket !== "undefined";

    if (hasWebSocket) {
      channel = supabase
        .channel("crm-realtime-pro")
        .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, () => loadAll(true))
        .on("postgres_changes", { event: "*", schema: "public", table: "contracts" }, () => loadAll(true))
        .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => loadAll(true))
        .on("postgres_changes", { event: "*", schema: "public", table: "deals" }, () => loadAll(true))
        .on("postgres_changes", { event: "*", schema: "public", table: "claims" }, () => loadAll(true))
        .on("postgres_changes", { event: "*", schema: "public", table: "artisans" }, () => loadAll(true))
        .subscribe();
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [currentOrgId]);

  const requireOrg = () => {
    if (!currentOrgId) throw new Error("Aucun établissement actif trouvé pour ce compte.");
  };

  const withOrg = (payload) => {
    requireOrg();
    return { ...payload, organization_id: currentOrgId };
  };

  const saveAction = async (label, run, type = "ok") => {
    try {
      await run();
      await loadAll(true);
      notify(label, type);
    } catch (e) {
      notify(e.message || "Erreur inattendue", "err");
    }
  };

  const actions = {
    refresh: () => loadAll(),

    seedDemo: async () => saveAction("Données de démo chargées", async () => {
      requireOrg();
      const sample = seedSample();

      const clientsPayload = sample.clients.map((c) => ({ ...c, organization_id: currentOrgId }));
      const { data: insertedClients, error } = await supabase.from("clients").insert(clientsPayload).select();
      if (error) throw error;

      const firstClientId = insertedClients?.[0]?.id;
      const secondClientId = insertedClients?.[1]?.id || firstClientId;

      let r = await supabase.from("contracts").insert([{ ...sample.contracts[0], client_id: firstClientId, organization_id: currentOrgId }]);
      if (r.error) throw r.error;

      r = await supabase.from("tasks").insert([{ ...sample.tasks[0], client_id: secondClientId, organization_id: currentOrgId }]);
      if (r.error) throw r.error;

      r = await supabase.from("deals").insert([{ ...sample.deals[0], client_id: secondClientId, organization_id: currentOrgId }]);
      if (r.error) throw r.error;

      r = await supabase.from("claims").insert([{ ...sample.claims[0], client_id: firstClientId, organization_id: currentOrgId }]);
      if (r.error) throw r.error;

      const artisansPayload = sample.artisans.map((a) => ({ ...a, organization_id: currentOrgId }));
      r = await supabase.from("artisans").insert(artisansPayload);
      if (r.error) throw r.error;
    }),

    addClient: async (payload) => saveAction("Client ajouté", async () => {
      const { error } = await supabase.from("clients").insert([withOrg(payload)]);
      if (error) throw error;
    }),

    updateClient: async (id, payload) => saveAction("Client modifié", async () => {
      const { error } = await supabase.from("clients").update(payload).eq("id", id);
      if (error) throw error;
    }),

    deleteClient: async (id) => saveAction("Client supprimé", async () => {
      let r = await supabase.from("contracts").delete().eq("client_id", id);
      if (r.error) throw r.error;
      r = await supabase.from("tasks").delete().eq("client_id", id);
      if (r.error) throw r.error;
      r = await supabase.from("deals").delete().eq("client_id", id);
      if (r.error) throw r.error;
      r = await supabase.from("claims").delete().eq("client_id", id);
      if (r.error) throw r.error;
      r = await supabase.from("clients").delete().eq("id", id);
      if (r.error) throw r.error;
    }),

    addContract: async (payload) => saveAction("Contrat ajouté", async () => {
      const { error } = await supabase.from("contracts").insert([withOrg(payload)]);
      if (error) throw error;
    }),

    updateContract: async (id, payload) => saveAction("Contrat modifié", async () => {
      const { error } = await supabase.from("contracts").update(payload).eq("id", id);
      if (error) throw error;
    }),

    deleteContract: async (id) => saveAction("Contrat supprimé", async () => {
      const { error } = await supabase.from("contracts").delete().eq("id", id);
      if (error) throw error;
    }),

    addTask: async (payload) => saveAction("Tâche ajoutée", async () => {
      const { error } = await supabase.from("tasks").insert([withOrg(payload)]);
      if (error) throw error;
    }),

    updateTask: async (id, payload) => saveAction("Tâche modifiée", async () => {
      const { error } = await supabase.from("tasks").update(payload).eq("id", id);
      if (error) throw error;
    }),

    deleteTask: async (id) => saveAction("Tâche supprimée", async () => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    }),

    toggleTask: async (task) => saveAction(task.done ? "Tâche réouverte" : "Tâche terminée", async () => {
      const { error } = await supabase.from("tasks").update({ done: !task.done }).eq("id", task.id);
      if (error) throw error;
    }),

    addDeal: async (payload) => saveAction("Opportunité ajoutée", async () => {
      const { error } = await supabase.from("deals").insert([withOrg(payload)]);
      if (error) throw error;
    }),

    updateDeal: async (id, payload) => saveAction("Opportunité modifiée", async () => {
      const { error } = await supabase.from("deals").update(payload).eq("id", id);
      if (error) throw error;
    }),

    deleteDeal: async (id) => saveAction("Opportunité supprimée", async () => {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (error) throw error;
    }),

    moveDeal: async (id, stage) => saveAction("Pipeline mis à jour", async () => {
      const { error } = await supabase.from("deals").update({ stage }).eq("id", id);
      if (error) throw error;
    }, "info"),

    addClaim: async (payload) => saveAction("Sinistre ajouté", async () => {
      const { error } = await supabase.from("claims").insert([withOrg(payload)]);
      if (error) throw error;
    }),

    updateClaim: async (id, payload) => saveAction("Sinistre modifié", async () => {
      const { error } = await supabase.from("claims").update(payload).eq("id", id);
      if (error) throw error;
    }),

    deleteClaim: async (id) => saveAction("Sinistre supprimé", async () => {
      const { error } = await supabase.from("claims").delete().eq("id", id);
      if (error) throw error;
    }),

    addArtisan: async (payload) => saveAction("Dossier artisan ajouté", async () => {
      const { error } = await supabase.from("artisans").insert([withOrg(payload)]);
      if (error) throw error;
    }),

    updateArtisan: async (id, payload) => saveAction("Dossier artisan modifié", async () => {
      const { error } = await supabase.from("artisans").update(payload).eq("id", id);
      if (error) throw error;
    }),

    deleteArtisan: async (id) => saveAction("Dossier artisan supprimé", async () => {
      const { error } = await supabase.from("artisans").delete().eq("id", id);
      if (error) throw error;
    }),
  };

  return { data, actions, loading, error, toasts, removeToast };
}


function KPI({ label, value, delta, icon }) {
  return <div className="card stat"><div className="row" style={{justifyContent:"space-between", alignItems:"center"}}><div className="label">{label}</div><div className="kpi-icon">{icon}</div></div><div className="value">{value}</div>{delta ? <div className="delta">{delta}</div> : null}</div>;
}

function Dashboard({ data }) {
  const activeContracts = data.contracts.filter((c) => c.statut === "Actif");
  const totalPrime = activeContracts.reduce((s, c) => s + Number(c.prime || 0), 0);
  const totalCommission = activeContracts.reduce((s, c) => s + Number(c.commission || 0), 0);
  const openClaims = data.claims.filter((c) => c.statut !== "Clos").length;
  const todo = data.tasks.filter((t) => !t.done).length;
  const prospects = data.clients.filter((c) => c.statut === "Prospect").length;
  const conversionRate = data.clients.length ? Math.round(((data.clients.length - prospects) / data.clients.length) * 100) : 0;
  const wonDeals = data.deals.filter((d) => d.stage === "gagne").length;
  const monthlyPrime = data.contracts.reduce((acc, c) => {
    const key = monthKeyFromDate(c.created_at);
    acc[key] = (acc[key] || 0) + Number(c.prime || 0);
    return acc;
  }, {});
  const sparkValues = Object.entries(monthlyPrime).sort((a, b) => a[0].localeCompare(b[0])).slice(-6).map(([, v]) => v);
  const urgentTasks = data.tasks.filter((t) => ["Haute", "Urgente"].includes(t.priorite) && !t.done).length;
  const nextRenewals = [...data.contracts].slice(0, 5);

  return <div className="col">
    <div className="grid4">
      <KPI label="Clients" value={data.clients.length} delta={`${prospects} prospects`} icon="👥" />
      <KPI label="Contrats actifs" value={activeContracts.length} delta={`${wonDeals} opportunités gagnées`} icon="📄" />
      <KPI label="Primes" value={euro(totalPrime)} delta={`${euro(totalCommission)} commissions`} icon="💶" />
      <KPI label="Transformation" value={`${conversionRate}%`} delta={`${urgentTasks} tâches prioritaires`} icon="📈" />
    </div>

    <div className="grid3">
      <div className="card">
        <div className="title" style={{fontSize:20, marginBottom:10}}>Vue dirigeant</div>
        <div className="metricline"><span>Sinistres ouverts</span><strong>{openClaims}</strong></div>
        <div className="metricline"><span>Tâches ouvertes</span><strong>{todo}</strong></div>
        <div className="metricline"><span>Dossiers artisans</span><strong>{data.artisans.length}</strong></div>
        <div className="metricline"><span>Pipeline total</span><strong>{euro(data.deals.reduce((s, d) => s + Number(d.montant || 0), 0))}</strong></div>
      </div>
      <div className="card">
        <div className="title" style={{fontSize:20, marginBottom:10}}>Évolution des primes</div>
        <MiniSpark values={sparkValues} />
        <div className="small">Tendance sur les 6 derniers points d’entrée contrats.</div>
      </div>
      <div className="card">
        <div className="title" style={{fontSize:20, marginBottom:10}}>Pipeline commercial</div>
        {STAGES.map((s) => {
          const count = data.deals.filter((d) => d.stage === s.id).length;
          const pct = data.deals.length ? Math.round((count / data.deals.length) * 100) : 0;
          return <div key={s.id} style={{marginBottom:10}}><div className="metricline"><span>{s.label}</span><strong>{count}</strong></div><div className="progress"><span style={{width:`${pct}%`, background:s.color}} /></div></div>;
        })}
      </div>
    </div>

    <div className="grid2">
      <div className="card">
        <div className="title" style={{fontSize:20, marginBottom:10}}>Actions rapides</div>
        <div className="helper"><div><strong>Relances commerciales</strong><div className="small">Passe sur l’onglet Clients pour appeler, envoyer un mail ou WhatsApp.</div></div><span>📲</span></div>
        <div className="helper" style={{marginTop:12}}><div><strong>Pôle artisans</strong><div className="small">Transforme les créations d’entreprise en contrats récurrents.</div></div><span>🛠️</span></div>
      </div>
      <div className="card">
        <div className="title" style={{fontSize:20, marginBottom:10}}>Derniers contrats</div>
        {nextRenewals.length === 0 ? <div className="small">Aucun contrat pour le moment.</div> : nextRenewals.map((c) => <div key={c.id} className="metricline"><span>{c.police || "Contrat"} · {c.compagnie || "—"}</span><strong>{euro(c.prime)}</strong></div>)}
      </div>
    </div>
  </div>;
}

function Clients({ data, actions }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const filtered = useMemo(() => data.clients.filter((c) => lower(`${c.prenom} ${c.nom} ${c.email} ${c.tel} ${c.ville} ${c.statut}`).includes(lower(q))), [data.clients, q]);
  const openWhatsApp = (tel) => window.open(`https://wa.me/33${String(tel || "").replace(/\D/g, "").replace(/^0/, "")}`, "_blank");
  const openMail = (email) => window.open(`mailto:${email}`, "_blank");
  return <>
    <div className="topbar">
      <div><div className="title">Clients</div><div className="subtitle">Pilotage client, relances et accès rapide aux actions commerciales.</div></div>
      <div className="filterbar">
        <input className="input searchbar" placeholder="Rechercher un client..." value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="btn" onClick={() => exportCSV("clients.csv", [["Prénom","Nom","Email","Téléphone","Ville","Statut"], ...filtered.map(c=>[c.prenom,c.nom,c.email,c.tel,c.ville,c.statut])])}>Exporter CSV</button>
        <button className="btn primary" onClick={()=>{setEdit(null);setOpen(true);}}>+ Nouveau client</button>
      </div>
    </div>
    <div className="tablewrap"><table className="table"><thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Ville</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{filtered.map(c=><tr key={c.id}><td className="name">{clientName(c)}</td><td>{c.email || "—"}</td><td>{c.tel || "—"}</td><td>{c.ville || "—"}</td><td><Badge>{c.statut || "Prospect"}</Badge></td><td><div className="actions"><button className="btn" onClick={()=>{setEdit(c);setOpen(true);}}>Modifier</button><button className="btn light" onClick={()=>openMail(c.email)}>Mail</button><button className="btn light" onClick={()=>openWhatsApp(c.tel)}>WhatsApp</button><button className="btn danger" onClick={()=>setToDelete(c)}>Supprimer</button></div></td></tr>)}</tbody></table></div>
    {open && <ClientForm client={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateClient(edit.id, payload) : await actions.addClient(payload); setOpen(false); }} />}
    {toDelete && <ConfirmDialog title="Supprimer le client" message={`Supprimer ${clientName(toDelete)} et ses données liées ?`} onClose={()=>setToDelete(null)} onConfirm={async ()=>{ await actions.deleteClient(toDelete.id); setToDelete(null); }} />}
  </>;
}

function ClientForm({ client, onClose, onSave }) {
  const [form, setForm] = useState(client || { prenom:"", nom:"", email:"", tel:"", ville:"", statut:"Prospect" });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={client ? "Modifier le client" : "Nouveau client"} onClose={onClose}>
    <div className="formgrid">
      <input className="input" placeholder="Prénom" value={form.prenom} onChange={e=>set("prenom", e.target.value)} />
      <input className="input" placeholder="Nom" value={form.nom} onChange={e=>set("nom", e.target.value)} />
      <input className="input" placeholder="Email" value={form.email} onChange={e=>set("email", e.target.value)} />
      <input className="input" placeholder="Téléphone" value={form.tel} onChange={e=>set("tel", e.target.value)} />
      <input className="input" placeholder="Ville" value={form.ville} onChange={e=>set("ville", e.target.value)} />
      <select className="select" value={form.statut} onChange={e=>set("statut", e.target.value)}><option>Prospect</option><option>Client actif</option><option>Ancien client</option></select>
    </div>
    <div className="row" style={{justifyContent:"flex-end", marginTop:16}}><button className="btn" onClick={onClose}>Annuler</button><button className="btn primary" onClick={()=>onSave(form)}>Enregistrer</button></div>
  </Modal>;
}

function Contracts({ data, actions }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [q, setQ] = useState("");
  const rows = data.contracts.filter(c => lower(`${c.police} ${c.compagnie} ${clientName(data.clients.find(x=>x.id===c.client_id))} ${c.statut}`).includes(lower(q)));
  return <>
    <div className="topbar">
      <div><div className="title">Contrats</div><div className="subtitle">Suivi des polices, des primes et des commissions.</div></div>
      <div className="filterbar"><input className="input searchbar" placeholder="Rechercher un contrat..." value={q} onChange={e=>setQ(e.target.value)} /><button className="btn" onClick={()=>exportCSV("contrats.csv", [["Police","Client","Compagnie","Prime","Commission","Statut"], ...rows.map(c=>[c.police, clientName(data.clients.find(x=>x.id===c.client_id)), c.compagnie, c.prime, c.commission, c.statut])])}>Exporter CSV</button><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true);}}>+ Nouveau contrat</button></div>
    </div>
    <div className="tablewrap"><table className="table"><thead><tr><th>Police</th><th>Client</th><th>Compagnie</th><th>Prime</th><th>Commission</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{rows.map(c=>{ const cl = data.clients.find(x=>x.id===c.client_id); return <tr key={c.id}><td className="name">{c.police}</td><td>{clientName(cl)}</td><td>{c.compagnie}</td><td>{euro(c.prime)}</td><td>{euro(c.commission)}</td><td><Badge>{c.statut}</Badge></td><td><div className="actions"><button className="btn" onClick={()=>{setEdit(c);setOpen(true);}}>Modifier</button><button className="btn danger" onClick={()=>setToDelete(c)}>Supprimer</button></div></td></tr>; })}</tbody></table></div>
    {open && <ContractForm clients={data.clients} contract={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateContract(edit.id, payload) : await actions.addContract(payload); setOpen(false); }} />}
    {toDelete && <ConfirmDialog title="Supprimer le contrat" message={`Supprimer le contrat ${toDelete.police || "—"} ?`} onClose={()=>setToDelete(null)} onConfirm={async ()=>{ await actions.deleteContract(toDelete.id); setToDelete(null); }} />}
  </>;
}

function ContractForm({ clients, contract, onClose, onSave }) {
  const [form, setForm] = useState(contract || { client_id: clients[0]?.id || "", police:"", compagnie:"", prime:"", commission:"", statut:"Actif" });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={contract ? "Modifier le contrat" : "Nouveau contrat"} onClose={onClose}>
    <div className="formgrid">
      <select className="select" value={form.client_id} onChange={e=>set("client_id",e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{clientName(c)}</option>)}</select>
      <input className="input" placeholder="N° police" value={form.police} onChange={e=>set("police",e.target.value)} />
      <input className="input" placeholder="Compagnie" value={form.compagnie} onChange={e=>set("compagnie",e.target.value)} />
      <input className="input" placeholder="Prime" type="number" value={form.prime} onChange={e=>set("prime",e.target.value)} />
      <input className="input" placeholder="Commission" type="number" value={form.commission} onChange={e=>set("commission",e.target.value)} />
      <select className="select" value={form.statut} onChange={e=>set("statut",e.target.value)}><option>Actif</option><option>En attente</option><option>Résilié</option></select>
    </div>
    <div className="row" style={{justifyContent:"flex-end", marginTop:16}}><button className="btn" onClick={onClose}>Annuler</button><button className="btn primary" onClick={()=>onSave({...form, prime:Number(form.prime), commission:Number(form.commission)})}>Enregistrer</button></div>
  </Modal>;
}

function Tasks({ data, actions }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [status, setStatus] = useState("toutes");
  const tasks = data.tasks.filter((t) => status === "toutes" ? true : status === "faites" ? t.done : !t.done);
  return <>
    <div className="topbar">
      <div><div className="title">Tâches</div><div className="subtitle">Organisation des relances et priorités du cabinet.</div></div>
      <div className="filterbar"><select className="select" style={{width:180}} value={status} onChange={(e)=>setStatus(e.target.value)}><option value="toutes">Toutes</option><option value="ouvertes">Ouvertes</option><option value="faites">Faites</option></select><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true);}}>+ Nouvelle tâche</button></div>
    </div>
    <div className="col">{tasks.map(t=>{ const cl = data.clients.find(c=>c.id===t.client_id); return <div className="card" key={t.id} style={{opacity:t.done?.78:1}}><div className="row" style={{justifyContent:"space-between", alignItems:"center"}}><div><div style={{fontWeight:900, textDecoration:t.done?"line-through":"none"}}>{t.titre}</div><div className="small">{clientName(cl)} · échéance {fmtDate(t.echeance)}</div></div><div className="actions"><Badge>{t.priorite}</Badge><button className={`btn ${t.done ? "" : "good"}`} onClick={()=>actions.toggleTask(t)}>{t.done ? "Réouvrir" : "Terminer"}</button><button className="btn" onClick={()=>{setEdit(t);setOpen(true);}}>Modifier</button><button className="btn danger" onClick={()=>setToDelete(t)}>Supprimer</button></div></div></div>;})}</div>
    {open && <TaskForm clients={data.clients} task={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateTask(edit.id, payload) : await actions.addTask(payload); setOpen(false); }} />}
    {toDelete && <ConfirmDialog title="Supprimer la tâche" message={`Supprimer la tâche “${toDelete.titre}” ?`} onClose={()=>setToDelete(null)} onConfirm={async ()=>{ await actions.deleteTask(toDelete.id); setToDelete(null); }} />}
  </>;
}

function TaskForm({ clients, task, onClose, onSave }) {
  const [form, setForm] = useState(task || { client_id: clients[0]?.id || "", titre:"", echeance:today(), priorite:"Normale", done:false });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={task ? "Modifier la tâche" : "Nouvelle tâche"} onClose={onClose}>
    <div className="formgrid">
      <select className="select" value={form.client_id} onChange={e=>set("client_id",e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{clientName(c)}</option>)}</select>
      <input className="input" placeholder="Titre" value={form.titre} onChange={e=>set("titre",e.target.value)} />
      <input className="input" type="date" value={form.echeance} onChange={e=>set("echeance",e.target.value)} />
      <select className="select" value={form.priorite} onChange={e=>set("priorite",e.target.value)}><option>Basse</option><option>Normale</option><option>Haute</option><option>Urgente</option></select>
    </div>
    <div className="row" style={{justifyContent:"flex-end", marginTop:16}}><button className="btn" onClick={onClose}>Annuler</button><button className="btn primary" onClick={()=>onSave(form)}>Enregistrer</button></div>
  </Modal>;
}

function Pipeline({ data, actions }) {
  const [dragId, setDragId] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  return <>
    <div className="topbar">
      <div><div className="title">Pipeline</div><div className="subtitle">Pilotage commercial du prospect au gagné.</div></div>
      <div className="filterbar"><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true);}}>+ Opportunité</button></div>
    </div>
    <div className="kgrid">{STAGES.map(s=>{ const deals = data.deals.filter(d=>d.stage===s.id); return <div className="kcol" key={s.id} onDragOver={(e)=>e.preventDefault()} onDrop={()=>{ if(!dragId) return; actions.moveDeal(dragId, s.id); setDragId(null); }}><div className="khead"><span>{s.label}</span><span>{deals.length}</span></div><div className="kbody">{deals.map(d=>{ const cl = data.clients.find(c=>c.id===d.client_id); return <div key={d.id} className="kcard" draggable onDragStart={()=>setDragId(d.id)}><div style={{fontWeight:900}}>{d.titre}</div><div className="small">{clientName(cl)}</div><div style={{marginTop:8,fontWeight:900,color:'#c7d2fe'}}>{euro(d.montant)}</div><div className="row" style={{marginTop:10}}><button className="btn" onClick={(e)=>{e.stopPropagation();setEdit(d);setOpen(true);}}>Modifier</button><button className="btn danger" onClick={(e)=>{e.stopPropagation();setToDelete(d);}}>Supprimer</button></div></div>; })}</div></div>; })}</div>
    {open && <DealForm clients={data.clients} deal={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateDeal(edit.id, payload) : await actions.addDeal(payload); setOpen(false); }} />}
    {toDelete && <ConfirmDialog title="Supprimer l’opportunité" message={`Supprimer “${toDelete.titre}” ?`} onClose={()=>setToDelete(null)} onConfirm={async ()=>{ await actions.deleteDeal(toDelete.id); setToDelete(null); }} />}
  </>;
}

function DealForm({ clients, deal, onClose, onSave }) {
  const [form, setForm] = useState(deal || { client_id: clients[0]?.id || "", titre:"", montant:"", stage:"lead" });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={deal ? "Modifier l’opportunité" : "Nouvelle opportunité"} onClose={onClose}>
    <div className="formgrid">
      <select className="select" value={form.client_id} onChange={e=>set("client_id",e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{clientName(c)}</option>)}</select>
      <input className="input" placeholder="Titre" value={form.titre} onChange={e=>set("titre",e.target.value)} />
      <input className="input" placeholder="Montant" type="number" value={form.montant} onChange={e=>set("montant",e.target.value)} />
      <select className="select" value={form.stage} onChange={e=>set("stage",e.target.value)}>{STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select>
    </div>
    <div className="row" style={{justifyContent:"flex-end", marginTop:16}}><button className="btn" onClick={onClose}>Annuler</button><button className="btn primary" onClick={()=>onSave({...form, montant:Number(form.montant)})}>Enregistrer</button></div>
  </Modal>;
}

function Claims({ data, actions }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  return <>
    <div className="topbar">
      <div><div className="title">Sinistres</div><div className="subtitle">Suivi simple des dossiers sinistre.</div></div>
      <div className="filterbar"><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true);}}>+ Nouveau sinistre</button></div>
    </div>
    <div className="tablewrap"><table className="table"><thead><tr><th>Client</th><th>Description</th><th>Montant</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{data.claims.map(c=>{ const cl = data.clients.find(x=>x.id===c.client_id); return <tr key={c.id}><td className="name">{clientName(cl)}</td><td>{c.description}</td><td>{euro(c.montant)}</td><td><Badge>{c.statut}</Badge></td><td><div className="actions"><button className="btn" onClick={()=>{setEdit(c);setOpen(true);}}>Modifier</button><button className="btn danger" onClick={()=>setToDelete(c)}>Supprimer</button></div></td></tr>; })}</tbody></table></div>
    {open && <ClaimForm clients={data.clients} claim={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateClaim(edit.id, payload) : await actions.addClaim(payload); setOpen(false); }} />}
    {toDelete && <ConfirmDialog title="Supprimer le sinistre" message="Confirmer la suppression de ce sinistre ?" onClose={()=>setToDelete(null)} onConfirm={async ()=>{ await actions.deleteClaim(toDelete.id); setToDelete(null); }} />}
  </>;
}

function ClaimForm({ clients, claim, onClose, onSave }) {
  const [form, setForm] = useState(claim || { client_id: clients[0]?.id || "", description:"", montant:"", statut:"Ouvert" });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={claim ? "Modifier le sinistre" : "Nouveau sinistre"} onClose={onClose}>
    <div className="formgrid">
      <select className="select" value={form.client_id} onChange={e=>set("client_id",e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{clientName(c)}</option>)}</select>
      <input className="input" placeholder="Description" value={form.description} onChange={e=>set("description",e.target.value)} />
      <input className="input" type="number" placeholder="Montant" value={form.montant} onChange={e=>set("montant",e.target.value)} />
      <select className="select" value={form.statut} onChange={e=>set("statut",e.target.value)}><option>Ouvert</option><option>En cours</option><option>Clos</option></select>
    </div>
    <div className="row" style={{justifyContent:"flex-end", marginTop:16}}><button className="btn" onClick={onClose}>Annuler</button><button className="btn primary" onClick={()=>onSave({...form, montant:Number(form.montant)})}>Enregistrer</button></div>
  </Modal>;
}

function CraftCreation({ data, actions }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const toggleField = async (caseItem, key) => await actions.updateArtisan(caseItem.id, { [key]: !caseItem[key] });
  return <>
    <div className="topbar">
      <div><div className="title">Création artisan</div><div className="subtitle">Qualification, formalités, assurances pro et conversion en client.</div></div>
      <div className="filterbar"><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true);}}>+ Dossier artisan</button></div>
    </div>
    <div className="col">{data.artisans.map(c => <div className="card" key={c.id}>
      <div className="row" style={{justifyContent:'space-between', alignItems:'flex-start'}}><div><div style={{fontWeight:900, fontSize:20}}>{c.nom}</div><div className="small">{c.activite} · {c.statut_juridique || '—'}</div></div><Badge>{c.avancement || 'À qualifier'}</Badge></div>
      <div className="row" style={{marginTop:12}}>
        <span className="badge" style={{background:'#172554', color:'#93c5fd'}}>INPI : {c.inpi_status || '—'}</span>
        {c.besoin_decennale && <span className="badge" style={{background:'#3b1219', color:'#fca5a5'}}>Décennale</span>}
        {c.besoin_rcpro && <span className="badge" style={{background:'#1f2937', color:'#cbd5e1'}}>RC Pro</span>}
      </div>
      <div className="row" style={{marginTop:14}}>
        <button className={`btn ${c.besoin_decennale ? 'good' : ''}`} onClick={()=>toggleField(c, 'besoin_decennale')}>Décennale</button>
        <button className={`btn ${c.besoin_rcpro ? 'good' : ''}`} onClick={()=>toggleField(c, 'besoin_rcpro')}>RC Pro</button>
        <button className="btn" onClick={()=>{setEdit(c);setOpen(true);}}>Modifier</button>
        <button className="btn danger" onClick={() => setToDelete(c)}>Supprimer</button>
      </div>
      <div style={{marginTop:14}}><div className="small">Notes</div><div style={{marginTop:6}}>{c.notes || '—'}</div></div>
    </div>)}</div>
    {open && <CraftForm artisan={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateArtisan(edit.id, payload) : await actions.addArtisan(payload); setOpen(false); }} />}
    {toDelete && <ConfirmDialog title="Supprimer le dossier artisan" message={`Supprimer ${toDelete.nom} ?`} onClose={()=>setToDelete(null)} onConfirm={async ()=>{ await actions.deleteArtisan(toDelete.id); setToDelete(null); }} />}
  </>;
}

function CraftForm({ artisan, onClose, onSave }) {
  const [form, setForm] = useState(artisan || { nom:'', activite:'', statut_juridique:'EI', avancement:'À qualifier', besoin_decennale:true, besoin_rcpro:true, inpi_status:'Non démarré', notes:'' });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={artisan ? "Modifier le dossier artisan" : "Nouveau dossier artisan"} onClose={onClose}>
    <div className="formgrid">
      <input className="input" placeholder="Nom" value={form.nom} onChange={e=>set('nom', e.target.value)} />
      <input className="input" placeholder="Activité" value={form.activite} onChange={e=>set('activite', e.target.value)} />
      <select className="select" value={form.statut_juridique} onChange={e=>set('statut_juridique', e.target.value)}><option>EI</option><option>SASU</option><option>EURL</option><option>SARL</option><option>SAS</option></select>
      <select className="select" value={form.avancement} onChange={e=>set('avancement', e.target.value)}><option>À qualifier</option><option>Dossier en cours</option><option>À déposer</option><option>Immatriculé</option><option>Transformé en client</option></select>
      <select className="select" value={form.inpi_status} onChange={e=>set('inpi_status', e.target.value)}><option>Non démarré</option><option>À préparer</option><option>En cours</option><option>Déposé</option></select>
    </div>
    <div className="row" style={{marginTop:12}}>
      <label className="small"><input type="checkbox" checked={form.besoin_decennale} onChange={e=>set('besoin_decennale', e.target.checked)} /> Décennale</label>
      <label className="small"><input type="checkbox" checked={form.besoin_rcpro} onChange={e=>set('besoin_rcpro', e.target.checked)} /> RC Pro</label>
    </div>
    <div style={{marginTop:12}}><textarea className="textarea" placeholder="Notes" value={form.notes} onChange={e=>set('notes', e.target.value)} /></div>
    <div className="row" style={{justifyContent:'flex-end', marginTop:16}}><button className="btn" onClick={onClose}>Annuler</button><button className="btn primary" onClick={()=>onSave(form)}>Enregistrer</button></div>
  </Modal>;
}

function Reports({ data }) {
  const totalPrime = data.contracts.filter(c=>c.statut==='Actif').reduce((s,c)=>s+Number(c.prime||0),0);
  const totalCommission = data.contracts.filter(c=>c.statut==='Actif').reduce((s,c)=>s+Number(c.commission||0),0);
  const topClients = data.clients.map(c => ({
    ...c,
    value: data.contracts.filter(k => k.client_id === c.id).reduce((s, k) => s + Number(k.prime || 0), 0),
  })).sort((a, b) => b.value - a.value).slice(0, 5);
  return <div className="col">
    <div className="grid3">
      <div className="card"><div className="title" style={{fontSize:20, marginBottom:10}}>Clients</div><strong>{data.clients.length}</strong></div>
      <div className="card"><div className="title" style={{fontSize:20, marginBottom:10}}>Primes actives</div><strong>{euro(totalPrime)}</strong></div>
      <div className="card"><div className="title" style={{fontSize:20, marginBottom:10}}>Commissions</div><strong>{euro(totalCommission)}</strong></div>
    </div>
    <div className="grid2">
      <div className="card"><div className="title" style={{fontSize:20, marginBottom:10}}>Top clients</div>{topClients.length === 0 ? <div className="small">Aucune donnée.</div> : topClients.map(c => <div key={c.id} className="metricline"><span>{clientName(c)}</span><strong>{euro(c.value)}</strong></div>)}</div>
      <div className="card"><div className="title" style={{fontSize:20, marginBottom:10}}>Répartition activité</div><div className="metricline"><span>Opportunités gagnées</span><strong>{data.deals.filter(d=>d.stage === 'gagne').length}</strong></div><div className="metricline"><span>Sinistres ouverts</span><strong>{data.claims.filter(c=>c.statut !== 'Clos').length}</strong></div><div className="metricline"><span>Dossiers artisans</span><strong>{data.artisans.length}</strong></div></div>
    </div>
  </div>;
}

function CRMApp({ onLogout, currentUser, currentOrg }) {
  const { data, actions, loading, error, toasts, removeToast } = useCRMCloud(currentOrg?.organization_id);
  const [page, setPage] = useState("dashboard");
  const [q, setQ] = useState("");

  const filteredData = useMemo(() => {
    if (!q.trim()) return data;
    const ids = data.clients.filter(c => lower(`${c.prenom} ${c.nom} ${c.email} ${c.tel} ${c.ville}`).includes(lower(q))).map(c=>c.id);
    return {
      ...data,
      clients: data.clients.filter(c=>ids.includes(c.id)),
      contracts: data.contracts.filter(c=>ids.includes(c.client_id)),
      tasks: data.tasks.filter(c=>ids.includes(c.client_id)),
      deals: data.deals.filter(c=>ids.includes(c.client_id)),
      claims: data.claims.filter(c=>ids.includes(c.client_id)),
      artisans: data.artisans.filter(c => lower(`${c.nom} ${c.activite} ${c.statut_juridique} ${c.inpi_status}`).includes(lower(q))),
    };
  }, [data, q]);

  return <>
    <style>{CSS}</style>
    <Toasts items={toasts} remove={removeToast} />
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">AP</div>
          <div><div style={{fontWeight:900}}>AssurPilot</div><div className="small">CRM intelligent pour courtiers</div></div>
        </div>
        <div className="nav">{MENU.map(([id, label]) => <button key={id} className={page===id?"active":""} onClick={()=>setPage(id)}>{label}</button>)}</div>
        <div className="side-footer">
          <div style={{fontWeight:900, marginBottom:6}}>Vue AssurPilot</div>
          <div className="small">Connecté : {currentUser?.email || "—"}</div>
            <div className="small">Établissement : {currentOrg?.organization_name || "—"}</div>
            <div className="small">Rôle : {currentOrg?.role || "—"}</div>
          <div className="small">Clients : {data.clients.length}</div>
          <div className="small">Contrats actifs : {data.contracts.filter(c=>c.statut === 'Actif').length}</div>
          <div className="small">Pipeline : {euro(data.deals.reduce((s, d) => s + Number(d.montant || 0), 0))}</div>
          {DEV_TOOLS ? <div className="row" style={{marginTop:10}}><button className="btn" onClick={actions.refresh}>Rafraîchir</button><button className="btn primary" onClick={actions.seedDemo}>Créer démo</button></div> : null}
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <div>
            <div className="title">{MENU.find(m=>m[0]===page)?.[1]}</div>
            <div className="subtitle">AssurPilot pilote votre cabinet, vos relances et votre activité artisan sans friction.</div>
          </div>
          <div className="filterbar">
            <input className="input searchbar" placeholder="Recherche globale client / artisan..." value={q} onChange={(e)=>setQ(e.target.value)} />
            <button className="btn" onClick={()=>exportCSV("clients.csv", [["Prénom","Nom","Email","Téléphone","Ville","Statut"], ...data.clients.map(c=>[c.prenom,c.nom,c.email,c.tel,c.ville,c.statut])])}>Exporter clients</button>
            <button className="btn light" onClick={onLogout}>Déconnexion</button>
          </div>
        </div>

        {error && <div className="notice">Erreur Supabase : {error}</div>}
        {loading && <div className="notice">Chargement des données du cabinet...</div>}
        {!loading && data.clients.length === 0 && data.contracts.length === 0 && data.tasks.length === 0 && data.deals.length === 0 && data.claims.length === 0 && data.artisans.length === 0 && <div className="notice">La base est vide. Commence par créer tes premiers clients, contrats ou dossiers artisans.</div>}

        {page === "dashboard" && <Dashboard data={filteredData} />}
        {page === "clients" && <Clients data={filteredData} actions={actions} />}
        {page === "contracts" && <Contracts data={filteredData} actions={actions} />}
        {page === "tasks" && <Tasks data={filteredData} actions={actions} />}
        {page === "pipeline" && <Pipeline data={filteredData} actions={actions} />}
        {page === "claims" && <Claims data={filteredData} actions={actions} />}
        {page === "craft" && <CraftCreation data={filteredData} actions={actions} />}
        {page === "reports" && <Reports data={filteredData} />}
      </main>
    </div>
  </>;
}


function LoginScreen({ onLogin, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const shell = {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "radial-gradient(circle at top left,#0b1838 0%,#08111f 34%,#050b15 100%)",
    color: "white",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const card = {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
  };

  const input = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none",
  };

  const button = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  };

  return (
    <div style={shell}>
      <div style={card}>
        <div style={{display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px"}}>
          <div style={{width:"46px", height:"46px", borderRadius:"16px", display:"grid", placeItems:"center", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", fontWeight:900}}>AP</div>
          <div>
            <div style={{fontSize:"28px", fontWeight:900}}>AssurPilot</div>
            <div style={{fontSize:"13px", color:"#94a3b8"}}>Connexion sécurisée au CRM</div>
          </div>
        </div>

        <div style={{fontSize:"34px", fontWeight:900, lineHeight:1.1, marginBottom:"10px"}}>Espace CRM privé</div>
        <div style={{color:"#cbd5e1", lineHeight:1.7, marginBottom:"20px"}}>
          Connecte-toi pour accéder à ton établissement, tes utilisateurs et tes données clients.
        </div>

        <div style={{display:"grid", gap:"12px"}}>
          <input
            style={input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            style={input}
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            onKeyDown={(e)=>{ if (e.key === "Enter") onLogin(email, password); }}
          />
          {error ? <div style={{padding:"12px 14px", borderRadius:"14px", background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", color:"#fecaca"}}>{error}</div> : null}
          <button style={button} onClick={()=>onLogin(email, password)} disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <button
            style={{...button, background:"transparent", border:"1px solid rgba(255,255,255,0.12)"}}
            onClick={()=>window.location.href = "/"}
          >
            Retour au site
          </button>
        </div>
      </div>
    </div>
  );
}


function CRMProtected() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");
  const [mode, setMode] = useState("login");
  const [currentOrg, setCurrentOrg] = useState(null);

  const loadCurrentOrg = async (userId) => {
    const { data, error } = await supabase
      .from("organization_users")
      .select("organization_id, role, organizations(name, slug)")
      .eq("user_id", userId)
      .limit(1);

    if (error) {
      setCurrentOrg(null);
      return;
    }

    const row = data?.[0];
    if (!row) {
      setCurrentOrg(null);
      return;
    }

    setCurrentOrg({
      organization_id: row.organization_id,
      role: row.role,
      organization_name: row.organizations?.name || "—",
      organization_slug: row.organizations?.slug || "",
    });
  };

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!active) return;
      if (error) setAuthError(error.message || "Erreur de session");
      setSession(data.session || null);
      if (data.session?.user?.id) {
        await loadCurrentOrg(data.session.user.id);
      } else {
        setCurrentOrg(null);
      }
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!active) return;
      setSession(newSession || null);
      if (newSession?.user?.id) {
        await loadCurrentOrg(newSession.user.id);
      } else {
        setCurrentOrg(null);
      }
      setChecking(false);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError("");
    setAuthInfo("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message || "Connexion impossible");
    setAuthLoading(false);
  };

  const signup = async ({ fullName, orgName, email, password }) => {
    setAuthLoading(true);
    setAuthError("");
    setAuthInfo("");

    if (!fullName.trim()) {
      setAuthError("Le nom complet est obligatoire.");
      setAuthLoading(false);
      return;
    }

    if (!orgName.trim()) {
      setAuthError("Le nom de l’établissement est obligatoire.");
      setAuthLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/crm",
        data: { full_name: fullName, org_name: orgName },
      },
    });

    if (error) {
      setAuthError(error.message || "Inscription impossible");
      setAuthLoading(false);
      return;
    }

    if (data?.session && data?.user?.id) {
      const { error: rpcError } = await supabase.rpc("create_organization_for_user", {
        p_user_id: data.user.id,
        p_org_name: orgName,
        p_org_slug: null,
      });

      if (rpcError && !String(rpcError.message || "").toLowerCase().includes("déjà rattaché")) {
        setAuthError(rpcError.message || "Compte créé, mais établissement non créé.");
        setAuthLoading(false);
        return;
      }
    }

    setAuthInfo("Compte créé. Vérifie ton email si une confirmation est demandée, puis connecte-toi.");
    setMode("login");
    setAuthLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (checking) {
    return <div style={{minHeight:"100vh", display:"grid", placeItems:"center", background:"radial-gradient(circle at top left,#0b1838 0%,#08111f 34%,#050b15 100%)", color:"white", fontFamily:"Inter, Arial, sans-serif"}}><div style={{padding:"18px 22px", borderRadius:"18px", background:"rgba(15,23,42,0.82)", border:"1px solid rgba(255,255,255,0.08)"}}>Vérification de l’accès sécurisé...</div></div>;
  }

  if (!session) {
    return <LoginScreen onLogin={login} loading={authLoading} error={authError} />;
  }

  return <CRMApp onLogout={logout} currentUser={session.user} currentOrg={currentOrg} />;
}


export default function App() {
  const path = window.location.pathname;
  if (path === "/crm") return <CRMProtected />;
  return <Landing />;
}

