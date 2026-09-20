import { useState, useEffect, useCallback } from "react";
import { api } from "./api.js";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TIME_SLOTS = ["12:00","12:30","13:00","13:30","14:00","14:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30"];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  fork:     "M3 2v7c0 1.1.9 2 2 2h2v11M7 2v20M12 2c0 4 2 7 5 7s5-3 5-7M12 9v13",
  user:     "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  clock:    "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 6v6l4 2",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  check:    "M20 6L9 17l-5-5",
  x:        "M18 6L6 18M6 6l12 12",
  trash:    "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  list:     "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  map:      "M3 6l9-4 9 4v12l-9 4-9-4zM12 2v20M3 6l9 4 9-4",
  plus:     "M12 5v14M5 12h14",
  loader:   "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cream: #FAF7F2; --warm: #F5EFE4; --gold: #C9973A; --gold-light: #E5B660;
    --dark: #1C1208; --brown: #3D2B1F; --text: #2C1E14; --muted: #7A6858;
    --border: #E8DFD0; --white: #FFFFFF; --green: #2D6A4F; --green-light: #40916C;
    --red: #9B2226; --amber: #CA6702;
    --shadow: 0 4px 24px rgba(28,18,8,0.10); --shadow-lg: 0 12px 48px rgba(28,18,8,0.18);
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text); }
  .display { font-family: 'Playfair Display', serif; }

  /* AUTH */
  .auth-page { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; background:var(--dark); }
  @media(max-width:768px){.auth-page{grid-template-columns:1fr;}}
  .auth-hero { background:linear-gradient(160deg,#3D2B1F 0%,#1C1208 100%); display:flex; flex-direction:column; justify-content:center; padding:60px; position:relative; overflow:hidden; }
  .auth-hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 30% 70%,rgba(201,151,58,0.18) 0%,transparent 60%); }
  .auth-hero-pattern { position:absolute; top:0; right:0; bottom:0; left:0; opacity:0.04; background-image:repeating-linear-gradient(45deg,var(--gold) 0,var(--gold) 1px,transparent 0,transparent 50%); background-size:20px 20px; }
  .auth-hero-content { position:relative; z-index:1; }
  .auth-logo { display:flex; align-items:center; gap:12px; margin-bottom:48px; }
  .auth-logo-icon { width:48px; height:48px; background:var(--gold); border-radius:12px; display:flex; align-items:center; justify-content:center; }
  .auth-logo-text { font-family:'Playfair Display',serif; font-size:22px; color:var(--cream); }
  .auth-hero h1 { font-family:'Playfair Display',serif; font-size:48px; color:var(--cream); line-height:1.15; margin-bottom:20px; }
  .auth-hero h1 em { color:var(--gold-light); font-style:italic; }
  .auth-hero p { color:rgba(250,247,242,0.6); font-size:15px; line-height:1.7; max-width:360px; }
  .auth-features { margin-top:48px; display:flex; flex-direction:column; gap:16px; }
  .auth-feat { display:flex; align-items:center; gap:12px; color:rgba(250,247,242,0.75); font-size:14px; }
  .auth-feat-dot { width:8px; height:8px; border-radius:50%; background:var(--gold); flex-shrink:0; }
  .auth-form-side { background:var(--cream); display:flex; align-items:center; justify-content:center; padding:60px 48px; }
  .auth-card { width:100%; max-width:420px; }
  .auth-tabs { display:flex; margin-bottom:36px; border-bottom:2px solid var(--border); }
  .auth-tab { flex:1; padding:12px; text-align:center; cursor:pointer; font-size:15px; font-weight:500; color:var(--muted); border-bottom:3px solid transparent; margin-bottom:-2px; transition:all 0.2s; }
  .auth-tab.active { color:var(--gold); border-bottom-color:var(--gold); }
  .auth-title { font-family:'Playfair Display',serif; font-size:28px; margin-bottom:6px; }
  .auth-sub { color:var(--muted); font-size:14px; margin-bottom:32px; }

  /* FORMS */
  .form-group { margin-bottom:20px; }
  .form-label { display:block; font-size:13px; font-weight:600; margin-bottom:7px; color:var(--brown); letter-spacing:0.03em; text-transform:uppercase; }
  .form-input { width:100%; padding:13px 16px; border:1.5px solid var(--border); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:15px; background:var(--white); color:var(--text); transition:border-color 0.2s,box-shadow 0.2s; outline:none; }
  .form-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,151,58,0.12); }
  .form-select { width:100%; padding:13px 16px; border:1.5px solid var(--border); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:15px; background:var(--white); color:var(--text); outline:none; cursor:pointer; transition:border-color 0.2s; }
  .form-select:focus { border-color:var(--gold); }
  .form-textarea { width:100%; padding:13px 16px; border:1.5px solid var(--border); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:15px; background:var(--white); color:var(--text); resize:none; outline:none; transition:border-color 0.2s; }
  .form-textarea:focus { border-color:var(--gold); }

  /* BUTTONS */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 24px; border-radius:10px; font-size:15px; font-weight:600; cursor:pointer; border:none; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
  .btn:disabled { opacity:0.55; cursor:not-allowed; transform:none !important; }
  .btn-primary { background:var(--gold); color:var(--dark); box-shadow:0 4px 16px rgba(201,151,58,0.30); }
  .btn-primary:hover:not(:disabled) { background:var(--gold-light); transform:translateY(-1px); box-shadow:0 6px 20px rgba(201,151,58,0.40); }
  .btn-outline { background:transparent; color:var(--text); border:1.5px solid var(--border); }
  .btn-outline:hover:not(:disabled) { border-color:var(--gold); color:var(--gold); }
  .btn-danger { background:#FEF2F2; color:var(--red); border:1.5px solid #FECACA; }
  .btn-danger:hover:not(:disabled) { background:#FEE2E2; }
  .btn-success { background:#ECFDF5; color:var(--green); border:1.5px solid #A7F3D0; }
  .btn-success:hover:not(:disabled) { background:#D1FAE5; }
  .btn-sm { padding:8px 14px; font-size:13px; border-radius:8px; }
  .btn-full { width:100%; }

  /* LAYOUT */
  .app-layout { display:flex; min-height:100vh; }
  .sidebar { width:260px; flex-shrink:0; background:var(--dark); display:flex; flex-direction:column; padding:28px 0; position:fixed; top:0; left:0; bottom:0; overflow-y:auto; z-index:100; }
  .sidebar-logo { padding:0 24px 32px; display:flex; align-items:center; gap:12px; }
  .sidebar-logo-icon { width:40px; height:40px; background:var(--gold); border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sidebar-logo-text { font-family:'Playfair Display',serif; color:var(--cream); font-size:18px; }
  .sidebar-logo-sub { font-size:11px; color:rgba(250,247,242,0.4); letter-spacing:0.1em; text-transform:uppercase; }
  .sidebar-section { padding:0 16px; margin-bottom:8px; }
  .sidebar-label { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(250,247,242,0.3); padding:0 12px; margin-bottom:6px; margin-top:16px; }
  .sidebar-item { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:9px; color:rgba(250,247,242,0.55); cursor:pointer; transition:all 0.2s; font-size:14px; font-weight:500; }
  .sidebar-item:hover { background:rgba(250,247,242,0.07); color:var(--cream); }
  .sidebar-item.active { background:rgba(201,151,58,0.18); color:var(--gold-light); }
  .sidebar-spacer { flex:1; }
  .sidebar-user { padding:16px; margin:0 16px; border-top:1px solid rgba(250,247,242,0.08); }
  .sidebar-user-name { color:var(--cream); font-size:14px; font-weight:500; }
  .sidebar-user-role { color:rgba(250,247,242,0.4); font-size:12px; margin-top:2px; }
  .main-content { margin-left:260px; flex:1; padding:36px; background:var(--cream); min-height:100vh; }

  /* TOPBAR */
  .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
  .topbar-title { font-family:'Playfair Display',serif; font-size:30px; color:var(--dark); }
  .topbar-sub { color:var(--muted); font-size:14px; margin-top:3px; }

  /* CARDS */
  .card { background:var(--white); border-radius:16px; padding:24px; box-shadow:var(--shadow); border:1px solid var(--border); }
  .card-title { font-family:'Playfair Display',serif; font-size:18px; margin-bottom:4px; }
  .card-sub { color:var(--muted); font-size:13px; }

  /* STATS */
  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:28px; }
  @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
  .stat-card { background:var(--white); border-radius:16px; padding:22px; border:1px solid var(--border); box-shadow:var(--shadow); }
  .stat-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
  .stat-icon.gold { background:rgba(201,151,58,0.12); color:var(--gold); }
  .stat-icon.green { background:rgba(45,106,79,0.12); color:var(--green-light); }
  .stat-icon.amber { background:rgba(202,103,2,0.12); color:var(--amber); }
  .stat-icon.red { background:rgba(155,34,38,0.10); color:var(--red); }
  .stat-value { font-family:'Playfair Display',serif; font-size:32px; font-weight:700; color:var(--dark); }
  .stat-label { font-size:13px; color:var(--muted); margin-top:3px; }

  /* TABLE */
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; }
  th { text-align:left; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); padding:10px 16px; border-bottom:1px solid var(--border); }
  td { padding:14px 16px; border-bottom:1px solid rgba(232,223,208,0.5); font-size:14px; vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:rgba(201,151,58,0.03); }

  /* BADGES */
  .badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  .badge-confirmed { background:#ECFDF5; color:#065F46; }
  .badge-pending { background:#FFFBEB; color:#92400E; }
  .badge-cancelled { background:#FEF2F2; color:#991B1B; }
  .badge-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }

  /* TABLES GRID */
  .tables-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:16px; }
  .table-card { border-radius:14px; border:2px solid var(--border); padding:18px; cursor:pointer; transition:all 0.2s; position:relative; background:var(--white); }
  .table-card:hover { border-color:var(--gold); transform:translateY(-2px); box-shadow:var(--shadow); }
  .table-card.occupied { border-color:#FCA5A5; background:#FFF5F5; }
  .table-card.available { border-color:#6EE7B7; background:#F0FDF9; }
  .table-number { font-family:'Playfair Display',serif; font-size:24px; font-weight:700; margin-bottom:4px; }
  .table-info { font-size:12px; color:var(--muted); }
  .table-status-dot { width:10px; height:10px; border-radius:50%; position:absolute; top:14px; right:14px; }
  .table-status-dot.available { background:#10B981; }
  .table-status-dot.occupied { background:#EF4444; }

  /* TIME SLOTS */
  .time-slots { display:flex; flex-wrap:wrap; gap:10px; }
  .time-slot { padding:8px 16px; border-radius:8px; border:1.5px solid var(--border); cursor:pointer; font-size:13px; font-weight:500; transition:all 0.15s; background:var(--white); }
  .time-slot:hover { border-color:var(--gold); color:var(--gold); }
  .time-slot.selected { background:var(--gold); color:var(--dark); border-color:var(--gold); font-weight:700; }

  /* STEPS */
  .steps { display:flex; margin-bottom:32px; }
  .step { flex:1; display:flex; flex-direction:column; align-items:center; position:relative; }
  .step-num { width:32px; height:32px; border-radius:50%; border:2px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; background:var(--white); color:var(--muted); z-index:1; transition:all 0.2s; }
  .step.active .step-num { background:var(--gold); border-color:var(--gold); color:var(--dark); }
  .step.done .step-num { background:var(--green); border-color:var(--green); color:var(--white); }
  .step-label { font-size:11px; margin-top:6px; color:var(--muted); font-weight:500; text-align:center; }
  .step.active .step-label { color:var(--gold); }
  .step::before { content:''; position:absolute; top:15px; right:50%; left:-50%; height:2px; background:var(--border); z-index:0; }
  .step:first-child::before { display:none; }
  .step.done::before { background:var(--green); }

  /* MISC */
  .empty { text-align:center; padding:60px 20px; color:var(--muted); }
  .empty-icon { font-size:48px; margin-bottom:12px; opacity:0.3; }
  .toast { position:fixed; bottom:28px; right:28px; padding:14px 22px; border-radius:12px; font-size:14px; font-weight:500; box-shadow:var(--shadow-lg); z-index:999; animation:slideUp 0.3s ease; }
  .toast.success { background:#065F46; color:#ECFDF5; }
  .toast.error { background:var(--red); color:#FEF2F2; }
  .flex { display:flex; } .flex-center { display:flex; align-items:center; } .flex-between { display:flex; align-items:center; justify-content:space-between; }
  .gap-8{gap:8px;} .gap-12{gap:12px;} .gap-16{gap:16px;}
  .mb-4{margin-bottom:4px;} .mb-8{margin-bottom:8px;} .mb-16{margin-bottom:16px;} .mb-24{margin-bottom:24px;}
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .text-muted{color:var(--muted);font-size:13px;} .text-gold{color:var(--gold);} .fw-600{font-weight:600;}
  .avatar { width:36px; height:36px; border-radius:50%; background:var(--gold); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:var(--dark); flex-shrink:0; }
  .search-input { padding:10px 16px; border:1.5px solid var(--border); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; background:var(--white); width:240px; transition:border-color 0.2s; }
  .search-input:focus { border-color:var(--gold); }
  .section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .modal-title { font-family:'Playfair Display',serif; font-size:22px; margin-bottom:6px; }
  .modal-sub { color:var(--muted); font-size:14px; margin-bottom:26px; }
  .modal-footer { display:flex; gap:10px; justify-content:flex-end; margin-top:24px; }

  /* SPINNER */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; display:inline-block; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }

  /* LOADING OVERLAY */
  .loading-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--cream); }
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type}`}>{message}</div>;
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      let res;
      if (tab === "login") {
        res = await api.login({ email: form.email, password: form.password });
      } else {
        if (!form.name || !form.email || !form.password) { setError("All fields required."); setLoading(false); return; }
        res = await api.register({ name: form.name, email: form.email, password: form.password, role: form.role });
      }
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      onLogin(res.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-pattern" />
        <div className="auth-hero-content">
          <div className="auth-logo">
            <div className="auth-logo-icon"><Icon d={icons.fork} color="#1C1208" size={22} /></div>
            <div><div className="auth-logo-text">La Maison</div></div>
          </div>
          <h1 className="display">Reserve Your<br /><em>Perfect Table</em></h1>
          <p>Experience seamless dining reservations. Book your table in seconds and let us handle every detail.</p>
          <div className="auth-features">
            {["Real-time table availability","JWT-secured authentication","Instant confirmation","Special occasion requests"].map(f => (
              <div className="auth-feat" key={f}><span className="auth-feat-dot" />{f}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-tabs">
            {["login","register"].map(t => (
              <div key={t} className={`auth-tab${tab===t?" active":""}`} onClick={() => { setTab(t); setError(""); }}>
                {t === "login" ? "Sign In" : "Create Account"}
              </div>
            ))}
          </div>
          <h2 className="auth-title display">{tab==="login" ? "Welcome back" : "Join us"}</h2>
          <p className="auth-sub">{tab==="login" ? "Sign in to manage your reservations" : "Create your account to get started"}</p>
          {tab === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your full name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} onKeyDown={handleKey} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} onKeyDown={handleKey} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form,password:e.target.value})} onKeyDown={handleKey} />
          </div>
          {tab === "register" && (
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select className="form-select" value={form.role} onChange={e => setForm({...form,role:e.target.value})}>
                <option value="customer">Customer</option>
                <option value="admin">Restaurant Staff</option>
              </select>
            </div>
          )}
          {error && <p style={{color:"var(--red)",fontSize:13,marginBottom:16}}>{error}</p>}
          <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spin"><Icon d={icons.loader} size={16}/></span> Please wait…</> : tab === "login" ? "Sign In" : "Create Account"}
          </button>
          {tab === "login" && (
            <p style={{marginTop:20,textAlign:"center",fontSize:13,color:"var(--muted)"}}>
              Demo: <strong>admin@bistro.com</strong> / admin123 &nbsp;|&nbsp; <strong>john@email.com</strong> / john123
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, active, setActive, onLogout }) {
  const customerItems = [
    { id: "dashboard", label: "Dashboard", icon: icons.grid },
    { id: "book", label: "Book a Table", icon: icons.calendar },
    { id: "reservations", label: "My Reservations", icon: icons.list },
  ];
  const adminItems = [
    { id: "dashboard", label: "Dashboard", icon: icons.grid },
    { id: "reservations", label: "All Reservations", icon: icons.list },
    { id: "tables", label: "Tables", icon: icons.map },
    { id: "book", label: "New Booking", icon: icons.plus },
  ];
  const items = user.role === "admin" ? adminItems : customerItems;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Icon d={icons.fork} color="#1C1208" size={20} /></div>
        <div>
          <div className="sidebar-logo-text">La Maison</div>
          <div className="sidebar-logo-sub">Reservations</div>
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Menu</div>
        {items.map(item => (
          <div key={item.id} className={`sidebar-item${active===item.id?" active":""}`} onClick={() => setActive(item.id)}>
            <Icon d={item.icon} size={17} />{item.label}
          </div>
        ))}
      </div>
      <div className="sidebar-spacer" />
      <div className="sidebar-user">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div className="avatar">{user.name[0]}</div>
          <div>
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role" style={{textTransform:"capitalize"}}>{user.role}</div>
          </div>
        </div>
        <div className="sidebar-item" onClick={onLogout} style={{paddingLeft:0}}>
          <Icon d={icons.logout} size={16} />Sign Out
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING WIZARD ───────────────────────────────────────────────────────────
function BookingWizard({ user, showToast, onDone }) {
  const [step, setStep] = useState(1);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ date: "", guests: 2, time: "", tableId: null, note: "", name: user.name });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getTables().then(setTables).catch(() => {});
    const fetchRes = user.role === "admin" ? api.getAllReservations : api.getMyReservations;
    fetchRes().then(setReservations).catch(() => {});
  }, []);

  const availableTables = tables.filter(t => {
    if (t.capacity < form.guests) return false;
    return !reservations.some(r =>
      r.tableId === t.id && r.date === form.date && r.time === form.time && r.status !== "cancelled"
    );
  });

  const confirm = async () => {
    setSubmitting(true);
    try {
      await api.createReservation({
        tableId: form.tableId,
        date: form.date,
        time: form.time,
        guests: form.guests,
        note: form.note,
      });
      showToast("Reservation submitted! We'll confirm shortly.", "success");
      onDone();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ["Details","Time","Table","Confirm"];
  const table = tables.find(t => t.id === form.tableId);

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="topbar-title display">Book a Table</div>
          <div className="topbar-sub">Reserve your perfect spot in minutes</div>
        </div>
      </div>
      <div className="card" style={{maxWidth:640}}>
        <div className="steps">
          {stepLabels.map((l,i) => (
            <div key={l} className={`step${step===i+1?" active":step>i+1?" done":""}`}>
              <div className="step-num">{step>i+1?"✓":i+1}</div>
              <div className="step-label">{l}</div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="modal-title display mb-4">Reservation Details</div>
            <div className="modal-sub mb-16">Tell us about your visit</div>
            <div className="form-group">
              <label className="form-label">Guest Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={form.date} min={new Date().toISOString().split("T")[0]} onChange={e => setForm({...form,date:e.target.value,time:"",tableId:null})} />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Guests</label>
                <select className="form-select" value={form.guests} onChange={e => setForm({...form,guests:+e.target.value,tableId:null})}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?"guest":"guests"}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{justifyContent:"flex-end",marginTop:0}}>
              <button className="btn btn-primary" disabled={!form.date||!form.name} onClick={() => setStep(2)}>Next: Choose Time →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="modal-title display mb-4">Select Time</div>
            <div className="modal-sub mb-16">Available slots for {form.date}</div>
            <div className="time-slots">
              {TIME_SLOTS.map(t => (
                <div key={t} className={`time-slot${form.time===t?" selected":""}`} onClick={() => setForm({...form,time:t,tableId:null})}>{t}</div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" disabled={!form.time} onClick={() => setStep(3)}>Next: Pick Table →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="modal-title display mb-4">Choose Your Table</div>
            <div className="modal-sub mb-16">{availableTables.length} tables available for {form.guests} guests at {form.time}</div>
            {availableTables.length === 0 ? (
              <div className="empty"><div>No tables available for this time. Try a different slot.</div></div>
            ) : (
              <div className="tables-grid">
                {availableTables.map(t => (
                  <div key={t.id}
                    className={`table-card available`}
                    style={form.tableId===t.id?{borderColor:"var(--gold)",background:"#FFFBEB"}:{}}
                    onClick={() => setForm({...form,tableId:t.id})}
                  >
                    <div className="table-status-dot available" />
                    <div className="table-number">{t.number}</div>
                    <div className="table-info">{t.zone}</div>
                    <div className="table-info">Up to {t.capacity} guests</div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" disabled={!form.tableId} onClick={() => setStep(4)}>Next: Confirm →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="modal-title display mb-4">Confirm Reservation</div>
            <div className="modal-sub mb-16">Review your details before confirming</div>
            <div style={{background:"var(--warm)",borderRadius:12,padding:20,marginBottom:20}}>
              {[["Guest",form.name],["Date",form.date],["Time",form.time],["Guests",form.guests],["Table",table?`${table.number} — ${table.zone}`:""]].map(([k,v]) => (
                <div key={k} className="flex-between" style={{padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <span className="text-muted">{k}</span>
                  <span className="fw-600">{v}</span>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">Special Requests (optional)</label>
              <textarea className="form-textarea" rows={3} placeholder="Birthday, anniversary, dietary needs..." value={form.note} onChange={e => setForm({...form,note:e.target.value})} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
              <button className="btn btn-primary" disabled={submitting} onClick={confirm}>
                {submitting ? <><span className="spin"><Icon d={icons.loader} size={16}/></span> Confirming…</> : <><Icon d={icons.check} size={16}/>Confirm Booking</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RESERVATIONS VIEW ────────────────────────────────────────────────────────
function ReservationsView({ user, showToast }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = user.role === "admin" ? await api.getAllReservations() : await api.getMyReservations();
      setReservations(data);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.updateStatus(id, status);
      showToast(`Reservation ${status}.`, "success");
      load();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const filtered = reservations.filter(r => {
    const matchSearch = r.userName.toLowerCase().includes(search.toLowerCase()) || r.date.includes(search);
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="topbar-title display">{user.role === "admin" ? "All Reservations" : "My Reservations"}</div>
          <div className="topbar-sub">{filtered.length} reservation{filtered.length !== 1 ? "s" : ""}</div>
        </div>
      </div>
      <div className="card">
        <div className="section-header">
          <div className="flex gap-8">
            {["all","confirmed","pending","cancelled"].map(f => (
              <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-outline"}`} onClick={() => setFilter(f)} style={{textTransform:"capitalize"}}>{f}</button>
            ))}
          </div>
          <input className="search-input" placeholder="Search name or date..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="empty"><span className="spin"><Icon d={icons.loader} size={28} color="var(--gold)"/></span></div>
        ) : filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">🍽</div><div>No reservations found.</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Guest</th><th>Date & Time</th><th>Table</th><th>Guests</th><th>Status</th><th>Note</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="flex-center gap-8">
                        <div className="avatar" style={{width:30,height:30,fontSize:11}}>{r.userName[0]}</div>
                        <span className="fw-600">{r.userName}</span>
                      </div>
                    </td>
                    <td><div>{r.date}</div><div className="text-muted">{r.time}</div></td>
                    <td>{r.tableNumber} <span className="text-muted">· {r.tableZone}</span></td>
                    <td>{r.guests}</td>
                    <td><span className={`badge badge-${r.status}`}><span className="badge-dot"/>{r.status}</span></td>
                    <td><span className="text-muted">{r.note || "—"}</span></td>
                    <td>
                      <div className="flex gap-8">
                        {user.role === "admin" && r.status === "pending" && (
                          <>
                            <button className="btn btn-sm btn-success" onClick={() => updateStatus(r.id,"confirmed")}><Icon d={icons.check} size={13}/></button>
                            <button className="btn btn-sm btn-danger" onClick={() => updateStatus(r.id,"cancelled")}><Icon d={icons.x} size={13}/></button>
                          </>
                        )}
                        {r.status !== "cancelled" && (user.role === "admin" || r.userId === user.id) && (
                          <button className="btn btn-sm btn-danger" onClick={() => updateStatus(r.id,"cancelled")}>
                            {user.role === "customer" ? "Cancel" : <Icon d={icons.trash} size={13}/>}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TABLES VIEW ──────────────────────────────────────────────────────────────
function TablesView({ showToast }) {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTables(), api.getAllReservations()])
      .then(([t, r]) => { setTables(t); setReservations(r); })
      .catch(e => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();

  const isOccupied = (table) => reservations.some(r => {
    if (r.tableId !== table.id || r.status === "cancelled" || r.date !== today) return false;
    const [h, m] = r.time.split(":").map(Number);
    const start = h * 60 + m;
    return nowMins >= start && nowMins < start + 90;
  });

  const zones = [...new Set(tables.map(t => t.zone))];

  if (loading) return <div className="loading-page"><span className="spin"><Icon d={icons.loader} size={36} color="var(--gold)"/></span></div>;

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="topbar-title display">Tables Overview</div>
          <div className="topbar-sub">Live floor status for today</div>
        </div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:24}}>
        <div className="flex-center gap-8"><span style={{width:10,height:10,borderRadius:"50%",background:"#10B981",display:"inline-block"}}/><span className="text-muted">Available</span></div>
        <div className="flex-center gap-8"><span style={{width:10,height:10,borderRadius:"50%",background:"#EF4444",display:"inline-block"}}/><span className="text-muted">Occupied</span></div>
      </div>
      {zones.map(zone => (
        <div key={zone} className="mb-24">
          <h3 className="display" style={{fontSize:16,marginBottom:14,color:"var(--brown)"}}>{zone}</h3>
          <div className="tables-grid">
            {tables.filter(t => t.zone === zone).map(t => {
              const occupied = isOccupied(t);
              return (
                <div key={t.id} className={`table-card ${occupied?"occupied":"available"}`}>
                  <div className={`table-status-dot ${occupied?"occupied":"available"}`}/>
                  <div className="table-number">{t.number}</div>
                  <div className="table-info">{t.capacity} seats</div>
                  <div className="table-info" style={{marginTop:4,fontWeight:600,color:occupied?"var(--red)":"var(--green-light)"}}>
                    {occupied?"Occupied":"Available"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, setActive }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = user.role === "admin" ? api.getAllReservations : api.getMyReservations;
    fetch().then(setReservations).catch(() => {}).finally(() => setLoading(false));
  }, [user.role]);

  const today = new Date().toISOString().split("T")[0];
  const todayRes  = reservations.filter(r => r.date === today);
  const pending   = reservations.filter(r => r.status === "pending");
  const confirmed = reservations.filter(r => r.status === "confirmed");
  const upcoming  = reservations.filter(r => r.date >= today && r.status !== "cancelled").slice(0, 5);

  const stats = user.role === "admin"
    ? [
        { label:"Today's Bookings", value:todayRes.length,  icon:icons.calendar, color:"gold"  },
        { label:"Confirmed",        value:confirmed.length, icon:icons.check,    color:"green" },
        { label:"Pending",          value:pending.length,   icon:icons.clock,    color:"amber" },
        { label:"Total Tables",     value:8,                icon:icons.map,      color:"red"   },
      ]
    : [
        { label:"My Reservations", value:reservations.length, icon:icons.calendar, color:"gold"  },
        { label:"Confirmed",       value:confirmed.length,    icon:icons.check,    color:"green" },
        { label:"Pending",         value:pending.length,      icon:icons.clock,    color:"amber" },
        { label:"Upcoming",        value:upcoming.length,     icon:icons.star,     color:"red"   },
      ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="topbar-title display">Good {greeting}, {user.name.split(" ")[0]} 👋</div>
          <div className="topbar-sub">{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setActive("book")}>
          <Icon d={icons.plus} size={16}/>New Booking
        </button>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}><Icon d={s.icon} size={20}/></div>
            <div className="stat-value">{loading ? "—" : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <div className="card-title display">Upcoming Reservations</div>
            <div className="card-sub">Next scheduled visits</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setActive("reservations")}>View All</button>
        </div>
        {loading ? (
          <div className="empty"><span className="spin"><Icon d={icons.loader} size={28} color="var(--gold)"/></span></div>
        ) : upcoming.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🍽</div>
            <div>No upcoming reservations.</div>
            <button className="btn btn-primary" style={{marginTop:16}} onClick={() => setActive("book")}>Make a Reservation</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Guest</th><th>Date</th><th>Time</th><th>Table</th><th>Guests</th><th>Status</th></tr>
              </thead>
              <tbody>
                {upcoming.map(r => (
                  <tr key={r.id}>
                    <td><span className="fw-600">{r.userName}</span></td>
                    <td>{r.date}</td>
                    <td>{r.time}</td>
                    <td>{r.tableNumber} · {r.tableZone}</td>
                    <td>{r.guests}</td>
                    <td><span className={`badge badge-${r.status}`}><span className="badge-dot"/>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [active, setActive] = useState("dashboard");
  const [toast, setToast]   = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleLogin = (u) => { setUser(u); setActive("dashboard"); };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return (
    <>
      <style>{css}</style>
      <AuthPage onLogin={handleLogin} />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );

  const renderPage = () => {
    switch (active) {
      case "dashboard":    return <Dashboard user={user} setActive={setActive} />;
      case "book":         return <BookingWizard user={user} showToast={showToast} onDone={() => setActive("reservations")} />;
      case "reservations": return <ReservationsView user={user} showToast={showToast} />;
      case "tables":       return <TablesView showToast={showToast} />;
      default:             return null;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="app-layout">
        <Sidebar user={user} active={active} setActive={setActive} onLogout={handleLogout} />
        <div className="main-content">{renderPage()}</div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}
