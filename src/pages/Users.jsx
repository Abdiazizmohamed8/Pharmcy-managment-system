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

import {
  useTheme,
} from "../context/ThemeContext";

function Users({
  currentUser,
  toast,
  openSidebar,
}) {

  const {
    darkMode,
  } = useTheme();

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
    editId,
    setEditId,
  ] = useState(null);

  const [
    visiblePasswords,
    setVisiblePasswords,
  ] = useState({});

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

        toast?.(
          "Fill all fields",
          "error"
        );

        return;
      }

      try {

        setLoading(true);

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            form.email,
            form.password
          );

        const firebaseUser =
          userCredential.user;

        const newUser = {

          uid:
            firebaseUser.uid,

          name:
            form.name,

          email:
            form.email,

          password:
            form.password,

          role:
            form.role,

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

        toast?.(
          "User created",
          "success"
        );

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

        console.log(error);

        toast?.(
          error.message,
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  /* =========================
        DELETE USER
  ========================= */

  const deleteUser =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete user?"
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

        toast?.(
          "User deleted",
          "success"
        );

      } catch (error) {

        console.log(error);

        toast?.(
          "Delete failed",
          "error"
        );
      }
    };

  /* =========================
        SAVE EDIT
  ========================= */

  const saveEdit =
    async (user) => {

      try {

        await setDoc(

          doc(
            db,
            "users",
            user.id
          ),

          user
        );

        toast?.(
          "User updated",
          "success"
        );

        setEditId(null);

      } catch (error) {

        console.log(error);

        toast?.(
          "Update failed",
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
        padding: "40px",
        color: "red",
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

        <div style={styles.headerLeft}>

          <button
            onClick={openSidebar}
            style={styles.menuButton}
          >
            ☰
          </button>

          <div>

            <h1 style={styles.title}>
              Users 👤
            </h1>

            <p style={styles.subtitle}>
              Manage all users
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }

          style={styles.addButton}
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
      }}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={th(darkMode)}>
                Name
              </th>

              <th style={th(darkMode)}>
                Email
              </th>

              <th style={th(darkMode)}>
                Password
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
                >

                  {/* NAME */}

                  <td style={td(darkMode)}>

                    {
                      editId ===
                      user.id ? (

                        <input
                          value={
                            user.name
                          }

                          onChange={(e) => {

                            setUsers((prev) =>
                              prev.map((u) =>

                                u.id ===
                                user.id

                                  ? {
                                      ...u,

                                      name:
                                        e.target.value,
                                    }

                                  : u
                              )
                            );
                          }}

                          style={input(
                            darkMode
                          )}
                        />

                      ) : (

                        user.name
                      )
                    }

                  </td>

                  {/* EMAIL */}

                  <td style={td(darkMode)}>

                    {
                      editId ===
                      user.id ? (

                        <input
                          value={
                            user.email
                          }

                          onChange={(e) => {

                            setUsers((prev) =>
                              prev.map((u) =>

                                u.id ===
                                user.id

                                  ? {
                                      ...u,

                                      email:
                                        e.target.value,
                                    }

                                  : u
                              )
                            );
                          }}

                          style={input(
                            darkMode
                          )}
                        />

                      ) : (

                        user.email
                      )
                    }

                  </td>

                  {/* PASSWORD */}

                  <td style={td(darkMode)}>

                    {
                      editId ===
                      user.id ? (

                        <input
                          type={
                            visiblePasswords[
                              user.id
                            ]

                              ? "text"

                              : "password"
                          }

                          value={
                            user.password || ""
                          }

                          onChange={(e) => {

                            setUsers((prev) =>
                              prev.map((u) =>

                                u.id ===
                                user.id

                                  ? {
                                      ...u,

                                      password:
                                        e.target.value,
                                    }

                                  : u
                              )
                            );
                          }}

                          style={input(
                            darkMode
                          )}
                        />

                      ) : (

                        visiblePasswords[
                          user.id
                        ]

                          ? (
                            user.password ||
                            "No Password"
                          )

                          : "••••••••"
                      )
                    }

                  </td>

                  {/* ROLE */}

                  <td style={td(darkMode)}>

                    {
                      editId ===
                      user.id ? (

                        <select
                          value={
                            user.role
                          }

                          onChange={(e) => {

                            setUsers((prev) =>
                              prev.map((u) =>

                                u.id ===
                                user.id

                                  ? {
                                      ...u,

                                      role:
                                        e.target.value,
                                    }

                                  : u
                              )
                            );
                          }}

                          style={input(
                            darkMode
                          )}
                        >

                          <option value="user">
                            User
                          </option>

                          <option value="admin">
                            Admin
                          </option>

                        </select>

                      ) : (

                        <span style={{
                          ...styles.badge,

                          background:
                            user.role ===
                            "admin"

                              ? "#14532d"

                              : "#1e3a8a",

                          color:
                            user.role ===
                            "admin"

                              ? "#22c55e"

                              : "#60a5fa",
                        }}>

                          {user.role}

                        </span>
                      )
                    }

                  </td>

                  {/* STATUS */}

                  <td style={td(darkMode)}>

                    <span style={{
                      ...styles.badge,
                      background:
                        "#14532d",
                      color:
                        "#22c55e",
                    }}>

                      Active

                    </span>

                  </td>

                  {/* ACTION */}

                  <td style={td(darkMode)}>

                    <div style={styles.actions}>

                      <button
                        onClick={() =>

                          setVisiblePasswords(
                            (prev) => ({

                              ...prev,

                              [user.id]:
                                !prev[
                                  user.id
                                ],
                            })
                          )
                        }

                        style={
                          styles.showButton
                        }
                      >

                        {
                          visiblePasswords[
                            user.id
                          ]

                            ? "Hide"

                            : "Show"
                        }

                      </button>

                      {
                        editId ===
                        user.id ? (

                          <button
                            onClick={() =>
                              saveEdit(
                                user
                              )
                            }

                            style={
                              styles.saveButton
                            }
                          >
                            Save
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              setEditId(
                                user.id
                              )
                            }

                            style={
                              styles.editButton
                            }
                          >
                            Edit
                          </button>
                        )
                      }

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

                    </div>

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

            <h2>
              Add User
            </h2>

            <div style={styles.formGrid}>

              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value,
                  })
                }
                style={input(
                  darkMode
                )}
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
                style={input(
                  darkMode
                )}
              />

              <input
                type="text"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target.value,
                  })
                }
                style={input(
                  darkMode
                )}
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
                style={input(
                  darkMode
                )}
              >

                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>

            </div>

            <div style={styles.modalButtons}>

              <button
                onClick={addUser}
                disabled={loading}
                style={styles.saveButton}
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
                style={
                  styles.cancelButton
                }
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
    padding: "14px",
    overflowX: "hidden",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "20px",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  menuButton: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "20px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    marginTop: "5px",
    color: "#94a3b8",
  },

  addButton: {
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  badge: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  showButton: {
    background: "#f59e0b",
    color: "#ffffff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  editButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  saveButton: {
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  deleteButton: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    padding: "20px",
  },

  modal: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "24px",
    padding: "30px",
    boxSizing: "border-box",
  },

  formGrid: {
    display: "grid",
    gap: "16px",
    marginTop: "20px",
  },

  modalButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },

  cancelButton: {
    flex: 1,
    background: "#374151",
    color: "#ffffff",
    border: "none",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

const th = (darkMode) => ({
  padding: "16px",
  textAlign: "left",
  background:
    darkMode
      ? "#0f172a"
      : "#e5e7eb",
  color:
    darkMode
      ? "#ffffff"
      : "#111827",
  fontWeight: "bold",
});

const td = (darkMode) => ({
  padding: "16px",
  borderBottom:
    darkMode
      ? "1px solid #1e293b"
      : "1px solid #d1d5db",
});

const input = (
  darkMode
) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
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
  boxSizing: "border-box",
});

export default Users;