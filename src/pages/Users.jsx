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
      <div
        style={{
          padding:
            "40px",

          borderRadius:
            "24px",

          background:
            darkMode
              ? "#111827"
              : "#ffffff",

          color:
            "#ef4444",

          fontWeight:
            "bold",

          fontSize:
            "30px",
        }}
      >
        Access Denied 🚫
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div
        style={{
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
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",

              fontSize:
                "34px",
            }}
          >
            Users 👤
          </h1>

          <p
            style={{
              marginTop:
                "8px",

              color:
                darkMode
                  ? "#9ca3af"
                  : "#6b7280",
            }}
          >
            Manage admins and users
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }

          style={{
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
          }}
        >
          + Add User
        </button>
      </div>

      {/* TABLE */}

      <div
        style={{
          background:
            darkMode
              ? "#111827"
              : "#ffffff",

          borderRadius:
            "24px",

          overflowX:
            "auto",

          border:
            darkMode
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}
      >

        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",

            minWidth:
              "850px",
          }}
        >

          <thead
            style={{
              background:
                darkMode
                  ? "#0f172a"
                  : "#f9fafb",
            }}
          >

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

                  <td style={td(darkMode)}>
                    {user.name}
                  </td>

                  <td style={td(darkMode)}>
                    {user.email}
                  </td>

                  <td style={td(darkMode)}>
                    {user.role}
                  </td>

                  <td style={td(darkMode)}>
                    {user.status}
                  </td>

                  <td style={td(darkMode)}>

                    <button
                      onClick={() =>
                        deleteUser(
                          user.id
                        )
                      }

                      style={{
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
                      }}
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

        <div
          style={{
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
          }}
        >

          <div
            style={{
              width: "100%",

              maxWidth:
                "500px",

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",

              borderRadius:
                "24px",

              padding:
                "30px",
            }}
          >

            <h2
              style={{
                marginTop: 0,

                marginBottom:
                  "24px",

                color:
                  darkMode
                    ? "#ffffff"
                    : "#111827",
              }}
            >
              Add User
            </h2>

            <div
              style={{
                display: "grid",

                gap: "16px",
              }}
            >

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

            <div
              style={{
                display: "flex",

                gap: "14px",

                marginTop:
                  "24px",
              }}
            >

              <button
                onClick={addUser}

                disabled={loading}

                style={{
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
                  flex: 1,

                  background:
                    darkMode
                      ? "#1f2937"
                      : "#f3f4f6",

                  color:
                    darkMode
                      ? "#ffffff"
                      : "#111827",

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

const th = (
  darkMode
) => ({
  padding: "18px",
  textAlign: "left",
  color: darkMode
    ? "#ffffff"
    : "#111827",
});

const td = (
  darkMode
) => ({
  padding: "18px",
  color: darkMode
    ? "#e5e7eb"
    : "#111827",
});

const input = (
  darkMode
) => ({
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: darkMode
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
});

export default Users;