import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Sidebar({ page, setPage, currentUser }) {
  const { darkMode } = useTheme();

  // Sidebar open / close
  const [open, setOpen] = useState(true);

  // Check if current user is admin
  const isAdmin =
    currentUser?.role?.toLowerCase() === "admin";

  // Navigation items
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

    // Show only for admin
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
    <aside
      className={`h-screen overflow-y-auto overflow-x-hidden
      transition-all duration-300
      flex flex-col justify-between
      border-r shadow-lg
      scrollbar-thin scrollbar-thumb-gray-400
      scrollbar-track-transparent
      ${
        open ? "w-[280px]" : "w-[90px]"
      }
      ${
        darkMode
          ? "bg-gradient-to-b from-green-950 to-emerald-900 border-gray-800 text-white"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      {/* Top Section */}
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Logo */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-[55px] h-[55px] rounded-2xl bg-green-600 flex items-center justify-center text-2xl">
              💊
            </div>

            {open && (
              <div>
                <h1 className="text-xl font-bold whitespace-nowrap">
                  ANFAC
                </h1>

                <p
                  className={`text-xs whitespace-nowrap
                  ${
                    darkMode
                      ? "text-green-200"
                      : "text-green-600"
                  }`}
                >
                  Pharmacy System
                </p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className={`min-w-[40px] h-[40px]
            rounded-xl flex items-center justify-center
            transition
            ${
              darkMode
                ? "bg-slate-900 hover:bg-slate-800"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {open ? "⬅️" : "➡️"}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = page === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200
                ${
                  active
                    ? "bg-green-600 text-white"
                    : darkMode
                    ? "bg-slate-900 hover:bg-slate-800 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                {/* Icon */}
                <div
                  className={`min-w-[42px] h-[42px]
                  rounded-xl flex items-center justify-center text-lg
                  ${
                    active
                      ? "bg-white/20"
                      : darkMode
                      ? "bg-black/20"
                      : "bg-white"
                  }`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                {open && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Section */}
      <div
        className={`m-3 p-3 rounded-2xl border
        ${
          darkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* User Image */}
          {currentUser?.image ? (
            <img
              src={currentUser.image}
              alt="user"
              className="w-[50px] h-[50px]
              rounded-full object-cover
              border-2 border-green-500"
            />
          ) : (
            <div
              className="w-[50px] h-[50px]
              rounded-full bg-green-600
              flex items-center justify-center
              text-white font-bold text-lg"
            >
              {currentUser?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>
          )}

          {/* User Info */}
          {open && (
            <div className="overflow-hidden">
              <h3 className="text-sm font-bold truncate">
                {currentUser?.name}
              </h3>

              <p
                className={`text-xs truncate
                ${
                  darkMode
                    ? "text-green-200"
                    : "text-green-600"
                }`}
              >
                {currentUser?.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;