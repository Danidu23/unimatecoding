import { X, CheckCircle, Banknote, HandCoins, ChefHat, PackageCheck, Clock3 } from "lucide-react";

const getTrackingStepFromOrder = (trackedOrder, payMethod) => {
  if (!trackedOrder) return 1;

  if (trackedOrder.orderStatus === "cancelled") {
    return 0;
  }

  if (payMethod === "bank_transfer") {
    if (trackedOrder.paymentStatus === "payment_verified") {
      switch (trackedOrder.orderStatus) {
        case "confirmed":
          return 2;
        case "preparing":
          return 3;
        case "ready":
          return 4;
        case "completed":
          return 5;
        default:
          return 1;
      }
    }

    if (trackedOrder.paymentStatus === "payment_rejected") {
      return 0;
    }

    return 1;
  }

  switch (trackedOrder.orderStatus) {
    case "pending":
      return 1;
    case "confirmed":
      return 2;
    case "preparing":
      return 3;
    case "ready":
      return 4;
    case "completed":
      return 5;
    case "cancelled":
      return 0;
    default:
      return 1;
  }
};

const getPaymentStepSubtitle = (trackedOrder, payMethod) => {
  if (payMethod !== "bank_transfer") {
    return "Pay cash when you collect";
  }

  if (trackedOrder?.paymentStatus === "payment_verified") {
    return "Payment verified successfully";
  }

  if (trackedOrder?.paymentStatus === "payment_rejected") {
    return trackedOrder?.paymentRejectionReason
      ? `Payment rejected: ${trackedOrder.paymentRejectionReason}`
      : "Payment was rejected";
  }

  return "Waiting for payment verification";
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
      return "Ready for Pickup";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status || "—";
  }
};

export default function OrderTrackingModal({
  orderId,
  canteenName,
  payMethod,
  trackedOrder,
  trackingLoading,
  trackingError,
  onClose,
}) {
  const activeStep = getTrackingStepFromOrder(trackedOrder, payMethod);

const steps =
  payMethod === "bank_transfer"
    ? [
        {
          icon: <CheckCircle size={15} />,
          label: "Order Placed",
          sub: "Your order has been received",
          time: activeStep >= 1 ? "Done" : "Pending",
          done: activeStep >= 1,
          active: activeStep === 1,
        },
        {
          icon: <Banknote size={15} />,
          label: "Payment Verification",
          sub: getPaymentStepSubtitle(trackedOrder, payMethod),
          time:
            trackedOrder?.paymentStatus === "payment_verified"
              ? "Done"
              : trackedOrder?.paymentStatus === "payment_rejected"
              ? "Rejected"
              : activeStep >= 2
              ? "In progress"
              : "Pending",
          done: trackedOrder?.paymentStatus === "payment_verified",
          active:
            trackedOrder?.paymentStatus !== "payment_verified" &&
            trackedOrder?.paymentStatus !== "payment_rejected",
        },
        {
          icon: <ChefHat size={15} />,
          label: "Preparing Your Order",
          sub: "The canteen is preparing your food",
          time: activeStep >= 3 ? "In progress" : "Pending",
          done: activeStep >= 3,
          active: activeStep === 3,
        },
        {
          icon: <PackageCheck size={15} />,
          label: "Ready for Pickup",
          sub: `Collect from ${canteenName || "canteen"}`,
          time: activeStep >= 4 ? "Ready" : "Pending",
          done: activeStep >= 4,
          active: activeStep === 4,
        },
        {
          icon: <CheckCircle size={15} />,
          label: "Completed",
          sub: "Order picked up successfully",
          time: activeStep >= 5 ? "Done" : "Pending",
          done: activeStep >= 5,
          active: activeStep === 5,
        },
      ]
    : [
        {
          icon: <CheckCircle size={15} />,
          label: "Order Placed",
          sub: "Your order has been received",
          time: activeStep >= 1 ? "Done" : "Pending",
          done: activeStep >= 1,
          active: activeStep === 1,
        },
        {
          icon: <CheckCircle size={15} />,
          label: "Order Confirmed",
          sub: "The canteen has accepted your order",
          time: activeStep >= 2 ? "Done" : "Pending",
          done: activeStep >= 2,
          active: activeStep === 2,
        },
        {
          icon: <ChefHat size={15} />,
          label: "Preparing Your Order",
          sub: "The canteen is preparing your food",
          time: activeStep >= 3 ? "In progress" : "Pending",
          done: activeStep >= 3,
          active: activeStep === 3,
        },
        {
          icon: <PackageCheck size={15} />,
          label: "Ready for Pickup",
          sub: "Pay cash when you collect",
          time: activeStep >= 4 ? "Ready" : "Pending",
          done: activeStep >= 4,
          active: activeStep === 4,
        },
        {
          icon: <CheckCircle size={15} />,
          label: "Completed",
          sub: "Order picked up successfully",
          time: activeStep >= 5 ? "Done" : "Pending",
          done: activeStep >= 5,
          active: activeStep === 5,
        },
      ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.75)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d1130",
          border: "1.5px solid rgba(245,166,35,.2)",
          borderRadius: "28px",
          maxWidth: "440px",
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,.6)",
        }}
      >
        <div style={{ padding: "16px 22px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 900, color: "#fff", fontFamily: "Manrope,sans-serif" }}>
              Track Order
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,.6)",
                cursor: "pointer",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <span style={{ fontSize: "13px", color: "#F5A623", fontWeight: 700, fontFamily: "Manrope,sans-serif" }}>
              {orderId}
            </span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,.3)" }} />
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,.45)" }}>{canteenName}</span>
          </div>
        </div>

        {trackingLoading && (
          <div
            style={{
              margin: "12px 22px 0",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
              color: "rgba(255,255,255,.65)",
              fontSize: "12px",
            }}
          >
            Loading tracking details...
          </div>
        )}

        {trackingError && (
          <div
            style={{
              margin: "12px 22px 0",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(239,68,68,.10)",
              border: "1px solid rgba(239,68,68,.22)",
              color: "#f87171",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            {trackingError}
          </div>
        )}

        {trackedOrder?.orderStatus === "cancelled" && (
          <div
            style={{
              margin: "12px 22px 0",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(239,68,68,.10)",
              border: "1px solid rgba(239,68,68,.22)",
              color: "#f87171",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            This order has been cancelled.
          </div>
        )}

        {trackedOrder?.paymentStatus === "payment_rejected" &&
          trackedOrder?.paymentRejectionReason && (
            <div
              style={{
                margin: "12px 22px 0",
                padding: "10px 12px",
                borderRadius: "10px",
                background: "rgba(239,68,68,.10)",
                border: "1px solid rgba(239,68,68,.22)",
                color: "#f87171",
                fontSize: "12px",
                lineHeight: 1.6,
              }}
            >
              Payment was rejected: {trackedOrder.paymentRejectionReason}
            </div>
        )}

        <div style={{ margin: "12px 22px 0", fontSize: "12px", color: "rgba(255,255,255,.55)" }}>
          Current Status: <strong style={{ color: "#fff" }}>{formatOrderStatus(trackedOrder?.orderStatus)}</strong>
        </div>

        <div style={{ padding: "14px 22px 18px", display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", marginBottom: i < steps.length - 1 ? "4px" : "0" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: step.done
                      ? "2px solid #F5A623"
                      : step.active
                      ? "2px solid #F5A623"
                      : "2px solid rgba(255,255,255,.15)",
                    background: step.done ? "#F5A623" : "#07091a",
                    color: step.done ? "#07091a" : step.active ? "#F5A623" : "rgba(255,255,255,.5)",
                    boxShadow: step.active ? "0 0 0 4px rgba(245,166,35,.2)" : "none",
                  }}
                >
                  {step.icon}
                </div>

                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: "2px",
                      flex: 1,
                      minHeight: "14px",
                      background: step.done ? "rgba(245,166,35,.4)" : "rgba(255,255,255,.08)",
                      margin: "3px 0",
                    }}
                  />
                )}
              </div>

              <div style={{ paddingBottom: i < steps.length - 1 ? "10px" : "0", paddingTop: "4px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: step.done ? "#fff" : step.active ? "#fff" : "rgba(255,255,255,.35)",
                      fontFamily: "Manrope,sans-serif",
                    }}
                  >
                    {step.label}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: step.done ? "#F5A623" : step.active ? "#F5A623" : "rgba(255,255,255,.25)",
                      fontWeight: 600,
                      fontFamily: "Manrope,sans-serif",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {step.time}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: step.done ? "rgba(255,255,255,.5)" : step.active ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.2)",
                    marginTop: "1px",
                  }}
                >
                  {step.sub}
                </p>
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              background: "rgba(245,166,35,.08)",
              border: "1px solid rgba(245,166,35,.18)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Clock3 size={16} color="#F5A623" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#F5A623", fontFamily: "Manrope,sans-serif" }}>
                Estimated Pickup Time
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,.7)" }}>
                {canteenName ? "Based on current canteen processing" : "Waiting for update"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}