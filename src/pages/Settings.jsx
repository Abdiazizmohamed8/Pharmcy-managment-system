import { useState } from "react";

function Settings({
  dark,
  setDark,
  currentUser,
  toast,
}) {
  const [storeName,
    setStoreName] =
    useState(
      "ANFAC Pharmacy"
    );

  const [phone, setPhone] =
    useState(
      "+252612345678"
    );

  const [email, setEmail] =
    useState(
      "info@anfac.so"
    );

  const [address,
    setAddress] =
    useState(
      "Mogadishu Somalia"
    );

  const saveSettings =
    () => {
      toast(
        "Settings saved successfully"
      );
    };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          Settings ⚙️
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "6px",
          }}
        >
          Manage system
          settings
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Store Settings */}
        <div
          style={cardStyle}
        >
          <h2
            style={{
              marginBottom:
                "20px",
            }}
          >
            Pharmacy Info
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "14px",
            }}
          >
            <input
              type="text"
              value={storeName}
              onChange={(e) =>
                setStoreName(
                  e.target
                    .value
                )
              }
              placeholder="Store Name"
              style={
                inputStyle
              }
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
              style={
                inputStyle
              }
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
              style={
                inputStyle
              }
            />

            <input
              type="text"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target
                    .value
                )
              }
              placeholder="Address"
              style={
                inputStyle
              }
            />

            <button
              onClick={
                saveSettings
              }
              style={
                saveBtnStyle
              }
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* System Settings */}
        <div
          style={cardStyle}
        >
          <h2
            style={{
              marginBottom:
                "20px",
            }}
          >
            System Settings
          </h2>

          {/* Dark Mode */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              marginBottom:
                "20px",
            }}
          >
            <div>
              <h4
                style={{
                  margin: 0,
                }}
              >
                Dark Mode
              </h4>

              <p
                style={{
                  margin: 0,
                  color:
                    "#6b7280",
                  fontSize:
                    "14px",
                }}
              >
                Enable dark
                theme
              </p>
            </div>

            <button
              onClick={() =>
                setDark(
                  !dark
                )
              }
              style={{
                width:
                  "60px",
                height:
                  "32px",
                borderRadius:
                  "20px",
                border:
                  "none",
                cursor:
                  "pointer",
                background:
                  dark
                    ? "#16a34a"
                    : "#d1d5db",
                color:
                  "#fff",
                fontWeight:
                  "bold",
              }}
            >
              {dark
                ? "ON"
                : "OFF"}
            </button>
          </div>

          {/* User */}
          <div
            style={{
              marginTop:
                "30px",
              borderTop:
                "1px solid #f3f4f6",
              paddingTop:
                "20px",
            }}
          >
            <h3
              style={{
                marginBottom:
                  "16px",
              }}
            >
              Current User
            </h3>

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width:
                    "55px",
                  height:
                    "55px",
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
                    "#fff",
                  fontWeight:
                    "bold",
                  fontSize:
                    "20px",
                }}
              >
                {
                  currentUser?.avatar
                }
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                  }}
                >
                  {
                    currentUser?.name
                  }
                </h3>

                <p
                  style={{
                    margin: 0,
                    color:
                      "#6b7280",
                  }}
                >
                  {
                    currentUser?.role
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Backup */}
          <div
            style={{
              marginTop:
                "30px",
            }}
          >
            <button
              style={{
                width: "100%",
                background:
                  "#2563eb",
                color: "#fff",
                border: "none",
                padding:
                  "12px",
                borderRadius:
                  "8px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
              }}
            >
              Backup Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "14px",
  boxShadow:
    "0 4px 12px rgba(0,0,0,0.05)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none",
};

const saveBtnStyle = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Settings;