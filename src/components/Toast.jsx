import React from "react";

function Toast({
  message,
  type = "success",
  onClose,
}) {

  /* =========================
      Toast Colors
  ========================= */

  const bgColor =
    type === "error"
      ? "#dc2626"
      : type === "warning"
      ? "#f59e0b"
      : "#16a34a";

  /* =========================
      Toast Icon
  ========================= */

  const icon =
    type === "error"
      ? "❌"
      : type === "warning"
      ? "⏰"
      : "✅";

  /* =========================
      Toast Title
  ========================= */

  const title =
    type === "error"
      ? "Error"
      : type === "warning"
      ? "Warning"
      : "Success";

  return (

    <div className="toast-wrapper">

      {/* Toast Box */}

      <div
        className="toast-box"
        style={{
          background: bgColor,
          color: "#ffffff",

          padding: "16px",

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

          minWidth: "320px",
          maxWidth: "420px",
        }}
      >

        {/* Icon */}

        <div
          style={{
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
          }}
        >

          {icon}

        </div>

        {/* Content */}

        <div
          style={{
            flex: 1,
          }}
        >

          {/* Title */}

          <div
            style={{
              fontWeight: "700",
              fontSize: "18px",
              marginBottom: "4px",
            }}
          >

            {title}

          </div>

          {/* Message */}

          <div
            style={{
              fontSize: "15px",
              lineHeight: "22px",
              opacity: 0.95,
            }}
          >

            {message}

          </div>

        </div>

        {/* Close Button */}

        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",

            color: "#ffffff",

            fontSize: "22px",

            cursor: "pointer",
          }}
        >

          ✕

        </button>

      </div>

      {/* Animation */}

      <style>
        {`
          @keyframes slideIn {

            from {
              opacity: 0;
              transform: translateY(20px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}

export default Toast;