export default function Landing() {
  const page = {
    minHeight: "100vh",
    background: "radial-gradient(circle at top left,#0b1838 0%,#08111f 34%,#050b15 100%)",
    color: "white",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const container = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
  };

  const card = {
    background: "rgba(15,23,42,0.7)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "24px",
  };

  const primaryBtn = {
    padding: "14px 22px",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "white",
  };

  const secondaryBtn = {
    padding: "14px 22px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
    fontWeight: 700,
    background: "transparent",
    color: "white",
  };

  const grid4 = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  };

  const grid3 = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  };

  const features = [
    ["🛡️", "Traçabilité du devoir de conseil", "Centralisez les besoins client, les recommandations formulées, les échanges et les justificatifs pour renforcer votre conformité DDA."],
    ["📋", "CRM pensé pour l’assurance", "Clients, prospects, contrats, sinistres, tâches, pipeline commercial et création artisan dans une seule interface claire."],
    ["📈", "Relances et suivi commercial", "Ne perdez plus de dossiers par oubli. Gardez la main sur les opportunités, les échéances et les relances prioritaires."],
    ["⚙️", "Cabinet plus structuré", "Vos données sont organisées, vos équipes vont plus vite et chaque dossier reste exploitable à tout moment."],
  ];

  const painPoints = [
    "Informations clients dispersées entre mails, téléphone, notes et fichiers Excel.",
    "Difficulté à prouver précisément le conseil donné en cas de contrôle ou de litige.",
    "Relances commerciales oubliées, échéances mal suivies, opportunités perdues.",
    "Temps administratif trop élevé pour un cabinet qui veut vendre plus sereinement.",
  ];

  const ddaItems = [
    "Historique des échanges client",
    "Suivi des besoins et du contexte",
    "Justification des recommandations",
    "Archivage exploitable des dossiers",
    "Vision claire en cas de contrôle ou contestation",
  ];

  const modules = [
    "Tableau de bord cabinet",
    "Gestion clients et prospects",
    "Contrats et commissions",
    "Tâches et relances",
    "Pipeline commercial",
    "Sinistres",
    "Création artisan",
    "Reporting opérationnel",
  ];

  const faqs = [
    ["AssurPilot s’adresse à qui ?", "Aux courtiers, agents, cabinets d’assurance et structures qui veulent mieux piloter leur activité commerciale et documentaire."],
    ["Le devoir de conseil est-il réellement pris en compte ?", "Oui. La logique produit met en avant la structuration du besoin client, la justification des recommandations et la conservation exploitable des échanges."],
    ["Le logiciel convient-il à un cabinet avec plusieurs utilisateurs ?", "Oui. AssurPilot est conçu pour évoluer vers une organisation cabinet avec gestion multi-utilisateurs et suivi partagé des dossiers."],
    ["Peut-on l’utiliser pour d’autres activités liées au cabinet ?", "Oui, notamment pour le suivi commercial, les relances, les opportunités et certains accompagnements professionnels comme la création artisan."],
  ];

  return (
    <div style={page}>
      <header style={{position:"sticky", top:0, zIndex:20, backdropFilter:"blur(10px)", background:"rgba(2,6,23,0.8)", borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{...container, display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px", flexWrap:"wrap"}}>
          <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
            <div style={{width:"44px", height:"44px", borderRadius:"16px", display:"grid", placeItems:"center", fontWeight:900, background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>AP</div>
            <div>
              <div style={{fontSize:"28px", fontWeight:900}}>AssurPilot</div>
              <div style={{fontSize:"12px", color:"#94a3b8"}}>CRM intelligent pour courtiers</div>
            </div>
          </div>
          <div style={{display:"flex", gap:"12px", flexWrap:"wrap"}}>
            <button style={secondaryBtn} onClick={() => document.getElementById("solution")?.scrollIntoView({behavior:"smooth"})}>Voir le fonctionnement</button>
            <button style={primaryBtn} onClick={() => window.location.href = "/crm"}>Accéder au CRM</button>
          </div>
        </div>
      </header>

      <section style={{...container, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:"28px", paddingTop:"48px", paddingBottom:"48px"}}>
        <div style={{alignSelf:"center"}}>
          <div style={{display:"inline-block", padding:"8px 14px", borderRadius:"999px", background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.25)", color:"#c7d2fe", fontWeight:700, marginBottom:"18px"}}>
            Pensé pour les courtiers et agents d’assurance
          </div>
          <h1 style={{fontSize:"56px", lineHeight:1.05, margin:"0 0 18px 0", fontWeight:900}}>
            Pilotez votre cabinet et sécurisez votre <span style={{background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", color:"transparent"}}>devoir de conseil</span>
          </h1>
          <p style={{fontSize:"20px", color:"#cbd5e1", lineHeight:1.7, maxWidth:"700px"}}>
            AssurPilot centralise vos clients, vos contrats, vos relances et votre suivi commercial dans une seule interface, avec une logique métier orientée assurance et conformité DDA.
          </p>
          <div style={{display:"flex", gap:"12px", flexWrap:"wrap", marginTop:"28px"}}>
            <button style={primaryBtn} onClick={() => window.location.href = "/crm"}>Accéder au CRM</button>
            <button style={secondaryBtn} onClick={() => document.getElementById("dda")?.scrollIntoView({behavior:"smooth"})}>Voir la partie DDA</button>
          </div>
        </div>

        <div style={card}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px", gap:"12px", flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:"14px", color:"#94a3b8"}}>Vue cabinet</div>
              <div style={{fontSize:"30px", fontWeight:900}}>AssurPilot</div>
            </div>
            <div style={{padding:"10px 14px", borderRadius:"16px", background:"rgba(16,185,129,0.12)", color:"#86efac", fontWeight:800}}>Cabinet structuré</div>
          </div>
          <div style={grid3}>
            <div style={{...card, padding:"18px"}}>
              <div style={{fontSize:"12px", letterSpacing:"0.15em", color:"#94a3b8"}}>CONFORMITÉ</div>
              <div style={{fontSize:"28px", fontWeight:900, marginTop:"8px"}}>DDA</div>
              <p style={{color:"#cbd5e1", lineHeight:1.6}}>Suivi des échanges, recommandations et justification du conseil.</p>
            </div>
            <div style={{...card, padding:"18px"}}>
              <div style={{fontSize:"12px", letterSpacing:"0.15em", color:"#94a3b8"}}>COMMERCIAL</div>
              <div style={{fontSize:"28px", fontWeight:900, marginTop:"8px"}}>Pipeline</div>
              <p style={{color:"#cbd5e1", lineHeight:1.6}}>Prospects, devis, négociation, gagné : une vue simple et actionnable.</p>
            </div>
            <div style={{...card, padding:"18px", gridColumn:"1 / -1"}}>
              <div style={{fontSize:"12px", letterSpacing:"0.15em", color:"#94a3b8"}}>SUIVI OPÉRATIONNEL</div>
              <div style={{fontSize:"28px", fontWeight:900, marginTop:"8px"}}>Clients, contrats, sinistres, tâches</div>
              <div style={{...grid4, marginTop:"14px"}}>
                {["Clients","Contrats","Relances","Artisans"].map((x) => <div key={x} style={{padding:"12px", borderRadius:"14px", background:"rgba(255,255,255,0.05)", color:"#e2e8f0"}}>{x}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{...container, paddingTop:"16px", paddingBottom:"16px"}}>
        <div style={grid4}>
          {painPoints.map((item, index) => (
            <div key={index} style={card}>
              <div style={{fontSize:"12px", letterSpacing:"0.15em", color:"#fda4af", fontWeight:800}}>PROBLÈME {index + 1}</div>
              <p style={{color:"#cbd5e1", lineHeight:1.7}}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="solution" style={{...container, paddingTop:"56px", paddingBottom:"56px"}}>
        <div style={{maxWidth:"840px", marginBottom:"28px"}}>
          <div style={{fontSize:"12px", letterSpacing:"0.2em", color:"#a5b4fc", fontWeight:800}}>LA SOLUTION</div>
          <h2 style={{fontSize:"46px", lineHeight:1.1, margin:"12px 0", fontWeight:900}}>Un CRM assurance tout-en-un, conçu pour vendre mieux et travailler plus sereinement</h2>
          <p style={{fontSize:"19px", color:"#cbd5e1", lineHeight:1.8}}>
            AssurPilot ne se contente pas d’empiler des fiches clients. La plateforme relie le suivi commercial, l’organisation cabinet et la traçabilité du conseil dans une seule expérience cohérente.
          </p>
        </div>
        <div style={grid4}>
          {features.map(([icon, title, desc]) => (
            <div key={title} style={card}>
              <div style={{fontSize:"34px", marginBottom:"12px"}}>{icon}</div>
              <div style={{fontSize:"24px", fontWeight:900}}>{title}</div>
              <p style={{color:"#cbd5e1", lineHeight:1.7}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="dda" style={{borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)"}}>
        <div style={{...container, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:"28px", paddingTop:"56px", paddingBottom:"56px"}}>
          <div>
            <div style={{fontSize:"12px", letterSpacing:"0.2em", color:"#86efac", fontWeight:800}}>DDA / DEVOIR DE CONSEIL</div>
            <h2 style={{fontSize:"46px", lineHeight:1.1, margin:"12px 0", fontWeight:900}}>Faites de la conformité un avantage opérationnel</h2>
            <p style={{fontSize:"19px", color:"#cbd5e1", lineHeight:1.8}}>
              AssurPilot aide votre cabinet à structurer les besoins clients, tracer les recommandations, conserver l’historique utile et rendre chaque dossier plus défendable en cas de contrôle ou de contestation.
            </p>
            <div style={{marginTop:"18px", padding:"18px", borderRadius:"20px", background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.2)", color:"#d1fae5"}}>
              L’objectif n’est pas seulement d’aller plus vite. L’objectif est aussi de pouvoir démontrer ce qui a été conseillé, pourquoi cela a été conseillé, et dans quel contexte.
            </div>
          </div>
          <div style={card}>
            <div style={{fontSize:"24px", fontWeight:900, marginBottom:"14px"}}>Ce que vous pouvez structurer</div>
            <div style={{display:"grid", gap:"12px"}}>
              {ddaItems.map((item) => (
                <div key={item} style={{display:"flex", gap:"12px", alignItems:"flex-start", padding:"14px", borderRadius:"18px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)"}}>
                  <div style={{color:"#86efac", fontWeight:900}}>✔</div>
                  <div style={{color:"#e2e8f0"}}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{...container, paddingTop:"56px", paddingBottom:"56px"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:"28px"}}>
          <div>
            <div style={{fontSize:"12px", letterSpacing:"0.2em", color:"#c4b5fd", fontWeight:800}}>MODULES CLÉS</div>
            <h2 style={{fontSize:"46px", lineHeight:1.1, margin:"12px 0", fontWeight:900}}>Tout ce qu’il faut pour piloter un cabinet dans une interface unique</h2>
            <p style={{fontSize:"19px", color:"#cbd5e1", lineHeight:1.8}}>
              AssurPilot rassemble les briques les plus utiles à une activité assurance moderne, sans noyer l’utilisateur dans un outil générique trop lourd.
            </p>
          </div>
          <div style={grid4}>
            {modules.map((item) => (
              <div key={item} style={{...card, padding:"18px", fontWeight:700}}>{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={{...container, paddingTop:"8px", paddingBottom:"56px"}}>
        <div style={grid3}>
          {[
            ["Spécialisé assurance", "Une logique métier pensée pour les courtiers et agents, pas un CRM générique déguisé."],
            ["Orienté conformité", "Le devoir de conseil n’est pas un détail annexe : il devient un pilier du pilotage commercial."],
            ["Pensé terrain", "Simple à prendre en main, clair à montrer à un collaborateur, utile dès les premiers dossiers."],
          ].map(([title, desc]) => (
            <div key={title} style={card}>
              <div style={{fontSize:"28px", fontWeight:900}}>{title}</div>
              <p style={{color:"#cbd5e1", lineHeight:1.7}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{...container, paddingTop:"24px", paddingBottom:"56px"}}>
        <div style={{...card, background:"linear-gradient(135deg, rgba(99,102,241,0.16), rgba(139,92,246,0.12))", border:"1px solid rgba(129,140,248,0.25)"}}>
          <div style={{maxWidth:"900px"}}>
            <div style={{fontSize:"12px", letterSpacing:"0.2em", color:"#c7d2fe", fontWeight:800}}>POSITIONNEMENT</div>
            <h2 style={{fontSize:"46px", lineHeight:1.1, margin:"12px 0", fontWeight:900}}>AssurPilot aide votre cabinet à gagner du temps, structurer ses dossiers et mieux défendre son conseil</h2>
            <p style={{fontSize:"19px", color:"#e2e8f0", lineHeight:1.8}}>
              Une solution pensée pour ceux qui veulent un outil concret, clair, spécialisé assurance, et suffisamment crédible pour être montré à un collaborateur, un associé ou un partenaire.
            </p>
            <div style={{display:"flex", gap:"12px", flexWrap:"wrap", marginTop:"24px"}}>
              <button style={{...primaryBtn, background:"white", color:"#020617"}} onClick={() => window.location.href = "/crm"}>Accéder au CRM</button>
              <button style={secondaryBtn} onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>Échanger sur vos besoins</button>
            </div>
          </div>
        </div>
      </section>

      <section style={{...container, paddingTop:"32px", paddingBottom:"56px"}}>
        <div style={{textAlign:"center", marginBottom:"20px"}}>
          <div style={{fontSize:"12px", letterSpacing:"0.2em", color:"#7dd3fc", fontWeight:800}}>FAQ</div>
          <h2 style={{fontSize:"46px", lineHeight:1.1, margin:"12px 0", fontWeight:900}}>Questions fréquentes</h2>
        </div>
        <div style={{display:"grid", gap:"14px"}}>
          {faqs.map(([q, a]) => (
            <div key={q} style={card}>
              <div style={{fontSize:"24px", fontWeight:900}}>{q}</div>
              <p style={{color:"#cbd5e1", lineHeight:1.7}}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" style={{borderTop:"1px solid rgba(255,255,255,0.08)", background:"rgba(15,23,42,0.7)"}}>
        <div style={{...container, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:"28px", paddingTop:"56px", paddingBottom:"56px"}}>
          <div>
            <div style={{fontSize:"12px", letterSpacing:"0.2em", color:"#a5b4fc", fontWeight:800}}>CONTACT</div>
            <h2 style={{fontSize:"46px", lineHeight:1.1, margin:"12px 0", fontWeight:900}}>Présentez AssurPilot à votre cabinet</h2>
            <p style={{fontSize:"19px", color:"#cbd5e1", lineHeight:1.8}}>
              Prenez contact pour organiser une démonstration, discuter de vos usages métier et voir comment AssurPilot peut s’intégrer à votre organisation.
            </p>
          </div>
          <div style={card}>
            <div style={{display:"grid", gap:"12px"}}>
              <input style={{padding:"14px", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:"white"}} placeholder="Nom" />
              <input style={{padding:"14px", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:"white"}} placeholder="Email professionnel" />
              <input style={{padding:"14px", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:"white"}} placeholder="Cabinet / société" />
              <textarea style={{minHeight:"140px", padding:"14px", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:"white"}} placeholder="Décrivez votre besoin" />
              <button style={primaryBtn} onClick={() => window.location.href = "/crm"}>Accéder au CRM</button>
            </div>
          </div>
        </div>
      </section>

      <footer style={{borderTop:"1px solid rgba(255,255,255,0.08)", background:"#020617"}}>
        <div style={{...container, display:"flex", justifyContent:"space-between", gap:"18px", flexWrap:"wrap", color:"#94a3b8"}}>
          <div><strong style={{color:"white"}}>AssurPilot</strong> — CRM intelligent pour courtiers et agents d’assurance.</div>
          <div style={{display:"flex", gap:"16px", flexWrap:"wrap"}}>
            <a href="#solution">Solution</a>
            <a href="#dda">DDA</a>
            <a href="#modules">Modules</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
