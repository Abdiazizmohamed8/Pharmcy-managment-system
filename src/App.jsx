import {
  useState,
  useEffect,
} from "react";

/* Firebase */
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  db,
  auth,
} from "./firebase";

/* Components */
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Login from "./components/Login";
import Toast from "./components/Toast";

/* Pages */
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Medicines from "./pages/Medicines";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import SalesHistory from "./pages/SalesHistory";
import Debts from "./pages/Debts";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

import "./App.css";

function App() {

  /* =========================
      AUTH
  ========================= */

  const [authed, setAuthed] =
    useState(false);

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  /* =========================
      THEME
  ========================= */

  const [dark, setDark] =
    useState(() => {

      const savedTheme =
        localStorage.getItem(
          "darkMode"
        );

      return savedTheme
        ? JSON.parse(
            savedTheme
          )
        : true;
    });

  /* =========================
      GLOBAL THEME
  ========================= */

  useEffect(() => {

    localStorage.setItem(
      "darkMode",
      JSON.stringify(dark)
    );

    // HTML
    if (dark) {

      document.documentElement.classList.add(
        "dark"
      );

    } else {

      document.documentElement.classList.remove(
        "dark"
      );
    }

    // BODY
    document.body.style.background =
      dark
        ? "#090d16"
        : "#f3f4f6";

    document.body.style.color =
      dark
        ? "white"
        : "#111827";

    document.body.style.transition =
      "all 0.3s ease";

    // ROOT
    const root =
      document.getElementById(
        "root"
      );

    if (root) {

      root.style.background =
        dark
          ? "#090d16"
          : "#f3f4f6";

      root.style.minHeight =
        "100vh";

      root.style.width =
        "100%";
    }

  }, [dark]);

  /* =========================
      PAGE
  ========================= */

  const [page, setPage] =
    useState("dashboard");

  /* =========================
      DATA
  ========================= */

  const [users, setUsers] =
    useState([]);

  const [
    medicines,
    setMedicines,
  ] = useState([]);

  const [
    customers,
    setCustomers,
  ] = useState([]);

  const [
    suppliers,
    setSuppliers,
  ] = useState([]);

  const [
    sales,
    setSales,
  ] = useState([]);

  /* =========================
      TOAST
  ========================= */

  const [
    toastData,
    setToastData,
  ] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const toast = (
    message,
    type = "success"
  ) => {

    setToastData({
      show: true,
      message,
      type,
    });

    setTimeout(() => {

      setToastData({
        show: false,
        message: "",
        type: "success",
      });

    }, 2500);
  };

  /* =========================
      LOAD USERS
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "users"
        ),

        (snapshot) => {

          setUsers(

            snapshot.docs.map(
              (doc) => ({

                id: doc.id,
                ...doc.data(),
              })
            )
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* =========================
      AUTH SESSION
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(

        auth,

        async (user) => {

          if (user) {

            const userDoc =
              users.find(
                (u) =>

                  u.email
                    ?.trim()
                    ?.toLowerCase()

                  ===

                  user.email
                    ?.trim()
                    ?.toLowerCase()
              );

            setCurrentUser({

              id: user.uid,

              ...(userDoc || {}),
            });

            setAuthed(true);

          } else {

            setAuthed(false);

            setCurrentUser(
              null
            );
          }

          setAuthLoading(false);
        }
      );

    return () =>
      unsubscribe();

  }, [users]);

  /* =========================
      LOAD MEDICINES
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "medicines"
        ),

        (snapshot) => {

          setMedicines(

            snapshot.docs.map(
              (doc) => ({

                id: doc.id,
                ...doc.data(),
              })
            )
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* =========================
      LOAD CUSTOMERS
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "customers"
        ),

        (snapshot) => {

          setCustomers(

            snapshot.docs.map(
              (doc) => ({

                id: doc.id,
                ...doc.data(),
              })
            )
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* =========================
      LOAD SUPPLIERS
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "suppliers"
        ),

        (snapshot) => {

          setSuppliers(

            snapshot.docs.map(
              (doc) => ({

                id: doc.id,
                ...doc.data(),
              })
            )
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* =========================
      LOAD SALES
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "sales"
        ),

        (snapshot) => {

          setSales(

            snapshot.docs.map(
              (doc) => ({

                id: doc.id,
                ...doc.data(),
              })
            )
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* =========================
      LOADING
  ========================= */

  if (authLoading) {
    return null;
  }

  /* =========================
      LOGIN
  ========================= */

  if (!authed) {

    return (
      <>
        <Login
          setAuthed={setAuthed}
          setCurrentUser={setCurrentUser}
          toast={toast}
        />

        {toastData.show && (

          <div className="
            fixed top-5 right-5
            z-[9999]
          ">

            <Toast
              message={toastData.message}
              type={toastData.type}
            />

          </div>
        )}
      </>
    );
  }

  /* =========================
      RENDER PAGE
  ========================= */

  const renderPage = () => {

    switch (page) {

      case "dashboard":

        return (
          <Dashboard
            medicines={medicines}
            customers={customers}
          />
        );

      case "pos":

        return (
          <POS
            sales={sales}
            setSales={setSales}
            toast={toast}
          />
        );

      case "medicines":

        return (
          <Medicines
            medicines={medicines}
            setMedicines={setMedicines}
            toast={toast}
            dark={dark}
          />
        );

      case "inventory":

        return (
          <Inventory
            medicines={medicines}
            darkMode={dark}
            toast={toast}
          />
        );

      case "customers":

        return (
          <Customers
            customers={customers}
            sales={sales}
            setCustomers={setCustomers}
            toast={toast}
          />
        );

      case "suppliers":

        return (
          <Suppliers
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            toast={toast}
          />
        );

      case "sales":

        return (
          <SalesHistory
            sales={sales}
            toast={toast}
          />
        );

      case "debts":

        return (
          <Debts
            sales={sales}
            setSales={setSales}
            toast={toast}
          />
        );

      case "expenses":

        return (
          <Expenses
            toast={toast}
            dark={dark}
          />
        );

      case "reports":

        return (
          <Reports
            medicines={medicines}
            sales={sales}
            dark={dark}
          />
        );

      case "users":

        if (
          currentUser?.role
            ?.toLowerCase()

          !== "admin"
        ) {

          return (
            <div className="
              text-center
              text-red-500
              text-3xl font-bold
              p-10
            ">
              Access Denied 🚫
            </div>
          );
        }

        return (
          <Users
            currentUser={currentUser}
            toast={toast}
            darkMode={dark}
          />
        );

      case "settings":

        return (
          <Settings
            dark={dark}
            setDark={setDark}
            currentUser={currentUser}
            toast={toast}
          />
        );

      default:

        return (
          <Dashboard
            medicines={medicines}
            customers={customers}
          />
        );
    }
  };

  return (

    <div className={`
      flex
      min-h-screen
      w-full
      overflow-x-hidden

      transition-all duration-300

      ${
        dark
          ? "bg-[#090d16] text-white"
          : "bg-gray-100 text-gray-900"
      }
    `}>

      {/* SIDEBAR */}
      <Sidebar
        page={page}
        setPage={setPage}
        currentUser={currentUser}
      />

      {/* MAIN */}
      <main className={`
        flex-1
        flex
        flex-col

        min-h-screen
        w-full

        overflow-x-hidden

        transition-all duration-300

        ${
          dark
            ? "bg-[#090d16]"
            : "bg-gray-100"
        }
      `}>

        {/* TOPBAR */}
        <Topbar
          setAuthed={setAuthed}
          setCurrentUser={setCurrentUser}
          currentUser={currentUser}
          medicines={medicines}
          sales={sales}
        />

        {/* PAGE CONTENT */}
        <div className={`
          flex-1

          overflow-y-auto
          overflow-x-hidden

          p-2 md:p-4

          transition-all duration-300

          ${
            dark
              ? "bg-[#090d16]"
              : "bg-gray-100"
          }
        `}>

          {renderPage()}

        </div>

      </main>

      {/* TOAST */}
      {toastData.show && (

        <div className="
          fixed top-5 right-5
          z-[9999]
        ">

          <Toast
            message={toastData.message}
            type={toastData.type}
          />

        </div>
      )}

    </div>
  );
}

export default App;