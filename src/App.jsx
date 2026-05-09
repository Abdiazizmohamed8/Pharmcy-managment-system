import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const USERS = [
  {
    id: 1,
    name: "Mohamed Admin",
    email: "admin@gmail.com",
    password: "123456",
    role: "Admin",
    avatar: "MA",
    active: true
  },
  { id: 2, name: "Pharmacist Amina", email: "amina@anfac.so", role: "Pharmacist", avatar: "PA", active: true },
  { id: 3, name: "Cashier Omar", email: "omar@anfac.so", role: "Cashier", avatar: "CO", active: true },
];

const MEDICINES_INIT = [
  { id: 1, name: "Amoxicillin 500mg", category: "Antibiotics", sku: "AMX500", barcode: "6281003456789", stock: 240, minStock: 50, buyPrice: 1.2, sellPrice: 2.5, expiry: "2026-08", batch: "B2024A", supplier: "MediCo Somalia", image: null },
  { id: 2, name: "Paracetamol 500mg", category: "Analgesics", sku: "PCM500", barcode: "6281003456790", stock: 580, minStock: 100, buyPrice: 0.4, sellPrice: 0.9, expiry: "2026-12", batch: "B2024B", supplier: "Gulf Pharma", image: null },
  { id: 3, name: "Metformin 850mg", category: "Diabetes", sku: "MET850", barcode: "6281003456791", stock: 34, minStock: 50, buyPrice: 0.8, sellPrice: 1.8, expiry: "2025-11", batch: "B2023C", supplier: "MediCo Somalia", image: null },
  { id: 4, name: "Omeprazole 20mg", category: "Gastro", sku: "OMP020", barcode: "6281003456792", stock: 190, minStock: 40, buyPrice: 0.6, sellPrice: 1.4, expiry: "2026-05", batch: "B2024D", supplier: "Najah Medical", image: null },
  { id: 5, name: "Amlodipine 5mg", category: "Cardiology", sku: "AML005", barcode: "6281003456793", stock: 12, minStock: 30, buyPrice: 0.9, sellPrice: 2.0, expiry: "2026-03", batch: "B2024E", supplier: "Gulf Pharma", image: null },
  { id: 6, name: "Ibuprofen 400mg", category: "Analgesics", sku: "IBU400", barcode: "6281003456794", stock: 320, minStock: 60, buyPrice: 0.5, sellPrice: 1.1, expiry: "2027-01", batch: "B2025A", supplier: "Najah Medical", image: null },
  { id: 7, name: "Cetirizine 10mg", category: "Antihistamine", sku: "CTZ010", barcode: "6281003456795", stock: 155, minStock: 30, buyPrice: 0.7, sellPrice: 1.5, expiry: "2026-09", batch: "B2024F", supplier: "MediCo Somalia", image: null },
  { id: 8, name: "Atorvastatin 20mg", category: "Cardiology", sku: "ATR020", barcode: "6281003456796", stock: 8, minStock: 25, buyPrice: 1.5, sellPrice: 3.2, expiry: "2025-06", batch: "B2023G", supplier: "Gulf Pharma", image: null },
];

const CUSTOMERS_INIT = [
  { id: 1, name: "Fadumo Abdi", phone: "+252612345678", address: "Hodan District", debt: 45.50, points: 120, joined: "2024-01-15" },
  { id: 2, name: "Mohamed Hassan", phone: "+252618765432", address: "Wadajir District", debt: 0, points: 340, joined: "2023-11-02" },
  { id: 3, name: "Safia Nur", phone: "+252615554433", address: "Waberi District", debt: 120.00, points: 85, joined: "2024-03-20" },
  { id: 4, name: "Ali Ibrahim", phone: "+252619998877", address: "Xamarweyne District", debt: 0, points: 210, joined: "2023-08-10" },
];

const SUPPLIERS_INIT = [
  { id: 1, name: "MediCo Somalia", contact: "+252612111222", email: "info@medico.so", city: "Mogadishu", balance: 2400, lastOrder: "2025-04-15" },
  { id: 2, name: "Gulf Pharma", contact: "+252618333444", email: "orders@gulfpharma.com", city: "Mogadishu", balance: 1800, lastOrder: "2025-04-28" },
  { id: 3, name: "Najah Medical", contact: "+252615777888", email: "sales@najah.so", city: "Mogadishu", balance: 650, lastOrder: "2025-05-01" },
];

const SALES_INIT = [
  { id: "INV-001", date: "2025-05-07", customer: "Fadumo Abdi", items: [{ name: "Amoxicillin 500mg", qty: 2, price: 2.5 }, { name: "Paracetamol 500mg", qty: 3, price: 0.9 }], total: 7.7, paid: 7.7, method: "Cash", user: "Cashier Omar", status: "Paid" },
  { id: "INV-002", date: "2025-05-07", customer: "Walk-in", items: [{ name: "Ibuprofen 400mg", qty: 1, price: 1.1 }], total: 1.1, paid: 1.1, method: "Cash", user: "Pharmacist Amina", status: "Paid" },
  { id: "INV-003", date: "2025-05-06", customer: "Mohamed Hassan", items: [{ name: "Omeprazole 20mg", qty: 2, price: 1.4 }, { name: "Atorvastatin 20mg", qty: 1, price: 3.2 }], total: 6.0, paid: 0, method: "Credit", user: "Cashier Omar", status: "Unpaid" },
  { id: "INV-004", date: "2025-05-05", customer: "Safia Nur", items: [{ name: "Amlodipine 5mg", qty: 1, price: 2.0 }, { name: "Metformin 850mg", qty: 2, price: 1.8 }], total: 5.6, paid: 3.0, method: "Partial", user: "Pharmacist Amina", status: "Partial" },
  { id: "INV-005", date: "2025-05-04", customer: "Ali Ibrahim", items: [{ name: "Cetirizine 10mg", qty: 2, price: 1.5 }], total: 3.0, paid: 3.0, method: "Cash", user: "Cashier Omar", status: "Paid" },
  { id: "INV-006", date: "2025-05-03", customer: "Walk-in", items: [{ name: "Paracetamol 500mg", qty: 5, price: 0.9 }, { name: "Ibuprofen 400mg", qty: 2, price: 1.1 }], total: 6.7, paid: 6.7, method: "Cash", user: "Pharmacist Amina", status: "Paid" },
];

const EXPENSES_INIT = [
  { id: 1, date: "2025-05-07", category: "Utilities", description: "Electricity bill", amount: 150, user: "Admin Hassan" },
  { id: 2, date: "2025-05-05", category: "Staff", description: "Staff salaries", amount: 800, user: "Admin Hassan" },
  { id: 3, date: "2025-05-01", category: "Supplies", description: "Packaging materials", amount: 45, user: "Admin Hassan" },
];

const CATEGORIES = ["Antibiotics", "Analgesics", "Diabetes", "Gastro", "Cardiology", "Antihistamine", "Vitamins", "Dermatology", "Neurology", "Respiratory"];

const salesTrend = [
  { day: "Mon", sales: 145, revenue: 320 },
  { day: "Tue", sales: 189, revenue: 412 },
  { day: "Wed", sales: 134, revenue: 290 },
  { day: "Thu", sales: 210, revenue: 470 },
  { day: "Fri", sales: 178, revenue: 395 },
  { day: "Sat", sales: 256, revenue: 580 },
  { day: "Sun", sales: 92, revenue: 198 },
];
const topMeds = [
  { name: "Paracetamol", sales: 58 },
  { name: "Amoxicillin", sales: 43 },
  { name: "Ibuprofen", sales: 37 },
  { name: "Omeprazole", sales: 29 },
  { name: "Cetirizine", sales: 22 },
];
const PIE_COLORS = ["#16a34a", "#22d3ee", "#f59e0b", "#8b5cf6", "#f87171"];

// ─── Utility ──────────────────────────────────────────────────────────────────
const fmt = (n) => `$${Number(n).toFixed(2)}`;
const today = () => new Date().toISOString().split("T")[0];
const genId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

function Toast({ toasts, remove }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => remove(t.id)} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 18px",
          borderRadius: 10, cursor: "pointer", minWidth: 260, maxWidth: 340,
          background: t.type === "success" ? "#16a34a" : t.type === "error" ? "#dc2626" : "#0284c7",
          color: "#fff", fontSize: 14, fontWeight: 500,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          animation: "slideIn 0.25s ease"
        }}>
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✗" : "ℹ"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };
  const remove = (id) => setToasts(p => p.filter(t => t.id !== id));
  return { toasts, add, remove };
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const { toasts, add: toast, remove } = useToast();

  // Global state
  const [medicines, setMedicines] = useState(MEDICINES_INIT);
  const [customers, setCustomers] = useState(CUSTOMERS_INIT);
  const [suppliers, setSuppliers] = useState(SUPPLIERS_INIT);
  const [sales, setSales] = useState(SALES_INIT);
  const [expenses, setExpenses] = useState(EXPENSES_INIT);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : USERS;
  });

  useEffect(() => {
    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );
  }, [users]);

  const bg = dark ? "#0f172a" : "#f0fdf4";
  const card = dark ? "#1e293b" : "#ffffff";
  const border = dark ? "#334155" : "#d1fae5";
  const text = dark ? "#f1f5f9" : "#1e293b";
  const muted = dark ? "#94a3b8" : "#64748b";
  const sidebar = dark ? "#0d2317" : "#052e16";
  const accent = "#16a34a";
  const accentL = "#dcfce7";

  const C = { bg, card, border, text, muted, sidebar, accent, accentL, dark };

  if (!authed) return <Login onLogin={(u) => { setCurrentUser(u); setAuthed(true); toast(`Welcome, ${u.name}!`); }} C={C} toast={toast} />;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "pos", label: "POS / Sales", icon: "🛒" },
    { id: "medicines", label: "Medicines", icon: "💊" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "suppliers", label: "Suppliers", icon: "🏭" },
    { id: "sales", label: "Sales History", icon: "📋" },
    { id: "debts", label: "Debts", icon: "💳" },
    { id: "expenses", label: "Expenses", icon: "💸" },
    { id: "reports", label: "Reports", icon: "📈" },
    ...(currentUser?.role === "Admin" ? [{ id: "users", label: "Users", icon: "👤" }] : []),
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const sharedProps = { C, medicines, setMedicines, customers, setCustomers, suppliers, setSuppliers, sales, setSales, expenses, setExpenses, users, setUsers, toast, currentUser };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, color: text, fontFamily: "'Segoe UI',system-ui,sans-serif", transition: "all 0.2s" }}>
      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        * { box-sizing: border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#16a34a44; border-radius:3px; }
        input,select,textarea { outline:none; font-family:inherit; }
        button { cursor:pointer; font-family:inherit; }
        .nav-item:hover { background: #16a34a22 !important; }
        .nav-item.active { background: #16a34a33 !important; border-left: 3px solid #16a34a !important; }
        .table-row:hover { background: #16a34a11 !important; }
        .btn-primary { background:#16a34a; color:#fff; border:none; padding:9px 20px; border-radius:8px; font-size:14px; font-weight:600; transition:0.15s; }
        .btn-primary:hover { background:#15803d; transform:translateY(-1px); }
        .btn-danger { background:#dc2626; color:#fff; border:none; padding:7px 14px; border-radius:7px; font-size:13px; transition:0.15s; }
        .btn-danger:hover { background:#b91c1c; }
        .btn-outline { background:transparent; border:1.5px solid #16a34a; color:#16a34a; padding:7px 14px; border-radius:7px; font-size:13px; font-weight:600; transition:0.15s; }
        .btn-outline:hover { background:#16a34a; color:#fff; }
        .input { width:100%; padding:9px 12px; border-radius:8px; font-size:14px; }
        .card { border-radius:14px; padding:20px; transition:0.15s; }
        .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
        @media(max-width:768px) { .desktop-only{display:none!important} }
      `}</style>

      {/* Mobile Overlay */}
      {mobileSidebar && <div onClick={() => setMobileSidebar(false)} style={{ position: "fixed", inset: 0, background: "#00000066", zIndex: 40 }} />}

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 68, background: sidebar, color: "#fff", flexShrink: 0,
        display: "flex", flexDirection: "column", transition: "width 0.2s", overflow: "hidden",
        position: window.innerWidth < 768 ? "fixed" : "relative",
        left: window.innerWidth < 768 ? (mobileSidebar ? 0 : -240) : 0,
        height: "100vh", zIndex: 50, boxShadow: "2px 0 20px rgba(0,0,0,0.15)"
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #ffffff22", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💊</div>
          {sidebarOpen && <div><div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 0.5 }}>ANFAC</div><div style={{ fontSize: 11, color: "#86efac" }}>Pharmacy System</div></div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
          {navItems.map(item => (
            <div key={item.id} className={`nav-item${page === item.id ? " active" : ""}`}
              onClick={() => { setPage(item.id); setMobileSidebar(false); }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 9, cursor: "pointer", marginBottom: 2, borderLeft: "3px solid transparent", transition: "0.15s" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #ffffff22" }}>
          {sidebarOpen ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 50, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{currentUser?.avatar}</div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser?.name}</div>
                <div style={{ fontSize: 11, color: "#86efac" }}>{currentUser?.role}</div>
              </div>
            </div>
          ) : (
            <div style={{ width: 34, height: 34, borderRadius: 50, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{currentUser?.avatar}</div>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ padding: "12px 24px", borderBottom: `1px solid ${border}`, background: card, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <button onClick={() => { window.innerWidth < 768 ? setMobileSidebar(!mobileSidebar) : setSidebarOpen(!sidebarOpen); }}
            style={{ background: "transparent", border: "none", fontSize: 20, color: muted, padding: 4 }}>☰</button>
          <div style={{ flex: 1, fontWeight: 700, fontSize: 16, color: text }}>
            {navItems.find(n => n.id === page)?.label || "Dashboard"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setDark(!dark)} style={{ background: "transparent", border: "none", fontSize: 18, color: muted }}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => { setAuthed(false); toast("Logged out successfully"); }} className="btn-outline" style={{ fontSize: 13 }}>Logout</button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {page === "dashboard" && <Dashboard {...sharedProps} />}
          {page === "pos" && <POS {...sharedProps} />}
          {page === "medicines" && <Medicines {...sharedProps} />}
          {page === "inventory" && <Inventory {...sharedProps} />}
          {page === "customers" && <Customers {...sharedProps} />}
          {page === "suppliers" && <Suppliers {...sharedProps} />}
          {page === "sales" && <SalesHistory {...sharedProps} />}
          {page === "debts" && <Debts {...sharedProps} />}
          {page === "expenses" && <Expenses {...sharedProps} />}
          {page === "reports" && <Reports {...sharedProps} />}
          {page === "users" && <Users {...sharedProps} />}
          {page === "settings" && <Settings {...sharedProps} dark={dark} setDark={setDark} />}
        </div>
      </div>

      <Toast toasts={toasts} remove={remove} />
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin, C, toast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = () => {
    setLoading(true);

    setTimeout(() => {

      const savedUsers =
        JSON.parse(localStorage.getItem("users")) || USERS;

      const u = savedUsers.find(
        u =>
          u.email === email &&
          u.password === password
      );

      if (u) {
        onLogin(u);
      } else {
        toast("Invalid credentials", "error");
      }

      setLoading(false);

    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg,#052e16 0%,#14532d 50%,#052e16 100%)", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      <div style={{ background: "#fff", borderRadius: 20, padding: "48px 40px", maxWidth: 420, width: "100%", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", animation: "fadeIn 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px", animation: "float 3s ease-in-out infinite" }}>💊</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#052e16", letterSpacing: 1 }}>ANFAC Pharmacy</div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Pharmacy Management System</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email Address</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)}
            style={{ border: "1.5px solid #d1fae5", background: "#f0fdf4", color: "#1e293b", borderRadius: 9 }}
            placeholder="Enter email" type="email" onKeyDown={e => e.key === "Enter" && handle()} />
        </div>
        <div style={{ marginBottom: 24, position: "relative" }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
          <input className="input" value={password} onChange={e => setPassword(e.target.value)}
            style={{ border: "1.5px solid #d1fae5", background: "#f0fdf4", color: "#1e293b", borderRadius: 9 }}
            placeholder="Enter password" type={showPw ? "text" : "password"} onKeyDown={e => e.key === "Enter" && handle()} />
          <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: 34, background: "none", border: "none", color: "#64748b", fontSize: 16 }}>{showPw ? "👁️" : "🙈"}</button>
        </div>
        <button className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: 15 }} onClick={handle} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ C, medicines, sales, customers, expenses }) {
  const { bg, card, border, text, muted, accent } = C;
  const todaySales = sales.filter(s => s.date === today());
  const todayRevenue = todaySales.reduce((a, s) => a + s.paid, 0);
  const totalDebt = customers.reduce((a, c) => a + c.debt, 0);
  const lowStock = medicines.filter(m => m.stock <= m.minStock);
  const expiredSoon = medicines.filter(m => {
    const exp = new Date(m.expiry + "-01");
    const diff = (exp - new Date()) / (1000 * 60 * 60 * 24 * 30);
    return diff <= 2;
  });
  const totalRevenue = sales.reduce((a, s) => a + s.paid, 0);
  const totalCost = sales.reduce((a, s) => {
    return a + s.items.reduce((b, i) => {
      const med = medicines.find(m => m.name === i.name);
      return b + (med ? med.buyPrice * i.qty : 0);
    }, 0);
  }, 0);
  const profit = totalRevenue - totalCost - expenses.reduce((a, e) => a + e.amount, 0);

  const stats = [
    { label: "Today's Revenue", value: fmt(todayRevenue), icon: "💰", color: "#16a34a", bg: "#dcfce7" },
    { label: "Total Customers", value: customers.length, icon: "👥", color: "#0284c7", bg: "#e0f2fe" },
    { label: "Low Stock Items", value: lowStock.length, icon: "⚠️", color: "#d97706", bg: "#fef3c7" },
    { label: "Outstanding Debt", value: fmt(totalDebt), icon: "💳", color: "#dc2626", bg: "#fee2e2" },
    { label: "Total Medicines", value: medicines.length, icon: "💊", color: "#7c3aed", bg: "#ede9fe" },
    { label: "Net Profit", value: fmt(profit), icon: "📈", color: "#059669", bg: "#d1fae5" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: text }}>Good morning! 👋</h2>
        <p style={{ color: muted, marginTop: 4 }}>Here's what's happening at ANFAC Pharmacy today.</p>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || expiredSoon.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 24 }}>
          {lowStock.length > 0 && (
            <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>⚠️</span>
              <div><div style={{ fontWeight: 700, color: "#92400e", fontSize: 14 }}>{lowStock.length} items low on stock</div>
                <div style={{ fontSize: 12, color: "#b45309", marginTop: 2 }}>{lowStock.map(m => m.name).slice(0, 2).join(", ")}{lowStock.length > 2 ? ` +${lowStock.length - 2} more` : ""}</div></div>
            </div>
          )}
          {expiredSoon.length > 0 && (
            <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>🚨</span>
              <div><div style={{ fontWeight: 700, color: "#991b1b", fontSize: 14 }}>{expiredSoon.length} items expiring soon</div>
                <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 2 }}>{expiredSoon.map(m => m.name).slice(0, 2).join(", ")}{expiredSoon.length > 2 ? ` +${expiredSoon.length - 2} more` : ""}</div></div>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ background: card, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: muted, fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: text }}>{s.value}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ background: card, border: `1px solid ${border}` }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, color: text }}>📊 Weekly Sales Overview</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={border} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: muted }} />
              <YAxis tick={{ fontSize: 12, fill: muted }} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, color: text }} />
              <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ background: card, border: `1px solid ${border}` }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, color: text }}>🥇 Top Medicines</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={topMeds} dataKey="sales" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {topMeds.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, color: text }} />
            </PieChart>
          </ResponsiveContainer>
          {topMeds.map((m, i) => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 50, background: PIE_COLORS[i], flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: muted, flex: 1 }}>{m.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: text }}>{m.sales}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sales */}
      <div className="card" style={{ background: card, border: `1px solid ${border}` }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, color: text }}>🧾 Recent Transactions</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Invoice", "Date", "Customer", "Items", "Total", "Method", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 5).map(s => (
                <tr key={s.id} className="table-row" style={{ borderBottom: `1px solid ${border}40` }}>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#16a34a", fontWeight: 600 }}>{s.id}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: muted }}>{s.date}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: text, fontWeight: 500 }}>{s.customer}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: muted }}>{s.items.length} item(s)</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: text }}>{fmt(s.total)}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: muted }}>{s.method}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span className="badge" style={{
                      background: s.status === "Paid" ? "#dcfce7" : s.status === "Unpaid" ? "#fee2e2" : "#fef3c7",
                      color: s.status === "Paid" ? "#15803d" : s.status === "Unpaid" ? "#dc2626" : "#d97706"
                    }}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── POS ──────────────────────────────────────────────────────────────────────
function POS({ C, medicines, setMedicines, customers, setCustomers, sales, setSales, toast, currentUser }) {
  const { bg, card, border, text, muted, accent } = C;
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("Walk-in");
  const [payMethod, setPayMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [showReceipt, setShowReceipt] = useState(null);

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.barcode.includes(search));

  const addToCart = (med) => {
    if (med.stock <= 0) { toast("Out of stock!", "error"); return; }
    setCart(prev => {
      const ex = prev.find(i => i.id === med.id);
      if (ex) {
        if (ex.qty >= med.stock) { toast("Max stock reached", "error"); return prev; }
        return prev.map(i => i.id === med.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...med, qty: 1 }];
    });
    setSearch("");
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.id !== id)); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const total = cart.reduce((a, i) => a + i.sellPrice * i.qty, 0);
  const paid = parseFloat(amountPaid) || 0;
  const change = paid - total;

  const completeSale = () => {
    if (cart.length === 0) { toast("Cart is empty", "error"); return; }
    if (payMethod === "Cash" && paid < total) { toast("Insufficient payment", "error"); return; }

    const inv = "INV-" + String(sales.length + 1).padStart(3, "0");
    const newSale = {
      id: inv, date: today(), customer,
      items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.sellPrice })),
      total, paid: payMethod === "Credit" ? 0 : payMethod === "Partial" ? paid : total,
      method: payMethod, user: currentUser?.name, status: payMethod === "Credit" ? "Unpaid" : payMethod === "Partial" ? "Partial" : "Paid"
    };

    setSales(prev => [newSale, ...prev]);
    setMedicines(prev => prev.map(m => {
      const item = cart.find(i => i.id === m.id);
      return item ? { ...m, stock: m.stock - item.qty } : m;
    }));
    if (payMethod === "Credit" || payMethod === "Partial") {
      const debt = payMethod === "Credit" ? total : total - paid;
      setCustomers(prev => prev.map(c => c.name === customer ? { ...c, debt: c.debt + debt } : c));
    }
    setShowReceipt(newSale);
    setCart([]); setAmountPaid(""); setCustomer("Walk-in");
    toast("Sale completed! " + inv);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, animation: "fadeIn 0.3s ease" }}>
      {/* Product Panel */}
      <div>
        <div style={{ marginBottom: 16 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} className="input"
            placeholder="🔍  Search medicine by name or barcode..."
            style={{ border: `1.5px solid ${border}`, background: card, color: text, borderRadius: 10, fontSize: 15, padding: "12px 16px" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
          {(search ? filtered : medicines).map(med => (
            <div key={med.id} onClick={() => addToCart(med)} className="card"
              style={{
                background: card, border: `1px solid ${border}`, cursor: "pointer", textAlign: "center",
                opacity: med.stock === 0 ? 0.5 : 1, transition: "0.15s", padding: "16px 12px"
              }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>💊</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 4, lineHeight: 1.3 }}>{med.name}</div>
              <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>{med.category}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#16a34a" }}>{fmt(med.sellPrice)}</div>
              <div style={{ fontSize: 11, color: med.stock <= med.minStock ? "#dc2626" : muted, marginTop: 4 }}>
                Stock: {med.stock}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card" style={{ background: card, border: `1px solid ${border}`, flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
            🛒 Cart <span style={{ color: muted, fontWeight: 400, fontSize: 13 }}>{cart.length} item(s)</span>
          </div>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: muted }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
              <div>Add medicines to cart</div>
            </div>
          ) : (
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${border}40` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: muted }}>{fmt(item.sellPrice)} each</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${border}`, background: "transparent", color: text, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 700, color: text, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{ width: 26, height: 26, borderRadius: 6, background: "#16a34a", border: "none", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text, minWidth: 50, textAlign: "right" }}>{fmt(item.sellPrice * item.qty)}</div>
                </div>
              ))}
            </div>
          )}
          {cart.length > 0 && (
            <button onClick={() => setCart([])} style={{ width: "100%", marginTop: 10, background: "transparent", border: `1px solid #dc2626`, color: "#dc2626", padding: "6px", borderRadius: 7, fontSize: 13 }}>
              Clear Cart
            </button>
          )}
        </div>

        {/* Payment */}
        <div className="card" style={{ background: card, border: `1px solid ${border}` }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 14 }}>💳 Payment</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Customer</label>
            <select className="input" value={customer} onChange={e => setCustomer(e.target.value)}
              style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 8 }}>
              <option>Walk-in</option>
              {customers.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Payment Method</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Cash", "Credit", "Partial"].map(m => (
                <button key={m} onClick={() => setPayMethod(m)} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: payMethod === m ? "#16a34a" : "transparent",
                  color: payMethod === m ? "#fff" : muted, border: `1px solid ${payMethod === m ? "#16a34a" : border}`
                }}>{m}</button>
              ))}
            </div>
          </div>
          {(payMethod === "Cash" || payMethod === "Partial") && (
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Amount Paid ($)</label>
              <input className="input" type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)}
                placeholder="0.00" style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 8 }} />
            </div>
          )}
          <div style={{ padding: "12px 0", borderTop: `1px solid ${border}`, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: muted, fontSize: 13 }}>Subtotal</span>
              <span style={{ color: text, fontWeight: 600 }}>{fmt(total)}</span>
            </div>
            {payMethod === "Cash" && paid > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ color: muted, fontSize: 13 }}>Change</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: change >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(Math.max(0, change))}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ color: text, fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ color: "#16a34a", fontWeight: 800, fontSize: 20 }}>{fmt(total)}</span>
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%", fontSize: 15, padding: "12px" }} onClick={completeSale}>
            ✅ Complete Sale
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", color: "#1e293b" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#052e16" }}>💊 ANFAC Pharmacy</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Mogadishu, Somalia | Tel: +252612345678</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{showReceipt.id} • {showReceipt.date}</div>
            </div>
            <div style={{ borderTop: "1px dashed #d1d5db", borderBottom: "1px dashed #d1d5db", padding: "12px 0", marginBottom: 12 }}>
              {showReceipt.items.map((i, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
                  <span>{i.name} x{i.qty}</span>
                  <span>{fmt(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              <span>TOTAL</span><span style={{ color: "#16a34a" }}>{fmt(showReceipt.total)}</span>
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>Method: {showReceipt.method} • Status: {showReceipt.status}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 16 }}>Thank you for choosing ANFAC Pharmacy!</div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={() => setShowReceipt(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Medicines ────────────────────────────────────────────────────────────────
function Medicines({ C, medicines, setMedicines, toast }) {
  const { card, border, text, muted } = C;
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Antibiotics", barcode: "", sku: "", stock: 0, minStock: 0, buyPrice: 0, sellPrice: 0, expiry: "", batch: "", supplier: "" });

  const filtered = medicines.filter(m =>
    (catFilter === "All" || m.category === catFilter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.barcode.includes(search))
  );

  const openAdd = () => { setForm({ name: "", category: "Antibiotics", barcode: "", sku: "", stock: 0, minStock: 0, buyPrice: 0, sellPrice: 0, expiry: "", batch: "", supplier: "" }); setModal("add"); };
  const openEdit = (m) => { setForm({ ...m }); setModal("edit"); };

  const save = () => {
    if (!form.name) { toast("Medicine name is required", "error"); return; }
    if (modal === "add") {
      setMedicines(prev => [...prev, { ...form, id: Date.now(), stock: Number(form.stock), buyPrice: Number(form.buyPrice), sellPrice: Number(form.sellPrice), minStock: Number(form.minStock) }]);
      toast("Medicine added successfully");
    } else {
      setMedicines(prev => prev.map(m => m.id === form.id ? { ...form, stock: Number(form.stock), buyPrice: Number(form.buyPrice), sellPrice: Number(form.sellPrice), minStock: Number(form.minStock) } : m));
      toast("Medicine updated");
    }
    setModal(null);
  };

  const del = (id) => { setMedicines(prev => prev.filter(m => m.id !== id)); toast("Medicine deleted", "error"); };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} className="input"
          placeholder="🔍  Search medicines..." style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 9, maxWidth: 300 }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input"
            style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 9, width: "auto" }}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="btn-primary" onClick={openAdd}>+ Add Medicine</button>
        </div>
      </div>

      <div className="card" style={{ background: card, border: `1px solid ${border}`, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.dark ? "#0d2317" : "#f0fdf4" }}>
                {["Name", "Category", "Barcode", "Stock", "Min", "Buy", "Sell", "Expiry", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const isLow = m.stock <= m.minStock;
                const expDate = new Date(m.expiry + "-01");
                const expSoon = (expDate - new Date()) < 60 * 24 * 60 * 60 * 1000;
                return (
                  <tr key={m.id} className="table-row" style={{ borderBottom: `1px solid ${border}40` }}>
                    <td style={{ padding: "11px 14px", fontWeight: 600, color: text, fontSize: 14 }}>{m.name}</td>
                    <td style={{ padding: "11px 14px" }}><span className="badge" style={{ background: "#dcfce7", color: "#15803d" }}>{m.category}</span></td>
                    <td style={{ padding: "11px 14px", fontSize: 12, color: muted }}>{m.barcode}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 700, color: isLow ? "#dc2626" : text }}>{m.stock}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{m.minStock}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{fmt(m.buyPrice)}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 700, color: "#16a34a" }}>{fmt(m.sellPrice)}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: expSoon ? "#dc2626" : muted }}>{m.expiry}</td>
                    <td style={{ padding: "11px 14px" }}>
                      {isLow ? <span className="badge" style={{ background: "#fee2e2", color: "#dc2626" }}>Low</span>
                        : expSoon ? <span className="badge" style={{ background: "#fef3c7", color: "#d97706" }}>Expiring</span>
                          : <span className="badge" style={{ background: "#dcfce7", color: "#15803d" }}>OK</span>}
                    </td>
                    <td style={{ padding: "11px 14px", display: "flex", gap: 6 }}>
                      <button className="btn-outline" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => openEdit(m)}>Edit</button>
                      <button className="btn-danger" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => del(m.id)}>Del</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <MedModal C={C} form={form} setForm={setForm} onSave={save} onClose={() => setModal(null)} mode={modal} />}
    </div>
  );
}

function MedModal({ C, form, setForm, onSave, onClose, mode }) {
  const { card, border, text, muted } = C;
  const F = (label, key, type = "text", opts = null) => (
    <div>
      <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>{label}</label>
      {opts ? (
        <select className="input" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 8 }}>
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input className="input" type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 8 }} />
      )}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: card, borderRadius: 16, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: text, marginBottom: 20 }}>{mode === "add" ? "Add Medicine" : "Edit Medicine"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {F("Medicine Name", "name")}
          {F("Category", "category", "text", CATEGORIES)}
          {F("Barcode", "barcode")}
          {F("SKU", "sku")}
          {F("Stock Quantity", "stock", "number")}
          {F("Min Stock", "minStock", "number")}
          {F("Buy Price ($)", "buyPrice", "number")}
          {F("Sell Price ($)", "sellPrice", "number")}
          {F("Expiry (YYYY-MM)", "expiry")}
          {F("Batch Number", "batch")}
          {F("Supplier", "supplier")}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={onSave}>Save</button>
          <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Inventory ────────────────────────────────────────────────────────────────
function Inventory({ C, medicines, setMedicines, toast }) {
  const { card, border, text, muted } = C;
  const [adjMed, setAdjMed] = useState(null);
  const [adjQty, setAdjQty] = useState(0);
  const [adjReason, setAdjReason] = useState("Purchase");

  const lowStock = medicines.filter(m => m.stock <= m.minStock);
  const outStock = medicines.filter(m => m.stock === 0);
  const expiredSoon = medicines.filter(m => {
    const diff = (new Date(m.expiry + "-01") - new Date()) / (1000 * 60 * 60 * 24 * 30);
    return diff <= 2 && diff >= 0;
  });

  const adjust = () => {
    setMedicines(prev => prev.map(m => m.id === adjMed.id ? { ...m, stock: Math.max(0, m.stock + Number(adjQty)) } : m));
    toast(`Stock adjusted for ${adjMed.name}`);
    setAdjMed(null); setAdjQty(0);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Products", value: medicines.length, icon: "💊", bg: "#dcfce7", c: "#15803d" },
          { label: "Low Stock", value: lowStock.length, icon: "⚠️", bg: "#fef3c7", c: "#d97706" },
          { label: "Out of Stock", value: outStock.length, icon: "❌", bg: "#fee2e2", c: "#dc2626" },
          { label: "Expiring Soon", value: expiredSoon.length, icon: "⏰", bg: "#ede9fe", c: "#7c3aed" },
        ].map(s => (
          <div key={s.label} className="card" style={{ background: card, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: text }}>{s.value}</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: card, border: `1px solid ${border}`, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 14 }}>📦 Stock Levels</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Medicine", "Category", "Current Stock", "Min Stock", "Level", "Adjust"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medicines.map(m => {
                const pct = Math.min(100, Math.round((m.stock / Math.max(m.minStock * 3, 1)) * 100));
                return (
                  <tr key={m.id} className="table-row" style={{ borderBottom: `1px solid ${border}40` }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: text, fontSize: 14 }}>{m.name}</td>
                    <td style={{ padding: "10px 12px" }}><span className="badge" style={{ background: "#dcfce7", color: "#15803d", fontSize: 11 }}>{m.category}</span></td>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: m.stock === 0 ? "#dc2626" : m.stock <= m.minStock ? "#d97706" : text }}>{m.stock}</td>
                    <td style={{ padding: "10px 12px", color: muted, fontSize: 13 }}>{m.minStock}</td>
                    <td style={{ padding: "10px 12px", minWidth: 120 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 8, background: `${border}`, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: m.stock === 0 ? "#dc2626" : m.stock <= m.minStock ? "#f59e0b" : "#16a34a", borderRadius: 4, transition: "0.3s" }} />
                        </div>
                        <span style={{ fontSize: 11, color: muted, minWidth: 30 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button className="btn-outline" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => setAdjMed(m)}>Adjust</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {adjMed && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: card, borderRadius: 16, padding: 28, maxWidth: 380, width: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: text, marginBottom: 16 }}>Adjust Stock — {adjMed.name}</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Reason</label>
              <select className="input" value={adjReason} onChange={e => setAdjReason(e.target.value)}
                style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 8 }}>
                {["Purchase", "Return", "Damage", "Adjustment", "Found"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Quantity Change (+ to add, - to remove)</label>
              <input className="input" type="number" value={adjQty} onChange={e => setAdjQty(e.target.value)}
                style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 8 }} />
            </div>
            <div style={{ color: muted, fontSize: 13, marginBottom: 16 }}>New stock: <strong style={{ color: text }}>{Math.max(0, adjMed.stock + Number(adjQty))}</strong></div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={adjust}>Confirm</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setAdjMed(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Customers ────────────────────────────────────────────────────────────────
function Customers({ C, customers, setCustomers, sales, toast }) {
  const { card, border, text, muted } = C;
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", debt: 0, points: 0 });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const save = () => {
    if (!form.name) { toast("Name required", "error"); return; }
    if (form.id) {
      setCustomers(prev => prev.map(c => c.id === form.id ? { ...form } : c));
      toast("Customer updated");
    } else {
      setCustomers(prev => [...prev, { ...form, id: Date.now(), joined: today() }]);
      toast("Customer added");
    }
    setModal(false);
  };

  const del = (id) => { setCustomers(prev => prev.filter(c => c.id !== id)); toast("Customer deleted", "error"); };

  const custSales = selected ? sales.filter(s => s.customer === selected.name) : [];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} className="input"
          placeholder="🔍  Search customers..." style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 9, maxWidth: 300 }} />
        <button className="btn-primary" onClick={() => { setForm({ name: "", phone: "", address: "", debt: 0, points: 0 }); setModal(true) }}>+ Add Customer</button>
      </div>

      <div className="card" style={{ background: card, border: `1px solid ${border}`, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.dark ? "#0d2317" : "#f0fdf4" }}>
                {["Name", "Phone", "Address", "Debt", "Points", "Joined", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="table-row" style={{ borderBottom: `1px solid ${border}40` }}>
                  <td style={{ padding: "11px 14px", fontWeight: 600, color: text }}>{c.name}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{c.phone}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{c.address}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: c.debt > 0 ? "#dc2626" : "#16a34a" }}>{fmt(c.debt)}</td>
                  <td style={{ padding: "11px 14px" }}><span className="badge" style={{ background: "#ede9fe", color: "#7c3aed" }}>⭐ {c.points}</span></td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{c.joined}</td>
                  <td style={{ padding: "11px 14px", display: "flex", gap: 6 }}>
                    <button className="btn-outline" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => { setSelected(c) }}>History</button>
                    <button className="btn-outline" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => { setForm({ ...c }); setModal(true) }}>Edit</button>
                    <button className="btn-danger" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => del(c.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: card, borderRadius: 16, padding: 28, maxWidth: 420, width: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: text, marginBottom: 18 }}>{form.id ? "Edit" : "Add"} Customer</div>
            {[["Full Name", "name"], ["Phone", "phone"], ["Address", "address"]].map(([l, k]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>{l}</label>
                <input className="input" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                  style={{ border: `1px solid ${border}`, background: C.bg, color: text, borderRadius: 8 }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={save}>Save</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: card, borderRadius: 16, padding: 28, maxWidth: 520, width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: text, marginBottom: 4 }}>{selected.name} — Purchase History</div>
            <div style={{ color: muted, fontSize: 13, marginBottom: 16 }}>Total debt: <strong style={{ color: selected.debt > 0 ? "#dc2626" : "#16a34a" }}>{fmt(selected.debt)}</strong></div>
            {custSales.length === 0 ? <div style={{ color: muted, textAlign: "center", padding: "30px 0" }}>No purchase history</div> : (
              custSales.map(s => (
                <div key={s.id} style={{ padding: "10px 0", borderBottom: `1px solid ${border}40` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: text, fontSize: 14 }}>{s.id}</span>
                    <span className="badge" style={{ background: s.status === "Paid" ? "#dcfce7" : "#fee2e2", color: s.status === "Paid" ? "#15803d" : "#dc2626" }}>{s.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: muted }}>{s.date} • {s.items.map(i => i.name).join(", ")}</div>
                  <div style={{ fontWeight: 700, color: "#16a34a", marginTop: 4 }}>{fmt(s.total)}</div>
                </div>
              ))
            )}
            <button className="btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Suppliers ────────────────────────────────────────────────────────────────
function Suppliers({ C, suppliers, setSuppliers, toast }) {
  const { card, border, text, muted } = C;
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", email: "", city: "Mogadishu", balance: 0 });
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if (!form.name) { toast("Name required", "error"); return; }
    if (form.id) { setSuppliers(prev => prev.map(s => s.id === form.id ? { ...form } : s)); toast("Updated"); }
    else { setSuppliers(prev => [...prev, { ...form, id: Date.now(), lastOrder: today() }]); toast("Supplier added"); }
    setModal(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} className="input"
          placeholder="🔍  Search suppliers..." style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 9, maxWidth: 300 }} />
        <button className="btn-primary" onClick={() => { setForm({ name: "", contact: "", email: "", city: "Mogadishu", balance: 0 }); setModal(true) }}>+ Add Supplier</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {filtered.map(s => (
          <div key={s.id} className="card" style={{ background: card, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏭</div>
              <div>
                <div style={{ fontWeight: 700, color: text, fontSize: 15 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: muted }}>{s.city}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 4 }}>📞 {s.contact}</div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 4 }}>✉️ {s.email}</div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 10 }}>📅 Last order: {s.lastOrder}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${border}` }}>
              <div>
                <div style={{ fontSize: 12, color: muted }}>Outstanding Balance</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: s.balance > 0 ? "#dc2626" : "#16a34a" }}>{fmt(s.balance)}</div>
              </div>
              <button className="btn-outline" style={{ fontSize: 12 }} onClick={() => { setForm({ ...s }); setModal(true) }}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: card, borderRadius: 16, padding: 28, maxWidth: 420, width: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: text, marginBottom: 18 }}>{form.id ? "Edit" : "Add"} Supplier</div>
            {[["Company Name", "name"], ["Contact Phone", "contact"], ["Email", "email"], ["City", "city"]].map(([l, k]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>{l}</label>
                <input className="input" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                  style={{ border: `1px solid ${border}`, background: C.bg, color: text, borderRadius: 8 }} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Balance ($)</label>
              <input className="input" type="number" value={form.balance} onChange={e => setForm(p => ({ ...p, balance: e.target.value }))}
                style={{ border: `1px solid ${border}`, background: C.bg, color: text, borderRadius: 8 }} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={save}>Save</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sales History ────────────────────────────────────────────────────────────
function SalesHistory({ C, sales, setSales, toast }) {
  const { card, border, text, muted } = C;
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [dateF, setDateF] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = sales.filter(s =>
    (statusF === "All" || s.status === statusF) &&
    (!dateF || s.date === dateF) &&
    (s.id.includes(search.toUpperCase()) || s.customer.toLowerCase().includes(search.toLowerCase()))
  );

  const del = (id) => { setSales(prev => prev.filter(s => s.id !== id)); toast("Sale deleted", "error"); };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} className="input"
          placeholder="🔍  Search invoice or customer..." style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 9, flex: 1, minWidth: 200 }} />
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className="input"
          style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 9, width: "auto" }}>
          {["All", "Paid", "Unpaid", "Partial"].map(s => <option key={s}>{s}</option>)}
        </select>
        <input type="date" value={dateF} onChange={e => setDateF(e.target.value)} className="input"
          style={{ border: `1px solid ${border}`, background: card, color: text, borderRadius: 9, width: "auto" }} />
      </div>

      <div style={{ color: muted, fontSize: 13, marginBottom: 12 }}>{filtered.length} transactions found</div>

      <div className="card" style={{ background: card, border: `1px solid ${border}`, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.dark ? "#0d2317" : "#f0fdf4" }}>
                {["Invoice", "Date", "Customer", "Items", "Total", "Paid", "Method", "User", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="table-row" style={{ borderBottom: `1px solid ${border}40` }}>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: "#16a34a", fontSize: 14 }}>{s.id}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{s.date}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 600, color: text, fontSize: 13 }}>{s.customer}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{s.items.length}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: text }}>{fmt(s.total)}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: "#16a34a" }}>{fmt(s.paid)}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{s.method}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{s.user}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span className="badge" style={{
                      background: s.status === "Paid" ? "#dcfce7" : s.status === "Unpaid" ? "#fee2e2" : "#fef3c7",
                      color: s.status === "Paid" ? "#15803d" : s.status === "Unpaid" ? "#dc2626" : "#d97706"
                    }}>{s.status}</span>
                  </td>
                  <td style={{ padding: "11px 14px", display: "flex", gap: 6 }}>
                    <button className="btn-outline" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => setSelected(s)}>View</button>
                    <button className="btn-danger" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => del(s.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: card, borderRadius: 16, padding: 28, maxWidth: 440, width: "100%" }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: text, marginBottom: 4 }}>{selected.id}</div>
            <div style={{ color: muted, fontSize: 13, marginBottom: 16 }}>{selected.date} • {selected.customer}</div>
            {selected.items.map((i, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${border}40` }}>
                <span style={{ color: text, fontSize: 14 }}>{i.name} × {i.qty}</span>
                <span style={{ fontWeight: 600, color: "#16a34a" }}>{fmt(i.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${border}` }}>
              <span style={{ fontWeight: 700, color: text }}>Total</span>
              <span style={{ fontWeight: 800, color: "#16a34a", fontSize: 18 }}>{fmt(selected.total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ color: muted, fontSize: 13 }}>Paid</span>
              <span style={{ fontWeight: 600, color: text }}>{fmt(selected.paid)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ color: muted, fontSize: 13 }}>Balance</span>
              <span style={{ fontWeight: 600, color: selected.total - selected.paid > 0 ? "#dc2626" : "#16a34a" }}>{fmt(selected.total - selected.paid)}</span>
            </div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 20 }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Debts ────────────────────────────────────────────────────────────────────
function Debts({ C, customers, setCustomers, sales, setSales, toast }) {
  const { card, border, text, muted } = C;
  const [payModal, setPayModal] = useState(null);
  const [payAmt, setPayAmt] = useState("");

  const debtors = customers.filter(c => c.debt > 0);
  const totalDebt = customers.reduce((a, c) => a + c.debt, 0);

  const recordPayment = () => {
    const amt = parseFloat(payAmt);
    if (!amt || amt <= 0) { toast("Enter valid amount", "error"); return; }
    if (amt > payModal.debt) { toast("Amount exceeds debt", "error"); return; }
    setCustomers(prev => prev.map(c => c.id === payModal.id ? { ...c, debt: parseFloat((c.debt - amt).toFixed(2)) } : c));
    toast(`Payment of ${fmt(amt)} recorded for ${payModal.name}`);
    setPayModal(null); setPayAmt("");
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Outstanding Debt", value: fmt(totalDebt), icon: "💳", bg: "#fee2e2", c: "#dc2626" },
          { label: "Debtors Count", value: debtors.length, icon: "👥", bg: "#fef3c7", c: "#d97706" },
          { label: "Total Customers", value: customers.length, icon: "👤", bg: "#dcfce7", c: "#16a34a" },
        ].map(s => (
          <div key={s.label} className="card" style={{ background: card, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: text }}>{s.value}</div></div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: card, border: `1px solid ${border}` }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 14 }}>💳 Outstanding Debts</div>
        {debtors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: muted }}><div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>No outstanding debts!</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}` }}>
                  {["Customer", "Phone", "Debt Amount", "Action"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {debtors.map(c => (
                  <tr key={c.id} className="table-row" style={{ borderBottom: `1px solid ${border}40` }}>
                    <td style={{ padding: "11px 12px", fontWeight: 600, color: text }}>{c.name}</td>
                    <td style={{ padding: "11px 12px", fontSize: 13, color: muted }}>{c.phone}</td>
                    <td style={{ padding: "11px 12px", fontWeight: 700, fontSize: 16, color: "#dc2626" }}>{fmt(c.debt)}</td>
                    <td style={{ padding: "11px 12px" }}>
                      <button className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={() => { setPayModal(c); setPayAmt("") }}>Record Payment</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {payModal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: card, borderRadius: 16, padding: 28, maxWidth: 380, width: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: text, marginBottom: 4 }}>Record Payment</div>
            <div style={{ color: muted, fontSize: 14, marginBottom: 16 }}>{payModal.name} — Debt: <strong style={{ color: "#dc2626" }}>{fmt(payModal.debt)}</strong></div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Amount to Pay ($)</label>
              <input className="input" type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)}
                placeholder="0.00" style={{ border: `1px solid ${border}`, background: C.bg, color: text, borderRadius: 8 }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={recordPayment}>Confirm Payment</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setPayModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Expenses ─────────────────────────────────────────────────────────────────
function Expenses({ C, expenses, setExpenses, toast, currentUser }) {
  const { card, border, text, muted } = C;
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ category: "Utilities", description: "", amount: 0 });

  const save = () => {
    if (!form.description || !form.amount) { toast("Fill all fields", "error"); return; }
    setExpenses(prev => [...prev, { ...form, id: Date.now(), date: today(), amount: parseFloat(form.amount), user: currentUser?.name }]);
    toast("Expense recorded"); setModal(false);
    setForm({ category: "Utilities", description: "", amount: 0 });
  };

  const total = expenses.reduce((a, e) => a + e.amount, 0);
  const byCategory = expenses.reduce((a, e) => ({ ...a, [e.category]: (a[e.category] || 0) + e.amount }), {});

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: text }}>Total Expenses</div>
          <div style={{ fontWeight: 800, fontSize: 28, color: "#dc2626" }}>{fmt(total)}</div>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>+ Add Expense</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
        {Object.entries(byCategory).map(([cat, amt]) => (
          <div key={cat} className="card" style={{ background: card, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 12, color: muted, marginBottom: 4 }}>{cat}</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#dc2626" }}>{fmt(amt)}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: card, border: `1px solid ${border}`, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.dark ? "#0d2317" : "#f0fdf4" }}>
                {["Date", "Category", "Description", "Amount", "Recorded By"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="table-row" style={{ borderBottom: `1px solid ${border}40` }}>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{e.date}</td>
                  <td style={{ padding: "11px 14px" }}><span className="badge" style={{ background: "#fee2e2", color: "#dc2626" }}>{e.category}</span></td>
                  <td style={{ padding: "11px 14px", color: text, fontSize: 14 }}>{e.description}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: "#dc2626", fontSize: 15 }}>{fmt(e.amount)}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: muted }}>{e.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: card, borderRadius: 16, padding: 28, maxWidth: 420, width: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: text, marginBottom: 18 }}>Add Expense</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Category</label>
              <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                style={{ border: `1px solid ${border}`, background: C.bg, color: text, borderRadius: 8 }}>
                {["Utilities", "Staff", "Supplies", "Rent", "Equipment", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Description</label>
              <input className="input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                style={{ border: `1px solid ${border}`, background: C.bg, color: text, borderRadius: 8 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 4 }}>Amount ($)</label>
              <input className="input" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                style={{ border: `1px solid ${border}`, background: C.bg, color: text, borderRadius: 8 }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={save}>Save</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function Reports({ C, sales, expenses, medicines, customers }) {
  const { card, border, text, muted } = C;
  const [period, setPeriod] = useState("week");

  const totalRevenue = sales.reduce((a, s) => a + s.paid, 0);
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const totalCost = sales.reduce((a, s) => a + s.items.reduce((b, i) => {
    const m = medicines.find(med => med.name === i.name); return b + (m ? m.buyPrice * i.qty : 0);
  }, 0), 0);
  const profit = totalRevenue - totalCost - totalExpenses;

  const unpaidSales = sales.filter(s => s.status !== "Paid").reduce((a, s) => a + s.total - s.paid, 0);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, color: text }}>📈 Financial Reports</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["week", "month", "year"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "7px 16px", borderRadius: 8, border: `1px solid ${border}`, fontSize: 13, fontWeight: 600,
              background: period === p ? "#16a34a" : "transparent", color: period === p ? "#fff" : muted
            }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Revenue", value: fmt(totalRevenue), icon: "💰", bg: "#dcfce7", c: "#16a34a" },
          { label: "Total Cost", value: fmt(totalCost), icon: "🏷️", bg: "#e0f2fe", c: "#0284c7" },
          { label: "Total Expenses", value: fmt(totalExpenses), icon: "💸", bg: "#fee2e2", c: "#dc2626" },
          { label: "Net Profit", value: fmt(profit), icon: "📊", bg: profit >= 0 ? "#dcfce7" : "#fee2e2", c: profit >= 0 ? "#16a34a" : "#dc2626" },
          { label: "Unpaid Invoices", value: fmt(unpaidSales), icon: "⚠️", bg: "#fef3c7", c: "#d97706" },
        ].map(s => (
          <div key={s.label} className="card" style={{ background: card, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.value}</div></div>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card" style={{ background: card, border: `1px solid ${border}` }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 14 }}>📊 Revenue Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={border} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: muted }} />
              <YAxis tick={{ fontSize: 12, fill: muted }} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, color: text }} />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={{ r: 4, fill: "#16a34a" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ background: card, border: `1px solid ${border}` }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 14 }}>🧾 P&L Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Revenue", value: totalRevenue, color: "#16a34a" },
              { label: "Cost of Goods", value: -totalCost, color: "#dc2626" },
              { label: "Expenses", value: -totalExpenses, color: "#f59e0b" },
              { label: "Net Profit", value: profit, color: profit >= 0 ? "#16a34a" : "#dc2626", bold: true },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: r.bold ? `2px solid ${border}` : `1px solid ${border}40` }}>
                <span style={{ color: r.bold ? text : muted, fontWeight: r.bold ? 700 : 400, fontSize: r.bold ? 15 : 13 }}>{r.label}</span>
                <span style={{ fontWeight: r.bold ? 800 : 600, fontSize: r.bold ? 18 : 14, color: r.color }}>{r.value >= 0 ? fmt(r.value) : "-" + fmt(-r.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ background: card, border: `1px solid ${border}`, marginTop: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 14 }}>🏆 Top Selling Medicines</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Rank", "Medicine", "Category", "Units Sold", "Revenue"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topMeds.map((m, i) => (
                <tr key={m.name} className="table-row" style={{ borderBottom: `1px solid ${border}40` }}>
                  <td style={{ padding: "10px 12px" }}><span style={{ fontWeight: 700, color: ["#f59e0b", "#94a3b8", "#b45309"][i] || muted, fontSize: 16 }}>{["🥇", "🥈", "🥉"][i] || i + 1}</span></td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: text }}>{m.name}</td>
                  <td style={{ padding: "10px 12px" }}><span className="badge" style={{ background: "#dcfce7", color: "#15803d", fontSize: 11 }}>Analgesics</span></td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: text }}>{m.sales}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "#16a34a" }}>{fmt(m.sales * 1.8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────
function Users({ C, users, setUsers, toast, currentUser }) {
  const { card, border, text, muted } = C;

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Pharmacist"
  });

  const save = () => {
    if (!form.name || !form.email || !form.password) {
      toast("Fill all fields", "error");
      return;
    }

    if (editing) {
      setUsers(prev =>
        prev.map(u =>
          u.id === editing
            ? {
              ...u,
              ...form,
              avatar: form.name
                .split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            }
            : u
        )
      );

      toast("User updated");
    } else {
      setUsers(prev => [
        ...prev,
        {
          ...form,
          id: Date.now(),
          avatar: form.name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          active: true
        }
      ]);

      toast("User created");
    }

    setModal(false);
    setEditing(null);

    setForm({
      name: "",
      email: "",
      password: "",
      role: "Pharmacist"
    });
  };

  const del = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast("User deleted");
  };

  const editUser = (u) => {
    setEditing(u.id);

    setForm({
      name: u.name,
      email: u.email,
      password: u.password || "",
      role: u.role
    });

    setModal(true);
  };

  const toggle = (id) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id
          ? { ...u, active: !u.active }
          : u
      )
    );

    toast("User status updated");
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
      }}>
        <h2 style={{
          fontWeight: 800,
          fontSize: 18,
          color: text
        }}>
          👤 User Management
        </h2>

        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);

            setForm({
              name: "",
              email: "",
              password: "",
              role: "Pharmacist"
            });

            setModal(true);
          }}
        >
          + Add User
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
        gap: 16
      }}>
        {users.map(u => (
          <div
            key={u.id}
            className="card"
            style={{
              background: card,
              border: `1px solid ${border}`,
              opacity: u.active ? 1 : 0.6
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14
            }}>
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 50,
                background: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff"
              }}>
                {u.avatar}
              </div>

              <div>
                <div style={{
                  fontWeight: 700,
                  color: text,
                  fontSize: 15
                }}>
                  {u.name}
                </div>

                <div style={{
                  fontSize: 13,
                  color: muted
                }}>
                  {u.email}
                </div>
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 12,
              borderTop: `1px solid ${border}`
            }}>
              <span
                className="badge"
                style={{
                  background:
                    u.role === "Admin"
                      ? "#fee2e2"
                      : u.role === "Pharmacist"
                        ? "#dcfce7"
                        : "#e0f2fe",

                  color:
                    u.role === "Admin"
                      ? "#dc2626"
                      : u.role === "Pharmacist"
                        ? "#16a34a"
                        : "#0284c7"
                }}
              >
                {u.role}
              </span>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span style={{
                  fontSize: 12,
                  color: u.active ? "#16a34a" : "#dc2626",
                  fontWeight: 600
                }}>
                  {u.active ? "Active" : "Inactive"}
                </span>

                {u.id !== currentUser?.id && (
                  <button
                    onClick={() => toggle(u.id)}
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 10,
                      border: "none",
                      background: u.active ? "#16a34a" : "#d1d5db",
                      cursor: "pointer",
                      position: "relative"
                    }}
                  >
                    <span style={{
                      position: "absolute",
                      top: 2,
                      left: u.active ? 16 : 2,
                      width: 16,
                      height: 16,
                      borderRadius: 50,
                      background: "#fff"
                    }} />
                  </button>
                )}
              </div>
            </div>

            <div style={{
              display: "flex",
              gap: 10,
              marginTop: 16
            }}>
              <button
                className="btn-outline"
                style={{ flex: 1 }}
                onClick={() => editUser(u)}
              >
                Edit
              </button>

              <button
                className="btn-danger"
                style={{ flex: 1 }}
                onClick={() => del(u.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "#00000088",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20
        }}>
          <div style={{
            background: card,
            borderRadius: 16,
            padding: 28,
            maxWidth: 380,
            width: "100%"
          }}>
            <div style={{
              fontWeight: 700,
              fontSize: 16,
              color: text,
              marginBottom: 18
            }}>
              {editing ? "Edit User" : "Add New User"}
            </div>

            {[
              ["Full Name", "name"],
              ["Email", "email"],
              ["Password", "password"]
            ].map(([l, k]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label style={{
                  fontSize: 12,
                  color: muted,
                  display: "block",
                  marginBottom: 4
                }}>
                  {l}
                </label>

                <input
                  className="input"
                  type={k === "password" ? "password" : "text"}
                  value={form[k]}
                  onChange={e =>
                    setForm(p => ({
                      ...p,
                      [k]: e.target.value
                    }))
                  }
                  style={{
                    border: `1px solid ${border}`,
                    background: C.bg,
                    color: text,
                    borderRadius: 8
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 12,
                color: muted,
                display: "block",
                marginBottom: 4
              }}>
                Role
              </label>

              <select
                className="input"
                value={form.role}
                onChange={e =>
                  setForm(p => ({
                    ...p,
                    role: e.target.value
                  }))
                }
                style={{
                  border: `1px solid ${border}`,
                  background: C.bg,
                  color: text,
                  borderRadius: 8
                }}
              >
                {["Admin", "Pharmacist", "Cashier"].map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={save}
              >
                {editing ? "Update User" : "Create User"}
              </button>

              <button
                className="btn-outline"
                style={{ flex: 1 }}
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function Settings({
  C,
  dark,
  setDark,
  currentUser,
  toast,
  users,
  setUsers
}) {

  const { card, border, text, muted } = C;

  const [lang, setLang] = useState("English");
  const [branch, setBranch] = useState("Main Branch - Mogadishu");

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const saveSettings = () => {

    const updatedUsers = users.map(u =>
      u.id === currentUser.id
        ? {
            ...u,
            name,
            email,
            password: newPassword || u.password
          }
        : u
    );

    setUsers(updatedUsers);

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    toast("Settings saved successfully");
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 680 }}>

      <h2 style={{
        fontWeight: 800,
        fontSize: 18,
        color: text,
        marginBottom: 24
      }}>
        ⚙️ Settings
      </h2>

      {[{
        title: "🏥 Pharmacy Info",
        items: [
          {
            label: "Pharmacy Name",
            value: "ANFAC Pharmacy",
            type: "text"
          },
          {
            label: "Address",
            value: "Mogadishu, Somalia",
            type: "text"
          },
          {
            label: "Phone",
            value: "+252612345678",
            type: "text"
          },
          {
            label: "Branch",
            value: branch,
            type: "select",
            opts: [
              "Main Branch - Mogadishu",
              "Branch 2 - Hodan",
              "Branch 3 - Wadajir"
            ],
            onChange: setBranch
          },
        ]

      }, {

        title: "👤 Account",

        items: [
          {
            label: "Name",
            value: name,
            type: "text",
            onChange: setName
          },

          {
            label: "Email",
            value: email,
            type: "text",
            onChange: setEmail
          },

          {
            label: "Role",
            value: currentUser?.role,
            type: "text",
            readOnly: true
          },

          {
            label: "Current Password",
            value: currentPassword,
            type: "password",
            onChange: setCurrentPassword
          },

          {
            label: "New Password",
            value: newPassword,
            type: "password",
            onChange: setNewPassword
          },
        ]

      }, {

        title: "🎨 Appearance",

        items: [
          {
            label: "Language",
            value: lang,
            type: "select",
            opts: ["English", "Somali"],
            onChange: setLang
          },

          {
            label: "Dark Mode",
            value: dark,
            type: "toggle",
            onChange: setDark
          },
        ]

      }].map(section => (

        <div
          key={section.title}
          className="card"
          style={{
            background: card,
            border: `1px solid ${border}`,
            marginBottom: 16
          }}
        >

          <div style={{
            fontWeight: 700,
            fontSize: 15,
            color: text,
            marginBottom: 16
          }}>
            {section.title}
          </div>

          {section.items.map(item => (

            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: `1px solid ${border}40`
              }}
            >

              <label style={{
                fontSize: 14,
                color: muted,
                flex: 1
              }}>
                {item.label}
              </label>

              {item.type === "toggle" ? (

                <div
                  onClick={() => item.onChange(!item.value)}
                  style={{
                    width: 42,
                    height: 22,
                    borderRadius: 11,
                    background: item.value
                      ? "#16a34a"
                      : "#d1d5db",

                    cursor: "pointer",
                    position: "relative",
                    transition: "0.2s"
                  }}
                >
                  <span style={{
                    position: "absolute",
                    top: 3,
                    left: item.value ? 20 : 3,
                    width: 16,
                    height: 16,
                    borderRadius: 50,
                    background: "#fff",
                    transition: "0.2s"
                  }} />
                </div>

              ) : item.type === "select" ? (

                <select
                  value={item.value}
                  onChange={e =>
                    item.onChange(e.target.value)
                  }
                  className="input"
                  style={{
                    border: `1px solid ${border}`,
                    background: C.bg,
                    color: text,
                    borderRadius: 8,
                    maxWidth: 220,
                    width: "auto"
                  }}
                >
                  {item.opts.map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>

              ) : (

                <input
                  type={item.type || "text"}
                  value={item.value}
                  readOnly={item.readOnly}
                  onChange={e =>
                    item.onChange &&
                    item.onChange(e.target.value)
                  }
                  className="input"
                  style={{
                    border: `1px solid ${border}`,
                    background: C.bg,
                    color: text,
                    borderRadius: 8,
                    maxWidth: 220
                  }}
                />

              )}
            </div>

          ))}
        </div>

      ))}

      <button
        className="btn-primary"
        style={{
          padding: "11px 28px",
          fontSize: 15
        }}
        onClick={saveSettings}
      >
        Save Settings
      </button>

    </div>
  );
}