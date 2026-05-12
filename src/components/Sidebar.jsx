function Sidebar({
  page,
  setPage,
  currentUser,
  dark,
}) {

  const isAdmin =
    currentUser?.role
      ?.toLowerCase() ===
    "admin";

  const navItems = [

    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
    },

    {
      id: "pos",
      label: "POS / Sales",
      icon: "🛒",
    },

    {
      id: "medicines",
      label: "Medicines",
      icon: "💊",
    },

    {
      id: "inventory",
      label: "Inventory",
      icon: "📦",
    },

    {
      id: "customers",
      label: "Customers",
      icon: "👥",
    },

    {
      id: "suppliers",
      label: "Suppliers",
      icon: "🏭",
    },

    {
      id: "sales",
      label: "Sales History",
      icon: "📋",
    },

    {
      id: "debts",
      label: "Debts",
      icon: "💳",
    },

    {
      id: "expenses",
      label: "Expenses",
      icon: "💸",
    },

    {
      id: "reports",
      label: "Reports",
      icon: "📈",
    },

    ...(isAdmin
      ? [
          {
            id: "users",
            label: "Users",
            icon: "👤",
          },
        ]
      : []),

    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
    },
  ];

  return (

    <div style={styles.sidebar}>

      {/* TOP */}

      <div>

        <div style={styles.logoContainer}>

          <div style={styles.logoIcon}>
            💊
          </div>

          <h2 style={styles.logoText}>
            ANFAC
          </h2>

          <p style={styles.logoSub}>
            Pharmacy System
          </p>

        </div>

        {/* NAV */}

        <div style={styles.navContainer}>

          {navItems.map((item) => {

            const active =
              page === item.id;

            return (

              <div
                key={item.id}
                onClick={() =>
                  setPage(item.id)
                }
                style={{
                  ...styles.navItem,

                  background:
                    active
                      ? "#16a34a"
                      : dark
                      ? "#0f172a"
                      : "transparent",

                  border:
                    active
                      ? "1px solid rgba(255,255,255,0.15)"
                      : "1px solid transparent",

                  fontWeight:
                    active
                      ? "700"
                      : "500",
                }}
              >

                <div
                  style={{
                    ...styles.iconBox,

                    background:
                      active
                        ? "rgba(255,255,255,0.18)"
                        : "#111827",
                  }}
                >
                  {item.icon}
                </div>

                <span style={styles.navLabel}>
                  {item.label}
                </span>

              </div>
            );
          })}

        </div>

      </div>

      {/* USER */}

      <div style={styles.userCard}>

        <div style={styles.userRow}>

          {currentUser?.image ? (

            <img
              src={currentUser.image}
              alt="user"
              style={styles.userImage}
            />

          ) : (

            <div style={styles.avatar}>

              {
                currentUser?.name
                  ?.charAt(0)
                  ?.toUpperCase()
              }

            </div>
          )}

          <div style={{
            overflow: "hidden",
          }}>

            <div style={styles.userName}>
              {currentUser?.name}
            </div>

            <div style={styles.userRole}>
              {currentUser?.role}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

const styles = {

  sidebar: {
    width: "280px",
    height: "100dvh",

    background:
      "linear-gradient(180deg,#052e16,#064e3b)",

    color: "#ffffff",

    padding: "20px 14px",

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",

    overflowY: "auto",

    flexShrink: 0,

    boxSizing: "border-box",

    boxShadow:
      "4px 0 15px rgba(0,0,0,0.08)",
  },

  logoContainer: {
    textAlign: "center",
    marginBottom: "35px",
  },

  logoIcon: {
    width: "78px",
    height: "78px",

    margin: "0 auto 14px",

    borderRadius: "22px",

    background: "#16a34a",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "34px",
  },

  logoText: {
    margin: 0,

    fontSize:
      "clamp(24px,4vw,28px)",

    fontWeight: "bold",

    color: "#ffffff",
  },

  logoSub: {
    color: "#bbf7d0",

    marginTop: "6px",

    fontSize: "13px",
  },

  navContainer: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",
  },

  navItem: {
    display: "flex",

    alignItems: "center",

    gap: "14px",

    padding: "14px 16px",

    borderRadius: "18px",

    cursor: "pointer",

    transition: "0.2s",

    width: "100%",

    boxSizing: "border-box",
  },

  iconBox: {
    width: "38px",

    height: "38px",

    borderRadius: "12px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "18px",

    flexShrink: 0,
  },

  navLabel: {
    fontSize: "15px",

    whiteSpace: "nowrap",

    overflow: "hidden",

    textOverflow: "ellipsis",
  },

  userCard: {
    marginTop: "20px",

    padding: "16px",

    borderRadius: "20px",

    background: "#111827",

    border: "1px solid #1f2937",

    boxSizing: "border-box",
  },

  userRow: {
    display: "flex",

    alignItems: "center",

    gap: "12px",
  },

  userImage: {
    width: "52px",

    height: "52px",

    borderRadius: "50%",

    objectFit: "cover",

    border: "2px solid #22c55e",

    flexShrink: 0,
  },

  avatar: {
    width: "52px",

    height: "52px",

    borderRadius: "50%",

    background: "#16a34a",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontWeight: "bold",

    fontSize: "18px",

    color: "#ffffff",

    flexShrink: 0,
  },

  userName: {
    fontWeight: "700",

    fontSize: "15px",

    color: "#ffffff",

    overflow: "hidden",

    textOverflow: "ellipsis",

    whiteSpace: "nowrap",
  },

  userRole: {
    color: "#bbf7d0",

    fontSize: "13px",

    marginTop: "3px",
  },
};

export default Sidebar;