import { useState } from "react";

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
   DATA
========================= */

import {
  USERS,
  MEDICINES_INIT,
  CUSTOMERS_INIT,
  SUPPLIERS_INIT,
  SALES_INIT,
  EXPENSES_INIT,
} from "./data/mockData";

/* =========================
   CSS
========================= */

import "./App.css";

function App() {

  /* =========================
     AUTH
  ========================= */

  const [
    authed,
    setAuthed,
  ] = useState(false);

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null);

  /* =========================
     THEME
  ========================= */

  const [
    dark,
    setDark,
  ] = useState(false);

  /* =========================
     PAGE
  ========================= */

  const [
    page,
    setPage,
  ] = useState(
    "dashboard"
  );

  /* =========================
     DATA
  ========================= */

  const [
    users,
    setUsers,
  ] = useState(
    USERS
  );

  const [
    medicines,
    setMedicines,
  ] = useState(
    MEDICINES_INIT
  );

  const [
    customers,
    setCustomers,
  ] = useState(
    CUSTOMERS_INIT
  );

  const [
    suppliers,
    setSuppliers,
  ] = useState(
    SUPPLIERS_INIT
  );

  const [
    sales,
    setSales,
  ] = useState(
    SALES_INIT
  );

  const [
    expenses,
    setExpenses,
  ] = useState(
    EXPENSES_INIT
  );

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
     LOGIN PAGE
  ========================= */

  if (!authed) {

    return (
      <>
        <Login
          users={users}
          setAuthed={
            setAuthed
          }
          setCurrentUser={
            setCurrentUser
          }
          toast={toast}
        />

        {toastData.show && (

          <Toast
            message={
              toastData.message
            }
            type={
              toastData.type
            }
          />
        )}
      </>
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
            medicines={
              medicines
            }
            customers={
              customers
            }
            sales={sales}
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
            sales={sales}
            setSales={
              setSales
            }
            toast={toast}
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
          />
        );

      case "inventory":

        return (
          <Inventory
            medicines={
              medicines
            }
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
            customers={
              customers
            }
            setCustomers={
              setCustomers
            }
            sales={sales}
            setSales={
              setSales
            }
            toast={toast}
          />
        );

      case "expenses":

        return (
          <Expenses
            expenses={
              expenses
            }
            setExpenses={
              setExpenses
            }
            toast={toast}
          />
        );

      case "reports":

        return (
          <Reports
            sales={sales}
            medicines={
              medicines
            }
            expenses={
              expenses
            }
          />
        );

      case "users":

        return (
          <Users
            users={users}
            setUsers={
              setUsers
            }
            currentUser={
              currentUser
            }
            setCurrentUser={
              setCurrentUser
            }
            toast={toast}
          />
        );

      case "settings":

        return (
          <Settings />
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
            sales={sales}
          />
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",

        minHeight:
          "100vh",

        background:
          dark
            ? "#111827"
            : "#f3f4f6",
      }}
    >

      {/* SIDEBAR */}

      <Sidebar
        page={page}
        setPage={
          setPage
        }
        currentUser={
          currentUser
        }
      />

      {/* MAIN */}

      <div
        style={{
          flex: 1,

          display: "flex",

          flexDirection:
            "column",
        }}
      >

        {/* TOPBAR */}

        <Topbar
          dark={dark}
          setDark={
            setDark
          }
          setAuthed={
            setAuthed
          }
          currentUser={
            currentUser
          }
          medicines={
            medicines
          }
        />

        {/* CONTENT */}

        <div
          style={{
            padding:
              "24px",
          }}
        >
          {renderPage()}
        </div>
      </div>

      {/* TOAST */}

      {toastData.show && (

        <Toast
          message={
            toastData.message
          }
          type={
            toastData.type
          }
        />
      )}
    </div>
  );
}

export default App;