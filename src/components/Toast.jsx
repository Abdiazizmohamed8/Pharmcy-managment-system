import React from "react";

function Toast({
  message,
  type = "success",
  onClose,
}) {

  const bgColor =
    type === "error"

      ? "#dc2626"

      : type === "warning"

      ? "#f59e0b"

      : "#16a34a";

  const icon =
    type === "error"

      ? "❌"

      : type === "warning"

      ? "⏰"

      : "✅";

  const title =
    type === "error"

      ? "Low Stock"

      : type === "warning"

      ? "Expiring Soon"

      : "Success";

  return (

    <div
      style={{
        position:  "relative",

        zIndex: 9999,

        minWidth:
          "320px",

        maxWidth:
          "420px",

        background:
          bgColor,

        color: "#ffffff",

        padding:
          "16px 18px",

        borderRadius:
          "18px",

        display: "flex",

        alignItems:
          "center",

        gap: "14px",

        boxShadow:
          "0 15px 40px rgba(0,0,0,0.25)",

        border:
          "1px solid rgba(255,255,255,0.15)",

        animation:
          "slideIn 0.35s ease",
      }}
    >

      {/* ICON */}

      <div
        style={{
          width: "44px",

          height:
            "44px",

          borderRadius:
            "14px",

          background:
            "rgba(255,255,255,0.15)",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          fontSize:
            "22px",

          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* TEXT */}

      <div
        style={{
          flex: 1,
        }}
      >

        <div
          style={{
            fontWeight:
              "700",

            fontSize:
              "18px",

            marginBottom:
              "4px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize:
              "15px",

            lineHeight:
              "22px",

            opacity: 0.95,
          }}
        >
          {message}
        </div>

      </div>

      {/* CLOSE BUTTON */}

      <button
        onClick={
          onClose
        }

        style={{
          background:
            "transparent",

          border:
            "none",

          color:
            "#ffffff",

          fontSize:
            "22px",

          cursor:
            "pointer",

          opacity: 0.85,
        }}
      >
        ✕
      </button>

      {/* ANIMATION */}

      <style>
        {`
          @keyframes slideIn {

            from {
              opacity: 0;
              transform: translateX(100%);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }

          }

          @media(max-width:600px){

            div[style*="position: fixed"]{

              left: 10px !important;

              right: 10px !important;

              min-width: auto !important;

              max-width: none !important;

            }

          }
        `}
      </style>

    </div>
  );
}

export default Toast;