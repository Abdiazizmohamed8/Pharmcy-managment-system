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

    <div style={{
      ...styles.container,

      background:
        dark
          ? "#020617"
          : "#f3f4f6",

      color:
        dark
          ? "#ffffff"
          : "#111827",
    }}>

      {/* HEADER */}

      <div style={styles.header}>

        <h1 style={{
          ...styles.title,

          color:
            dark
              ? "#ffffff"
              : "#111827",
        }}>
          Settings ⚙️
        </h1>

        <p style={{
          ...styles.subtitle,

          color:
            dark
              ? "#d1d5db"
              : "#6b7280",
        }}>
          Manage pharmacy settings
        </p>

      </div>

      {/* GRID */}

      <div style={styles.grid}>

        {/* PHARMACY INFO */}

        <div style={card(dark)}>

          <h2 style={title(dark)}>
            Pharmacy Info 🏥
          </h2>

          <div style={styles.formWrapper}>

            <input
              type="text"

              value={
                storeName
              }

              onChange={(e) =>
                setStoreName(
                  e.target.value
                )
              }

              placeholder="Store Name"

              style={input(dark)}
            />

            <input
              type="text"

              value={phone}

              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }

              placeholder="Phone"

              style={input(dark)}
            />

            <input
              type="email"

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

              placeholder="Email"

              style={input(dark)}
            />

            <input
              type="text"

              value={
                address
              }

              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }

              placeholder="Address"

              style={input(dark)}
            />

            <select
              value={
                currency
              }

              onChange={(e) =>
                setCurrency(
                  e.target.value
                )
              }

              style={input(dark)}
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

        <div style={card(dark)}>

          <h2 style={title(dark)}>
            System Settings 🛠️
          </h2>

          {/* DARK MODE */}

          <div style={{
            ...styles.darkCard,

            background:
              dark
                ? "#0f172a"
                : "#f9fafb",
          }}>

            <div>

              <h4 style={{
                margin:
                  "0 0 6px",

                color:
                  dark
                    ? "#ffffff"
                    : "#111827",
              }}>
                Dark Mode
              </h4>

              <p style={{
                margin: 0,

                fontSize:
                  "14px",

                color:
                  dark
                    ? "#d1d5db"
                    : "#6b7280",
              }}>
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
                ...styles.toggleButton,

                background:
                  dark
                    ? "#16a34a"
                    : "#d1d5db",
              }}
            >

              {dark
                ? "ON"
                : "OFF"}

            </button>

          </div>

          {/* USER */}

          <div style={{
            borderTop:
              dark

                ? "1px solid #1f2937"

                : "1px solid #e5e7eb",

            paddingTop:
              "24px",
          }}>

            <h3 style={{
              marginTop: 0,

              marginBottom:
                "18px",

              color:
                dark
                  ? "#ffffff"
                  : "#111827",
            }}>
              Current User 👤
            </h3>

            <div style={styles.userWrapper}>

              {/* AVATAR */}

              <div style={styles.avatar}>

                {
                  currentUser?.name
                    ?.charAt(0)
                    ?.toUpperCase() ||

                  "A"
                }

              </div>

              {/* USER INFO */}

              <div>

                <h3 style={{
                  margin:
                    "0 0 6px",

                  color:
                    dark
                      ? "#ffffff"
                      : "#111827",

                  wordBreak:
                    "break-word",
                }}>

                  {
                    currentUser?.name ||

                    "Admin"
                  }

                </h3>

                <p style={{
                  margin: 0,

                  color:
                    dark
                      ? "#d1d5db"
                      : "#6b7280",

                  wordBreak:
                    "break-word",
                }}>

                  {
                    currentUser?.role ||

                    "Administrator"
                  }

                </p>

              </div>

            </div>

          </div>

          {/* BACKUP */}

          <div style={{
            marginTop:
              "28px",
          }}>

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
      STYLES
========================= */

const styles = {

  container: {
    width: "100%",

    minHeight: "100vh",

    padding: "24px",

    transition:
      "0.3s ease",

    boxSizing:
      "border-box",
  },

  header: {
    marginBottom:
      "30px",
  },

  title: {
    margin: 0,

    fontSize:
      "clamp(30px,6vw,40px)",

    fontWeight:
      "bold",

    wordBreak:
      "break-word",
  },

  subtitle: {
    marginTop:
      "10px",

    fontSize:
      "15px",
  },

  grid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",

    gap: "24px",

    alignItems:
      "start",
  },

  formWrapper: {
    display: "flex",

    flexDirection:
      "column",

    gap: "16px",
  },

  darkCard: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    flexWrap:
      "wrap",

    gap: "16px",

    padding:
      "18px",

    borderRadius:
      "18px",

    marginBottom:
      "24px",
  },

  toggleButton: {
    width: "80px",

    height: "40px",

    borderRadius:
      "999px",

    border:
      "none",

    cursor:
      "pointer",

    color:
      "#ffffff",

    fontWeight:
      "bold",

    transition:
      "0.3s",

    flexShrink: 0,
  },

  userWrapper: {
    display: "flex",

    alignItems:
      "center",

    gap: "16px",

    flexWrap:
      "wrap",
  },

  avatar: {
    width: "64px",

    height: "64px",

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

    flexShrink: 0,
  },
};

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

  width: "100%",

  boxSizing:
    "border-box",
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

  fontSize:
    "clamp(22px,5vw,28px)",
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

  width: "100%",

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