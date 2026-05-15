import {
  useMemo,
  useState,
} from "react";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "../firebase";

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

  /* =========================
      States
  ========================= */

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  /* =========================
      Notifications
  ========================= */

  const notifications =
    useMemo(() => {

      const alerts = [];

      /* =========================
          Medicine Alerts
      ========================= */

      medicines.forEach(
        (medicine) => {

          /* Low Stock */

          if (
            Number(
              medicine.stock
            ) <=
            Number(
              medicine.minStock || 5
            )
          ) {

            alerts.push({
              type: "danger",

              message:
                `${medicine.name} stock is low`,
            });
          }

          /* Expiry */

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
              expiry.getTime() -
              today.getTime();

            const days =
              Math.ceil(
                diff /
                  (
                    1000 *
                    60 *
                    60 *
                    24
                  )
              );

            /* Expired */

            if (days < 0) {

              alerts.push({
                type: "danger",

                message:
                  `${medicine.name} expired`,
              });

            }

            /* Expiring Soon */

            else if (
              days <= 60
            ) {

              alerts.push({
                type: "warning",

                message:
                  `${medicine.name} expiring soon`,
              });
            }
          }
        }
      );

      /* =========================
          Debt Alerts
      ========================= */

      sales.forEach(
        (sale) => {

          const total =
            Number(
              sale.total || 0
            );

          const paid =
            Number(
              sale.paid || 0
            );

          const debt =
            total - paid;

          if (debt > 0) {

            alerts.push({
              type: "danger",

              message:
                `${sale.customer} has unpaid debt $${debt.toFixed(2)}`,
            });
          }
        }
      );

      return alerts;

    }, [
      medicines,
      sales,
    ]);

  /* =========================
      Logout
  ========================= */

  const handleLogout =
    async () => {

      try {

        await signOut(
          auth
        );

        setAuthed(false);

        setCurrentUser(
          null
        );

      } catch (error) {

        console.log(
          error
        );
      }
    };

  /* =========================
      Theme UI
  ========================= */

  const ui = {

    bg: darkMode
      ? "bg-[#020617] border-[#1e293b]"
      : "bg-white border-slate-200",

    card: darkMode
      ? "bg-[#111827] border-[#1e293b]"
      : "bg-slate-50 border-slate-200",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",

    title: darkMode
      ? "text-white"
      : "text-slate-900",
  };

  return (

    <div className={`
      sticky top-0 z-50
      w-full border-b
      backdrop-blur-xl
      px-4 md:px-6
      py-4
      ${ui.bg}
    `}>

      <div className="
        flex flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
      ">

        {/* =========================
            Left
        ========================= */}

        <div>

          <h1 className={`
            text-2xl md:text-3xl
            font-black
            ${ui.title}
          `}>
            Welcome 👋
          </h1>

          <p className={`
            text-sm mt-1
            ${ui.text}
          `}>
            Pharmacy management system
          </p>

        </div>

        {/* =========================
            Right
        ========================= */}

        <div className="
          flex flex-wrap
          items-center gap-3
          w-full lg:w-auto
        ">

          {/* =========================
              Notifications
          ========================= */}

          <div className="
            relative
          ">

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className={`
                relative
                w-12 h-12
                rounded-2xl
                border
                flex items-center
                justify-center
                text-xl
                transition-all
                hover:scale-105
                ${ui.card}
                ${ui.title}
              `}
            >

              🔔

              {notifications.length > 0 && (

                <span className="
                  absolute
                  -top-1 -right-1
                  w-5 h-5
                  rounded-full
                  bg-red-600
                  text-white
                  text-[10px]
                  font-bold
                  flex items-center
                  justify-center
                ">

                  {notifications.length}

                </span>
              )}

            </button>

            {/* =========================
                Dropdown
            ========================= */}

            {showNotifications && (

              <div className={`
                absolute
                right-0 top-14
                w-[340px]
                max-w-[90vw]
                max-h-[400px]
                overflow-y-auto
                rounded-3xl
                border
                p-4
                shadow-2xl
                ${ui.card}
              `}>

                <h2 className={`
                  text-lg font-bold
                  mb-4
                  ${ui.title}
                `}>
                  Notifications
                </h2>

                {notifications.length === 0 ? (

                  <div className={`
                    text-sm
                    ${ui.text}
                  `}>
                    No alerts found
                  </div>

                ) : (

                  <div className="
                    space-y-3
                  ">

                    {notifications.map(
                      (
                        notification,
                        index
                      ) => (

                        <div
                          key={index}
                          className={`
                            rounded-2xl
                            p-4
                            text-sm
                            font-semibold
                            text-white

                            ${
                              notification.type ===
                              "danger"

                                ? "bg-red-700"

                                : notification.type ===
                                  "warning"

                                ? "bg-yellow-600"

                                : "bg-green-600"
                            }
                          `}
                        >

                          {
                            notification.type ===
                            "danger"

                              ? "🔥 "

                              : notification.type ===
                                "warning"

                              ? "⏰ "

                              : "✅ "
                          }

                          {
                            notification.message
                          }

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            )}

          </div>

          {/* =========================
              Dark Mode
          ========================= */}

          <button
            onClick={toggleTheme}
            className={`
              w-12 h-12
              rounded-2xl
              border
              flex items-center
              justify-center
              text-xl
              transition-all
              hover:scale-105
              ${ui.card}
            `}
          >

            {darkMode
              ? "🌙"
              : "☀️"}

          </button>

          {/* =========================
              User Card
          ========================= */}

          <div className={`
            flex items-center
            gap-3
            rounded-2xl
            border
            px-4 py-2
            ${ui.card}
          `}>

            {/* Avatar */}

            <div className="
              w-12 h-12
              rounded-full
              bg-green-600
              text-white
              font-bold
              flex items-center
              justify-center
            ">

              {currentUser?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>

            {/* User Info */}

            <div>

              <h3 className={`
                font-bold
                ${ui.title}
              `}>

                {currentUser?.name ||
                  "Unknown User"}

              </h3>

              <p className={`
                text-xs
                ${ui.text}
              `}>

                {currentUser?.role ||
                  "Staff"}

              </p>

            </div>

          </div>

          {/* =========================
              Logout
          ========================= */}

          <button
            onClick={handleLogout}
            className="
              h-12 px-5
              rounded-2xl
              bg-red-600
              hover:bg-red-700
              text-white
              font-bold
              transition-all
              hover:scale-105
            "
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Topbar;