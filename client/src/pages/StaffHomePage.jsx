import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Soup } from "lucide-react";
import StaffHeader from "../components/StaffHeader";
import api from "../api/axios";

const CSS = `
  .staff-home-shell{min-height:100vh;padding:96px 24px 24px}
  .staff-home-wrap{width:min(1180px,100%);margin:0 auto}
  .staff-home-card{
    background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.03));
    border:1px solid rgba(255,255,255,.08);
    border-radius:28px;
    backdrop-filter:blur(18px);
    box-shadow:0 18px 45px rgba(0,0,0,.28);
    padding:24px;
  }
  .staff-home-title{
    font-family:'Manrope',sans-serif;
    font-size:32px;
    font-weight:900;
    color:#fff;
    letter-spacing:-.8px;
  }
  .staff-home-sub{
    margin-top:8px;
    font-size:14px;
    color:rgba(255,255,255,.55);
    line-height:1.7;
  }
  .staff-stats-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:16px;
    margin-top:24px;
  }
  .staff-stat-card{
    padding:18px;
    border-radius:20px;
    background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.06);
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
  .staff-home-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:18px;
    margin-top:24px;
  }
  .staff-home-link{
    text-decoration:none;
    padding:22px;
    border-radius:22px;
    background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.06);
    display:block;
    transition:all .2s ease;
  }
  .staff-home-link:hover{
    transform:translateY(-2px);
    border-color:rgba(245,166,35,.22);
  }
  .staff-home-link-title{
    margin-top:12px;
    font-size:20px;
    font-weight:900;
    color:#fff;
    font-family:'Manrope',sans-serif;
  }
  .staff-home-link-sub{
    margin-top:8px;
    font-size:13px;
    color:rgba(255,255,255,.55);
    line-height:1.7;
  }
  @media (max-width:900px){
    .staff-home-grid{grid-template-columns:1fr}
    .staff-stats-grid{grid-template-columns:1fr 1fr}
  }
  @media (max-width:700px){
    .staff-home-grid{grid-template-columns:1fr}
    .staff-stats-grid{grid-template-columns:1fr}
    .staff-home-shell{padding:92px 16px 16px}
  }
`;

export default function StaffHomePage() {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    paymentsWaiting: 0,
    readyOrders: 0,
    totalMenuItems: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

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

      setStats({
        pendingOrders: orders.filter((order) => order.orderStatus === "pending").length,
        paymentsWaiting: orders.filter(
          (order) =>
            order.paymentMethod === "bank_transfer" &&
            order.paymentStatus === "payment_submitted"
        ).length,
        readyOrders: orders.filter((order) => order.orderStatus === "ready").length,
        totalMenuItems: menuItems.length,
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

  return (
    <>
      <style>{CSS}</style>
      <StaffHeader />

      <div className="staff-home-shell">
        <div className="staff-home-wrap">
          <div className="staff-home-card">
            <div className="staff-home-title">Staff Home</div>
            <div className="staff-home-sub">
              Manage canteen orders and menu items from one place.
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
                <div className="staff-stat-label">Pending Orders</div>
                <div className="staff-stat-value">
                  {loadingStats ? "..." : stats.pendingOrders}
                </div>
                <div className="staff-stat-sub">Orders waiting for staff action</div>
              </div>

              <div className="staff-stat-card">
                <div className="staff-stat-label">Payments Waiting</div>
                <div className="staff-stat-value">
                  {loadingStats ? "..." : stats.paymentsWaiting}
                </div>
                <div className="staff-stat-sub">Bank transfers waiting verification</div>
              </div>

              <div className="staff-stat-card">
                <div className="staff-stat-label">Ready Orders</div>
                <div className="staff-stat-value">
                  {loadingStats ? "..." : stats.readyOrders}
                </div>
                <div className="staff-stat-sub">Orders ready for pickup now</div>
              </div>

              <div className="staff-stat-card">
                <div className="staff-stat-label">Total Menu Items</div>
                <div className="staff-stat-value">
                  {loadingStats ? "..." : stats.totalMenuItems}
                </div>
                <div className="staff-stat-sub">Items currently listed in menu</div>
              </div>
            </div>

            <div className="staff-home-grid"> 
              <Link to="/staff/orders" className="staff-home-link">
                <ClipboardList size={28} color="#F5A623" />
                <div className="staff-home-link-title">Orders</div>
                <div className="staff-home-link-sub">
                  Verify payments, update order status, and manage student orders.
                </div>
              </Link>

              <Link to="/staff/menu" className="staff-home-link">
                <Soup size={28} color="#F5A623" />
                <div className="staff-home-link-title">Menu</div>
                <div className="staff-home-link-sub">
                  Add, edit, delete, and update menu item availability.
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}