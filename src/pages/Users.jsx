import { useState, useEffect } from "react";

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

import { db, auth } from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

function Users({
  currentUser,
  toast,
  openSidebar,
}) {

  const { darkMode } =
    useTheme();

  // Theme
  const ui = {
    bg: darkMode
      ? "bg-[#020617] text-white"
      : "bg-slate-100 text-black",

    card: darkMode
      ? "bg-[#111827] border-[#1f2937]"
      : "bg-white border-slate-200",

    input: darkMode
      ? "bg-[#0f172a] border-[#374151] text-white"
      : "bg-white border-slate-300",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  // States
  const [users, setUsers] =
    useState([]);

  const [show, setShow] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [showPass, setShowPass] =
    useState({});

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "user",
    });

  // Admin
  const isAdmin =
    currentUser?.role
      ?.toLowerCase() ===
    "admin";

  // Get Users
  useEffect(() => {

    const unsub =
      onSnapshot(

        collection(
          db,
          "users"
        ),

        (snap) => {

          setUsers(

            snap.docs.map(
              (d) => ({
                id: d.id,
                ...d.data(),
              })
            )
          );
        }
      );

    return () => unsub();

  }, []);

  // Input
  const change =
    (e) => {

      setForm({
        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  // Add User
  const addUser =
    async () => {

      if (
        !form.name ||
        !form.email ||
        !form.password
      ) {

        toast?.(
          "Fill all fields",
          "error"
        );

        return;
      }

      try {

        setLoading(true);

        const res =
          await createUserWithEmailAndPassword(
            auth,
            form.email,
            form.password
          );

        await setDoc(

          doc(
            db,
            "users",
            res.user.uid
          ),

          {
            uid:
              res.user.uid,

            ...form,

            status:
              "active",
          }
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

        setShow(false);

      } catch (err) {

        toast?.(
          err.message,
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  // Delete
  const remove =
    async (id) => {

      if (
        !window.confirm(
          "Delete user?"
        )
      ) return;

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

      } catch {

        toast?.(
          "Delete failed",
          "error"
        );
      }
    };

  // Save Edit
  const save =
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

      } catch {

        toast?.(
          "Update failed",
          "error"
        );
      }
    };

  // Access
  if (!isAdmin) {

    return (

      <div className="
        p-10 text-red-500
        text-2xl font-black
      ">
        Access Denied 🚫
      </div>
    );
  }

  return (

    <div className={`
      min-h-screen p-4 md:p-6
      ${ui.bg}
    `}>

      {/* Header */}
      <div className="
        flex flex-col md:flex-row
        justify-between gap-5
        mb-6
      ">

        <div className="
          flex items-center gap-4
        ">

          <button
            onClick={openSidebar}
            className={`
              md:hidden
              w-12 h-12 rounded-2xl
              text-xl
              ${ui.card}
            `}
          >
            ☰
          </button>

          <div>

            <h1 className="
              text-3xl md:text-5xl
              font-black
            ">
              Users 👤
            </h1>

            <p className={ui.text}>
              Manage users
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            setShow(true)
          }
          className="
            h-14 px-6 rounded-2xl
            bg-green-600
            text-white font-bold
          "
        >
          + Add User
        </button>

      </div>

      {/* Table */}
      <div className={`
        rounded-3xl border
        overflow-x-auto
        ${ui.card}
      `}>

        <table className="
          w-full min-w-[900px]
        ">

          <thead>

            <tr className="
              border-b border-[#1f2937]
              text-slate-400
            ">

              {[
                "Name",
                "Email",
                "Password",
                "Role",
                "Status",
                "Action",
              ].map((i) => (

                <th
                  key={i}
                  className="
                    p-5 text-left
                  "
                >
                  {i}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {!users.length ? (

              <tr>

                <td
                  colSpan="6"
                  className="
                    p-10 text-center
                    text-slate-400
                  "
                >
                  No users found
                </td>

              </tr>

            ) : (

              users.map((u) => (

                <tr
                  key={u.id}
                  className="
                    border-b border-[#1f2937]
                  "
                >

                  {/* Name */}
                  <td className="p-5">

                    {editId ===
                    u.id ? (

                      <input
                        value={u.name}
                        onChange={(e) =>

                          setUsers(
                            users.map(
                              (x) =>

                                x.id ===
                                u.id

                                  ? {
                                      ...x,
                                      name:
                                        e.target.value,
                                    }

                                  : x
                            )
                          )
                        }
                        className={`
                          w-full h-11 px-4
                          rounded-xl border
                          outline-none
                          ${ui.input}
                        `}
                      />

                    ) : (
                      u.name
                    )}

                  </td>

                  {/* Email */}
                  <td className="p-5">

                    {editId ===
                    u.id ? (

                      <input
                        value={u.email}
                        onChange={(e) =>

                          setUsers(
                            users.map(
                              (x) =>

                                x.id ===
                                u.id

                                  ? {
                                      ...x,
                                      email:
                                        e.target.value,
                                    }

                                  : x
                            )
                          )
                        }
                        className={`
                          w-full h-11 px-4
                          rounded-xl border
                          outline-none
                          ${ui.input}
                        `}
                      />

                    ) : (
                      u.email
                    )}

                  </td>

                  {/* Password */}
                  <td className="p-5">

                    {editId ===
                    u.id ? (

                      <input
                        type={
                          showPass[
                            u.id
                          ]

                            ? "text"

                            : "password"
                        }
                        value={
                          u.password
                        }
                        onChange={(e) =>

                          setUsers(
                            users.map(
                              (x) =>

                                x.id ===
                                u.id

                                  ? {
                                      ...x,
                                      password:
                                        e.target.value,
                                    }

                                  : x
                            )
                          )
                        }
                        className={`
                          w-full h-11 px-4
                          rounded-xl border
                          outline-none
                          ${ui.input}
                        `}
                      />

                    ) : (

                      showPass[
                        u.id
                      ]

                        ? u.password

                        : "••••••••"
                    )}

                  </td>

                  {/* Role */}
                  <td className="p-5">

                    {editId ===
                    u.id ? (

                      <select
                        value={u.role}
                        onChange={(e) =>

                          setUsers(
                            users.map(
                              (x) =>

                                x.id ===
                                u.id

                                  ? {
                                      ...x,
                                      role:
                                        e.target.value,
                                    }

                                  : x
                            )
                          )
                        }
                        className={`
                          w-full h-11 px-4
                          rounded-xl border
                          outline-none
                          ${ui.input}
                        `}
                      >

                        <option value="user">
                          User
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                      </select>

                    ) : (

                      <span className={`
                        px-4 py-2 rounded-full
                        text-sm font-bold
                        ${
                          u.role ===
                          "admin"

                            ? "bg-green-900 text-green-400"

                            : "bg-blue-900 text-blue-400"
                        }
                      `}>

                        {u.role}

                      </span>
                    )}

                  </td>

                  {/* Status */}
                  <td className="p-5">

                    <span className="
                      px-4 py-2 rounded-full
                      bg-green-900
                      text-green-400
                      text-sm font-bold
                    ">
                      Active
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="p-5">

                    <div className="
                      flex flex-wrap gap-2
                    ">

                      <button
                        onClick={() =>

                          setShowPass({
                            ...showPass,

                            [u.id]:
                              !showPass[
                                u.id
                              ],
                          })
                        }
                        className="
                          h-10 px-4 rounded-xl
                          bg-yellow-500
                          text-white text-sm
                          font-bold
                        "
                      >

                        {
                          showPass[
                            u.id
                          ]

                            ? "Hide"

                            : "Show"
                        }

                      </button>

                      {editId ===
                      u.id ? (

                        <button
                          onClick={() =>
                            save(u)
                          }
                          className="
                            h-10 px-4 rounded-xl
                            bg-green-600
                            text-white text-sm
                            font-bold
                          "
                        >
                          Save
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            setEditId(
                              u.id
                            )
                          }
                          className="
                            h-10 px-4 rounded-xl
                            bg-blue-600
                            text-white text-sm
                            font-bold
                          "
                        >
                          Edit
                        </button>
                      )}

                      <button
                        onClick={() =>
                          remove(u.id)
                        }
                        className="
                          h-10 px-4 rounded-xl
                          bg-red-600
                          text-white text-sm
                          font-bold
                        "
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* Modal */}
      {show && (

        <div className="
          fixed inset-0 z-50
          bg-black/60
          flex items-center
          justify-center
          p-4
        ">

          <div className={`
            w-full max-w-md
            rounded-3xl border
            p-6 space-y-4
            ${ui.card}
          `}>

            <h2 className="
              text-2xl font-black
            ">
              Add User
            </h2>

            {[
              [
                "name",
                "Full Name",
              ],

              [
                "email",
                "Email",
              ],

              [
                "password",
                "Password",
              ],
            ].map(([k, t]) => (

              <input
                key={k}
                name={k}
                type={
                  k ===
                  "password"

                    ? "password"

                    : "text"
                }
                placeholder={t}
                value={form[k]}
                onChange={change}
                className={`
                  w-full h-14 px-5
                  rounded-2xl border
                  outline-none
                  ${ui.input}
                `}
              />

            ))}

            <select
              name="role"
              value={form.role}
              onChange={change}
              className={`
                w-full h-14 px-5
                rounded-2xl border
                outline-none
                ${ui.input}
              `}
            >

              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

            <div className="
              flex gap-4 pt-2
            ">

              <button
                onClick={addUser}
                disabled={loading}
                className="
                  flex-1 h-14 rounded-2xl
                  bg-green-600
                  text-white font-bold
                "
              >

                {
                  loading
                    ? "Saving..."
                    : "Save User"
                }

              </button>

              <button
                onClick={() =>
                  setShow(false)
                }
                className="
                  flex-1 h-14 rounded-2xl
                  bg-slate-700
                  text-white font-bold
                "
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

export default Users;