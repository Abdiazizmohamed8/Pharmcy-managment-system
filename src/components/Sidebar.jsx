function Sidebar({
  page,
  setPage,
  currentUser,
  dark,
}) {

  /* =========================
     CHECK ADMIN
  ========================= */

  const isAdmin =
    currentUser?.role
      ?.toLowerCase() ===
    "admin";

  /* =========================
     NAV ITEMS
  ========================= */

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

    /* =========================
       ADMIN ONLY
    ========================= */

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
    <div
      style={{
        width: "260px",

        minHeight:
          "100vh",

        background:
          dark
            ? "#020617"
            : "linear-gradient(180deg,#052e16,#064e3b)",

        color: "#ffffff",

        padding:
          "20px 14px",

        display:
          "flex",

        flexDirection:
          "column",

        justifyContent:
          "space-between",

        borderRight:
          dark
            ? "1px solid #1e293b"
            : "none",

        boxShadow:
          dark
            ? "4px 0 20px rgba(0,0,0,0.4)"
            : "4px 0 15px rgba(0,0,0,0.08)",

        position:
          "sticky",

        top: 0,

        overflowY:
          "auto",
      }}
    >

      {/* TOP */}

      <div>

        {/* LOGO */}

        <div
          style={{
            textAlign:
              "center",

            marginBottom:
              "35px",
          }}
        >

          <div
            style={{
              width: "78px",

              height:
                "78px",

              margin:
                "0 auto 14px",

              borderRadius:
                "22px",

              background:
                "#16a34a",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                "34px",

              boxShadow:
                "0 10px 25px rgba(0,0,0,0.25)",
            }}
          >
            💊
          </div>

          <h2
            style={{
              margin: 0,

              fontSize:
                "28px",

              fontWeight:
                "bold",

              color:
                "#ffffff",
            }}
          >
            ANFAC
          </h2>

          <p
            style={{
              color:
                "#bbf7d0",

              marginTop:
                "6px",

              fontSize:
                "13px",
            }}
          >
            Pharmacy System
          </p>
        </div>

        {/* NAVIGATION */}

        <div
          style={{
            display:
              "flex",

            flexDirection:
              "column",

            gap: "8px",
          }}
        >

          {navItems.map(
            (item) => {

              const active =
                page ===
                item.id;

              return (
                <div
                  key={
                    item.id
                  }

                  onClick={() =>
                    setPage(
                      item.id
                    )
                  }

                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: "14px",

                    padding:
                      "14px 16px",

                    borderRadius:
                      "18px",

                    cursor:
                      "pointer",

                    background:
                      active
                        ? "#16a34a"
                        : dark
                        ? "#0f172a"
                        : "transparent",

                    color:
                      "#ffffff",

                    transition:
                      "0.2s",

                    fontWeight:
                      active
                        ? "700"
                        : "500",

                    border:
                      active
                        ? "1px solid rgba(255,255,255,0.15)"
                        : dark
                        ? "1px solid #1e293b"
                        : "1px solid transparent",
                  }}
                >

                  {/* ICON */}

                  <div
                    style={{
                      width: "38px",

                      height:
                        "38px",

                      borderRadius:
                        "12px",

                      background:
                        active
                          ? "rgba(255,255,255,0.18)"
                          : dark
                          ? "#111827"
                          : "rgba(255,255,255,0.08)",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      fontSize:
                        "18px",
                    }}
                  >
                    {
                      item.icon
                    }
                  </div>

                  {/* LABEL */}

                  <span
                    style={{
                      fontSize:
                        "15px",
                    }}
                  >
                    {
                      item.label
                    }
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* USER */}

      <div
        style={{
          marginTop:
            "20px",

          padding:
            "16px",

          borderRadius:
            "20px",

          background:
            dark
              ? "#111827"
              : "rgba(255,255,255,0.08)",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid rgba(255,255,255,0.08)",
        }}
      >

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: "12px",
          }}
        >

          {/* AVATAR */}

          {currentUser?.image ? (

            <img
              src={
                currentUser.image
              }

              alt="user"

              style={{
                width: "52px",

                height:
                  "52px",

                borderRadius:
                  "50%",

                objectFit:
                  "cover",

                border:
                  "2px solid #22c55e",
              }}
            />

          ) : (

            <div
              style={{
                width: "52px",

                height:
                  "52px",

                borderRadius:
                  "50%",

                background:
                  "#16a34a",

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

                color:
                  "#ffffff",
              }}
            >
              {currentUser?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>
          )}

          {/* INFO */}

          <div>

            <div
              style={{
                fontWeight:
                  "700",

                fontSize:
                  "15px",

                color:
                  "#ffffff",
              }}
            >
              {
                currentUser?.name
              }
            </div>

            <div
              style={{
                color:
                  "#bbf7d0",

                fontSize:
                  "13px",

                marginTop:
                  "3px",
              }}
            >
              {
                currentUser?.role
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;