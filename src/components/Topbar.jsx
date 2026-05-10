import { useState } from "react";

function Topbar({
  dark,
  setDark,
  setAuthed,
  currentUser,
  medicines = [],
}) {

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  /* =========================
     NOTIFICATIONS
  ========================= */

  const notifications = [];

  medicines.forEach(
    (medicine) => {

      /* LOW STOCK */
      if (
        medicine.stock <=
        medicine.minStock
      ) {

        notifications.push({
          type: "danger",

          message: `${medicine.name} low stock`,
        });
      }

      /* EXPIRY */
      if (
        medicine.expiryDate
      ) {

        const today =
          new Date();

        const expiry =
          new Date(
            medicine.expiryDate
          );

        const diff =
          expiry - today;

        const days =
          Math.ceil(
            diff /
            (1000 *
              60 *
              60 *
              24)
          );

        /* EXPIRED */
        if (days < 0) {

          notifications.push({
            type: "danger",

            message: `${medicine.name} expired`,
          });
        }

        /* EXPIRING SOON */
        else if (
          days <= 10
        ) {

          notifications.push({
            type: "warning",

            message: `${medicine.name} expiring soon`,
          });
        }
      }
    }
  );

  return (
    <div
      style={{
        background:
          dark
            ? "#111827"
            : "#ffffff",

        padding:
          "14px 28px",

        borderBottom:
          dark
            ? "1px solid #374151"
            : "1px solid #e5e7eb",

        display: "flex",

        justifyContent:
          "space-between",

        alignItems:
          "center",

        position:
          "sticky",

        top: 0,

        zIndex: 100,
      }}
    >

      {/* LEFT */}
      <div>

        <h1
          style={{
            margin: 0,

            fontSize:
              "26px",

            fontWeight:
              "700",

            color:
              dark
                ? "#fff"
                : "#111827",
          }}
        >
          Welcome 👋
        </h1>

        <p
          style={{
            margin:
              "4px 0 0",

            color:
              dark
                ? "#9ca3af"
                : "#6b7280",

            fontSize:
              "14px",
          }}
        >
          Pharmacy management
          system
        </p>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          gap: "14px",
        }}
      >

        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <div
          style={{
            position:
              "relative",
          }}
        >

          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }

            style={{
              width: "54px",

              height:
                "54px",

              borderRadius:
                "16px",

              border: "none",

              background:
                dark
                  ? "#1f2937"
                  : "#f3f4f6",

              cursor:
                "pointer",

              fontSize:
                "22px",

              position:
                "relative",

              transition:
                "0.2s",
            }}
          >
            🔔

            {/* COUNT */}
            {notifications.length >
              0 && (

              <div
                style={{
                  position:
                    "absolute",

                  top: "-4px",

                  right: "-4px",

                  width: "24px",

                  height:
                    "24px",

                  borderRadius:
                    "50%",

                  background:
                    "#dc2626",

                  color:
                    "#fff",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  fontSize:
                    "11px",

                  fontWeight:
                    "bold",

                  animation:
                    "pulse 1s infinite",
                }}
              >
                {
                  notifications.length
                }
              </div>
            )}
          </button>

          {/* DROPDOWN */}
          {showNotifications && (

            <div
              style={{
                position:
                  "absolute",

                top: "70px",

                right: 0,

                width: "340px",

                maxHeight:
                  "420px",

                overflowY:
                  "auto",

                background:
                  dark
                    ? "#1f2937"
                    : "#ffffff",

                borderRadius:
                  "20px",

                padding:
                  "18px",

                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.12)",

                zIndex: 999,
              }}
            >

              <h3
                style={{
                  marginTop: 0,

                  marginBottom:
                    "16px",

                  fontSize:
                    "18px",

                  color:
                    dark
                      ? "#fff"
                      : "#111827",
                }}
              >
                Notifications
              </h3>

              {notifications.length ===
              0 ? (

                <p
                  style={{
                    color:
                      dark
                        ? "#9ca3af"
                        : "#6b7280",
                  }}
                >
                  No alerts
                </p>

              ) : (

                notifications.map(
                  (
                    notification,
                    index
                  ) => (

                    <div
                      key={index}

                      style={{
                        padding:
                          "14px",

                        borderRadius:
                          "14px",

                        marginBottom:
                          "12px",

                        background:
                          notification.type ===
                          "danger"

                            ? "#fee2e2"

                            : "#fef3c7",

                        color:
                          notification.type ===
                          "danger"

                            ? "#dc2626"

                            : "#92400e",

                        fontWeight:
                          "600",

                        fontSize:
                          "14px",
                      }}
                    >
                      {notification.type ===
                      "danger"

                        ? "🔥 "

                        : "⚠️ "}

                      {
                        notification.message
                      }
                    </div>
                  )
                )
              )}
            </div>
          )}
        </div>

        {/* =========================
            DARK MODE
        ========================= */}

        <button
          onClick={() =>
            setDark(
              !dark
            )
          }

          style={{
            width: "54px",

            height:
              "54px",

            borderRadius:
              "16px",

            border: "none",

            background:
              dark
                ? "#16a34a"
                : "#f3f4f6",

            cursor:
              "pointer",

            fontSize:
              "20px",
          }}
        >
          {dark
            ? "🌙"
            : "☀️"}
        </button>

        {/* =========================
            USER PROFILE
        ========================= */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: "12px",

            background:
              dark
                ? "#1f2937"
                : "#f9fafb",

            padding:
              "8px 14px",

            borderRadius:
              "18px",
          }}
        >

          {/* USER IMAGE */}
          {currentUser?.image ? (

            <img
              src={
                currentUser.image
              }

              alt="user"

              style={{
                width: "50px",

                height:
                  "50px",

                borderRadius:
                  "50%",

                objectFit:
                  "cover",

                border:
                  "2px solid #16a34a",
              }}
            />

          ) : (

            <div
              style={{
                width: "50px",

                height:
                  "50px",

                borderRadius:
                  "50%",

                background:
                  "#16a34a",

                color: "#fff",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                fontWeight:
                  "bold",

                fontSize:
                  "18px",
              }}
            >
              {
                currentUser?.name?.charAt(
                  0
                )
              }
            </div>
          )}

          {/* USER INFO */}
          <div>

            <div
              style={{
                fontWeight:
                  "700",

                fontSize:
                  "16px",

                color:
                  dark
                    ? "#fff"
                    : "#111827",
              }}
            >
              {
                currentUser?.name
              }
            </div>

            {/* ROLE */}
            <div
              style={{
                marginTop:
                  "4px",

                display:
                  "inline-flex",

                alignItems:
                  "center",

                gap: "5px",

                background:
                  currentUser?.role ===
                  "Admin"

                    ? "#dcfce7"

                    : "#dbeafe",

                color:
                  currentUser?.role ===
                  "Admin"

                    ? "#166534"

                    : "#1d4ed8",

                padding:
                  "3px 9px",

                borderRadius:
                  "999px",

                fontSize:
                  "11px",

                fontWeight:
                  "bold",
              }}
            >
              {currentUser?.role ===
              "Admin"

                ? "👑 Admin"

                : "💳 Cashier"}
            </div>
          </div>
        </div>

        {/* =========================
            LOGOUT
        ========================= */}

        <button
          onClick={() =>
            setAuthed(
              false
            )
          }

          style={{
            background:
              "#dc2626",

            color: "#fff",

            border: "none",

            padding:
              "14px 22px",

            borderRadius:
              "16px",

            fontWeight:
              "bold",

            cursor:
              "pointer",

            fontSize:
              "14px",

            transition:
              "0.2s",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Topbar;