import { useEffect, useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Banknote,
  HandCoins,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import api from "../api/axios";
import StaffHeader from "../components/StaffHeader";

const CSS = `
  .staff-shell{min-height:100vh;padding:86px 24px 24px}
  .staff-wrap{width:min(1180px,100%);margin:0 auto}
  .staff-card{
    background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.03));
    border:1px solid rgba(255,255,255,.08);
    border-radius:28px;
    backdrop-filter:blur(18px);
    box-shadow:0 18px 45px rgba(0,0,0,.28);
  }
  .staff-head{padding:24px;border-bottom:1px solid rgba(255,255,255,.06)}
  .staff-title{
    display:flex;align-items:center;gap:10px;
    font-family:'Manrope',sans-serif;font-size:28px;font-weight:900;color:#fff;letter-spacing:-.8px;
  }
  .staff-sub{margin-top:8px;font-size:14px;color:rgba(255,255,255,.52);line-height:1.7}
  .toolbar{
    display:grid;grid-template-columns:1.2fr .7fr .7fr;gap:12px;
    padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.06);
  }
  .input-wrap{position:relative}
  .input-icon{
    position:absolute;left:13px;top:50%;transform:translateY(-50%);
    color:rgba(255,255,255,.34);pointer-events:none
  }
  .input, .select{
    width:100%;padding:12px 14px 12px 40px;border-radius:14px;background:rgba(255,255,255,.045);
    border:1.5px solid rgba(255,255,255,.08);color:#fff;font-size:14px;outline:none;
  }
  .select{appearance:none}
  .select option{background:#0d1130;color:#fff}
  .orders-list{display:grid;gap:14px;padding:20px 24px}
  .order-card{
    padding:16px;border-radius:20px;background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.06);
  }
  .order-top{
    display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;
    margin-bottom:10px;
  }
  .order-id{
    font-family:'Manrope',sans-serif;font-size:16px;font-weight:900;color:#F5A623
  }
  .order-meta{display:flex;gap:8px;flex-wrap:wrap}
  .pill{
    display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;
    font-size:11px;font-weight:800;font-family:'Manrope',sans-serif;
    border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#fff;
  }
  .row{
    display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:10px
  }
  .mini{
    padding:12px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05)
  }
  .mini-label{font-size:11px;color:rgba(255,255,255,.42);text-transform:uppercase;font-weight:700;letter-spacing:.5px}
  .mini-value{margin-top:6px;font-size:13px;color:#fff;font-weight:800;font-family:'Manrope',sans-serif}
  .items-box{
    margin-top:12px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05)
  }
  .items-title{font-size:12px;font-weight:800;color:rgba(255,255,255,.7);font-family:'Manrope',sans-serif;margin-bottom:6px}
  .items-text{font-size:13px;color:rgba(255,255,255,.58);line-height:1.7}
  .empty, .msg{
    margin:20px 24px;padding:16px;border-radius:16px;font-size:13px
  }
  .empty{
    background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.08);color:rgba(255,255,255,.48)
  }
  .msg.error{
    background:rgba(239,68,68,.10);border:1px solid rgba(239,68,68,.22);color:#f87171
  }
  @media (max-width:900px){
    .toolbar{grid-template-columns:1fr}
    .row{grid-template-columns:1fr 1fr}
  }
  @media (max-width:640px){
    .staff-shell{padding:82px 16px 16px}
    .row{grid-template-columns:1fr}
    .staff-head,.toolbar,.orders-list{padding-left:16px;padding-right:16px}
  }
`;

const formatPaymentMethod = (method) => {
  switch (method) {
    case "cash":
      return "Cash";
    case "bank_transfer":
      return "Bank Transfer";
    default:
      return method || "—";
  }
};

const formatPaymentStatus = (status) => {
  switch (status) {
    case "pay_on_pickup":
      return "Pay on Pickup";
    case "payment_submitted":
      return "Payment Submitted";
    case "payment_verified":
      return "Payment Verified";
    case "payment_rejected":
      return "Payment Rejected";
    default:
      return status || "—";
  }
};

const formatOrderStatus = (status) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "preparing":
      return "Preparing";
    case "ready":
      return "Ready";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status || "—";
  }
};

const getNextOrderAction = (order) => {
  switch (order.orderStatus) {
    case "pending":
      if (order.paymentMethod === "bank_transfer" && order.paymentStatus !== "payment_verified") {
        return null;
      }
      return { label: "Mark Confirmed", value: "confirmed" };

    case "confirmed":
      return { label: "Mark Preparing", value: "preparing" };

    case "preparing":
      return { label: "Mark Ready", value: "ready" };

    case "ready":
      return { label: "Mark Completed", value: "completed" };

    default:
      return null;
  }
};

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentActionLoadingId, setPaymentActionLoadingId] = useState("");
  const [paymentActionError, setPaymentActionError] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [statusActionLoadingId, setStatusActionLoadingId] = useState("");
  const [statusActionError, setStatusActionError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (orderStatus) params.orderStatus = orderStatus;
      if (paymentStatus) params.paymentStatus = paymentStatus;

      const res = await api.get("/orders", { params });
      setOrders(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load staff orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId) => {
    try {
        setPaymentActionLoadingId(orderId);
        setPaymentActionError("");

        await api.patch(`/orders/${orderId}/payment-status`, {
        paymentStatus: "payment_verified",
        });

        await fetchOrders();
    } catch (err) {
        setPaymentActionError(
        err.response?.data?.message || "Failed to verify payment."
        );
    } finally {
        setPaymentActionLoadingId("");
    }
  };

  const openRejectModal = (orderId) => {
    setRejectOrderId(orderId);
    setRejectReason("");
    setPaymentActionError("");
    setRejectModalOpen(true);
  };

  const handleRejectPayment = async () => {
    try {
        if (!rejectReason.trim()) {
        setPaymentActionError("Payment rejection reason is required.");
        return;
        }

        setPaymentActionLoadingId(rejectOrderId);
        setPaymentActionError("");

        await api.patch(`/orders/${rejectOrderId}/payment-status`, {
        paymentStatus: "payment_rejected",
        paymentRejectionReason: rejectReason,
        });

        setRejectModalOpen(false);
        setRejectOrderId("");
        setRejectReason("");
        await fetchOrders();
    } catch (err) {
        setPaymentActionError(
        err.response?.data?.message || "Failed to reject payment."
        );
    } finally {
        setPaymentActionLoadingId("");
    }
  };

  const handleOrderStatusUpdate = async (orderId, orderStatusValue) => {
    try {
      setStatusActionLoadingId(orderId);
      setStatusActionError("");

      await api.patch(`/orders/${orderId}/status`, {
        orderStatus: orderStatusValue,
      });

      await fetchOrders();
    } catch (err) {
      setStatusActionError(
        err.response?.data?.message || "Failed to update order status."
      );
    } finally {
      setStatusActionLoadingId("");
    }
  };

  const handleViewSlip = (slipUrl) => {
    if (!slipUrl) return;

    const apiBase = api.defaults.baseURL || "http://127.0.0.1:5001/api";
    const backendBase = apiBase.replace(/\/api\/?$/, "");

    const fullSlipUrl = slipUrl.startsWith("http")
      ? slipUrl
      : `${backendBase}${slipUrl}`;

    window.open(fullSlipUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    fetchOrders();
  }, [orderStatus, paymentStatus]);

  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase();
    const studentName = order.studentId?.name?.toLowerCase() || "";
    const studentEmail = order.studentId?.email?.toLowerCase() || "";
    const orderId = order._id?.toLowerCase() || "";
    const items = order.items?.map((item) => item.name).join(" ").toLowerCase() || "";

    return (
      studentName.includes(text) ||
      studentEmail.includes(text) ||
      orderId.includes(text) ||
      items.includes(text)
    );
  });

  return (
    <>
      <style>{CSS}</style>
      <StaffHeader />
      <div className="staff-shell">
        <div className="staff-wrap staff-card">
          <div className="staff-head">
            <div className="staff-title">
              <ClipboardList size={24} color="#F5A623" />
              Staff Orders
            </div>
            <div className="staff-sub">
              View all student orders, payment details, and current order progress.
            </div>
          </div>

          <div className="toolbar">
            <div className="input-wrap">
              <span className="input-icon"><Search size={16} /></span>
              <input
                className="input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student, order ID, or item"
              />
            </div>

            <div className="input-wrap">
              <span className="input-icon"><Filter size={16} /></span>
              <select className="select" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                <option value="">All Order Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="input-wrap">
              <span className="input-icon"><Filter size={16} /></span>
              <select className="select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                <option value="">All Payment Statuses</option>
                <option value="pay_on_pickup">Pay on Pickup</option>
                <option value="payment_submitted">Payment Submitted</option>
                <option value="payment_verified">Payment Verified</option>
                <option value="payment_rejected">Payment Rejected</option>
              </select>
            </div>
          </div>

          {error && <div className="msg error">{error}</div>}
          {paymentActionError && <div className="msg error">{paymentActionError}</div>}
          {statusActionError && <div className="msg error">{statusActionError}</div>}

          <div className="orders-list">
            {loading ? (
              <div className="empty">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="empty">No orders found.</div>
            ) : (
              filteredOrders.map((order) => {
                const nextAction = getNextOrderAction(order);

                return (
                  <div key={order._id} className="order-card">
                    <div className="order-top">
                      <div>
                        <div className="order-id">{order._id}</div>
                        <div style={{ marginTop: "6px", fontSize: "13px", color: "rgba(255,255,255,.52)" }}>
                          {new Date(order.createdAt || order.orderDate).toLocaleString()}
                        </div>
                      </div>

                      <div className="order-meta">
                        <span className="pill">
                          {order.paymentMethod === "bank_transfer" ? <Banknote size={13} /> : <HandCoins size={13} />}
                          {formatPaymentMethod(order.paymentMethod)}
                        </span>
                        <span className="pill">
                          <CheckCircle2 size={13} />
                          {formatPaymentStatus(order.paymentStatus)}
                        </span>
                        <span className="pill">
                          <AlertCircle size={13} />
                          {formatOrderStatus(order.orderStatus)}
                        </span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="mini">
                        <div className="mini-label">Student</div>
                        <div className="mini-value">{order.studentId?.name || "—"}</div>
                      </div>
                      <div className="mini">
                        <div className="mini-label">Email</div>
                        <div className="mini-value">{order.studentId?.email || "—"}</div>
                      </div>
                      <div className="mini">
                        <div className="mini-label">Pickup Date</div>
                        <div className="mini-value">
                          <CalendarDays size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
                          {order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : "—"}
                        </div>
                      </div>
                      <div className="mini">
                        <div className="mini-label">Total</div>
                        <div className="mini-value">Rs. {order.totalAmount ?? "—"}</div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="mini">
                        <div className="mini-label">Payment Reference</div>
                        <div className="mini-value">{order.paymentReference || "—"}</div>
                      </div>
                      <div className="mini">
                        <div className="mini-label">Slip</div>
                        <div className="mini-value">
                          {order.slipUrl ? (
                            <button
                              type="button"
                              onClick={() => handleViewSlip(order.slipUrl)}
                              style={{
                                padding: "7px 10px",
                                borderRadius: "10px",
                                background: "rgba(96,165,250,.12)",
                                border: "1px solid rgba(96,165,250,.24)",
                                color: "#60a5fa",
                                fontSize: "12px",
                                fontWeight: 800,
                                fontFamily: "Manrope,sans-serif",
                                cursor: "pointer",
                              }}
                            >
                              View Slip
                            </button>
                          ) : (
                            "—"
                          )}
                        </div>
                      </div>
                      <div className="mini">
                        <div className="mini-label">Cancelled By</div>
                        <div className="mini-value">{order.cancelledBy || "—"}</div>
                      </div>
                      <div className="mini">
                        <div className="mini-label">Reason</div>
                        <div className="mini-value">{order.cancellationReason || "—"}</div>
                      </div>
                    </div>

                    <div className="items-box">
                      <div className="items-title">Items</div>
                      <div className="items-text">
                        {order.items?.map((item) => `${item.name} x${item.quantity}`).join(", ") || "—"}
                      </div>
                    </div>

                    {order.paymentMethod === "bank_transfer" &&
                      order.paymentStatus === "payment_submitted" && (
                        <div
                          style={{
                            marginTop: "12px",
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleVerifyPayment(order._id)}
                            disabled={paymentActionLoadingId === order._id}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "12px",
                              background: "rgba(34,197,94,.12)",
                              border: "1px solid rgba(34,197,94,.24)",
                              color: "#4ade80",
                              fontSize: "12px",
                              fontWeight: 800,
                              fontFamily: "Manrope,sans-serif",
                              cursor: paymentActionLoadingId === order._id ? "not-allowed" : "pointer",
                              opacity: paymentActionLoadingId === order._id ? 0.6 : 1,
                            }}
                          >
                            {paymentActionLoadingId === order._id ? "Updating..." : "Verify Payment"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openRejectModal(order._id)}
                            disabled={paymentActionLoadingId === order._id}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "12px",
                              background: "rgba(239,68,68,.10)",
                              border: "1px solid rgba(239,68,68,.24)",
                              color: "#f87171",
                              fontSize: "12px",
                              fontWeight: 800,
                              fontFamily: "Manrope,sans-serif",
                              cursor: paymentActionLoadingId === order._id ? "not-allowed" : "pointer",
                              opacity: paymentActionLoadingId === order._id ? 0.6 : 1,
                            }}
                          >
                            Reject Payment
                          </button>
                        </div>
                      )}

                    {nextAction && (
                      <div
                        style={{
                          marginTop: "12px",
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleOrderStatusUpdate(order._id, nextAction.value)}
                          disabled={statusActionLoadingId === order._id}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "12px",
                            background: "rgba(245,166,35,.12)",
                            border: "1px solid rgba(245,166,35,.24)",
                            color: "#F5A623",
                            fontSize: "12px",
                            fontWeight: 800,
                            fontFamily: "Manrope,sans-serif",
                            cursor: statusActionLoadingId === order._id ? "not-allowed" : "pointer",
                            opacity: statusActionLoadingId === order._id ? 0.6 : 1,
                          }}
                        >
                          {statusActionLoadingId === order._id ? "Updating..." : nextAction.label}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {rejectModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setRejectModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "#0d1130",
              border: "1.5px solid rgba(239,68,68,.2)",
              borderRadius: "24px",
              padding: "22px",
              boxShadow: "0 24px 80px rgba(0,0,0,.6)",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 900,
                color: "#fff",
                fontFamily: "Manrope,sans-serif",
                marginBottom: "8px",
              }}
            >
              Reject Payment
            </h3>

            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,.55)",
                lineHeight: 1.7,
                marginBottom: "14px",
              }}
            >
              Enter the reason for rejecting this payment slip. The student should know what needs to be corrected.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              style={{
                width: "100%",
                minHeight: "110px",
                borderRadius: "14px",
                background: "rgba(255,255,255,.045)",
                border: "1.5px solid rgba(255,255,255,.08)",
                color: "#fff",
                padding: "12px 14px",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "16px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectOrderId("");
                  setRejectReason("");
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.08)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRejectPayment}
                disabled={paymentActionLoadingId === rejectOrderId}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(239,68,68,.12)",
                  border: "1px solid rgba(239,68,68,.24)",
                  color: "#f87171",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: paymentActionLoadingId === rejectOrderId ? "not-allowed" : "pointer",
                  opacity: paymentActionLoadingId === rejectOrderId ? 0.6 : 1,
                }}
              >
                {paymentActionLoadingId === rejectOrderId ? "Updating..." : "Reject Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}