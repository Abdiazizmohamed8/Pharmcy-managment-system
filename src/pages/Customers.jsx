import {
  useMemo,
  useState,
} from "react";

import {
  doc,
  deleteDoc,
} from "firebase/firestore";

import {
  db,
} from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

function Customers({
  customers = [],
  setCustomers,
  openSidebar,
  toast,
}) {

  const {
    darkMode,
  } = useTheme();

  const [
    search,
    setSearch,
  ] = useState("");

  /* =========================
        FILTER CUSTOMERS
  ========================= */

  const filteredCustomers =
    useMemo(() => {

      return customers.filter(
        (customer) =>

          customer.name
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            )
      );

    }, [
      customers,
      search,
    ]);

  /* =========================
        DELETE CUSTOMER
  ========================= */

  const deleteCustomer =
    async (id) => {

      try {

        await deleteDoc(

          doc(
            db,
            "customers",
            id
          )
        );

        const updated =
          customers.filter(
            (
              customer
            ) =>

              customer.id !==
              id
          );

        setCustomers(
          updated
        );

        toast?.(
          "Customer deleted",
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

  return (

    <div
      style={{
        ...styles.container,

        background:
          darkMode
            ? "#020617"
            : "#f8fafc",

        color:
          darkMode
            ? "#ffffff"
            : "#111827",
      }}
    >

      {/* HEADER */}

      <div
        style={
          styles.mobileHeader
        }
      >

        <button
          onClick={
            openSidebar
          }

          style={{
            ...styles.menuButton,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            color:
              darkMode
                ? "#ffffff"
                : "#111827",

            border:
              darkMode
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",
          }}
        >
          ☰
        </button>

        <div>

          <h1
            style={{
              ...styles.title,

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            Customers 👥
          </h1>

          <p
            style={
              styles.subtitle
            }
          >
            Pharmacy customer
            management
          </p>

        </div>

      </div>

      {/* TOP BAR */}

      <div
        style={
          styles.topBar
        }
      >

        {/* SEARCH */}

        <input
          type="text"

          placeholder="Search customer..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          style={{
            ...styles.searchInput,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            color:
              darkMode
                ? "#ffffff"
                : "#111827",

            border:
              darkMode
                ? "1px solid #374151"
                : "1px solid #d1d5db",
          }}
        />

        {/* TOTAL */}

        <div
          style={
            styles.totalCard
          }
        >

          <p
            style={
              styles.totalLabel
            }
          >
            Total Customers
          </p>

          <h2
            style={
              styles.totalAmount
            }
          >
            {
              customers.length
            }
          </h2>

        </div>

      </div>

      {/* TABLE */}

      <div
        style={{
          ...styles.tableWrapper,

          background:
            darkMode
              ? "#111827"
              : "#ffffff",

          border:
            darkMode
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}
      >

        {/* TABLE HEADER */}

        <div
          style={{
            ...styles.tableHeader,

            background:
              darkMode
                ? "#0f172a"
                : "#f1f5f9",

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}
        >

          <div>Customer</div>

          <div>Phone</div>

          <div>Address</div>

          <div>Debt</div>

          <div>Status</div>

          <div>Action</div>

        </div>

        {/* TABLE BODY */}

        {
          filteredCustomers.length ===
          0 ? (

            <div
              style={
                styles.empty
              }
            >
              No customers found
            </div>

          ) : (

            filteredCustomers.map(
              (
                customer
              ) => {

                const debt =
                  Number(
                    customer.debt ||
                    0
                  );

                const status =
                  debt > 0
                    ? "Debt"
                    : "No Debt";

                return (

                  <div
                    key={
                      customer.id
                    }

                    style={{
                      ...styles.tableRow,

                      borderTop:
                        darkMode
                          ? "1px solid #1f2937"
                          : "1px solid #e5e7eb",
                    }}
                  >

                    {/* CUSTOMER */}

                    <div
                      style={
                        styles.customerBox
                      }
                    >

                      <div
                        style={
                          styles.avatar
                        }
                      >

                        {
                          customer.name?.charAt(
                            0
                          )
                        }

                      </div>

                      <div>

                        <div
                          style={
                            styles.customerName
                          }
                        >
                          {
                            customer.name
                          }
                        </div>

                        <div
                          style={
                            styles.customerRole
                          }
                        >
                          Customer
                        </div>

                      </div>

                    </div>

                    {/* PHONE */}

                    <div>
                      {
                        customer.phone ||
                        "-"
                      }
                    </div>

                    {/* ADDRESS */}

                    <div>
                      {
                        customer.address ||
                        "-"
                      }
                    </div>

                    {/* DEBT */}

                    <div>

                      <span
                        style={{
                          ...styles.debtBadge,

                          background:
                            debt > 0
                              ? "#fee2e2"
                              : "#dcfce7",

                          color:
                            debt > 0
                              ? "#dc2626"
                              : "#16a34a",
                        }}
                      >

                        $
                        {
                          debt.toFixed(
                            2
                          )
                        }

                      </span>

                    </div>

                    {/* STATUS */}

                    <div>

                      <span
                        style={{
                          ...styles.statusBadge,

                          background:
                            debt > 0
                              ? "#fee2e2"
                              : "#dcfce7",

                          color:
                            debt > 0
                              ? "#dc2626"
                              : "#16a34a",
                        }}
                      >

                        {status}

                      </span>

                    </div>

                    {/* ACTION */}

                    <div>

                      <button
                        onClick={() =>
                          deleteCustomer(
                            customer.id
                          )
                        }

                        style={
                          styles.deleteButton
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              }
            )
          )
        }

      </div>

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
    padding: "16px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  mobileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  menuButton: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },

  title: {
    margin: 0,
    fontSize:
      "clamp(28px,5vw,38px)",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "6px",
    color: "#94a3b8",
    fontSize: "14px",
  },

  topBar: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  searchInput: {
    width: "100%",
    maxWidth: "340px",
    padding: "14px",
    borderRadius: "14px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  totalCard: {
    background: "#2563eb",
    color: "#ffffff",
    padding: "14px 20px",
    borderRadius: "18px",
    minWidth: "180px",
    textAlign: "center",
  },

  totalLabel: {
    margin: 0,
    fontSize: "13px",
  },

  totalAmount: {
    margin: "8px 0 0",
    fontSize:
      "clamp(24px,5vw,32px)",
    fontWeight: "700",
  },

  tableWrapper: {
    width: "100%",
    borderRadius: "24px",
    overflowX: "auto",
  },

  tableHeader: {
    display: "grid",

    gridTemplateColumns:
      "2fr 1fr 1fr 1fr 1fr 1fr",

    gap: "14px",

    padding: "18px",

    fontWeight: "700",

    minWidth: "900px",
  },

  tableRow: {
    display: "grid",

    gridTemplateColumns:
      "2fr 1fr 1fr 1fr 1fr 1fr",

    gap: "14px",

    padding: "18px",

    alignItems: "center",

    minWidth: "900px",
  },

  customerBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#16a34a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
    fontSize: "28px",
    fontWeight: "700",
  },

  customerName: {
    fontWeight: "700",
    fontSize: "18px",
  },

  customerRole: {
    color: "#94a3b8",
    marginTop: "4px",
    fontSize: "14px",
  },

  debtBadge: {
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "700",
    display: "inline-block",
  },

  statusBadge: {
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "700",
    display: "inline-block",
  },

  deleteButton: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    width: "100%",
  },

  empty: {
    padding: "60px",
    textAlign: "center",
    color: "#94a3b8",
  },
};

export default Customers;