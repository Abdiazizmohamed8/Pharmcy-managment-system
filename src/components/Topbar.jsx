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
      STATES
  ========================= */

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  /* =========================
      NOTIFICATIONS
  ========================= */

  const notifications =
    useMemo(() => {

      const alerts = [];

      medicines.forEach(
        (medicine) => {

          // LOW STOCK

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

          // EXPIRY

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

            if (days < 0) {

              alerts.push({
                type: "danger",

                message:
                  `${medicine.name} expired`,
              });

            } else if (
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

      /* DEBTS */

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
                `${sale.customer} unpaid debt $${debt.toFixed(2)}`,
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
      LOGOUT
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
      UI
  ========================= */

  const ui = {

    bg: darkMode
      ? "bg-[#020617]/95 border-[#1e293b]"
      : "bg-white/95 border-slate-200",

    card: darkMode
      ? "bg-[#111827] border-[#1e293b]"
      : "bg-slate-50 border-slate-200",

    title: darkMode
      ? "text-white"
      : "text-slate-900",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  return (

    <div className={`
      sticky top-0 z-30
      w-full
      border-b
      backdrop-blur-xl

      px-3 md:px-6
      py-4

      ${ui.bg}
    `}>

      <div className="
        flex items-center
        justify-between
        gap-3
        w-full
      ">

        {/* LEFT */}

        <div className="
          min-w-0
        ">

          <h1 className={`
            text-xl md:text-3xl
            font-black
            truncate
            ${ui.title}
          `}>
            Welcome 👋
          </h1>

          <p className={`
            text-xs md:text-sm
            truncate
            ${ui.text}
          `}>
            Pharmacy management system
          </p>

        </div>

        {/* RIGHT */}

        <div className="
          flex items-center
          gap-2 md:gap-3
          flex-shrink-0
        ">

          {/* NOTIFICATIONS */}

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
                w-10 h-10
                md:w-12 md:h-12

                rounded-2xl
                border

                flex items-center
                justify-center

                text-lg md:text-xl

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

            {/* DROPDOWN */}

            {showNotifications && (

              <div className={`
                fixed md:absolute

                top-20 md:top-14
                right-2 md:right-0

                w-[95vw]
                md:w-[340px]
                max-w-[340px]

                max-h-[400px]
                overflow-y-auto

                rounded-3xl
                border
                p-4

                shadow-2xl
                z-[9999]

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

          {/* DARK MODE */}

          <button
            onClick={toggleTheme}
            className={`
              w-10 h-10
              md:w-12 md:h-12

              rounded-2xl
              border

              flex items-center
              justify-center

              text-lg md:text-xl

              transition-all
              hover:scale-105

              ${ui.card}
            `}
          >

            {darkMode
              ? "🌙"
              : "☀️"}

          </button>

          {/* USER */}

          <div className={`
            hidden sm:flex
            items-center
            gap-3

            rounded-2xl
            border

            px-4 py-2

            ${ui.card}
          `}>

            {/* AVATAR */}

            <div className="
              w-10 h-10
              md:w-12 md:h-12

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

            {/* INFO */}

            <div>

              <h3 className={`
                font-bold
                ${ui.title}
              `}>

                {currentUser?.name ||
                  "Unknown"}

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

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              h-10 md:h-12
              px-3 md:px-5

              rounded-2xl

              bg-red-600
              hover:bg-red-700

              text-white
              text-sm md:text-base
              font-bold

              transition-all
              hover:scale-105

              whitespace-nowrap
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