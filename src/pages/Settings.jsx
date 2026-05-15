import { useState } from "react";

import {
  useTheme,
} from "../context/ThemeContext";

function Settings({
  currentUser,
  toast,
  openSidebar,
}) {

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  // Theme
  const ui = {
    bg: darkMode
      ? "bg-[#020617] text-white"
      : "bg-slate-100 text-black",

    card: darkMode
      ? "bg-[#111827] border-[#1f2937]"
      : "bg-white border-slate-200",

    input: darkMode
      ? "bg-[#0f172a] border-[#374151] text-white"
      : "bg-white border-slate-300 text-black",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  // States
  const [form, setForm] =
    useState({

      storeName:
        "ANFAC Pharmacy",

      phone:
        "+252615189953",

      email:
        "info@anfac.so",

      address:
        "Mogadishu Somalia",

      currency:
        "USD",
    });

  // Input Change
  const change =
    (e) => {

      setForm({
        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  // Save
  const saveSettings =
    () => {

      toast?.(
        "Settings saved",
        "success"
      );
    };

  // Backup
  const backupDatabase =
    () => {

      toast?.(
        "Backup completed",
        "success"
      );
    };

  return (

    <div className={`
      min-h-screen p-4 md:p-6
      ${ui.bg}
    `}>

      {/* Header */}
      <div className="
        flex items-center gap-4
        mb-8
      ">

        <button
          onClick={openSidebar}
          className={`
            md:hidden
            w-12 h-12
            rounded-2xl
            text-xl
            ${ui.card}
          `}
        >
          ☰
        </button>

        <div>

          <h1 className="
            text-3xl md:text-5xl
            font-black
          ">
            Settings ⚙️
          </h1>

          <p className={ui.text}>
            Manage pharmacy settings
          </p>

        </div>

      </div>

      {/* Grid */}
      <div className="
        grid grid-cols-1
        xl:grid-cols-2
        gap-6
      ">

        {/* Pharmacy */}
        <div className={`
          p-6 rounded-3xl border
          ${ui.card}
        `}>

          <h2 className="
            text-2xl font-black
            mb-6
          ">
            Pharmacy Info 🏥
          </h2>

          <div className="
            space-y-4
          ">

            {[
              [
                "storeName",
                "Store Name",
              ],

              [
                "phone",
                "Phone",
              ],

              [
                "email",
                "Email",
              ],

              [
                "address",
                "Address",
              ],
            ].map(
              ([key, text]) => (

                <input
                  key={key}
                  name={key}
                  placeholder={text}
                  value={form[key]}
                  onChange={change}
                  className={`
                    w-full h-14 px-5
                    rounded-2xl border
                    outline-none
                    ${ui.input}
                  `}
                />

              )
            )}

            {/* Currency */}
            <select
              name="currency"
              value={form.currency}
              onChange={change}
              className={`
                w-full h-14 px-5
                rounded-2xl border
                outline-none
                ${ui.input}
              `}
            >

              <option>
                USD
              </option>

              <option>
                SOS
              </option>

              <option>
                ETB
              </option>

            </select>

            {/* Save */}
            <button
              onClick={
                saveSettings
              }
              className="
                w-full h-14
                rounded-2xl
                bg-green-600
                hover:bg-green-700
                text-white font-bold
              "
            >
              Save Settings
            </button>

          </div>

        </div>

        {/* System */}
        <div className={`
          p-6 rounded-3xl border
          ${ui.card}
        `}>

          <h2 className="
            text-2xl font-black
            mb-6
          ">
            System Settings 🛠️
          </h2>

          {/* Dark Mode */}
          <div className="
            flex items-center
            justify-between
            gap-4
            rounded-3xl
            p-5 mb-6
            bg-slate-900/60
          ">

            <div>

              <h3 className="
                font-bold mb-1
              ">
                Dark Mode
              </h3>

              <p className={ui.text}>
                Enable dark theme
              </p>

            </div>

            <button
              onClick={
                toggleTheme
              }
              className={`
                w-20 h-10
                rounded-full
                text-white font-bold
                ${
                  darkMode
                    ? "bg-green-600"
                    : "bg-slate-500"
                }
              `}
            >

              {darkMode
                ? "ON"
                : "OFF"}

            </button>

          </div>

          {/* User */}
          <div className="
            border-t border-slate-700
            pt-6
          ">

            <h3 className="
              text-xl font-black
              mb-5
            ">
              Current User 👤
            </h3>

            <div className="
              flex items-center gap-4
            ">

              {/* Avatar */}
              <div className="
                w-16 h-16
                rounded-full
                bg-green-600
                flex items-center
                justify-center
                text-2xl font-black
                text-white
              ">

                {
                  currentUser?.name
                    ?.charAt(0)
                    ?.toUpperCase() ||

                  "A"
                }

              </div>

              {/* Info */}
              <div>

                <h3 className="
                  text-xl font-bold
                ">

                  {
                    currentUser?.name ||

                    "Admin"
                  }

                </h3>

                <p className={ui.text}>

                  {
                    currentUser?.role ||

                    "Administrator"
                  }

                </p>

              </div>

            </div>

          </div>

          {/* Backup */}
          <button
            onClick={
              backupDatabase
            }
            className="
              w-full h-14 mt-8
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white font-bold
            "
          >
            Backup Database
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;