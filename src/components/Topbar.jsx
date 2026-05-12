import { useState } from "react";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "../firebase";

function Topbar({
  dark,
  setDark,
  setAuthed,
  setCurrentUser,
  currentUser,
  medicines = [],
  sales = [],
}) {

  /* =========================
        STATE
  ========================= */

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  /* =========================
        NOTIFICATIONS
  ========================= */

  const notifications = [];

  /* =========================
        MEDICINE ALERTS
  ========================= */

  medicines.forEach((medicine) => {

    /* LOW STOCK */

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

    /* EXPIRY */

    const expiryDate =
      medicine.expiryDate ||
      medicine.expiry;

    if (expiryDate) {

      const today = new Date();

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

  /* =========================
        DEBT ALERTS
  ========================= */

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

    <div style={{
      ...styles.container,

      background:
        dark
          ? "#020617"
          : "#ffffff",

      borderBottom:
        dark
          ? "1px solid #1e293b"
          : "1px solid #e5e7eb",
    }}>

      {/* LEFT */}

      <div style={styles.left}>

        <h1 style={{
          ...styles.title,

          color:
            dark
              ? "#ffffff"
              : "#111827",
        }}>
          Welcome 👋
        </h1>

        <p style={{
          ...styles.subtitle,

          color:
            dark
              ? "#94a3b8"
              : "#6b7280",
        }}>
          Pharmacy management system
        </p>

      </div>

      {/* RIGHT */}

      <div style={styles.right}>

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
                dark
                  ? "1px solid #1e293b"
                  : "1px solid #e5e7eb",

              background:
                dark
                  ? "#111827"
                  : "#f9fafb",

              color:
                dark
                  ? "#ffffff"
                  : "#111827",
            }}
          >

            🔔

            {
              notifications.length > 0 && (

                <div style={styles.badge}>
                  {notifications.length}
                </div>
              )
            }

          </button>

          {/* DROPDOWN */}

          {
            showNotifications && (

              <div style={{
                ...styles.dropdown,

                background:
                  dark
                    ? "#111827"
                    : "#ffffff",

                border:
                  dark
                    ? "1px solid #1f2937"
                    : "1px solid #e5e7eb",
              }}>

                <h3 style={{
                  ...styles.dropdownTitle,

                  color:
                    dark
                      ? "#ffffff"
                      : "#111827",
                }}>
                  Notifications
                </h3>

                {
                  notifications.length === 0 ? (

                    <div style={{
                      color:
                        dark
                          ? "#94a3b8"
                          : "#6b7280",
                    }}>
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

                                : notification.type ===
                                  "warning"

                                ? "#92400e"

                                : "#1e3a8a",
                          }}
                        >

                          {
                            notification.type ===
                            "danger"

                              ? "🔥 "

                              : notification.type ===
                                "warning"

                              ? "⏰ "

                              : "🔔 "
                          }

                          {
                            notification.message
                          }

                        </div>
                      )
                    )
                  )
                }

              </div>
            )
          }

        </div>

        {/* DARK MODE */}

        <button
          onClick={() =>
            setDark(!dark)
          }
          style={{
            ...styles.iconButton,

            border:
              dark
                ? "1px solid #1e293b"
                : "1px solid #e5e7eb",

            background:
              dark
                ? "#16a34a"
                : "#f9fafb",
          }}
        >
          {
            dark
              ? "🌙"
              : "☀️"
          }
        </button>

        {/* USER */}

        <div style={{
          ...styles.userCard,

          background:
            dark
              ? "#111827"
              : "#f9fafb",
        }}>

          <div style={styles.avatar}>

            {
              currentUser?.name
                ?.charAt(0)
                ?.toUpperCase()
            }

          </div>

          <div style={styles.userInfo}>

            <div style={{
              ...styles.userName,

              color:
                dark
                  ? "#ffffff"
                  : "#111827",
            }}>
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
          style={styles.logoutButton}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

/* =========================
      RESPONSIVE STYLES
========================= */

const styles = {

  container: {
    padding: "18px 24px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "18px",

    position: "sticky",

    top: 0,

    zIndex: 100,

    width: "100%",

    boxSizing: "border-box",
  },

  left: {
    minWidth: "220px",
  },

  title: {
    margin: 0,

    fontSize:
      "clamp(24px,4vw,30px)",

    fontWeight: "700",
  },

  subtitle: {
    marginTop: "6px",

    fontSize: "14px",
  },

  right: {
    display: "flex",

    alignItems: "center",

    gap: "14px",

    flexWrap: "wrap",

    justifyContent: "flex-end",
  },

  notificationWrapper: {
    position: "relative",
  },

  iconButton: {
    width: "56px",

    height: "56px",

    borderRadius: "18px",

    fontSize: "22px",

    cursor: "pointer",

    position: "relative",

    flexShrink: 0,
  },

  badge: {
    position: "absolute",

    top: "-5px",

    right: "-5px",

    width: "24px",

    height: "24px",

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

    top: "70px",

    right: 0,

    width: "330px",

    maxWidth: "90vw",

    maxHeight: "420px",

    overflowY: "auto",

    borderRadius: "22px",

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

    gap: "12px",

    padding: "10px 14px",

    borderRadius: "20px",

    minWidth: "180px",
  },

  avatar: {
    width: "52px",

    height: "52px",

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

    border: "none",

    padding: "14px 24px",

    borderRadius: "16px",

    fontWeight: "700",

    cursor: "pointer",

    whiteSpace: "nowrap",
  },
};

export default Topbar;