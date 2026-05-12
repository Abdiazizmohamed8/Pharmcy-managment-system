import { useState } from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";

function Login({
  setAuthed,
  setCurrentUser,
  toast,
}) {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  /* =========================
        LOGIN
  ========================= */

  const handleLogin = async () => {

    if (
      !form.email ||
      !form.password
    ) {

      toast(
        "Please fill all fields",
        "error"
      );

      return;
    }

    try {

      setLoading(true);

      /* =========================
            FIREBASE AUTH
      ========================= */

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          form.email.trim(),
          form.password
        );

      const firebaseUser =
        userCredential.user;

      /* =========================
            GET USER DATA
      ========================= */

      const q = query(
        collection(db, "users"),
        where(
          "email",
          "==",
          firebaseUser.email
        )
      );

      const querySnapshot =
        await getDocs(q);

      /* =========================
            USER NOT FOUND
      ========================= */

      if (querySnapshot.empty) {

        toast(
          "User data not found in database",
          "error"
        );

        return;
      }

      /* =========================
            USER DATA
      ========================= */

      const userData =
        querySnapshot.docs[0].data();

      /* =========================
            BLOCK DISABLED USER
      ========================= */

      if (
        userData.status ===
        "disabled"
      ) {

        toast(
          "Account disabled",
          "error"
        );

        return;
      }

      /* =========================
            LOGIN SUCCESS
      ========================= */

      setCurrentUser({
        uid: firebaseUser.uid,
        ...userData,
      });

      setAuthed(true);

      toast(
        "Login successful",
        "success"
      );

    } catch (error) {

      console.log(error);

      /* =========================
            FIREBASE ERRORS
      ========================= */

      if (
        error.code ===
        "auth/user-not-found"
      ) {

        toast(
          "User not found",
          "error"
        );

      } else if (
        error.code ===
        "auth/wrong-password"
      ) {

        toast(
          "Wrong password",
          "error"
        );

      } else if (
        error.code ===
        "auth/invalid-credential"
      ) {

        toast(
          "Invalid email or password",
          "error"
        );

      } else if (
        error.code ===
        "auth/invalid-email"
      ) {

        toast(
          "Invalid email format",
          "error"
        );

      } else {

        toast(
          "Login failed",
          "error"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  /* =========================
        ENTER KEY
  ========================= */

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      handleLogin();
    }
  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        {/* LOGO */}

        <div style={styles.logoSection}>

          <div style={styles.logo}>
            💊
          </div>

          <h1 style={styles.title}>
            ANFAC
          </h1>

          <p style={styles.subtitle}>
            Pharmacy Management System
          </p>

        </div>

        {/* EMAIL */}

        <div style={styles.inputGroup}>

          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter email"
            value={form.email}
            onKeyDown={handleKeyDown}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            style={styles.input}
          />

        </div>

        {/* PASSWORD */}

        <div style={styles.inputGroup}>

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={form.password}
            onKeyDown={handleKeyDown}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            style={styles.input}
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.button,
            background:
              loading
                ? "#86efac"
                : "#16a34a",
          }}
        >

          {
            loading
              ? "Loading..."
              : "Login"
          }

        </button>

      </div>

    </div>
  );
}

/* =========================
      RESPONSIVE STYLES
========================= */

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background:
      "linear-gradient(135deg,#020617,#052e16,#16a34a)",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    borderRadius: "30px",
    padding: "40px 30px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.25)",

    display: "flex",
    flexDirection: "column",

    gap: "18px",
  },

  logoSection: {
    textAlign: "center",
    marginBottom: "10px",
  },

  logo: {
    width: "90px",
    height: "90px",
    margin: "0 auto",
    borderRadius: "25px",
    background: "#16a34a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "42px",
    marginBottom: "15px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(28px,5vw,40px)",
    color: "#111827",
    fontWeight: "800",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "10px",
    fontSize: "14px",
  },

  inputGroup: {
    width: "100%",
  },

  label: {
    fontWeight: "700",
    marginBottom: "8px",
    display: "block",
    color: "#374151",
  },

  input: {
    width: "100%",
    padding: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "16px",
    background: "#f9fafb",
    color: "#111827",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "16px",
  },

  button: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "16px",
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default Login;