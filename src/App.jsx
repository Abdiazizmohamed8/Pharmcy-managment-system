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
      Authentication
  ========================= */

  const [authed, setAuthed] =
    useState(false);

  const [currentUser, setCurrentUser] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /* =========================
      Theme
  ========================= */

  const [dark, setDark] =
    useState(() => {
      const savedTheme =
        localStorage.getItem(
          "darkMode"
        );

      return savedTheme
        ? JSON.parse(savedTheme)
        : true;
    });

  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      JSON.stringify(dark)
    );

    document.body.className =
      dark
        ? "bg-[#090d16]"
        : "bg-gray-100";
  }, [dark]);

  /* =========================
      Current Page
  ========================= */

  const [page, setPage] =
    useState("dashboard");

  /* =========================
      Firebase Data
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

  /* =========================
      Toast
  ========================= */

  const [toastData, setToastData] =
    useState({
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
      Load Users
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
      Authentication Session
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
                    ?.toLowerCase() ===
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
      Load Medicines
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
      Load Customers
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
      Load Suppliers
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
      Remove Loading Screen
  ========================= */

  if (authLoading) {
    return null;
  }

  /* =========================
      Login Screen
  ========================= */

  if (!authed) {
    return (
      <>
        <Login
          setAuthed={
            setAuthed
          }
          setCurrentUser={
            setCurrentUser
          }
          toast={toast}
        />

        {toastData.show && (
          <div
            className="
            fixed top-5 right-5
            z-[9999]
          "
          >
            <Toast
              message={
                toastData.message
              }
              type={
                toastData.type
              }
            />
          </div>
        )}
      </>
    );
  }

  /* =========================
      Render Pages
  ========================= */

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <Dashboard
            medicines={
              medicines
            }
            customers={
              customers
            }
          />
        );

      case "pos":
        return (
          <POS
            medicines={
              medicines
            }
            setMedicines={
              setMedicines
            }
            customers={
              customers
            }
            setCustomers={
              setCustomers
            }
            toast={toast}
            dark={dark}
          />
        );

      case "medicines":
        return (
          <Medicines
            medicines={
              medicines
            }
            setMedicines={
              setMedicines
            }
            toast={toast}
            dark={dark}
          />
        );

      case "inventory":
        return (
          <Inventory
            medicines={
              medicines
            }
            darkMode={dark}
            toast={toast}
          />
        );

      case "customers":
        return (
          <Customers
            customers={
              customers
            }
            setCustomers={
              setCustomers
            }
            toast={toast}
            darkMode={dark}
          />
        );

      case "suppliers":
        return (
          <Suppliers
            suppliers={
              suppliers
            }
            setSuppliers={
              setSuppliers
            }
            toast={toast}
            darkMode={dark}
          />
        );

      case "sales":
        return (
          <SalesHistory
            toast={toast}
          />
        );

      case "debts":
        return (
          <Debts
            customers={
              customers
            }
            setCustomers={
              setCustomers
            }
            toast={toast}
            dark={dark}
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
            medicines={
              medicines
            }
            dark={dark}
          />
        );

      case "users":
        if (
          currentUser?.role?.toLowerCase() !==
          "admin"
        ) {
          return (
            <div
              className="
              text-center
              text-red-500
              text-3xl font-bold
              p-10
            "
            >
              Access Denied 🚫
            </div>
          );
        }

        return (
          <Users
            currentUser={
              currentUser
            }
            toast={toast}
            darkMode={dark}
          />
        );

      case "settings":
        return (
          <Settings
            dark={dark}
            setDark={setDark}
            currentUser={
              currentUser
            }
            toast={toast}
          />
        );

      default:
        return (
          <Dashboard
            medicines={
              medicines
            }
            customers={
              customers
            }
          />
        );
    }
  };

  return (
    <div
      className={`
        flex min-h-screen
        overflow-hidden
        ${
          dark
            ? "bg-[#090d16] text-white"
            : "bg-gray-100 text-gray-900"
        }
      `}
    >
      {/* Sidebar */}
      <Sidebar
        page={page}
        setPage={setPage}
        currentUser={
          currentUser
        }
        dark={dark}
      />

      {/* Main Content */}
      <main
        className="
        flex-1 flex flex-col
        h-screen overflow-hidden
      "
      >
        {/* Topbar */}
        <Topbar
          dark={dark}
          setDark={setDark}
          setAuthed={
            setAuthed
          }
          setCurrentUser={
            setCurrentUser
          }
          currentUser={
            currentUser
          }
          medicines={
            medicines
          }
        />

        {/* Page Content */}
        <div
          className="
          flex-1 overflow-y-auto
          overflow-x-hidden
        "
        >
          {renderPage()}
        </div>
      </main>

      {/* Toast */}
      {toastData.show && (
        <div
          className="
          fixed top-5 right-5
          z-[9999]
        "
        >
          <Toast
            message={
              toastData.message
            }
            type={
              toastData.type
            }
          />
        </div>
      )}
    </div>
  );
}

export default App;