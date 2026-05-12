import React from "react";

function Toast({
  message,
  type = "success",
  onClose,
}) {

  /* =========================
        COLORS
  ========================= */

  const bgColor =

    type === "error"

      ? "#dc2626"

      : type === "warning"

      ? "#f59e0b"

      : "#16a34a";

  /* =========================
        ICONS
  ========================= */

  const icon =

    type === "error"

      ? "❌"

      : type === "warning"

      ? "⏰"

      : "✅";

  /* =========================
        TITLES
  ========================= */

  const title =

    type === "error"

      ? "Low Stock"

      : type === "warning"

      ? "Expiring Soon"

      : "Success";

  return (

    <div
      className="toast-responsive"

      style={{
        ...styles.toast,

        background: bgColor,
      }}
    >

      {/* ICON */}

      <div
        className="toast-icon"

        style={styles.iconBox}
      >
        {icon}
      </div>

      {/* CONTENT */}

      <div style={styles.content}>

        <div
          className="toast-title"

          style={styles.title}
        >
          {title}
        </div>

        <div
          className="toast-message"

          style={styles.message}
        >
          {message}
        </div>

      </div>

      {/* CLOSE BUTTON */}

      <button
        onClick={onClose}

        className="toast-close"

        style={styles.closeBtn}
      >
        ✕
      </button>

      {/* RESPONSIVE + ANIMATION */}

      <style>
        {`

          @keyframes slideIn {

            from {
              opacity: 0;
              transform: translateY(-20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {

            .toast-responsive {

              width: 100% !important;

              min-width: auto !important;

              max-width: none !important;

              padding: 14px !important;

              border-radius: 16px !important;
            }

            .toast-title {

              font-size: 16px !important;
            }

            .toast-message {

              font-size: 14px !important;

              line-height: 20px !important;
            }

            .toast-icon {

              width: 40px !important;

              height: 40px !important;

              font-size: 20px !important;
            }

            .toast-close {

              font-size: 20px !important;
            }
          }

          @media (max-width: 480px) {

            .toast-responsive {

              gap: 10px !important;

              padding: 12px !important;
            }

            .toast-title {

              font-size: 15px !important;
            }

            .toast-message {

              font-size: 13px !important;

              line-height: 18px !important;
            }

            .toast-icon {

              width: 36px !important;

              height: 36px !important;

              font-size: 18px !important;

              border-radius: 12px !important;
            }
          }

        `}
      </style>

    </div>
  );
}

/* =========================
      STYLES
========================= */

const styles = {

  toast: {

    zIndex: 9999,

    minWidth: "320px",

    maxWidth: "420px",

    width: "100%",

    color: "#ffffff",

    padding: "16px 18px",

    borderRadius: "18px",

    display: "flex",

    alignItems: "center",

    gap: "14px",

    boxShadow:
      "0 15px 40px rgba(0,0,0,0.25)",

    border:
      "1px solid rgba(255,255,255,0.15)",

    animation:
      "slideIn 0.35s ease",

    boxSizing: "border-box",

    overflow: "hidden",
  },

  iconBox: {
    width: "44px",

    height: "44px",

    borderRadius: "14px",

    background:
      "rgba(255,255,255,0.15)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "22px",

    flexShrink: 0,
  },

  content: {
    flex: 1,

    minWidth: 0,
  },

  title: {
    fontWeight: "700",

    fontSize: "18px",

    marginBottom: "4px",

    wordBreak: "break-word",
  },

  message: {
    fontSize: "15px",

    lineHeight: "22px",

    opacity: 0.95,

    wordBreak: "break-word",
  },

  closeBtn: {
    background: "transparent",

    border: "none",

    color: "#ffffff",

    fontSize: "22px",

    cursor: "pointer",

    opacity: 0.85,

    flexShrink: 0,

    padding: 0,
  },
};

export default Toast;