import { useState } from "react";

function Login({
  users,
  setAuthed,
  setCurrentUser,
  toast,
}) {

  const [
    form,
    setForm,
  ] = useState({
    username: "",
    password: "",
  });

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = () => {

    const foundUser =
      users.find(
        (user) =>
          user.username ===
            form.username &&
          user.password ===
            form.password
      );

    if (!foundUser) {

      toast(
        "Wrong username or password",
        "error"
      );

      return;
    }

    setCurrentUser(
      foundUser
    );

    setAuthed(true);

    toast(
      "Login successful"
    );
  };

  return (
    <div
      style={{
        minHeight:
          "100vh",

        display: "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        background:
          "linear-gradient(135deg,#052e16,#16a34a)",

        padding:
          "20px",
      }}
    >

      {/* LOGIN CARD */}

      <div
        style={{
          width: "100%",

          maxWidth:
            "420px",

          background:
            "#ffffff",

          borderRadius:
            "24px",

          padding:
            "40px 35px",

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.15)",
        }}
      >

        {/* LOGO */}

        <div
          style={{
            textAlign:
              "center",

            marginBottom:
              "30px",
          }}
        >

          <div
            style={{
              width: "90px",

              height:
                "90px",

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

              margin:
                "0 auto 18px",

              fontSize:
                "42px",

              color: "#fff",
            }}
          >
            💊
          </div>

          <h1
            style={{
              color:
                "#111827",

              margin: 0,

              fontSize:
                "34px",

              fontWeight:
                "bold",
            }}
          >
            ANFAC
          </h1>

          <p
            style={{
              color:
                "#6b7280",

              marginTop:
                "8px",

              fontSize:
                "15px",
            }}
          >
            Pharmacy Management
            System
          </p>
        </div>

        {/* USERNAME */}

        <div
          style={{
            marginBottom:
              "18px",
          }}
        >

          <label
            style={{
              color:
                "#111827",

              fontSize:
                "14px",

              fontWeight:
                "bold",

              display:
                "block",

              marginBottom:
                "8px",
            }}
          >
            Username
          </label>

          <input
            type="text"

            placeholder="Enter username"

            value={
              form.username
            }

            onChange={(e) =>
              setForm({
                ...form,

                username:
                  e.target
                    .value,
              })
            }

            style={{
              width: "100%",

              padding:
                "15px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                "14px",

              outline:
                "none",

              fontSize:
                "15px",

              background:
                "#f9fafb",
            }}
          />
        </div>

        {/* PASSWORD */}

        <div
          style={{
            marginBottom:
              "24px",
          }}
        >

          <label
            style={{
              color:
                "#111827",

              fontSize:
                "14px",

              fontWeight:
                "bold",

              display:
                "block",

              marginBottom:
                "8px",
            }}
          >
            Password
          </label>

          <input
            type="password"

            placeholder="Enter password"

            value={
              form.password
            }

            onChange={(e) =>
              setForm({
                ...form,

                password:
                  e.target
                    .value,
              })
            }

            style={{
              width: "100%",

              padding:
                "15px",

              border:
                "1px solid #d1d5db",

              borderRadius:
                "14px",

              outline:
                "none",

              fontSize:
                "15px",

              background:
                "#f9fafb",
            }}
          />
        </div>

        {/* LOGIN BUTTON */}

        <button
          onClick={
            handleLogin
          }

          style={{
            width: "100%",

            padding:
              "15px",

            background:
              "#16a34a",

            color: "#fff",

            border: "none",

            borderRadius:
              "14px",

            fontWeight:
              "bold",

            cursor:
              "pointer",

            fontSize:
              "16px",
          }}
        >
          Login
        </button>

        {/* DEMO LOGIN */}

        <div
          style={{
            marginTop:
              "24px",

            background:
              "#f3f4f6",

            padding:
              "16px",

            borderRadius:
              "14px",

            fontSize:
              "14px",

            lineHeight:
              "24px",

            color:
              "#374151",
          }}
        >

          <div
            style={{
              fontWeight:
                "bold",

              marginBottom:
                "8px",
            }}
          >
            Demo Accounts
          </div>

          <div>
            👑 Admin:
            <strong>
              {" "}
              admin
            </strong>{" "}
            / 1234
          </div>

          <div>
            💳 Cashier:
            <strong>
              {" "}
              cashier
            </strong>{" "}
            / 1234
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;