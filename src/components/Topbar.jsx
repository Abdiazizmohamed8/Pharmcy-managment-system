import { useState } from "react";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "../firebase";

/* =========================
      THEME
========================= */

import {
  useTheme,
} from "../context/ThemeContext";

function Topbar({

  setAuthed,
  setCurrentUser,
  currentUser,
  medicines = [],
  sales = [],

}) {

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  /* =========================
        NOTIFICATIONS
  ========================= */

  const notifications = [];

  /* LOW STOCK + EXPIRY */

  medicines.forEach((medicine) => {

    if (
      Number(medicine.stock) <=
      Number(medicine.minStock || 5)
    ) {

      notifications.push({
        type: "danger",

        message:
          `${medicine.name} stock is low`,
      });
    }

    const expiryDate =
      medicine.expiryDate ||
      medicine.expiry;

    if (expiryDate) {

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const expiry =
        new Date(
          `${expiryDate}T00:00:00`
        );

      const diff =
        expiry - today;

      const days =
        Math.ceil(
          diff /
          (1000 * 60 * 60 * 24)
        );

      if (days < 0) {

        notifications.push({
          type: "danger",

          message:
            `${medicine.name} expired`,
        });

      } else if (days <= 60) {

        notifications.push({
          type: "warning",

          message:
            `${medicine.name} expiring soon`,
        });
      }
    }
  });

  /* DEBTS */

  sales.forEach((sale) => {

    if (
      sale.paymentMethod === "Debt" &&
      sale.paymentStatus
        ?.toLowerCase() !== "paid"
    ) {

      notifications.push({
        type: "danger",

        message:
          `${sale.customerName} unpaid debt`,
      });
    }
  });

  /* =========================
        LOGOUT
  ========================= */

  const handleLogout =
    async () => {

      try {

        await signOut(auth);

        setAuthed(false);

        setCurrentUser(null);

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <>

      {/* RESPONSIVE */}

      <style>
        {`

          @media (max-width: 768px) {

            .topbar-mobile {

              flex-direction: column !important;

              align-items: flex-start !important;
            }

            .topbar-right {

              width: 100% !important;

              justify-content: flex-start !important;
            }

            .topbar-dropdown {

              right: auto !important;

              left: 0 !important;

              width: 100% !important;

              max-width: calc(100vw - 30px) !important;
            }

            .topbar-user {

              width: 100% !important;

              max-width: 100% !important;
            }

            .topbar-logout {

              width: 100% !important;
            }
          }

        `}
      </style>

      <div
        className="topbar-mobile"

        style={{
          ...styles.container,

          background:
            darkMode
              ? "#020617"
              : "#ffffff",

          borderBottom:
            darkMode
              ? "1px solid #1e293b"
              : "1px solid #e5e7eb",
        }}
      >

        {/* LEFT */}

        <div style={styles.left}>

          <h1
            style={{
              ...styles.title,

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            Welcome 👋
          </h1>

          <p
            style={{
              ...styles.subtitle,

              color:
                darkMode
                  ? "#94a3b8"
                  : "#6b7280",
            }}
          >
            Pharmacy management system
          </p>

        </div>

        {/* RIGHT */}

        <div
          className="topbar-right"

          style={styles.right}
        >

          {/* NOTIFICATION */}

          <div style={styles.notificationWrapper}>

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }

              style={{
                ...styles.iconButton,

                border:
                  darkMode
                    ? "1px solid #1e293b"
                    : "1px solid #e5e7eb",

                background:
                  darkMode
                    ? "#111827"
                    : "#f9fafb",

                color:
                  darkMode
                    ? "#ffffff"
                    : "#111827",
              }}
            >

              🔔

              {notifications.length > 0 && (

                <div style={styles.badge}>
                  {notifications.length}
                </div>

              )}

            </button>

            {/* DROPDOWN */}

            {showNotifications && (

              <div
                className="topbar-dropdown"

                style={{
                  ...styles.dropdown,

                  background:
                    darkMode
                      ? "#111827"
                      : "#ffffff",

                  border:
                    darkMode
                      ? "1px solid #1f2937"
                      : "1px solid #e5e7eb",
                }}
              >

                <h3
                  style={{
                    ...styles.dropdownTitle,

                    color:
                      darkMode
                        ? "#ffffff"
                        : "#111827",
                  }}
                >
                  Notifications
                </h3>

                {notifications.length === 0 ? (

                  <div
                    style={{
                      color:
                        darkMode
                          ? "#94a3b8"
                          : "#6b7280",
                    }}
                  >
                    No alerts
                  </div>

                ) : (

                  notifications.map(
                    (
                      notification,
                      index
                    ) => (

                      <div
                        key={index}

                        style={{
                          ...styles.notificationItem,

                          background:
                            notification.type ===
                            "danger"

                              ? "#7f1d1d"

                              : "#92400e",
                        }}
                      >

                        {
                          notification.type ===
                          "danger"

                            ? "🔥 "

                            : "⏰ "
                        }

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

          {/* DARK MODE */}

          <button
            onClick={toggleTheme}

            style={{
              ...styles.iconButton,

              border:
                darkMode
                  ? "1px solid #1e293b"
                  : "1px solid #e5e7eb",

              background:
                darkMode
                  ? "#16a34a"
                  : "#f9fafb",
            }}
          >
            {
              darkMode
                ? "🌙"
                : "☀️"
            }
          </button>

          {/* USER */}

          <div
            className="topbar-user"

            style={{
              ...styles.userCard,

              background:
                darkMode
                  ? "#111827"
                  : "#f9fafb",
            }}
          >

            <div style={styles.avatar}>

              {
                currentUser?.name
                  ?.charAt(0)
                  ?.toUpperCase()
              }

            </div>

            <div style={styles.userInfo}>

              <div
                style={{
                  ...styles.userName,

                  color:
                    darkMode
                      ? "#ffffff"
                      : "#111827",
                }}
              >
                {currentUser?.name}
              </div>

              <div style={styles.userRole}>
                {currentUser?.role}
              </div>

            </div>

          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}

            className="topbar-logout"

            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </div>

    </>
  );
}

/* =========================
      STYLES
========================= */

const styles = {

  container: {
    position: "sticky",

    top: 0,

    zIndex: 100,

    padding: "16px 20px",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "16px",

    width: "100%",

    overflow: "visible",

    boxSizing: "border-box",

    backdropFilter:
      "blur(10px)",
  },

  left: {
    flex: "1 1 250px",

    minWidth: 0,
  },

  title: {
    margin: 0,

    fontSize:
      "clamp(22px,4vw,30px)",

    fontWeight: "700",

    wordBreak: "break-word",
  },

  subtitle: {
    marginTop: "6px",

    fontSize: "14px",

    wordBreak: "break-word",
  },

  right: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    flexWrap: "wrap",

    justifyContent:
      "flex-end",

    flex: "1 1 300px",
  },

  notificationWrapper: {
    position: "relative",
  },

  iconButton: {
    width: "52px",

    height: "52px",

    borderRadius: "16px",

    fontSize: "20px",

    cursor: "pointer",

    position: "relative",

    flexShrink: 0,
  },

  badge: {
    position: "absolute",

    top: "-5px",

    right: "-5px",

    width: "22px",

    height: "22px",

    borderRadius: "50%",

    background: "#ef4444",

    color: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "11px",

    fontWeight: "bold",
  },

  dropdown: {
    position: "absolute",

    top: "65px",

    right: 0,

    width: "320px",

    maxWidth:
      "calc(100vw - 20px)",

    maxHeight: "400px",

    overflowY: "auto",

    overflowX: "hidden",

    borderRadius: "20px",

    padding: "18px",

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.3)",

    zIndex: 999,

    boxSizing: "border-box",
  },

  dropdownTitle: {
    marginTop: 0,

    marginBottom: "16px",
  },

  notificationItem: {
    padding: "14px",

    borderRadius: "14px",

    marginBottom: "12px",

    color: "#ffffff",

    fontWeight: "600",

    fontSize: "14px",

    wordBreak: "break-word",
  },

  userCard: {
    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "10px 14px",

    borderRadius: "18px",

    maxWidth: "220px",

    minWidth: 0,

    overflow: "hidden",

    flex: "1 1 auto",
  },

  avatar: {
    width: "48px",

    height: "48px",

    borderRadius: "50%",

    background: "#16a34a",

    color: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontWeight: "bold",

    flexShrink: 0,
  },

  userInfo: {
    overflow: "hidden",
  },

  userName: {
    fontWeight: "700",

    whiteSpace: "nowrap",

    overflow: "hidden",

    textOverflow: "ellipsis",
  },

  userRole: {
    fontSize: "13px",

    color: "#94a3b8",

    marginTop: "3px",
  },

  logoutButton: {
    background: "#dc2626",

    color: "#ffffff",

    padding: "12px 20px",

    borderRadius: "14px",

    fontWeight: "700",

    cursor: "pointer",

    whiteSpace: "nowrap",
  },
};

export default Topbar;