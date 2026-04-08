import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  RefreshCw,
  UtensilsCrossed,
  Eye,
} from "lucide-react";
import StaffLayout from "../components/StaffLayout";
import api from "../api/axios";

const CSS = `
  .staff-home-wrap{width:100%;margin:0}
  .staff-home-card{
    width:100%;
    background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.03));
    border:1px solid rgba(255,255,255,.08);
    border-radius:30px;
    backdrop-filter:blur(18px);
    box-shadow:0 20px 48px rgba(0,0,0,.30);
    padding:32px;
  }
  .staff-home-title{
    font-family:'Manrope',sans-serif;
    font-size:36px;
    font-weight:900;
    color:#fff;
    letter-spacing:-1px;
  }
  .staff-home-sub{
    margin-top:10px;
    font-size:14px;
    color:rgba(255,255,255,.58);
    line-height:1.75;
    max-width:720px;
  }
  .staff-home-topbar{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:16px;
    flex-wrap:wrap;
  }
  .staff-home-actions{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
  }
  .staff-home-btn{
    border:none;
    outline:none;
    cursor:pointer;
    border-radius:14px;
    padding:12px 16px;
    font-size:13px;
    font-weight:800;
    font-family:'Manrope',sans-serif;
    display:inline-flex;
    align-items:center;
    gap:8px;
    transition:all .2s ease;
    text-decoration:none;
  }
  .staff-home-btn.primary{
    background:linear-gradient(135deg,#F5A623,#ffbe55);
    color:#1a1408;
    box-shadow:0 12px 28px rgba(245,166,35,.22);
  }
  .staff-home-btn.secondary{
    background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.08);
    color:#fff;
  }
  .staff-home-btn:hover{
    transform:translateY(-1px);
  }
  .staff-home-section{
    margin-top:28px;
  }
  .staff-home-section-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    flex-wrap:wrap;
    margin-bottom:16px;
  }
  .staff-home-section-title{
    font-size:18px;
    font-weight:900;
    color:#fff;
    font-family:'Manrope',sans-serif;
    letter-spacing:-.4px;
  }
  .staff-home-section-sub{
    font-size:13px;
    color:rgba(255,255,255,.52);
    margin-top:4px;
    line-height:1.6;
  }
  .staff-attention-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:16px;
  }
  .staff-attention-card{
    padding:20px;
    border-radius:22px;
    background:linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.022));
    border:1px solid rgba(255,255,255,.07);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.03);
  }
  .staff-attention-card.clickable{
    cursor:pointer;
    transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease,background .2s ease;
  }
  .staff-attention-card.clickable:hover{
    transform:translateY(-2px);
    border-color:rgba(245,166,35,.18);
    box-shadow:0 16px 34px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.03);
  }
  .staff-attention-top{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
  }
  .staff-attention-label{
    font-size:12px;
    color:rgba(255,255,255,.48);
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.5px;
  }
  .staff-attention-value{
    margin-top:10px;
    font-size:28px;
    font-weight:900;
    color:#fff;
    font-family:'Manrope',sans-serif;
    letter-spacing:-.8px;
  }
  .staff-attention-sub{
    margin-top:6px;
    font-size:12px;
    color:rgba(255,255,255,.52);
    line-height:1.6;
  }
  .staff-home-split{
    display:grid;
    grid-template-columns:1.5fr 1fr;
    gap:18px;
    margin-top:24px;
  }
  .staff-panel{
    padding:22px;
    border-radius:26px;
    background:linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.02));
    border:1px solid rgba(255,255,255,.065);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.025);
  }
  .staff-recent-list{
    display:flex;
    flex-direction:column;
    gap:12px;
  }
  .staff-recent-row{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:16px;
    padding:18px;
    border-radius:20px;
    background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.022));
    border:1px solid rgba(255,255,255,.065);
    transition:all .2s ease;
  }
  .staff-recent-row:hover{
    transform:translateY(-1px);
    border-color:rgba(245,166,35,.16);
    box-shadow:0 12px 28px rgba(0,0,0,.18);
  }
  .staff-recent-id{
    font-size:12px;
    color:rgba(255,255,255,.42);
    font-weight:700;
    letter-spacing:.3px;
  }
  .staff-recent-name{
    margin-top:5px;
    font-size:16px;
    font-weight:900;
    color:#fff;
    font-family:'Manrope',sans-serif;
  }
  .staff-recent-meta{
    margin-top:7px;
    font-size:12px;
    color:rgba(255,255,255,.58);
    line-height:1.75;
  }
  .staff-recent-right{
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    gap:8px;
  }
  .staff-pill-group{
    display:flex;
    flex-wrap:wrap;
    justify-content:flex-end;
    gap:8px;
  }
  .staff-pill{
    display:inline-flex;
    align-items:center;
    gap:6px;
    padding:7px 11px;
    border-radius:999px;
    font-size:11px;
    font-weight:800;
    color:#f8fafc;
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.10);
    white-space:nowrap;
  }
  .staff-pill.payment-submitted{
    background:rgba(245,166,35,.12);
    border-color:rgba(245,166,35,.22);
    color:#ffd089;
  }
  .staff-pill.payment-verified,
  .staff-pill.order-completed,
  .staff-pill.order-ready{
    background:rgba(34,197,94,.12);
    border-color:rgba(34,197,94,.22);
    color:#86efac;
  }
  .staff-pill.payment-rejected,
  .staff-pill.order-cancelled{
    background:rgba(239,68,68,.12);
    border-color:rgba(239,68,68,.22);
    color:#fca5a5;
  }
  .staff-pill.order-pending,
  .staff-pill.order-confirmed,
  .staff-pill.order-preparing,
  .staff-pill.payment-pay-on-pickup{
    background:rgba(96,165,250,.12);
    border-color:rgba(96,165,250,.22);
    color:#93c5fd;
  }
  .staff-recent-actions{
    margin-top:10px;
    display:flex;
    justify-content:flex-end;
  }
  .staff-recent-open{
    border:none;
    outline:none;
    cursor:pointer;
    border-radius:12px;
    padding:10px 13px;
    font-size:12px;
    font-weight:800;
    font-family:'Manrope',sans-serif;
    display:inline-flex;
    align-items:center;
    gap:7px;
    color:#fff;
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.1);
    text-decoration:none;
    transition:all .2s ease;
  }
  .staff-recent-open:hover{
    transform:translateY(-1px);
    border-color:rgba(245,166,35,.18);
  }
  .staff-recent-total{
    font-size:13px;
    font-weight:800;
    color:#F5A623;
    font-family:'Manrope',sans-serif;
  }
  .staff-empty{
    padding:20px;
    border-radius:18px;
    background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.06);
    font-size:13px;
    color:rgba(255,255,255,.55);
  }
  .staff-summary-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
  }
  .staff-summary-card{
    padding:18px;
    border-radius:20px;
    background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.022));
    border:1px solid rgba(255,255,255,.065);
  }
  .staff-summary-label{
    font-size:12px;
    color:rgba(255,255,255,.48);
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.45px;
  }
  .staff-summary-value{
    margin-top:10px;
    font-size:24px;
    font-weight:900;
    color:#fff;
    font-family:'Manrope',sans-serif;
    letter-spacing:-.6px;
  }
  .staff-summary-sub{
    margin-top:6px;
    font-size:12px;
    color:rgba(255,255,255,.52);
    line-height:1.6;
  }
  .staff-quick-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:14px;
  }
  .staff-quick-link{
    text-decoration:none;
    min-height:148px;
    padding:20px;
    border-radius:22px;
    background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.022));
    border:1px solid rgba(255,255,255,.065);
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    gap:12px;
    transition:all .2s ease;
  }
  .staff-quick-link:hover{
    transform:translateY(-2px);
    border-color:rgba(245,166,35,.20);
    box-shadow:0 16px 34px rgba(245,166,35,.11);
  }
  .staff-quick-title{
    font-size:15px;
    font-weight:900;
    color:#fff;
    font-family:'Manrope',sans-serif;
  }
  .staff-quick-sub{
    font-size:12px;
    color:rgba(255,255,255,.55);
    line-height:1.7;
  }
  .staff-stats-grid{
    display:grid;
    grid-template-columns:1fr;
    gap:16px;
    margin-top:24px;
  }
  .staff-stat-card{
    padding:20px;
    border-radius:22px;
    background:linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.022));
    border:1px solid rgba(255,255,255,.07);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.03);
  }
  .staff-stat-label{
    font-size:12px;
    color:rgba(255,255,255,.48);
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.5px;
  }
  .staff-stat-value{
    margin-top:10px;
    font-size:28px;
    font-weight:900;
    color:#fff;
    font-family:'Manrope',sans-serif;
    letter-spacing:-.8px;
  }
  .staff-stat-sub{
    margin-top:6px;
    font-size:12px;
    color:rgba(255,255,255,.52);
    line-height:1.6;
  }
  @media (max-width:900px){
    .staff-home-topbar{align-items:stretch}
    .staff-home-actions{width:100%}
    .staff-home-btn{justify-content:center;flex:1}
    .staff-attention-grid{grid-template-columns:1fr 1fr}
    .staff-home-split{grid-template-columns:1fr}
    .staff-quick-grid{grid-template-columns:1fr 1fr}
  }
  @media (max-width:700px){
    .staff-attention-grid{grid-template-columns:1fr}
    .staff-summary-grid{grid-template-columns:1fr}
    .staff-quick-grid{grid-template-columns:1fr}
    .staff-recent-row{flex-direction:column}
    .staff-recent-right{align-items:flex-start}
    .staff-pill-group{justify-content:flex-start}
    .staff-home-card{padding:20px}
    .staff-panel{padding:18px}
    .staff-home-title{font-size:30px}
    .staff-home-btn{width:100%}
    .staff-home-actions{width:100%}
    .staff-recent-actions{justify-content:flex-start}
  }
`;

export default function StaffHomePage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pendingOrders: 0,
    paymentsWaiting: 0,
    readyOrders: 0,
    totalMenuItems: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [orders, setOrders] = useState([]);
  const [menuItemCount, setMenuItemCount] = useState(0);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      setStatsError("");

      const [ordersRes, menuRes] = await Promise.all([
        api.get("/orders"),
        api.get("/menu"),
      ]);

      const orders = ordersRes.data?.data || [];
      const menuItems = menuRes.data?.data || [];

      setOrders(orders);
      setMenuItemCount(menuItems.length);

      setStats({
        pendingOrders: orders.filter((order) => order.orderStatus === "pending").length,
        paymentsWaiting: orders.filter(
          (order) =>
            order.paymentMethod === "bank_transfer" &&
            order.paymentStatus === "payment_submitted"
        ).length,
        readyOrders: orders.filter((order) => order.orderStatus === "ready").length,
        totalMenuItems: menuItems.filter((item) => item.isAvailable !== false).length,
      });
    } catch (err) {
      setStatsError(err.response?.data?.message || "Failed to load dashboard stats.");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const todayKey = new Date().toDateString();

  const todayOrders = orders.filter((order) => {
    const sourceDate = order.pickupDate || order.createdAt || order.orderDate;
    if (!sourceDate) return false;
    return new Date(sourceDate).toDateString() === todayKey;
  });

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.orderDate || 0).getTime() -
        new Date(a.createdAt || a.orderDate || 0).getTime()
    )
    .slice(0, 5);

  const needsAttention = [
    {
      label: "Payments to Review",
      value: stats.paymentsWaiting,
      sub: "Bank transfer slips waiting for verification.",
      icon: <Banknote size={18} color="#F5A623" />,
      onClick: () => navigate(buildOrdersRoute({ paymentStatus: "payment_submitted" })),
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      sub: "Orders that still need confirmation from staff.",
      icon: <AlertTriangle size={18} color="#f87171" />,
      onClick: () => navigate(buildOrdersRoute({ orderStatus: "pending" })),
    },
    {
      label: "Ready for Pickup",
      value: stats.readyOrders,
      sub: "Orders that can be handed over to students now.",
      icon: <CheckCircle2 size={18} color="#4ade80" />,
      onClick: () => navigate(buildOrdersRoute({ orderStatus: "ready" })),
    },
    {
      label: "Unavailable Items",
      value: Math.max(menuItemCount - stats.totalMenuItems, 0),
      sub: "Menu items currently unavailable for ordering.",
      icon: <UtensilsCrossed size={18} color="#60a5fa" />,
      onClick: () => navigate("/staff/menu?availability=unavailable"),
    },
  ];

  const activeTodayOrders = todayOrders.filter(
    (order) => order.orderStatus !== "cancelled"
  );

  const todaySummary = {
    todayOrders: activeTodayOrders.length,
    todayRevenue: activeTodayOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    ),
    completedPickups: activeTodayOrders.filter(
      (order) => order.orderStatus === "completed"
    ).length,
    tomorrowPreorders: orders.filter((order) => {
      if (!order.pickupDate || order.orderStatus === "cancelled") return false;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return new Date(order.pickupDate).toDateString() === tomorrow.toDateString();
    }).length,
  };

  const formatLabel = (value) => {
    if (!value) return "Unknown";
    return value
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "payment_submitted":
        return "payment-submitted";
      case "payment_verified":
        return "payment-verified";
      case "payment_rejected":
        return "payment-rejected";
      case "pay_on_pickup":
        return "payment-pay-on-pickup";
      default:
        return "";
    }
  };

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "ready":
        return "order-ready";
      case "completed":
        return "order-completed";
      case "cancelled":
        return "order-cancelled";
      case "pending":
        return "order-pending";
      case "confirmed":
        return "order-confirmed";
      case "preparing":
        return "order-preparing";
      default:
        return "";
    }
  };

  const buildOrdersRoute = (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });

    const query = searchParams.toString();
    return query ? `/staff/orders?${query}` : "/staff/orders";
  };

  return (
    <StaffLayout>
      <style>{CSS}</style>

      <div className="staff-home-wrap">
        <div className="staff-home-card">
          <div className="staff-home-topbar">
            <div>
              <div className="staff-home-title">Dashboard</div>
              <div className="staff-home-sub">
                Monitor canteen activity, review orders, and manage menu operations from one place.
              </div>
            </div>

            <div className="staff-home-actions">
              <button
                type="button"
                className="staff-home-btn secondary"
                onClick={fetchDashboardStats}
              >
                <RefreshCw size={16} />
                Refresh Data
              </button>
            </div>
          </div>

          {statsError && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "16px",
                background: "rgba(239,68,68,.10)",
                border: "1px solid rgba(239,68,68,.22)",
                color: "#f87171",
                fontSize: "13px",
              }}
            >
              {statsError}
            </div>
          )}

          <div className="staff-stats-grid">
            <div className="staff-stat-card">
              <div className="staff-stat-label">Total Menu Items</div>
              <div className="staff-stat-value">
                {loadingStats ? "..." : stats.totalMenuItems}
              </div>
              <div className="staff-stat-sub">Items currently listed in menu</div>
            </div>
          </div>

          <div className="staff-home-section">
            <div className="staff-home-section-head">
              <div>
                <div className="staff-home-section-title">Needs Attention</div>
                <div className="staff-home-section-sub">
                  Focus on the most urgent staff actions first.
                </div>
              </div>
            </div>

            <div className="staff-attention-grid">
              {needsAttention.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="staff-attention-card clickable"
                  onClick={item.onClick}
                >
                  <div className="staff-attention-top">
                    <div className="staff-attention-label">{item.label}</div>
                    {item.icon}
                  </div>
                  <div className="staff-attention-value">
                    {loadingStats ? "..." : item.value}
                  </div>
                  <div className="staff-attention-sub">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="staff-home-split">
            <div className="staff-panel">
              <div className="staff-home-section-head">
                <div>
                  <div className="staff-home-section-title">Recent Orders</div>
                  <div className="staff-home-section-sub">
                    The latest order activity from students.
                  </div>
                </div>
                <Link to="/staff/orders" className="staff-home-btn secondary">
                  View All
                  <ArrowRight size={15} />
                </Link>
              </div>

              {loadingStats ? (
                <div className="staff-empty">Loading recent orders...</div>
              ) : recentOrders.length === 0 ? (
                <div className="staff-empty">No recent orders found.</div>
              ) : (
                <div className="staff-recent-list">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="staff-recent-row">
                      <div>
                        <div className="staff-recent-id">{order._id}</div>
                        <div className="staff-recent-name">
                          {order.studentId?.name || "Unknown Student"}
                        </div>
                        <div className="staff-recent-meta">
                          {order.items?.map((item) => `${item.name} x${item.quantity}`).join(", ") || "No items"}
                        </div>
                      </div>

                      <div className="staff-recent-right">
                        <div className="staff-pill-group">
                          <span className="staff-pill">
                            <CalendarDays size={12} />
                            {order.pickupDate
                              ? new Date(order.pickupDate).toLocaleDateString()
                              : "No pickup date"}
                          </span>
                          <span className={`staff-pill ${getPaymentStatusClass(order.paymentStatus)}`}>
                            {formatLabel(order.paymentStatus || "unknown")}
                          </span>
                          <span className={`staff-pill ${getOrderStatusClass(order.orderStatus)}`}>
                            {formatLabel(order.orderStatus || "unknown")}
                          </span>
                        </div>
                        <div className="staff-recent-total">
                          Rs. {Number(order.totalAmount || 0).toLocaleString()}
                        </div>
                        <div className="staff-recent-actions">
                          <Link
                            to={buildOrdersRoute({ search: order._id })}
                            className="staff-recent-open"
                          >
                            <Eye size={14} />
                            Open Order
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="staff-panel">
              <div className="staff-home-section-head">
                <div>
                  <div className="staff-home-section-title">Today’s Summary</div>
                  <div className="staff-home-section-sub">
                    A quick look at today’s operations and upcoming pickups.
                  </div>
                </div>
              </div>

              <div className="staff-summary-grid">
                <div className="staff-summary-card">
                  <div className="staff-summary-label">Today’s Orders</div>
                  <div className="staff-summary-value">
                    {loadingStats ? "..." : todaySummary.todayOrders}
                  </div>
                  <div className="staff-summary-sub">Orders scheduled for today.</div>
                </div>

                <div className="staff-summary-card">
                  <div className="staff-summary-label">Today’s Revenue</div>
                  <div className="staff-summary-value">
                    {loadingStats ? "..." : `Rs. ${todaySummary.todayRevenue.toLocaleString()}`}
                  </div>
                  <div className="staff-summary-sub">Total value of today’s orders.</div>
                </div>

                <div className="staff-summary-card">
                  <div className="staff-summary-label">Completed Pickups</div>
                  <div className="staff-summary-value">
                    {loadingStats ? "..." : todaySummary.completedPickups}
                  </div>
                  <div className="staff-summary-sub">Orders marked as completed today.</div>
                </div>

                <div className="staff-summary-card">
                  <div className="staff-summary-label">Tomorrow’s Preorders</div>
                  <div className="staff-summary-value">
                    {loadingStats ? "..." : todaySummary.tomorrowPreorders}
                  </div>
                  <div className="staff-summary-sub">Advance orders expected for tomorrow.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="staff-home-section">
            <div className="staff-home-section-head">
              <div>
                <div className="staff-home-section-title">Quick Actions</div>
                <div className="staff-home-section-sub">
                  Jump straight into the most common staff tasks.
                </div>
              </div>
            </div>

            <div className="staff-quick-grid">
              <Link to="/staff/orders" className="staff-quick-link">
                <ClipboardList size={22} color="#F5A623" />
                <div className="staff-quick-title">Review Orders</div>
                <div className="staff-quick-sub">Check order progress and update statuses.</div>
              </Link>

              <Link to="/staff/orders" className="staff-quick-link">
                <Banknote size={22} color="#F5A623" />
                <div className="staff-quick-title">Verify Payments</div>
                <div className="staff-quick-sub">Open orders and review submitted bank transfers.</div>
              </Link>

              <Link to="/staff/menu" className="staff-quick-link">
                <UtensilsCrossed size={22} color="#F5A623" />
                <div className="staff-quick-title">Manage Menu</div>
                <div className="staff-quick-sub">Add items, edit prices, and change availability.</div>
              </Link>

              <button
                type="button"
                className="staff-home-btn primary"
                onClick={fetchDashboardStats}
                style={{ justifyContent: "center", minHeight: "148px", width: "100%" }}
              >
                <RefreshCw size={16} />
                Refresh Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}