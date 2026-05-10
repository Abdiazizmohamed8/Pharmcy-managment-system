import { useState } from "react";
function Sidebar({
  page,
  setPage,
  currentUser,
}) {

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

    ...(currentUser?.role ===
    "Admin"

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
        width: "240px",

        background:
          "#052e16",

        color: "#fff",

        minHeight:
          "100vh",

        padding:
          "20px 10px",

        display: "flex",

        flexDirection:
          "column",
      }}
    >

      {/* LOGO */}
      <div
        style={{
          textAlign:
            "center",

          marginBottom:
            "35px",
        }}
      >

        <h2
          style={{
            color:
              "#22c55e",

            margin: 0,

            fontSize:
              "26px",

            fontWeight:
              "bold",
          }}
        >
          💊 ANFAC
        </h2>

        <p
          style={{
            fontSize:
              "12px",

            color:
              "#86efac",

            marginTop:
              "6px",
          }}
        >
          Pharmacy System
        </p>
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          display: "flex",

          flexDirection:
            "column",

          gap: "6px",
        }}
      >

        {navItems.map(
          (item) => (

            <div
              key={item.id}

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

                gap: "12px",

                padding:
                  "14px 16px",

                borderRadius:
                  "12px",

                cursor:
                  "pointer",

                fontWeight:
                  page ===
                  item.id

                    ? "bold"

                    : "500",

                fontSize:
                  "15px",

                background:
                  page ===
                  item.id

                    ? "#16a34a"

                    : "transparent",

                color:
                  "#fff",

                transition:
                  "0.2s",
              }}
            >

              {/* ICON */}
              <span
                style={{
                  fontSize:
                    "18px",
                }}
              >
                {
                  item.icon
                }
              </span>

              {/* LABEL */}
              <span>
                {
                  item.label
                }
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Sidebar;