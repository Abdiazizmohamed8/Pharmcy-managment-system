import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

function Login({ setAuthed, setCurrentUser, toast }) {
  // Input states
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  /* =========================
        HANDLE LOGIN
  ========================= */
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast("Please fill all fields", "error");
      return;
    }

    try {
      setLoading(true);

      // Auth logic
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      const firebaseUser = userCredential.user;

      // Firestore query
      const q = query(
        collection(db, "users"),
        where("email", "==", firebaseUser.email)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast("User data not found", "error");
        return;
      }

      const userData = querySnapshot.docs[0].data();

      // Check status
      if (userData.status === "disabled") {
        toast("Account disabled", "error");
        return;
      }

      // Final success
      setCurrentUser({
        uid: firebaseUser.uid,
        ...userData,
      });

      setAuthed(true);
      toast("Login successful", "success");

    } catch (error) {
      console.log(error);
      toast("Login failed", "error");
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
    /* MAIN WRAPPER: Green gradient background */
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#14532d]">
      
      {/* THE WHITE CARD */}
      <div className="w-full max-w-[440px] bg-white rounded-[50px] p-10 md:p-14 shadow-2xl flex flex-col items-center">
        
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-[28px] bg-[#22c55e] flex items-center justify-center text-4xl shadow-lg shadow-green-100 mb-5">
            💊
          </div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">
            ANFAC
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-medium">
            Pharmacy Management System
          </p>
        </div>

        {/* FORM FIELDS */}
        <div className="w-full space-y-5">
          
          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#1e293b] text-sm ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onKeyDown={handleKeyDown}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-4 bg-[#f8fafc] border border-gray-100 rounded-2xl text-gray-800 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#1e293b] text-sm ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onKeyDown={handleKeyDown}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-4 bg-[#f8fafc] border border-gray-100 rounded-2xl text-gray-800 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full mt-4 p-4 rounded-2xl text-white text-lg font-bold flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-green-100 ${
              loading ? "bg-green-300" : "bg-[#22c55e] hover:bg-green-600"
            }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default Login;