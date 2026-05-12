import {
  useState,
  useEffect,
} from "react";

/* =========================
      FIREBASE
========================= */

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

/* =========================
      COMPONENTS
========================= */

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Login from "./components/Login";
import Toast from "./components/Toast";

/* =========================
      PAGES
========================= */

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

/* =========================
      CSS
========================= */

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
    useState(true);

  /* =========================
        PAGE
  ========================= */

  const [page, setPage] =
    useState("dashboard");

  /* =========================
        FIREBASE DATA
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

  const [sales, setSales] =
    useState([]);

  const [
    expenses,
    setExpenses,
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
        USERS
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
            setCurrentUser(null);
          }

          setAuthLoading(false);
        }
      );

    return () =>
      unsubscribe();

  }, [users]);

  /* =========================
        FIREBASE LOAD
  ========================= */

  useEffect(() => {

    const unsubMedicines =
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

    const unsubCustomers =
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

    const unsubSuppliers =
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

    const unsubSales =
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

    const unsubExpenses =
      onSnapshot(

        collection(
          db,
          "expenses"
        ),

        (snapshot) => {

          setExpenses(
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            )
          );
        }
      );

    return () => {

      unsubMedicines();
      unsubCustomers();
      unsubSuppliers();
      unsubSales();
      unsubExpenses();
    };

  }, []);

  /* =========================
        LOADING
  ========================= */

  if (authLoading) {

    return (

      <div style={styles.loadingContainer}>
        Loading...
      </div>
    );
  }

  /* =========================
        LOGIN
  ========================= */

  if (!authed) {

    return (

      <div
        style={{
          width: "100%",
          minHeight: "100dvh",
          overflow: "hidden",
        }}
      >

        <Login
          setAuthed={setAuthed}
          setCurrentUser={setCurrentUser}
          toast={toast}
        />

        {toastData.show && (

          <div style={styles.toastWrapper}>

            <Toast
              message={toastData.message}
              type={toastData.type}
            />

          </div>
        )}

      </div>
    );
  }

  /* =========================
        PAGE RENDER
  ========================= */

  const renderPage = () => {

    switch (page) {

      case "dashboard":

        return (
          <Dashboard
            medicines={medicines}
            customers={customers}
            sales={sales}
            dark={dark}
          />
        );

      case "pos":

        return (
          <POS
            medicines={medicines}
            setMedicines={setMedicines}
            customers={customers}
            setCustomers={setCustomers}
            sales={sales}
            setSales={setSales}
            toast={toast}
            dark={dark}
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
            setCustomers={setCustomers}
            toast={toast}
            darkMode={dark}
          />
        );

      case "suppliers":

        return (
          <Suppliers
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            toast={toast}
            darkMode={dark}
          />
        );

      case "sales":

        return (
          <SalesHistory
            sales={sales}
            setSales={setSales}
            toast={toast}
            dark={dark}
          />
        );

      case "debts":

        return (
          <Debts
            customers={customers}
            setCustomers={setCustomers}
            sales={sales}
            setSales={setSales}
            toast={toast}
            dark={dark}
          />
        );

      case "expenses":

        return (
          <Expenses
            expenses={expenses}
            setExpenses={setExpenses}
            toast={toast}
            dark={dark}
          />
        );

      case "reports":

        return (
          <Reports
            sales={sales}
            medicines={medicines}
            expenses={expenses}
            dark={dark}
          />
        );

      case "users":

        if (
          currentUser?.role
            ?.toLowerCase() !==
          "admin"
        ) {

          return (
            <div style={styles.accessDenied}>
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
            sales={sales}
            dark={dark}
          />
        );
    }
  };

  return (

    <div style={styles.app}>

      {/* MOBILE HIDE SIDEBAR */}

      {window.innerWidth > 768 && (

        <Sidebar
          page={page}
          setPage={setPage}
          currentUser={currentUser}
          dark={dark}
        />

      )}

      {/* MAIN */}

      <div style={styles.main}>

        <Topbar
          dark={dark}
          setDark={setDark}
          setAuthed={setAuthed}
          setCurrentUser={setCurrentUser}
          currentUser={currentUser}
          medicines={medicines}
          sales={sales}
        />

        <div style={styles.content}>
          {renderPage()}
        </div>

      </div>

      {/* TOAST */}

      {toastData.show && (

        <div style={styles.toastWrapper}>

          <Toast
            message={toastData.message}
            type={toastData.type}
          />

        </div>
      )}

    </div>
  );
}

/* =========================
      STYLES
========================= */

const styles = {

  app: {
    display: "flex",
    minHeight: "100dvh",
    width: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
    background: "#020617",
    color: "#ffffff",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
    overflowX: "hidden",
  },

  content: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "clamp(14px,3vw,24px)",
    width: "100%",
    boxSizing: "border-box",
  },

  toastWrapper: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 9999,
  },

  loadingContainer: {
    minHeight: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "clamp(22px,5vw,28px)",
    fontWeight: "bold",
    background: "#020617",
    color: "#ffffff",
  },

  accessDenied: {
    fontSize: "clamp(22px,5vw,28px)",
    fontWeight: "bold",
    padding: "30px",
    textAlign: "center",
    color: "#ef4444",
  },
};

export default App;