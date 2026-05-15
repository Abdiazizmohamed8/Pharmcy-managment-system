import { useState } from "react";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
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

  // Form
  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  // Loading
  const [loading, setLoading] =
    useState(false);

  // Show Password
  const [showPass, setShowPass] =
    useState(false);

  // Input Change
  const change =
    (e) => {

      setForm({
        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  // Login
  const handleLogin =
    async () => {

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
          // Session only until browser closes
        await setPersistence(
      auth,
      browserSessionPersistence
         );

        // Firebase Login
        const res =
          await signInWithEmailAndPassword(
            auth,
            form.email.trim(),
            form.password
          );

        const firebaseUser =
          res.user;

        // Get User
        const q = query(

          collection(
            db,
            "users"
          ),

          where(
            "email",
            "==",
            firebaseUser.email
          )
        );

        const snap =
          await getDocs(q);

        // Invalid
        if (snap.empty) {

          toast(
            "Invalid login",
            "error"
          );

          return;
        }

        const user =
          snap.docs[0].data();

        // Disabled
        if (
          user.status ===
          "disabled"
        ) {

          toast(
            "Account disabled",
            "error"
          );

          return;
        }

        // Save User
        setCurrentUser({
          uid:
            firebaseUser.uid,

          ...user,
        });

        setAuthed(true);

        toast(
          "Login successful",
          "success"
        );

      } catch {

        toast(
          "Invalid login",
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  // Enter Key
  const enter =
    (e) => {

      if (
        e.key === "Enter"
      ) {

        handleLogin();
      }
    };

  return (

    <div className="
      min-h-screen
      flex items-center
      justify-center
      p-4
      bg-gradient-to-br
      from-[#020617]
      via-[#052e16]
      to-[#16a34a]
    ">

      {/* Card */}
      <div className="
        w-full max-w-md
        bg-white
        rounded-[30px]
        p-6 md:p-10
        shadow-2xl
      ">

        {/* Logo */}
        <div className="
          text-center mb-8
        ">

          <div className="
            w-24 h-24 mx-auto mb-4
            rounded-[28px]
            bg-green-600
            flex items-center
            justify-center
            text-5xl
          ">
            💊
          </div>

          <h1 className="
            text-5xl font-black
            text-slate-900
          ">
            ANFAC
          </h1>

          <p className="
            text-slate-500 mt-3
          ">
            Pharmacy Management System
          </p>

        </div>

        {/* Inputs */}
        <div className="
          space-y-5
        ">

          {/* Email */}
          <div>

            <label className="
              block mb-2
              text-sm font-bold
              text-slate-700
            ">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={change}
              onKeyDown={enter}
              className="
                w-full h-14 px-5
                rounded-2xl
                border border-slate-200
                bg-slate-50
                outline-none
                focus:border-green-500
              "
            />

          </div>

          {/* Password */}
          <div>

            <label className="
              block mb-2
              text-sm font-bold
              text-slate-700
            ">
              Password
            </label>

            <div className="
              relative
            ">

              <input
                type={
                  showPass
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={change}
                onKeyDown={enter}
                className="
                  w-full h-14 px-5 pr-16
                  rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  outline-none
                  focus:border-green-500
                "
              />

              {/* Show Button */}
              <button
                type="button"
                onClick={() =>

                  setShowPass(
                    !showPass
                  )
                }
                className="
                  absolute top-1/2 right-4
                  -translate-y-1/2
                  text-sm font-bold
                  text-green-600
                "
              >

                {
                  showPass
                    ? "Hide"
                    : "Show"
                }

              </button>

            </div>

          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`
              w-full h-14
              rounded-2xl
              text-white font-bold
              transition
              ${
                loading

                  ? "bg-green-300 cursor-not-allowed"

                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >

            {
              loading
                ? "Loading..."
                : "Login"
            }

          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;