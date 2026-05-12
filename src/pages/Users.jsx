import {
  useState,
  useEffect,
} from "react";

import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  db,
  auth,
} from "../firebase";

function Users({
  currentUser,
  toast,
  darkMode,
}) {

  /* =========================
        STATES
  ========================= */

  const [
    users,
    setUsers,
  ] = useState([]);

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  /* =========================
        ADMIN CHECK
  ========================= */

  const isAdmin =
    currentUser?.role
      ?.toLowerCase() ===
    "admin";

  /* =========================
        GET USERS
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "users"
        ),

        (snapshot) => {

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setUsers(data);
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* =========================
        ADD USER
  ========================= */

  const addUser =
    async () => {

      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.password.trim()
      ) {

        toast(
          "Please fill all fields",
          "error"
        );

        return;
      }

      try {

        setLoading(true);

        const cleanEmail =
          form.email
            .trim()
            .toLowerCase();

        const cleanName =
          form.name.trim();

        /* =========================
              CREATE AUTH USER
        ========================= */

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            cleanEmail,
            form.password
          );

        const firebaseUser =
          userCredential.user;

        /* =========================
              SAVE FIRESTORE
        ========================= */

        const newUser = {

          uid:
            firebaseUser.uid,

          name:
            cleanName,

          email:
            cleanEmail,

          role:
            form.role
              .toLowerCase(),

          status:
            "active",
        };

        await setDoc(

          doc(
            db,
            "users",
            firebaseUser.uid
          ),

          newUser
        );

        toast(
          "User created successfully",
          "success"
        );

        /* =========================
              RESET
        ========================= */

        setForm({
          name: "",
          email: "",
          password: "",
          role: "user",
        });

        setShowModal(
          false
        );

      } catch (error) {

        console.log(
          error
        );

        if (
          error.code ===
          "auth/email-already-in-use"
        ) {

          toast(
            "Email already exists",
            "error"
          );

        } else {

          toast(
            error.message,
            "error"
          );
        }

      } finally {

        setLoading(false);
      }
    };

  /* =========================
        DELETE USER
  ========================= */

  const deleteUser =
    async (id) => {

      if (
        currentUser?.id === id
      ) {

        toast(
          "Cannot delete your own account",
          "error"
        );

        return;
      }

      const confirmDelete =
        window.confirm(
          "Delete this user?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(

          doc(
            db,
            "users",
            id
          )
        );

        toast(
          "User deleted",
          "success"
        );

      } catch (error) {

        console.log(
          error
        );

        toast(
          "Delete failed",
          "error"
        );
      }
    };

  /* =========================
        ACCESS DENIED
  ========================= */

  if (!isAdmin) {

    return (

      <div style={{
        ...styles.deniedCard,

        background:
          darkMode
            ? "#111827"
            : "#ffffff",

        color:
          "#ef4444",

        border:
          darkMode
            ? "1px solid #1f2937"
            : "1px solid #e5e7eb",
      }}>

        Access Denied 🚫

      </div>
    );
  }

  return (

    <div style={{
      ...styles.container,

      background:
        darkMode
          ? "#020617"
          : "#f3f4f6",

      color:
        darkMode
          ? "#ffffff"
          : "#111827",
    }}>

      {/* HEADER */}

      <div style={styles.header}>

        {/* LEFT */}

        <div>

          <h1 style={{
            ...styles.title,

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}>
            Users 👤
          </h1>

          <p style={{
            ...styles.subtitle,

            color:
              darkMode
                ? "#9ca3af"
                : "#6b7280",
          }}>
            Manage admins and users
          </p>

        </div>

        {/* BUTTON */}

        <button
          onClick={() =>
            setShowModal(true)
          }

          style={
            styles.addButton
          }
        >
          + Add User
        </button>

      </div>

      {/* TABLE */}

      <div style={{
        ...styles.tableWrapper,

        background:
          darkMode
            ? "#111827"
            : "#ffffff",

        border:
          darkMode
            ? "1px solid #1f2937"
            : "1px solid #e5e7eb",
      }}>

        <table style={styles.table}>

          <thead style={{
            background:
              darkMode
                ? "#0f172a"
                : "#f9fafb",
          }}>

            <tr>

              <th style={th(darkMode)}>
                Name
              </th>

              <th style={th(darkMode)}>
                Email
              </th>

              <th style={th(darkMode)}>
                Role
              </th>

              <th style={th(darkMode)}>
                Status
              </th>

              <th style={th(darkMode)}>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map(
              (user) => (

                <tr
                  key={user.id}

                  style={{
                    borderTop:
                      darkMode
                        ? "1px solid #1f2937"
                        : "1px solid #e5e7eb",
                  }}
                >

                  {/* NAME */}

                  <td style={td(darkMode)}>
                    {user.name}
                  </td>

                  {/* EMAIL */}

                  <td style={{
                    ...td(darkMode),

                    wordBreak:
                      "break-word",
                  }}>
                    {user.email}
                  </td>

                  {/* ROLE */}

                  <td style={td(darkMode)}>

                    <span style={{
                      ...styles.roleBadge,

                      background:
                        user.role ===
                        "admin"

                          ? "#dcfce7"

                          : "#dbeafe",

                      color:
                        user.role ===
                        "admin"

                          ? "#166534"

                          : "#1d4ed8",
                    }}>

                      {user.role}

                    </span>

                  </td>

                  {/* STATUS */}

                  <td style={td(darkMode)}>

                    <span style={{
                      ...styles.statusBadge,

                      background:
                        user.status ===
                        "active"

                          ? "#dcfce7"

                          : "#fee2e2",

                      color:
                        user.status ===
                        "active"

                          ? "#166534"

                          : "#dc2626",
                    }}>

                      {user.status}

                    </span>

                  </td>

                  {/* ACTION */}

                  <td style={td(darkMode)}>

                    <button
                      onClick={() =>
                        deleteUser(
                          user.id
                        )
                      }

                      style={
                        styles.deleteButton
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {showModal && (

        <div style={styles.modalOverlay}>

          <div style={{
            ...styles.modal,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",
          }}>

            <h2 style={{
              ...styles.modalTitle,

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}>
              Add User
            </h2>

            {/* FORM */}

            <div style={styles.formGrid}>

              <input
                type="text"

                placeholder="Full name"

                value={form.name}

                onChange={(e) =>
                  setForm({
                    ...form,

                    name:
                      e.target.value,
                  })
                }

                style={input(darkMode)}
              />

              <input
                type="email"

                placeholder="Email"

                value={form.email}

                onChange={(e) =>
                  setForm({
                    ...form,

                    email:
                      e.target.value,
                  })
                }

                style={input(darkMode)}
              />

              <input
                type="password"

                placeholder="Password"

                value={form.password}

                onChange={(e) =>
                  setForm({
                    ...form,

                    password:
                      e.target.value,
                  })
                }

                style={input(darkMode)}
              />

              <select
                value={form.role}

                onChange={(e) =>
                  setForm({
                    ...form,

                    role:
                      e.target.value,
                  })
                }

                style={input(darkMode)}
              >

                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>

            </div>

            {/* BUTTONS */}

            <div style={styles.modalButtons}>

              <button
                onClick={addUser}

                disabled={loading}

                style={{
                  ...styles.saveButton,

                  opacity:
                    loading
                      ? 0.7
                      : 1,
                }}
              >

                {
                  loading
                    ? "Saving..."
                    : "Save User"
                }

              </button>

              <button
                onClick={() =>
                  setShowModal(false)
                }

                style={{
                  ...styles.cancelButton,

                  background:
                    darkMode
                      ? "#1f2937"
                      : "#f3f4f6",

                  color:
                    darkMode
                      ? "#ffffff"
                      : "#111827",
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

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

    boxSizing: "border-box",
  },

  deniedCard: {
    padding: "40px",

    borderRadius: "24px",

    fontWeight: "bold",

    fontSize:
      "clamp(24px,5vw,30px)",

    textAlign: "center",

    width: "100%",

    boxSizing: "border-box",
  },

  header: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    marginBottom:
      "24px",

    flexWrap:
      "wrap",

    gap: "16px",
  },

  title: {
    margin: 0,

    fontSize:
      "clamp(28px,6vw,34px)",
  },

  subtitle: {
    marginTop:
      "8px",

    fontSize:
      "15px",
  },

  addButton: {
    background:
      "#16a34a",

    color:
      "#ffffff",

    border:
      "none",

    padding:
      "14px 22px",

    borderRadius:
      "14px",

    cursor:
      "pointer",

    fontWeight:
      "bold",

    width: "100%",

    maxWidth:
      "220px",
  },

  tableWrapper: {
    borderRadius:
      "24px",

    overflowX:
      "auto",
  },

  table: {
    width: "100%",

    minWidth:
      "850px",

    borderCollapse:
      "collapse",
  },

  roleBadge: {
    padding:
      "8px 14px",

    borderRadius:
      "999px",

    fontWeight:
      "bold",

    fontSize:
      "12px",

    textTransform:
      "capitalize",

    whiteSpace:
      "nowrap",
  },

  statusBadge: {
    padding:
      "8px 14px",

    borderRadius:
      "999px",

    fontWeight:
      "bold",

    fontSize:
      "12px",

    textTransform:
      "capitalize",

    whiteSpace:
      "nowrap",
  },

  deleteButton: {
    background:
      "#dc2626",

    color:
      "#ffffff",

    border:
      "none",

    padding:
      "10px 14px",

    borderRadius:
      "12px",

    cursor:
      "pointer",

    fontWeight:
      "bold",

    whiteSpace:
      "nowrap",
  },

  modalOverlay: {
    position:
      "fixed",

    inset: 0,

    background:
      "rgba(0,0,0,0.6)",

    display:
      "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    zIndex: 999,

    padding:
      "20px",
  },

  modal: {
    width: "100%",

    maxWidth:
      "500px",

    borderRadius:
      "24px",

    padding:
      "30px",

    boxSizing:
      "border-box",
  },

  modalTitle: {
    marginTop: 0,

    marginBottom:
      "24px",
  },

  formGrid: {
    display: "grid",

    gap: "16px",
  },

  modalButtons: {
    display: "flex",

    gap: "14px",

    marginTop:
      "24px",

    flexWrap:
      "wrap",
  },

  saveButton: {
    flex: 1,

    background:
      "#16a34a",

    color:
      "#ffffff",

    border:
      "none",

    padding:
      "14px",

    borderRadius:
      "14px",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    minWidth:
      "140px",
  },

  cancelButton: {
    flex: 1,

    border:
      "none",

    padding:
      "14px",

    borderRadius:
      "14px",

    fontWeight:
      "bold",

    cursor:
      "pointer",

    minWidth:
      "140px",
  },
};

const th = (
  darkMode
) => ({
  padding: "18px",

  textAlign: "left",

  color:
    darkMode
      ? "#ffffff"
      : "#111827",

  whiteSpace:
    "nowrap",

  fontSize:
    "14px",
});

const td = (
  darkMode
) => ({
  padding: "18px",

  color:
    darkMode
      ? "#e5e7eb"
      : "#111827",

  whiteSpace:
    "nowrap",

  fontSize:
    "14px",
});

const input = (
  darkMode
) => ({
  width: "100%",

  padding: "14px",

  borderRadius:
    "14px",

  border:
    darkMode
      ? "1px solid #374151"
      : "1px solid #d1d5db",

  background:
    darkMode
      ? "#0f172a"
      : "#ffffff",

  color:
    darkMode
      ? "#ffffff"
      : "#111827",

  outline: "none",

  boxSizing:
    "border-box",

  fontSize:
    "14px",
});

export default Users;