import { useState } from "react";

function Users({
  users,
  setUsers,
  currentUser,
  setCurrentUser,
  toast,
}) {

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    username: "",
    password: "",
    role: "Cashier",
    image: "",
  });

  /* =========================
     ADD USER
  ========================= */

  const addUser = () => {

    if (
      !form.name ||
      !form.username ||
      !form.password
    ) {

      toast(
        "Fill all fields",
        "error"
      );

      return;
    }

    const newUser = {
      id: Date.now(),

      name: form.name,

      username:
        form.username,

      password:
        form.password,

      role: form.role,

      image:
        form.image,

      active: true,
    };

    /* SAVE USER */
    setUsers((prev) => [
      ...prev,
      newUser,
    ]);

    /* UPDATE CURRENT USER */
    setCurrentUser(
      newUser
    );

    toast(
      "User added successfully"
    );

    setShowModal(false);

    setForm({
      name: "",
      username: "",
      password: "",
      role: "Cashier",
      image: "",
    });
  };

  /* =========================
     DELETE USER
  ========================= */

  const deleteUser = (
    id
  ) => {

    setUsers((prev) =>
      prev.filter(
        (user) =>
          user.id !== id
      )
    );

    toast(
      "User deleted",
      "error"
    );
  };

  /* =========================
     TOGGLE STATUS
  ========================= */

  const toggleStatus = (
    id
  ) => {

    setUsers((prev) =>
      prev.map((user) =>

        user.id === id

          ? {
              ...user,

              active:
                !user.active,
            }

          : user
      )
    );

    toast(
      "User status updated"
    );
  };

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          marginBottom:
            "24px",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,

              fontSize:
                "30px",
            }}
          >
            Users 👤
          </h1>

          <p
            style={{
              color:
                "#6b7280",

              marginTop:
                "6px",
            }}
          >
            Manage pharmacy
            users
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(
              true
            )
          }

          style={{
            background:
              "#16a34a",

            color: "#fff",

            border: "none",

            padding:
              "13px 20px",

            borderRadius:
              "12px",

            cursor:
              "pointer",

            fontWeight:
              "bold",
          }}
        >
          + Add User
        </button>
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <div
        style={{
          background:
            "#fff",

          borderRadius:
            "18px",

          overflow:
            "hidden",

          boxShadow:
            "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >

        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",
          }}
        >

          <thead
            style={{
              background:
                "#f3f4f6",
            }}
          >

            <tr>

              <th
                style={
                  thStyle
                }
              >
                User
              </th>

              <th
                style={
                  thStyle
                }
              >
                Username
              </th>

              <th
                style={
                  thStyle
                }
              >
                Role
              </th>

              <th
                style={
                  thStyle
                }
              >
                Status
              </th>

              <th
                style={
                  thStyle
                }
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {users.map(
              (user) => (

                <tr
                  key={user.id}
                >

                  {/* USER */}
                  <td
                    style={
                      tdStyle
                    }
                  >

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap: "12px",
                      }}
                    >

                      {/* IMAGE */}
                      {user.image ? (

                        <img
                          src={
                            user.image
                          }

                          alt="user"

                          style={{
                            width:
                              "52px",

                            height:
                              "52px",

                            borderRadius:
                              "50%",

                            objectFit:
                              "cover",

                            border:
                              "2px solid #16a34a",
                          }}
                        />

                      ) : (

                        <div
                          style={{
                            width:
                              "52px",

                            height:
                              "52px",

                            borderRadius:
                              "50%",

                            background:
                              "#16a34a",

                            color:
                              "#fff",

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            fontWeight:
                              "bold",

                            fontSize:
                              "18px",
                          }}
                        >
                          {
                            user.name?.charAt(
                              0
                            )
                          }
                        </div>
                      )}

                      <div>

                        <h4
                          style={{
                            margin: 0,

                            fontSize:
                              "15px",
                          }}
                        >
                          {
                            user.name
                          }
                        </h4>
                      </div>
                    </div>
                  </td>

                  {/* USERNAME */}
                  <td
                    style={
                      tdStyle
                    }
                  >
                    {
                      user.username
                    }
                  </td>

                  {/* ROLE */}
                  <td
                    style={
                      tdStyle
                    }
                  >

                    <span
                      style={{
                        background:
                          user.role ===
                          "Admin"

                            ? "#dcfce7"

                            : "#dbeafe",

                        color:
                          user.role ===
                          "Admin"

                            ? "#166534"

                            : "#1d4ed8",

                        padding:
                          "6px 12px",

                        borderRadius:
                          "999px",

                        fontSize:
                          "12px",

                        fontWeight:
                          "bold",
                      }}
                    >
                      {user.role ===
                      "Admin"

                        ? "👑 Admin"

                        : "💳 Cashier"}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td
                    style={
                      tdStyle
                    }
                  >

                    <span
                      style={{
                        background:
                          user.active

                            ? "#dcfce7"

                            : "#fee2e2",

                        color:
                          user.active

                            ? "#16a34a"

                            : "#dc2626",

                        padding:
                          "6px 12px",

                        borderRadius:
                          "999px",

                        fontSize:
                          "12px",

                        fontWeight:
                          "bold",
                      }}
                    >
                      {user.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td
                    style={
                      tdStyle
                    }
                  >

                    <div
                      style={{
                        display:
                          "flex",

                        gap: "8px",
                      }}
                    >

                      <button
                        onClick={() =>
                          toggleStatus(
                            user.id
                          )
                        }

                        style={{
                          background:
                            "#2563eb",

                          color:
                            "#fff",

                          border:
                            "none",

                          padding:
                            "8px 12px",

                          borderRadius:
                            "8px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "bold",
                        }}
                      >
                        Toggle
                      </button>

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
                            "#fff",

                          border:
                            "none",

                          padding:
                            "8px 12px",

                          borderRadius:
                            "8px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "bold",
                        }}
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

      {/* =========================
          MODAL
      ========================= */}

      {showModal && (

        <div
          style={{
            position:
              "fixed",

            inset: 0,

            background:
              "rgba(0,0,0,0.5)",

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
              background:
                "#fff",

              padding:
                "30px",

              borderRadius:
                "18px",

              width: "100%",

              maxWidth:
                "430px",
            }}
          >

            <h2
              style={{
                marginBottom:
                  "20px",
              }}
            >
              Add User
            </h2>

            <div
              style={{
                display:
                  "flex",

                flexDirection:
                  "column",

                gap: "14px",
              }}
            >

              {/* NAME */}
              <input
                type="text"

                placeholder="Full Name"

                value={
                  form.name
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    name:
                      e.target
                        .value,
                  })
                }

                style={
                  inputStyle
                }
              />

              {/* USERNAME */}
              <input
                type="text"

                placeholder="Username"

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

                style={
                  inputStyle
                }
              />

              {/* PASSWORD */}
              <input
                type="password"

                placeholder="Password"

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

                style={
                  inputStyle
                }
              />

              {/* IMAGE */}
              <div>

                <label
                  style={{
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
                  Upload Photo
                </label>

                <input
                  type="file"

                  accept="image/*"

                  onChange={(
                    e
                  ) => {

                    const file =
                      e.target
                        .files[0];

                    if (
                      file
                    ) {

                      const reader =
                        new FileReader();

                      reader.onloadend =
                        () => {

                          setForm({
                            ...form,

                            image:
                              reader.result,
                          });
                        };

                      reader.readAsDataURL(
                        file
                      );
                    }
                  }}

                  style={{
                    width:
                      "100%",

                    padding:
                      "10px",

                    border:
                      "1px solid #d1d5db",

                    borderRadius:
                      "10px",
                  }}
                />

                {/* PREVIEW */}
                {form.image && (

                  <div
                    style={{
                      marginTop:
                        "12px",

                      display:
                        "flex",

                      justifyContent:
                        "center",
                    }}
                  >

                    <img
                      src={
                        form.image
                      }

                      alt="preview"

                      style={{
                        width:
                          "90px",

                        height:
                          "90px",

                        borderRadius:
                          "50%",

                        objectFit:
                          "cover",

                        border:
                          "3px solid #16a34a",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* ROLE */}
              <select
                value={
                  form.role
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    role:
                      e.target
                        .value,
                  })
                }

                style={
                  inputStyle
                }
              >

                <option>
                  Admin
                </option>

                <option>
                  Cashier
                </option>
              </select>

              {/* SAVE */}
              <button
                onClick={
                  addUser
                }

                style={{
                  background:
                    "#16a34a",

                  color:
                    "#fff",

                  border:
                    "none",

                  padding:
                    "13px",

                  borderRadius:
                    "10px",

                  fontWeight:
                    "bold",

                  cursor:
                    "pointer",
                }}
              >
                Save User
              </button>

              {/* CANCEL */}
              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }

                style={{
                  background:
                    "#e5e7eb",

                  border:
                    "none",

                  padding:
                    "13px",

                  borderRadius:
                    "10px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
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

const thStyle = {
  textAlign: "left",
  padding: "16px",
  fontSize: "14px",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "16px",
  borderTop:
    "1px solid #f3f4f6",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  borderRadius:
    "10px",
  border:
    "1px solid #d1d5db",
  outline: "none",
  fontSize:
    "14px",
};

export default Users;