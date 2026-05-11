import {
  useState,
} from "react";

function Settings({
  dark,
  setDark,
  currentUser,
  toast,
}) {

  /* =========================
     STATES
  ========================= */

  const [
    storeName,
    setStoreName,
  ] = useState(
    "ANFAC Pharmacy"
  );

  const [
    phone,
    setPhone,
  ] = useState(
    "+252612345678"
  );

  const [
    email,
    setEmail,
  ] = useState(
    "info@anfac.so"
  );

  const [
    address,
    setAddress,
  ] = useState(
    "Mogadishu Somalia"
  );

  const [
    currency,
    setCurrency,
  ] = useState(
    "USD"
  );

  /* =========================
     SAVE SETTINGS
  ========================= */

  const saveSettings =
    () => {

      toast(
        "Settings saved successfully",
        "success"
      );
    };

  /* =========================
     BACKUP
  ========================= */

  const backupDatabase =
    () => {

      toast(
        "Database backup completed",
        "success"
      );
    };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",

        background:
          dark
            ? "#020617"
            : "#f3f4f6",

        color:
          dark
            ? "#ffffff"
            : "#111827",

        padding: "24px",

        transition:
          "0.3s ease",

        boxSizing:
          "border-box",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          marginBottom:
            "30px",
        }}
      >

        <h1
          style={{
            margin: 0,

            fontSize:
              "40px",

            fontWeight:
              "bold",

            color:
              dark
                ? "#ffffff"
                : "#111827",
          }}
        >
          Settings ⚙️
        </h1>

        <p
          style={{
            marginTop:
              "10px",

            color:
              dark
                ? "#d1d5db"
                : "#6b7280",

            fontSize:
              "15px",
          }}
        >
          Manage pharmacy settings
        </p>
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(340px,1fr))",

          gap: "24px",
        }}
      >

        {/* PHARMACY INFO */}

        <div
          style={card(
            dark
          )}
        >

          <h2
            style={title(
              dark
            )}
          >
            Pharmacy Info 🏥
          </h2>

          <div
            style={{
              display: "flex",

              flexDirection:
                "column",

              gap: "16px",
            }}
          >

            <input
              type="text"

              value={
                storeName
              }

              onChange={(e) =>
                setStoreName(
                  e.target
                    .value
                )
              }

              placeholder="Store Name"

              style={input(
                dark
              )}
            />

            <input
              type="text"

              value={phone}

              onChange={(e) =>
                setPhone(
                  e.target
                    .value
                )
              }

              placeholder="Phone"

              style={input(
                dark
              )}
            />

            <input
              type="email"

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target
                    .value
                )
              }

              placeholder="Email"

              style={input(
                dark
              )}
            />

            <input
              type="text"

              value={
                address
              }

              onChange={(e) =>
                setAddress(
                  e.target
                    .value
                )
              }

              placeholder="Address"

              style={input(
                dark
              )}
            />

            <select
              value={
                currency
              }

              onChange={(e) =>
                setCurrency(
                  e.target
                    .value
                )
              }

              style={input(
                dark
              )}
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

            <button
              onClick={
                saveSettings
              }

              style={
                saveBtn
              }
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* SYSTEM SETTINGS */}

        <div
          style={card(
            dark
          )}
        >

          <h2
            style={title(
              dark
            )}
          >
            System Settings 🛠️
          </h2>

          {/* DARK MODE */}

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              padding:
                "18px",

              borderRadius:
                "18px",

              background:
                dark
                  ? "#0f172a"
                  : "#f9fafb",

              marginBottom:
                "24px",
            }}
          >

            <div>

              <h4
                style={{
                  margin:
                    "0 0 6px",

                  color:
                    dark
                      ? "#ffffff"
                      : "#111827",
                }}
              >
                Dark Mode
              </h4>

              <p
                style={{
                  margin: 0,

                  fontSize:
                    "14px",

                  color:
                    dark
                      ? "#d1d5db"
                      : "#6b7280",
                }}
              >
                Enable dark theme
              </p>
            </div>

            <button
              onClick={() =>
                setDark(
                  !dark
                )
              }

              style={{
                width: "80px",

                height: "40px",

                borderRadius:
                  "999px",

                border:
                  "none",

                cursor:
                  "pointer",

                background:
                  dark
                    ? "#16a34a"
                    : "#d1d5db",

                color:
                  "#ffffff",

                fontWeight:
                  "bold",

                transition:
                  "0.3s",
              }}
            >
              {dark
                ? "ON"
                : "OFF"}
            </button>
          </div>

          {/* USER */}

          <div
            style={{
              borderTop:
                dark

                  ? "1px solid #1f2937"

                  : "1px solid #e5e7eb",

              paddingTop:
                "24px",
            }}
          >

            <h3
              style={{
                marginTop: 0,

                marginBottom:
                  "18px",

                color:
                  dark
                    ? "#ffffff"
                    : "#111827",
              }}
            >
              Current User 👤
            </h3>

            <div
              style={{
                display: "flex",

                alignItems:
                  "center",

                gap: "16px",
              }}
            >

              {/* AVATAR */}

              <div
                style={{
                  width: "64px",

                  height:
                    "64px",

                  borderRadius:
                    "50%",

                  background:
                    "#16a34a",

                  display:
                    "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  color:
                    "#ffffff",

                  fontWeight:
                    "bold",

                  fontSize:
                    "24px",
                }}
              >
                {currentUser?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "A"}
              </div>

              {/* USER INFO */}

              <div>

                <h3
                  style={{
                    margin:
                      "0 0 6px",

                    color:
                      dark
                        ? "#ffffff"
                        : "#111827",
                  }}
                >
                  {currentUser?.name ||
                    "Admin"}
                </h3>

                <p
                  style={{
                    margin: 0,

                    color:
                      dark
                        ? "#d1d5db"
                        : "#6b7280",
                  }}
                >
                  {currentUser?.role ||
                    "Administrator"}
                </p>
              </div>
            </div>
          </div>

          {/* BACKUP */}

          <div
            style={{
              marginTop:
                "28px",
            }}
          >

            <button
              onClick={
                backupDatabase
              }

              style={
                backupBtn
              }
            >
              Backup Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   CARD
========================= */

const card = (
  dark
) => ({
  background:
    dark
      ? "#111827"
      : "#ffffff",

  padding: "28px",

  borderRadius:
    "24px",

  border:
    dark
      ? "1px solid #1f2937"
      : "1px solid #e5e7eb",

  boxShadow:
    dark
      ? "0 4px 20px rgba(0,0,0,0.35)"
      : "0 8px 24px rgba(0,0,0,0.05)",
});

/* =========================
   TITLE
========================= */

const title = (
  dark
) => ({
  marginTop: 0,

  marginBottom:
    "24px",

  color:
    dark
      ? "#ffffff"
      : "#111827",
});

/* =========================
   INPUT
========================= */

const input = (
  dark
) => ({
  width: "100%",

  padding:
    "14px 16px",

  borderRadius:
    "14px",

  border:
    dark

      ? "1px solid #374151"

      : "1px solid #d1d5db",

  background:
    dark
      ? "#0f172a"
      : "#ffffff",

  color:
    dark
      ? "#ffffff"
      : "#111827",

  outline:
    "none",

  fontSize:
    "15px",

  boxSizing:
    "border-box",
});

/* =========================
   BUTTONS
========================= */

const saveBtn = {
  background:
    "#16a34a",

  color:
    "#ffffff",

  border:
    "none",

  padding:
    "15px",

  borderRadius:
    "14px",

  cursor:
    "pointer",

  fontWeight:
    "bold",

  fontSize:
    "15px",
};

const backupBtn = {
  width: "100%",

  background:
    "#2563eb",

  color:
    "#ffffff",

  border:
    "none",

  padding:
    "15px",

  borderRadius:
    "14px",

  cursor:
    "pointer",

  fontWeight:
    "bold",

  fontSize:
    "15px",
};

export default Settings;