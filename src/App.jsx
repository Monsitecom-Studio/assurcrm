import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://mwmgbputepupsmxmkeco.supabase.co",
  "sb_publishable_WsdtYK8PqBNCaliPt8Z1yA_YUqhtlVf"
);

const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);
const euro = (n) => Number(n || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "—");

const BRANCHES = [
  { id: "auto", label: "Auto", color: "#60a5fa" },
  { id: "mrh", label: "MRH", color: "#34d399" },
  { id: "sante", label: "Santé", color: "#f87171" },
  { id: "pro", label: "RC Pro", color: "#a78bfa" },
  { id: "prevoyance", label: "Prévoyance", color: "#fbbf24" },
];

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
:root{--bg:#0b1020;--panel:#11172a;--panel2:#171f36;--line:#27314d;--soft:#94a3b8;--txt:#f8fafc;--acc:#6366f1;--ok:#22c55e;--warn:#f59e0b;--bad:#ef4444;--radius:16px}
*{box-sizing:border-box} body{margin:0;background:linear-gradient(180deg,#08101f,#0b1020);color:var(--txt);font-family:Inter,system-ui,sans-serif}
button,input,select,textarea{font:inherit}.app{display:grid;grid-template-columns:260px 1fr;min-height:100vh}
.sidebar{background:rgba(10,15,29,.95);border-right:1px solid var(--line);padding:18px;position:sticky;top:0;height:100vh}
.brand{display:flex;gap:12px;align-items:center;padding:10px 8px 18px;border-bottom:1px solid var(--line);margin-bottom:14px}
.logo{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:grid;place-items:center;font-weight:800}
.nav{display:flex;flex-direction:column;gap:8px}.nav button{background:transparent;color:#cbd5e1;border:none;padding:12px 14px;border-radius:12px;text-align:left;cursor:pointer;font-weight:600}.nav button.active,.nav button:hover{background:#18213a;color:#fff}
.main{padding:22px 24px 34px}.top{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:18px}.title{font-size:30px;font-weight:800;letter-spacing:-.02em}
.row{display:flex;gap:12px;flex-wrap:wrap}.input,.select,.textarea{background:var(--panel);border:1px solid var(--line);color:#fff;border-radius:12px;padding:11px 12px;width:100%}.textarea{min-height:88px;resize:vertical}
.btn{background:#1b2642;color:#fff;border:1px solid var(--line);padding:10px 14px;border-radius:12px;cursor:pointer;font-weight:700}.btn.primary{background:linear-gradient(135deg,#6366f1,#4f46e5);border:none}.btn.good{background:#123321;border:1px solid #24533a}.btn.danger{background:#391418;border:1px solid #6b1c24}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.card{background:rgba(17,23,42,.92);border:1px solid var(--line);border-radius:var(--radius);padding:18px;box-shadow:0 12px 36px rgba(0,0,0,.18)}.stat .label{color:var(--soft);font-size:12px;text-transform:uppercase;letter-spacing:.08em}.stat .value{font-size:28px;font-weight:800;margin-top:6px}
.tablewrap{overflow:auto;border:1px solid var(--line);border-radius:16px}.table{width:100%;border-collapse:collapse;background:rgba(17,23,42,.92)}.table th,.table td{padding:12px 14px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}.table th{font-size:12px;color:#94a3b8;text-transform:uppercase}.table td.name{font-weight:700;color:#fff}
.badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700}.modalbg{position:fixed;inset:0;background:rgba(2,6,23,.7);display:grid;place-items:center;padding:16px;z-index:50}.modal{width:min(860px,100%);max-height:90vh;overflow:auto;background:#0f172a;border:1px solid var(--line);border-radius:20px}.modal header{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--line)}.modal .body{padding:20px}
.kgrid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;overflow:auto}.kcol{min-width:250px;background:rgba(17,23,42,.92);border:1px solid var(--line);border-radius:16px}.khead{padding:12px 14px;border-bottom:1px solid var(--line);font-weight:800;font-size:13px;display:flex;justify-content:space-between}.kbody{padding:10px;display:flex;flex-direction:column;gap:10px;min-height:300px}.kcard{background:#19233b;border:1px solid var(--line);border-radius:14px;padding:12px;cursor:grab}
.formgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.small{font-size:12px;color:var(--soft)}.searchbar{min-width:260px}.actions{display:flex;gap:8px;flex-wrap:wrap}.notice{background:#10203b;border:1px solid #1e3a5f;color:#bfdbfe;padding:10px 12px;border-radius:12px;font-size:12px;margin-bottom:14px}
@media (max-width:1100px){.grid4,.grid3,.grid2,.formgrid,.kgrid{grid-template-columns:1fr}.app{grid-template-columns:1fr}.sidebar{position:relative;height:auto}}
`;

function seedSample() {
  return {
    clients: [
      { prenom: "Jean", nom: "Martin", email: "jean.martin@mail.fr", tel: "0611223344", ville: "Toulouse", statut: "Client actif" },
      { prenom: "Sophie", nom: "Durand", email: "sophie.durand@mail.fr", tel: "0622334455", ville: "Bordeaux", statut: "Prospect" },
    ],
    contracts: [
      { police: "AUTO-2026-001", compagnie: "AXA", prime: 890, commission: 125, statut: "Actif" },
    ],
    tasks: [
      { titre: "Relance devis auto", echeance: today(), priorite: "Haute", done: false },
    ],
    deals: [
      { titre: "Pack auto", montant: 980, stage: "devis" },
    ],
    claims: [
      { description: "Choc arrière", statut: "Ouvert", montant: 2100 },
    ],
    artisans: [
      { nom: "Rachid Benali", activite: "Électricien", statut_juridique: "SASU", avancement: "Dossier en cours", besoin_decennale: true, besoin_rcpro: true, inpi_status: "À préparer", notes: "Accompagnement jusqu'aux attestations." },
    ],
  };
}

function Modal({ title, onClose, children }) {
  return <div className="modalbg" onClick={onClose}><div className="modal" onClick={(e)=>e.stopPropagation()}><header><strong>{title}</strong><button className="btn" onClick={onClose}>Fermer</button></header><div className="body">{children}</div></div></div>;
}

function colorBadge(txt) {
  if (["Actif", "Client actif", "Gagné", "Clos", "Transformé en client", "Immatriculé"].includes(txt)) return { background: "#123321", color: "#86efac" };
  if (["Prospect", "Ouvert", "À qualifier"].includes(txt)) return { background: "#172554", color: "#93c5fd" };
  if (["Haute", "Urgente", "Perdu"].includes(txt)) return { background: "#3b1219", color: "#fca5a5" };
  return { background: "#3a2a08", color: "#fde68a" };
}
function Badge({ children }) { const c = colorBadge(children); return <span className="badge" style={c}>{children}</span>; }
function clientName(c) { return c ? `${c.prenom || ""} ${c.nom || ""}`.trim() : "—"; }
function branchLabel(id) { return BRANCHES.find((b) => b.id === id)?.label || id; }

function exportCSV(filename, rows) {
  const csv = rows
    .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function useCRMCloud() {
  const [data, setData] = useState({ clients: [], contracts: [], tasks: [], deals: [], claims: [], artisans: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    let channel = null;
    const hasWebSocket = typeof window !== "undefined" && typeof window.WebSocket !== "undefined";

    if (hasWebSocket) {
      channel = supabase
        .channel("crm-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, loadAll)
        .on("postgres_changes", { event: "*", schema: "public", table: "contracts" }, loadAll)
        .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, loadAll)
        .on("postgres_changes", { event: "*", schema: "public", table: "deals" }, loadAll)
        .on("postgres_changes", { event: "*", schema: "public", table: "claims" }, loadAll)
        .on("postgres_changes", { event: "*", schema: "public", table: "artisans" }, loadAll)
        .subscribe();
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const actions = {
    refresh: loadAll,
    seedDemo: async () => {
      const sample = seedSample();
      const { data: insertedClients } = await supabase.from("clients").insert(sample.clients).select();
      const firstClientId = insertedClients?.[0]?.id;
      const secondClientId = insertedClients?.[1]?.id || firstClientId;
      await supabase.from("contracts").insert([{ ...sample.contracts[0], client_id: firstClientId }]);
      await supabase.from("tasks").insert([{ ...sample.tasks[0], client_id: secondClientId }]);
      await supabase.from("deals").insert([{ ...sample.deals[0], client_id: secondClientId }]);
      await supabase.from("claims").insert([{ ...sample.claims[0], client_id: firstClientId }]);
      await supabase.from("artisans").insert(sample.artisans);
      await loadAll();
    },
    addClient: async (payload) => { await supabase.from("clients").insert([{ ...payload }]); await loadAll(); },
    updateClient: async (id, payload) => { await supabase.from("clients").update(payload).eq("id", id); await loadAll(); },
    deleteClient: async (id) => {
      await supabase.from("contracts").delete().eq("client_id", id);
      await supabase.from("tasks").delete().eq("client_id", id);
      await supabase.from("deals").delete().eq("client_id", id);
      await supabase.from("claims").delete().eq("client_id", id);
      await supabase.from("clients").delete().eq("id", id);
      await loadAll();
    },
    addContract: async (payload) => { await supabase.from("contracts").insert([{ ...payload }]); await loadAll(); },
    updateContract: async (id, payload) => { await supabase.from("contracts").update(payload).eq("id", id); await loadAll(); },
    deleteContract: async (id) => { await supabase.from("contracts").delete().eq("id", id); await loadAll(); },
    addTask: async (payload) => { await supabase.from("tasks").insert([{ ...payload }]); await loadAll(); },
    updateTask: async (id, payload) => { await supabase.from("tasks").update(payload).eq("id", id); await loadAll(); },
    deleteTask: async (id) => { await supabase.from("tasks").delete().eq("id", id); await loadAll(); },
    toggleTask: async (task) => { await supabase.from("tasks").update({ done: !task.done }).eq("id", task.id); await loadAll(); },
    addDeal: async (payload) => { await supabase.from("deals").insert([{ ...payload }]); await loadAll(); },
    updateDeal: async (id, payload) => { await supabase.from("deals").update(payload).eq("id", id); await loadAll(); },
    deleteDeal: async (id) => { await supabase.from("deals").delete().eq("id", id); await loadAll(); },
    moveDeal: async (id, stage) => { await supabase.from("deals").update({ stage }).eq("id", id); await loadAll(); },
    addClaim: async (payload) => { await supabase.from("claims").insert([{ ...payload }]); await loadAll(); },
    updateClaim: async (id, payload) => { await supabase.from("claims").update(payload).eq("id", id); await loadAll(); },
    deleteClaim: async (id) => { await supabase.from("claims").delete().eq("id", id); await loadAll(); },
    addArtisan: async (payload) => { await supabase.from("artisans").insert([{ ...payload }]); await loadAll(); },
    updateArtisan: async (id, payload) => { await supabase.from("artisans").update(payload).eq("id", id); await loadAll(); },
    deleteArtisan: async (id) => { await supabase.from("artisans").delete().eq("id", id); await loadAll(); },
  };

  return { data, actions, loading, error };
}

function Dashboard({ data }) {
  const activeContracts = data.contracts.filter((c) => c.statut === "Actif");
  const totalPrime = activeContracts.reduce((s, c) => s + Number(c.prime || 0), 0);
  const totalCommission = activeContracts.reduce((s, c) => s + Number(c.commission || 0), 0);
  const openClaims = data.claims.filter((c) => c.statut !== "Clos").length;
  const todo = data.tasks.filter((t) => !t.done).length;
  const craftOpen = data.artisans.length;
  return <div className="row" style={{flexDirection:"column"}}>
    <div className="grid4">
      <div className="card stat"><div className="label">Clients</div><div className="value">{data.clients.length}</div></div>
      <div className="card stat"><div className="label">Contrats actifs</div><div className="value">{activeContracts.length}</div></div>
      <div className="card stat"><div className="label">Primes</div><div className="value">{euro(totalPrime)}</div></div>
      <div className="card stat"><div className="label">Commissions</div><div className="value">{euro(totalCommission)}</div></div>
    </div>
    <div className="grid3">
      <div className="card"><div className="title" style={{fontSize:18, marginBottom:10}}>Suivi rapide</div><div className="small">Tâches ouvertes : <strong style={{color:'#fff'}}>{todo}</strong></div><div className="small">Sinistres ouverts : <strong style={{color:'#fff'}}>{openClaims}</strong></div><div className="small">Dossiers artisans : <strong style={{color:'#fff'}}>{craftOpen}</strong></div></div>
      <div className="card"><div className="title" style={{fontSize:18, marginBottom:10}}>Répartition contrats</div><div className="row">{BRANCHES.map(b=>{ const n = data.contracts.filter(c=>c.branche===b.id && c.statut==='Actif').length; return <div key={b.id} className="badge" style={{background:b.color+"22", color:b.color}}>{b.label} : {n}</div>; })}</div></div>
      <div className="card"><div className="title" style={{fontSize:18, marginBottom:10}}>Cloud partagé</div><div className="small">Cette version synchronise les données entre 2 utilisateurs via Supabase.</div></div>
    </div>
  </div>;
}

function Clients({ data, actions }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const filtered = useMemo(() => data.clients.filter((c) => `${c.prenom} ${c.nom} ${c.email} ${c.tel} ${c.ville}`.toLowerCase().includes(q.toLowerCase())), [data.clients, q]);
  return <>
    <div className="top"><input className="input searchbar" placeholder="Rechercher un client..." value={q} onChange={(e)=>setQ(e.target.value)} /><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true);}}>+ Nouveau client</button></div>
    <div className="tablewrap"><table className="table"><thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Ville</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{filtered.map(c=><tr key={c.id}><td className="name">{clientName(c)}</td><td>{c.email}</td><td>{c.tel}</td><td>{c.ville}</td><td><Badge>{c.statut}</Badge></td><td><div className="actions"><button className="btn" onClick={()=>{setEdit(c);setOpen(true);}}>Modifier</button><button className="btn danger" onClick={()=>actions.deleteClient(c.id)}>Supprimer</button></div></td></tr>)}</tbody></table></div>
    {open && <ClientForm client={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateClient(edit.id, payload) : await actions.addClient(payload); setOpen(false); }} />}
  </>;
}

function ClientForm({ client, onClose, onSave }) {
  const [form, setForm] = useState(client || { prenom:"", nom:"", email:"", tel:"", ville:"", statut:"Prospect" });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={client?"Modifier le client":"Nouveau client"} onClose={onClose}>
    <div className="formgrid">
      <input className="input" placeholder="Prénom" value={form.prenom} onChange={e=>set("prenom",e.target.value)} />
      <input className="input" placeholder="Nom" value={form.nom} onChange={e=>set("nom",e.target.value)} />
      <input className="input" placeholder="Email" value={form.email} onChange={e=>set("email",e.target.value)} />
      <input className="input" placeholder="Téléphone" value={form.tel} onChange={e=>set("tel",e.target.value)} />
      <input className="input" placeholder="Ville" value={form.ville} onChange={e=>set("ville",e.target.value)} />
      <select className="select" value={form.statut} onChange={e=>set("statut",e.target.value)}><option>Prospect</option><option>Client actif</option><option>Ancien client</option></select>
    </div>
    <div className="row" style={{justifyContent:"flex-end", marginTop:16}}><button className="btn" onClick={onClose}>Annuler</button><button className="btn primary" onClick={()=>onSave(form)}>Enregistrer</button></div>
  </Modal>;
}

function Contracts({ data, actions }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");
  const rows = data.contracts.filter(c => { const client = data.clients.find(x=>x.id===c.client_id); return `${c.police} ${c.compagnie} ${clientName(client)}`.toLowerCase().includes(q.toLowerCase()); });
  return <>
    <div className="top"><input className="input searchbar" placeholder="Rechercher un contrat..." value={q} onChange={e=>setQ(e.target.value)} /><div className="row"><button className="btn" onClick={()=>exportCSV("contrats.csv", [["Police","Client","Compagnie","Prime","Commission","Statut"], ...rows.map(c=>[c.police, clientName(data.clients.find(x=>x.id===c.client_id)), c.compagnie, c.prime, c.commission, c.statut])])}>Exporter CSV</button><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true)}}>+ Nouveau contrat</button></div></div>
    <div className="tablewrap"><table className="table"><thead><tr><th>Police</th><th>Client</th><th>Compagnie</th><th>Prime</th><th>Commission</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{rows.map(c=>{ const cl = data.clients.find(x=>x.id===c.client_id); return <tr key={c.id}><td className="name">{c.police}</td><td>{clientName(cl)}</td><td>{c.compagnie}</td><td>{euro(c.prime)}</td><td>{euro(c.commission)}</td><td><Badge>{c.statut}</Badge></td><td><div className="actions"><button className="btn" onClick={()=>{setEdit(c);setOpen(true)}}>Modifier</button><button className="btn danger" onClick={()=>actions.deleteContract(c.id)}>Supprimer</button></div></td></tr>; })}</tbody></table></div>
    {open && <ContractForm clients={data.clients} contract={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateContract(edit.id, payload) : await actions.addContract(payload); setOpen(false); }} />}
  </>;
}

function ContractForm({ clients, contract, onClose, onSave }) {
  const [form, setForm] = useState(contract || { client_id: clients[0]?.id || "", police:"", compagnie:"", prime:"", commission:"", statut:"Actif" });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={contract?"Modifier le contrat":"Nouveau contrat"} onClose={onClose}>
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
  return <>
    <div className="top"><div className="small">Clique pour terminer ou réouvrir une tâche.</div><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true)}}>+ Nouvelle tâche</button></div>
    <div className="row" style={{flexDirection:"column"}}>{data.tasks.map(t=>{ const cl = data.clients.find(c=>c.id===t.client_id); return <div className="card" key={t.id} style={{opacity:t.done?.7:1}}><div className="row" style={{justifyContent:"space-between", alignItems:"center"}}><div><div style={{fontWeight:800, textDecoration:t.done?"line-through":"none"}}>{t.titre}</div><div className="small">{clientName(cl)} · échéance {fmtDate(t.echeance)}</div></div><div className="row"><Badge>{t.priorite}</Badge><button className={`btn ${t.done?"":"good"}`} onClick={()=>actions.toggleTask(t)}>{t.done?"Réouvrir":"Terminer"}</button><button className="btn" onClick={()=>{setEdit(t);setOpen(true)}}>Modifier</button><button className="btn danger" onClick={()=>actions.deleteTask(t.id)}>Supprimer</button></div></div></div>;})}</div>
    {open && <TaskForm clients={data.clients} task={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateTask(edit.id, payload) : await actions.addTask(payload); setOpen(false); }} />}
  </>;
}

function TaskForm({ clients, task, onClose, onSave }) {
  const [form, setForm] = useState(task || { client_id: clients[0]?.id || "", titre:"", echeance:today(), priorite:"Normale", done:false });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={task?"Modifier la tâche":"Nouvelle tâche"} onClose={onClose}>
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
  return <>
    <div className="top"><div className="small">Tu peux déplacer les opportunités entre les colonnes.</div><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true)}}>+ Opportunité</button></div>
    <div className="kgrid">{STAGES.map(s=>{ const deals = data.deals.filter(d=>d.stage===s.id); return <div className="kcol" key={s.id} onDragOver={(e)=>e.preventDefault()} onDrop={()=>{ if(!dragId) return; actions.moveDeal(dragId, s.id); setDragId(null); }}><div className="khead"><span>{s.label}</span><span>{deals.length}</span></div><div className="kbody">{deals.map(d=>{ const cl = data.clients.find(c=>c.id===d.client_id); return <div key={d.id} className="kcard" draggable onDragStart={()=>setDragId(d.id)}><div style={{fontWeight:800}}>{d.titre}</div><div className="small">{clientName(cl)}</div><div style={{marginTop:8,fontWeight:800,color:'#c7d2fe'}}>{euro(d.montant)}</div><div className="row" style={{marginTop:10}}><button className="btn" onClick={(e)=>{e.stopPropagation();setEdit(d);setOpen(true)}}>Modifier</button><button className="btn danger" onClick={(e)=>{e.stopPropagation();actions.deleteDeal(d.id)}}>Supprimer</button></div></div>; })}</div></div>; })}</div>
    {open && <DealForm clients={data.clients} deal={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateDeal(edit.id, payload) : await actions.addDeal(payload); setOpen(false); }} />}
  </>;
}

function DealForm({ clients, deal, onClose, onSave }) {
  const [form, setForm] = useState(deal || { client_id: clients[0]?.id || "", titre:"", montant:"", stage:"lead" });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={deal?"Modifier l’opportunité":"Nouvelle opportunité"} onClose={onClose}>
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
  return <>
    <div className="top"><div className="small">Gestion simple des sinistres.</div><button className="btn primary" onClick={()=>{setEdit(null);setOpen(true)}}>+ Nouveau sinistre</button></div>
    <div className="tablewrap"><table className="table"><thead><tr><th>Client</th><th>Description</th><th>Montant</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{data.claims.map(c=>{ const cl = data.clients.find(x=>x.id===c.client_id); return <tr key={c.id}><td className="name">{clientName(cl)}</td><td>{c.description}</td><td>{euro(c.montant)}</td><td><Badge>{c.statut}</Badge></td><td><div className="actions"><button className="btn" onClick={()=>{setEdit(c);setOpen(true)}}>Modifier</button><button className="btn danger" onClick={()=>actions.deleteClaim(c.id)}>Supprimer</button></div></td></tr>; })}</tbody></table></div>
    {open && <ClaimForm clients={data.clients} claim={edit} onClose={()=>setOpen(false)} onSave={async (payload)=>{ edit ? await actions.updateClaim(edit.id, payload) : await actions.addClaim(payload); setOpen(false); }} />}
  </>;
}

function ClaimForm({ clients, claim, onClose, onSave }) {
  const [form, setForm] = useState(claim || { client_id: clients[0]?.id || "", description:"", montant:"", statut:"Ouvert" });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title={claim?"Modifier le sinistre":"Nouveau sinistre"} onClose={onClose}>
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
  const toggleField = async (caseItem, key) => await actions.updateArtisan(caseItem.id, { [key]: !caseItem[key] });
  return <>
    <div className="top"><div className="small">Qualification, formalités, assurances pro et conversion en client.</div><button className="btn primary" onClick={()=>setOpen(true)}>+ Dossier artisan</button></div>
    <div className="row" style={{flexDirection:'column', gap:14}}>{data.artisans.map(c => <div className="card" key={c.id}>
      <div className="row" style={{justifyContent:'space-between', alignItems:'flex-start'}}><div><div style={{fontWeight:800, fontSize:18}}>{c.nom}</div><div className="small">{c.activite} · {c.statut_juridique || '—'}</div></div><Badge>{c.avancement || 'À qualifier'}</Badge></div>
      <div className="row" style={{marginTop:12}}>
        <span className="badge" style={{background:'#172554', color:'#93c5fd'}}>INPI : {c.inpi_status || '—'}</span>
        {c.besoin_decennale && <span className="badge" style={{background:'#3b1219', color:'#fca5a5'}}>Décennale</span>}
        {c.besoin_rcpro && <span className="badge" style={{background:'#1f2937', color:'#cbd5e1'}}>RC Pro</span>}
      </div>
      <div className="row" style={{marginTop:14}}>
        <button className={`btn ${c.besoin_decennale ? 'good' : ''}`} onClick={()=>toggleField(c, 'besoin_decennale')}>Décennale</button>
        <button className={`btn ${c.besoin_rcpro ? 'good' : ''}`} onClick={()=>toggleField(c, 'besoin_rcpro')}>RC Pro</button>
        <button className="btn danger" onClick={() => actions.deleteArtisan(c.id)}>Supprimer</button>
      </div>
      <div style={{marginTop:14}}><div className="small">Notes</div><div style={{marginTop:6}}>{c.notes || '—'}</div></div>
    </div>)}</div>
    {open && <CraftForm onClose={()=>setOpen(false)} onSave={async (payload)=>{ await actions.addArtisan(payload); setOpen(false); }} />}
  </>;
}

function CraftForm({ onClose, onSave }) {
  const [form, setForm] = useState({ nom:'', activite:'', statut_juridique:'EI', avancement:'À qualifier', besoin_decennale:true, besoin_rcpro:true, inpi_status:'Non démarré', notes:'' });
  const set = (k,v)=>setForm(s=>({...s,[k]:v}));
  return <Modal title="Nouveau dossier artisan" onClose={onClose}>
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
  return <div className="grid3"><div className="card"><div className="title" style={{fontSize:18, marginBottom:10}}>Clients</div><strong>{data.clients.length}</strong></div><div className="card"><div className="title" style={{fontSize:18, marginBottom:10}}>Primes actives</div><strong>{euro(totalPrime)}</strong></div><div className="card"><div className="title" style={{fontSize:18, marginBottom:10}}>Dossiers artisans</div><strong>{data.artisans.length}</strong></div></div>;
}

export default function App() {
  const { data, actions, loading, error } = useCRMCloud();
  const [page, setPage] = useState("dashboard");
  const [q, setQ] = useState("");

  const filteredData = useMemo(() => {
    if (!q.trim()) return data;
    const ids = data.clients.filter(c => `${c.prenom} ${c.nom} ${c.email} ${c.tel} ${c.ville}`.toLowerCase().includes(q.toLowerCase())).map(c=>c.id);
    return {
      ...data,
      clients: data.clients.filter(c=>ids.includes(c.id)),
      contracts: data.contracts.filter(c=>ids.includes(c.client_id)),
      tasks: data.tasks.filter(c=>ids.includes(c.client_id)),
      deals: data.deals.filter(c=>ids.includes(c.client_id)),
      claims: data.claims.filter(c=>ids.includes(c.client_id)),
    };
  }, [data, q]);

  return <>
    <style>{CSS}</style>
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="logo">AC</div><div><div style={{fontWeight:800}}>AssurCRM Pro</div><div className="small">Version cloud partagée</div></div></div>
        <div className="nav">{MENU.map(([id, label]) => <button key={id} className={page===id?"active":""} onClick={()=>setPage(id)}>{label}</button>)}</div>
        <div className="card" style={{marginTop:16, padding:14}}>
          <div style={{fontWeight:800, marginBottom:6}}>Supabase connecté</div>
          <div className="small">Projet : mwmgbputepupsmxmkeco</div>
          <div className="small" style={{marginTop:6}}>Le temps réel s’active automatiquement si WebSocket est disponible.</div>
          <div className="row" style={{marginTop:10}}>
            <button className="btn" onClick={actions.refresh}>Rafraîchir</button>
            <button className="btn primary" onClick={actions.seedDemo}>Créer démo</button>
          </div>
        </div>
      </aside>
      <main className="main">
        <div className="top">
          <div className="title">{MENU.find(m=>m[0]===page)?.[1]}</div>
          <div className="row">
            <input className="input searchbar" placeholder="Recherche globale client..." value={q} onChange={(e)=>setQ(e.target.value)} />
            <button className="btn" onClick={()=>exportCSV("clients.csv", [["Prénom","Nom","Email","Téléphone","Ville","Statut"], ...data.clients.map(c=>[c.prenom,c.nom,c.email,c.tel,c.ville,c.statut])])}>Exporter clients</button>
          </div>
        </div>

        {error && <div className="notice">Erreur Supabase : {error}</div>}
        {loading && <div className="notice">Chargement des données partagées...</div>}
        {typeof window !== "undefined" && typeof window.WebSocket === "undefined" && <div className="notice">Le mode aperçu du canvas ne gère pas WebSocket. Les données cloud fonctionnent quand même, mais sans synchro temps réel ici.</div>}
        {!loading && data.clients.length === 0 && data.contracts.length === 0 && data.tasks.length === 0 && data.deals.length === 0 && data.claims.length === 0 && data.artisans.length === 0 && <div className="notice">La base est vide. Clique sur <strong>Créer démo</strong> pour charger des données de test.</div>}

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
