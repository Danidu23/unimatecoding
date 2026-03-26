import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Shield,
  PencilLine,
  Save,
  X,
  Camera,
  Bell,
  Lock,
  LogOut,
  Settings,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UtensilsCrossed,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppHeader from "../components/AppHeader";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html,body,#root{width:100%;max-width:100%;overflow-x:hidden}
  body{
    font-family:'DM Sans',system-ui,sans-serif;
    background:
      radial-gradient(circle at 15% 20%, rgba(245,166,35,.10), transparent 28%),
      radial-gradient(circle at 85% 15%, rgba(96,165,250,.10), transparent 26%),
      linear-gradient(180deg,#07091a 0%,#090d22 35%,#0a1028 100%);
    color:#fff;
  }
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#07091a}
  ::-webkit-scrollbar-thumb{background:#F5A623;border-radius:3px}
  a{text-decoration:none}
  button{font-family:inherit;cursor:pointer;border:none}

  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  @keyframes pulseRing{0%{transform:scale(.9);opacity:.55}70%,100%{transform:scale(1.4);opacity:0}}
  @keyframes popIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}

  .page-shell{min-height:100vh;padding:86px 24px 24px}

  .layout{
    width:min(1180px,100%);margin:0 auto;display:grid;grid-template-columns:340px 1fr;gap:22px
  }

  .card{
    background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.03));
    border:1px solid rgba(255,255,255,.08);
    border-radius:28px;
    backdrop-filter:blur(18px);
    box-shadow:0 18px 45px rgba(0,0,0,.28);
  }

  .profile-side{padding:24px;position:sticky;top:88px;height:fit-content;overflow:hidden}
  .profile-side::before{
    content:'';position:absolute;inset:0;
    background:
      radial-gradient(circle at 50% 0%,rgba(245,166,35,.10),transparent 42%),
      linear-gradient(180deg,rgba(255,255,255,.02),transparent 30%);
    pointer-events:none
  }
  .avatar-wrap{display:flex;justify-content:center;position:relative;margin-bottom:18px}
  .avatar-ring{
    position:absolute;inset:auto;width:124px;height:124px;border-radius:50%;
    border:1px solid rgba(245,166,35,.24);animation:pulseRing 3.2s infinite
  }
  .avatar{
    width:112px;height:112px;border-radius:50%;
    background:linear-gradient(135deg,#1f2c6b,#10182f);
    border:2px solid rgba(255,255,255,.1);
    display:flex;align-items:center;justify-content:center;
    font-family:'Manrope',sans-serif;font-size:34px;font-weight:900;color:#F5A623;
    position:relative;overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,.35)
  }
  .avatar-edit{
    position:absolute;right:calc(50% - 56px);bottom:0;
    width:34px;height:34px;border-radius:50%;
    border:1.5px solid rgba(255,255,255,.12);background:#F5A623;color:#07091a;
    display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(245,166,35,.35)
  }

  .side-name{
    font-family:'Manrope',sans-serif;font-size:28px;font-weight:900;letter-spacing:-.8px;color:#fff;text-align:center
  }
  .side-sub{
    margin-top:6px;text-align:center;font-size:14px;color:rgba(255,255,255,.48);line-height:1.65
  }
  .pill{
    display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;
    background:rgba(245,166,35,.10);border:1px solid rgba(245,166,35,.2);
    font-size:11px;font-weight:800;font-family:'Manrope',sans-serif;color:#F5A623;letter-spacing:.45px;text-transform:uppercase
  }
  .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}
  .stat{
    padding:14px 14px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)
  }
  .stat .label{font-size:11px;color:rgba(255,255,255,.42);text-transform:uppercase;font-weight:700;letter-spacing:.5px}
  .stat .value{margin-top:6px;font-family:'Manrope',sans-serif;font-weight:800;font-size:18px;color:#fff}

  .quick-actions{margin-top:20px;display:grid;gap:10px}
  .qa-btn{
    width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;
    padding:13px 14px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
    color:#fff;text-decoration:none;font-size:14px;font-weight:700;font-family:'Manrope',sans-serif;transition:.22s;cursor:pointer
  }
  .qa-btn:hover{background:rgba(245,166,35,.07);border-color:rgba(245,166,35,.24);transform:translateY(-1px)}
  .qa-left{display:flex;align-items:center;gap:10px}
  .qa-btn.danger:hover{background:rgba(239,68,68,.07);border-color:rgba(239,68,68,.24);color:#f87171}

  .main{padding:22px}
  .hero{
    position:relative;overflow:hidden;padding:24px 24px 22px;margin-bottom:20px;border-radius:24px;
    background:
      radial-gradient(circle at 0% 0%,rgba(245,166,35,.14),transparent 34%),
      linear-gradient(135deg,rgba(17,24,39,.75),rgba(12,17,48,.92));
    border:1px solid rgba(255,255,255,.07)
  }
  .hero::after{
    content:'';position:absolute;inset:0;
    background:linear-gradient(120deg,transparent 20%,rgba(255,255,255,.03) 50%,transparent 80%);
    background-size:200% auto;animation:shimmer 5.5s linear infinite;pointer-events:none
  }
  .hero-title{
    position:relative;z-index:1;
    font-family:'Manrope',sans-serif;font-size:clamp(24px,3vw,34px);font-weight:900;letter-spacing:-1px;line-height:1.08
  }
  .hero-title .accent{
    background-image:linear-gradient(90deg,#F5A623,#ffd166,#F5A623);background-size:200% auto;
    -webkit-background-clip:text;background-clip:text;color:transparent;animation:shimmer 3.5s linear infinite
  }
  .hero-sub{position:relative;z-index:1;margin-top:10px;font-size:14px;line-height:1.75;color:rgba(255,255,255,.55);max-width:680px}

  .tabs{
    display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px
  }
  .tab-btn{
    border:none;cursor:pointer;padding:10px 16px;border-radius:14px;
    font-size:13px;font-weight:800;font-family:'Manrope',sans-serif;letter-spacing:.2px;
    background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.07);
    transition:.22s
  }
  .tab-btn.active{
    background:rgba(245,166,35,.12);color:#F5A623;border-color:rgba(245,166,35,.22);box-shadow:0 8px 20px rgba(245,166,35,.12)
  }

  .grid-2{display:grid;grid-template-columns:1.18fr .82fr;gap:18px}
  .section-card{padding:20px;border-radius:22px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)}
  .section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
  .section-title{
    display:flex;align-items:center;gap:10px;font-family:'Manrope',sans-serif;font-weight:900;font-size:18px;letter-spacing:-.3px
  }

  .field-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .field-col-full{grid-column:1 / -1}
  .label{
    display:flex;align-items:center;gap:6px;margin-bottom:7px;font-size:11px;
    color:rgba(255,255,255,.46);font-family:'Manrope',sans-serif;font-weight:800;letter-spacing:.55px;text-transform:uppercase
  }
  .input-wrap{position:relative}
  .input-icon{
    position:absolute;left:13px;top:50%;transform:translateY(-50%);display:flex;color:rgba(255,255,255,.34);pointer-events:none
  }
  .input{
    width:100%;padding:12px 14px 12px 40px;border-radius:14px;background:rgba(255,255,255,.045);
    border:1.5px solid rgba(255,255,255,.08);color:#fff;font-size:14px;outline:none;transition:.2s
  }
  .input:focus{border-color:rgba(245,166,35,.42);background:rgba(245,166,35,.04)}
  .readonly{
    width:100%;padding:12px 14px 12px 40px;border-radius:14px;background:rgba(255,255,255,.03);
    border:1.5px solid rgba(255,255,255,.06);color:rgba(255,255,255,.72);font-size:14px
  }

  .btn-row{display:flex;gap:10px;flex-wrap:wrap}
  .btn{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    border:none;cursor:pointer;padding:12px 16px;border-radius:14px;
    font-size:13px;font-weight:800;font-family:'Manrope',sans-serif;transition:.22s
  }
  .btn-primary{
    background:#F5A623;color:#07091a;box-shadow:0 8px 22px rgba(245,166,35,.28)
  }
  .btn-ghost{
    background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.08)
  }

  .badge-success{
    display:inline-flex;align-items:center;gap:7px;background:rgba(34,197,94,.12);color:#4ade80;border:1px solid rgba(34,197,94,.22);
    border-radius:999px;padding:7px 12px;font-size:12px;font-weight:800;font-family:'Manrope',sans-serif
  }

  .list{display:grid;gap:12px}
  .activity-item{
    display:flex;align-items:flex-start;gap:12px;padding:14px;border-radius:18px;
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)
  }

  .empty-state{
    padding:18px;border-radius:18px;background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.08);
    color:rgba(255,255,255,.48);font-size:14px
  }

  .setting-row{
    display:flex;align-items:center;justify-content:space-between;gap:14px;
    padding:14px 0;border-bottom:1px solid rgba(255,255,255,.06)
  }
  .setting-row:last-child{border-bottom:none}

  .switch{
    width:48px;height:28px;border-radius:999px;background:rgba(255,255,255,.12);
    position:relative;border:none;cursor:pointer;transition:.22s
  }
  .switch.active{background:rgba(245,166,35,.24)}
  .switch-thumb{
    position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;
    background:#fff;transition:.22s
  }
  .switch.active .switch-thumb{left:23px;background:#F5A623}

  .overlay{
    position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;padding:20px;z-index:999;animation:fadeIn .22s ease
  }
  .modal{
    width:min(460px,100%);background:#0d1130;border:1px solid rgba(255,255,255,.08);
    border-radius:26px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,.42);animation:popIn .24s ease
  }

  .toggle-eye{
    position:absolute;right:13px;top:50%;transform:translateY(-50%);
    background:none;border:none;color:rgba(255,255,255,.35);
    cursor:pointer;display:flex;padding:4px;transition:color .2s;
  }

  @media (max-width:980px){
    .layout{grid-template-columns:1fr}
    .profile-side{position:relative;top:0}
    .grid-2{grid-template-columns:1fr}
  }
  @media (max-width:640px){
    .page-shell{padding:82px 16px 16px}
    .main,.profile-side{padding:18px}
    .field-grid{grid-template-columns:1fr}
    .hero{padding:20px}
  }
`;

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [showPwModal, setShowPwModal] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const [notif, setNotif] = useState({
    orderUpdates: true,
    promotions: false,
    securityAlerts: true,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [orders, setOrders] = useState([]);

  const resetPasswordModal = () => {
  setPw({ current: "", next: "", confirm: "" });
  setShowPw({ current: false, next: false, confirm: false });
  setPwError("");
  setPwSuccess("");
};

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoadingProfile(true);

        const [profileRes, ordersRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/users/me/orders"),
        ]);

        const profile = profileRes.data.data;

        setForm({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
        });

        setOrders(ordersRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, []);

  const initials = useMemo(
    () =>
      (form.name || "U")
        .split(" ")
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [form.name]
  );

  const pendingCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "pending").length,
    [orders]
  );

  const completedCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "completed").length,
    [orders]
  );

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    try {
      const res = await api.put("/users/me", {
        name: form.name,
        phone: form.phone,
      });

      setForm((prev) => ({
        ...prev,
        name: res.data.data.name,
        phone: res.data.data.phone,
        email: res.data.data.email,
      }));

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleChangePassword = async () => {
  setPwError("");
  setPwSuccess("");

  if (!pw.current || !pw.next || !pw.confirm) {
    setPwError("Please fill all password fields.");
    return;
  }

  if (pw.next.length < 8) {
    setPwError("New password must be at least 8 characters.");
    return;
  }

  if (pw.next !== pw.confirm) {
    setPwError("New password and confirm password do not match.");
    return;
  }

  if (pw.current === pw.next) {
    setPwError("New password must be different from current password.");
    return;
  }

  try {
    setPwLoading(true);

    const res = await api.put("/auth/change-password", {
      currentPassword: pw.current,
      newPassword: pw.next,
    });

    setPwSuccess(res.data.message || "Password changed successfully.");

    setTimeout(() => {
      resetPasswordModal();
      setShowPwModal(false);
    }, 1200);
  } catch (err) {
    setPwError(err.response?.data?.message || "Failed to change password.");
  } finally {
    setPwLoading(false);
  }
};

  const toggleNotif = (k) => setNotif((p) => ({ ...p, [k]: !p[k] }));

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  if (loadingProfile) {
    return (
      <>
        <style>{CSS}</style>
        <AppHeader />
        <div style={{ minHeight: "100vh", paddingTop: "98px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
          Loading profile...
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <AppHeader />

      <div className="page-shell">
        <div className="layout">
          <aside className="card profile-side">
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <span className="pill">
                  <Shield size={12} />
                  {user?.role === "staff" ? "Staff Account" : "Student Account"}
                </span>
              </div>

              <div className="avatar-wrap">
                <div className="avatar-ring" />
                <div className="avatar">{initials}</div>
                <button className="avatar-edit" type="button" title="Change avatar">
                  <Camera size={15} />
                </button>
              </div>

              <h2 className="side-name">{form.name || "User"}</h2>
              <p className="side-sub">
                {form.email || "-"}
                <br />
                {user?.role === "staff" ? "Staff" : "Student"} • UniMate Member
              </p>

              <div className="stats-grid">
                <div className="stat">
                  <div className="label">Pending Orders</div>
                  <div className="value">{pendingCount}</div>
                </div>
                <div className="stat">
                  <div className="label">Completed</div>
                  <div className="value">{completedCount}</div>
                </div>
              </div>

              <div className="quick-actions">
                <button className="qa-btn" type="button" onClick={() => setEditing(true)}>
                  <span className="qa-left">
                    <PencilLine size={16} color="#F5A623" />
                    Edit Profile
                  </span>
                  <span style={{ transform: "rotate(180deg)" }}>➜</span>
                </button>

                <button
                  className="qa-btn"
                  type="button"
                  onClick={() => {
                    resetPasswordModal();
                    setShowPwModal(true);
                  }}
                >
                  <span className="qa-left">
                    <Lock size={16} color="#F5A623" />
                    Change Password
                  </span>
                  <span style={{ transform: "rotate(180deg)" }}>➜</span>
                </button>

                <button className="qa-btn danger" type="button" onClick={doLogout}>
                  <span className="qa-left">
                    <LogOut size={16} color="#f87171" />
                    Sign Out
                  </span>
                  <span style={{ transform: "rotate(180deg)" }}>➜</span>
                </button>
              </div>
            </div>
          </aside>

          <main className="card main">
            <section className="hero">
              <h1 className="hero-title">
                Manage your <span className="accent">profile</span>, orders, and settings
              </h1>
              <p className="hero-sub">
                Keep your UniMate profile updated, review your recent orders, and manage how you receive notifications.
              </p>
            </section>

            <div className="tabs">
              {[
                ["overview", "Overview"],
                ["orders", "My Orders"],
                ["settings", "Settings"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`tab-btn ${activeTab === key ? "active" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="grid-2">
                <section className="section-card">
                  <div className="section-head">
                    <div className="section-title">
                      <User size={18} color="#F5A623" />
                      Profile Information
                    </div>

                    <div className="btn-row">
                      {!editing ? (
                        <button className="btn btn-ghost" type="button" onClick={() => setEditing(true)}>
                          <PencilLine size={15} /> Edit
                        </button>
                      ) : (
                        <>
                          <button className="btn btn-primary" type="button" onClick={handleSave}>
                            <Save size={15} /> Save Changes
                          </button>
                          <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>
                            <X size={15} /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {saved && (
                    <div className="badge-success" style={{ marginBottom: 14 }}>
                      <CheckCircle2 size={14} />
                      Profile updated successfully
                    </div>
                  )}

                  <div className="field-grid">
                    <div className="field-col-full">
                      <label className="label"><User size={12} /> Full Name</label>
                      <div className="input-wrap">
                        <span className="input-icon"><User size={15} /></span>
                        {editing ? (
                          <input
                            className="input"
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="Enter full name"
                          />
                        ) : (
                          <div className="readonly">{form.name || "-"}</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="label"><Mail size={12} /> Email Address</label>
                      <div className="input-wrap">
                        <span className="input-icon"><Mail size={15} /></span>
                        <div className="readonly">{form.email || "-"}</div>
                      </div>
                    </div>

                    <div>
                      <label className="label"><Phone size={12} /> Phone Number</label>
                      <div className="input-wrap">
                        <span className="input-icon"><Phone size={15} /></span>
                        {editing ? (
                          <input
                            className="input"
                            value={form.phone}
                            onChange={(e) => setField("phone", e.target.value)}
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <div className="readonly">{form.phone || "-"}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="section-card">
                  <div className="section-head">
                    <div className="section-title">
                      <Shield size={18} color="#F5A623" />
                      Account Details
                    </div>
                  </div>

                  {[
                    ["Role", user?.role === "staff" ? "Staff" : "Student"],
                    ["Email", form.email || "-"],
                    ["Phone", form.phone || "-"],
                  ].map(([l, v], i, arr) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "11px 0",
                        borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,.45)" }}>{l}</span>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "rgba(255,255,255,.82)", fontFamily: "Manrope,sans-serif" }}>
                        {v}
                      </span>
                    </div>
                  ))}
                </section>
              </div>
            )}

            {activeTab === "orders" && (
              <section className="section-card">
                <div className="section-head">
                  <div className="section-title">
                    <UtensilsCrossed size={18} color="#F5A623" />
                    My Orders
                  </div>
                </div>

                <div className="list">
                  {orders.length === 0 ? (
                    <div className="empty-state">No orders yet.</div>
                  ) : (
                    orders.map((order, i) => (
                      <div key={order._id || i} className="activity-item" style={{ animation: `fadeUp .4s ease ${i * 0.07}s both` }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "rgba(245,166,35,.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            color: "#F5A623",
                          }}
                        >
                          <UtensilsCrossed size={15} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "14px", fontWeight: 800, color: "#fff", fontFamily: "Manrope,sans-serif", marginBottom: "3px" }}>
                            {order.items?.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                          </p>

                          <p style={{ fontSize: "12px", color: "rgba(255,255,255,.45)" }}>
                            {order.paymentMethod} · {order.paymentStatus}
                          </p>

                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,.3)", marginTop: "2px" }}>
                            Pickup: {new Date(order.pickupDate).toLocaleDateString()}
                          </p>

                          {order.cancellationReason ? (
                            <p style={{ fontSize: "11px", color: "#f87171", marginTop: "6px" }}>
                              Reason: {order.cancellationReason}
                            </p>
                          ) : null}
                        </div>

                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            fontFamily: "Manrope,sans-serif",
                            padding: "4px 10px",
                            borderRadius: "100px",
                            flexShrink: 0,
                            background:
                              order.orderStatus === "completed"
                                ? "rgba(34,197,94,.12)"
                                : order.orderStatus === "pending"
                                ? "rgba(245,166,35,.12)"
                                : order.orderStatus === "cancelled"
                                ? "rgba(239,68,68,.12)"
                                : "rgba(96,165,250,.12)",
                            color:
                              order.orderStatus === "completed"
                                ? "#4ade80"
                                : order.orderStatus === "pending"
                                ? "#F5A623"
                                : order.orderStatus === "cancelled"
                                ? "#f87171"
                                : "#60a5fa",
                          }}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeTab === "settings" && (
              <div className="grid-2">
                <section className="section-card">
                  <div className="section-head">
                    <div className="section-title">
                      <Bell size={18} color="#F5A623" />
                      Notifications
                    </div>
                  </div>

                  {[
                    ["orderUpdates", "Order Updates", "Get notified about order status changes."],
                    ["promotions", "Promotions", "Receive special offers and canteen promotions."],
                    ["securityAlerts", "Security Alerts", "Important account and login notices."],
                  ].map(([key, title, desc]) => (
                    <div key={key} className="setting-row">
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 800, fontFamily: "Manrope,sans-serif" }}>{title}</div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,.45)", marginTop: 4 }}>{desc}</div>
                      </div>

                      <button
                        type="button"
                        className={`switch ${notif[key] ? "active" : ""}`}
                        onClick={() => toggleNotif(key)}
                      >
                        <div className="switch-thumb" />
                      </button>
                    </div>
                  ))}
                </section>

                <section className="section-card">
                  <div className="section-head">
                    <div className="section-title">
                      <Settings size={18} color="#F5A623" />
                      Quick Actions
                    </div>
                  </div>

                  <div className="quick-actions" style={{ marginTop: 0 }}>
                    <button
                      className="qa-btn"
                      type="button"
                      onClick={() => {
                        resetPasswordModal();
                        setShowPwModal(true);
                      }}
                    >
                      <span className="qa-left">
                        <Lock size={16} color="#F5A623" />
                        Change Password
                      </span>
                      <span style={{ transform: "rotate(180deg)" }}>➜</span>
                    </button>

                    <button className="qa-btn danger" type="button" onClick={doLogout}>
                      <span className="qa-left">
                        <LogOut size={16} color="#f87171" />
                        Sign Out
                      </span>
                      <span style={{ transform: "rotate(180deg)" }}>➜</span>
                    </button>
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>

      {showPwModal && (
        <div className="overlay">
          <div className="modal">
            <div className="section-head" style={{ marginBottom: 18 }}>
              <div className="section-title">
                <Lock size={18} color="#F5A623" />
                Change Password
              </div>
              <button className="btn btn-ghost" type="button" onClick={() => {
                resetPasswordModal();
                setShowPwModal(false);
              }}>
                <X size={16} />
              </button>
            </div>
            
            {pwError && (
              <div
                style={{
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "rgba(239,68,68,.10)",
                  border: "1px solid rgba(239,68,68,.22)",
                  color: "#f87171",
                  fontSize: 13,
                }}
              >
                <AlertCircle size={15} />
                {pwError}
              </div>
            )}

            {pwSuccess && (
              <div
                style={{
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "rgba(34,197,94,.10)",
                  border: "1px solid rgba(34,197,94,.22)",
                  color: "#4ade80",
                  fontSize: 13,
                }}
              >
                <CheckCircle2 size={15} />
                {pwSuccess}
              </div>
            )}

            <div className="list">
              {[
                ["current", "Current Password"],
                ["next", "New Password"],
                ["confirm", "Confirm Password"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="label">
                    <Lock size={12} />
                    {label}
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <Lock size={15} />
                    </span>
                    <input
                      className="input"
                      type={showPw[key] ? "text" : "password"}
                      value={pw[key]}
                      onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={label}
                      style={{ paddingRight: 44 }}
                    />
                    <button
                      type="button"
                      className="toggle-eye"
                      onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))}
                    >
                      {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="btn-row" style={{ marginTop: 18, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" type="button" onClick={() => {
                resetPasswordModal();
                setShowPwModal(false);
              }}>
                Cancel
              </button>
              <button className="btn btn-primary" type="button" onClick={handleChangePassword} disabled={pwLoading}>
                {pwLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}