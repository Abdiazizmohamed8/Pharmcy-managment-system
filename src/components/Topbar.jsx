import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

function Login({ setAuthed, setCurrentUser, toast }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast("Please fill all fields", "error");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      const firebaseUser = userCredential.user;

      const q = query(
        collection(db, "users"),
        where("email", "==", firebaseUser.email)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast("Your password or username is invalid", "error");
        setLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();

      if (userData.status === "disabled") {
        toast("Account disabled", "error");
        setLoading(false);
        return;
      }

      setCurrentUser({
        uid: firebaseUser.uid,
        ...userData,
      });

      setAuthed(true);
      toast("Login successful", "success");
    } catch (error) {
      console.log(error);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-email"
      ) {
        toast("Your password or username is invalid", "error");
      } else {
        toast("Login failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>💊</div>
          <h1 style={styles.title}>ANFAC</h1>
          <p style={styles.subtitle}>Pharmacy Management System</p>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>

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

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>

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

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.button,
            background: loading ? "#86efac" : "#16a34a",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #020617, #052e16, #16a34a)",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "40px 25px",
    boxShadow:
      "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    boxSizing: "border-box",
  },

  logoSection: {
    textAlign: "center",
    marginBottom: "10px",
  },

  logo: {
    width: "80px",
    height: "80px",
    margin: "0 auto",
    borderRadius: "20px",
    background: "#16a34a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    marginBottom: "12px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
    fontSize: "14px",
  },

  inputGroup: {
    width: "100%",
    textAlign: "left",
  },

  label: {
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
    color: "#374151",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    background: "#f9fafb",
    color: "#111827",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "16px",
    transition: "border-color 0.2s",
  },

  button: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.2s",
    marginTop: "10px",
    boxShadow: "0 4px 6px -1px rgba(22,163,74,0.2)",
  },
};

export default Login;




