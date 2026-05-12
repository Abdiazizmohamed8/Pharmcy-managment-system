import {
  useState,
} from "react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  db,
} from "../firebase";

function Debts({
  customers,
  setCustomers,
  sales,
  setSales,
  toast,
  dark,
}) {

  /* =========================
        STATES
  ========================= */

  const [
    search,
    setSearch,
  ] = useState("");

  /* =========================
        FILTER DEBTS
  ========================= */

  const debtCustomers =
    customers.filter(
      (customer) =>
        Number(
          customer.debt
        ) > 0
    );

  /* =========================
        SEARCH
  ========================= */

  const filteredCustomers =
    debtCustomers.filter(
      (customer) =>
        customer.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* =========================
        TOTAL DEBT
  ========================= */

  const totalDebt =
    debtCustomers.reduce(
      (
        acc,
        customer
      ) =>

        acc +
        Number(
          customer.debt || 0
        ),

      0
    );

  /* =========================
        MARK PAID
  ========================= */

  const markPaid =
    async (
      customer
    ) => {

      try {

        /* UPDATE CUSTOMER */

        await updateDoc(
          doc(
            db,
            "customers",
            customer.id
          ),

          {
            debt: 0,
          }
        );

        /* UPDATE LOCAL CUSTOMERS */

        const updatedCustomers =
          customers.map(
            (item) => {

              if (
                item.id ===
                customer.id
              ) {

                return {
                  ...item,
                  debt: 0,
                };
              }

              return item;
            }
          );

        setCustomers(
          updatedCustomers
        );

        /* UPDATE SALES */

        const updatedSales =
          await Promise.all(

            sales.map(
              async (sale) => {

                if (

                  (
                    sale.customer ===
                      customer.name ||

                    sale.customerName ===
                      customer.name
                  ) &&

                  (
                    sale.status ===
                      "unpaid" ||

                    sale.status ===
                      "partial"
                  )
                ) {

                  await updateDoc(

                    doc(
                      db,
                      "sales",
                      sale.id
                    ),

                    {

                      status:
                        "paid",

                      paymentStatus:
                        "paid",

                      paid:
                        sale.total,

                      debt: 0,

                      remainingDebt: 0,
                    }
                  );

                  return {

                    ...sale,

                    status:
                      "paid",

                    paymentStatus:
                      "paid",

                    paid:
                      sale.total,

                    debt: 0,

                    remainingDebt: 0,
                  };
                }

                return sale;
              }
            )
          );

        setSales(
          updatedSales
        );

        toast(
          `${customer.name} paid debt`,
          "success"
        );

      } catch (error) {

        console.log(
          error
        );

        toast(
          "Failed to update debt",
          "error"
        );
      }
    };

  return (

    <div style={{
      ...styles.container,

      background:
        dark
          ? "#020617"
          : "#f3f4f6",
    }}>

      {/* HEADER */}

      <div style={styles.header}>

        {/* LEFT */}

        <div>

          <h1 style={{
            ...styles.title,

            color:
              dark
                ? "#ffffff"
                : "#111827",
          }}>
            Debts 💳
          </h1>

          <p style={{
            ...styles.subtitle,

            color:
              dark
                ? "#d1d5db"
                : "#6b7280",
          }}>
            Manage customer debts
          </p>

        </div>

        {/* TOTAL */}

        <div style={{
          ...styles.totalCard,

          boxShadow:
            dark
              ? "0 4px 18px rgba(0,0,0,0.4)"
              : "0 4px 18px rgba(220,38,38,0.2)",
        }}>

          <div style={styles.totalLabel}>
            Total Debt
          </div>

          <div style={styles.totalAmount}>
            $
            {totalDebt.toFixed(2)}
          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div style={styles.searchWrapper}>

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

            border:
              dark
                ? "1px solid #374151"
                : "1px solid #d1d5db",

            background:
              dark
                ? "#111827"
                : "#ffffff",

            color:
              dark
                ? "#ffffff"
                : "#111827",
          }}
        />

      </div>

      {/* EMPTY */}

      {filteredCustomers.length === 0 ? (

        <div style={{
          ...styles.emptyCard,

          background:
            dark
              ? "#111827"
              : "#ffffff",

          color:
            dark
              ? "#d1d5db"
              : "#9ca3af",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",

          boxShadow:
            dark
              ? "0 4px 20px rgba(0,0,0,0.35)"
              : "0 4px 18px rgba(0,0,0,0.05)",
        }}>
          No debts found
        </div>

      ) : (

        <div style={{
          ...styles.tableWrapper,

          background:
            dark
              ? "#111827"
              : "#ffffff",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}>

          <table style={styles.table}>

            {/* HEAD */}

            <thead>

              <tr style={{
                borderBottom:
                  dark
                    ? "1px solid #1f2937"
                    : "1px solid #e5e7eb",
              }}>

                {[
                  "Customer",
                  "Phone",
                  "Address",
                  "Debt",
                  "Status",
                  "Action",
                ].map((item) => (

                  <th
                    key={item}
                    style={{
                      ...styles.th,

                      color:
                        dark
                          ? "#ffffff"
                          : "#111827",
                    }}
                  >
                    {item}
                  </th>
                ))}

              </tr>

            </thead>

            {/* BODY */}

            <tbody>

              {filteredCustomers.map(
                (
                  customer
                ) => {

                  const customerSales =
                    sales.filter(
                      (sale) =>

                        sale.customer ===
                        customer.name
                    );

                  const hasPartial =
                    customerSales.some(
                      (sale) =>

                        sale.status ===
                        "partial"
                    );

                  return (

                    <tr
                      key={customer.id}

                      style={{
                        borderBottom:
                          dark
                            ? "1px solid #1f2937"
                            : "1px solid #e5e7eb",
                      }}
                    >

                      {/* CUSTOMER */}

                      <td style={{
                        ...styles.td,

                        color:
                          dark
                            ? "#ffffff"
                            : "#111827",

                        fontWeight: "600",
                      }}>
                        {customer.name}
                      </td>

                      {/* PHONE */}

                      <td style={{
                        ...styles.td,

                        color:
                          dark
                            ? "#d1d5db"
                            : "#6b7280",
                      }}>
                        {customer.phone}
                      </td>

                      {/* ADDRESS */}

                      <td style={{
                        ...styles.td,

                        color:
                          dark
                            ? "#d1d5db"
                            : "#6b7280",
                      }}>
                        {customer.address}
                      </td>

                      {/* DEBT */}

                      <td style={{
                        ...styles.td,

                        color: "#ef4444",

                        fontWeight: "bold",
                      }}>
                        $
                        {Number(
                          customer.debt
                        ).toFixed(2)}
                      </td>

                      {/* STATUS */}

                      <td style={styles.td}>

                        <span style={{
                          background:
                            hasPartial
                              ? "#fef3c7"
                              : "#fee2e2",

                          color:
                            hasPartial
                              ? "#92400e"
                              : "#dc2626",

                          padding:
                            "8px 14px",

                          borderRadius:
                            "999px",

                          fontSize:
                            "13px",

                          fontWeight:
                            "bold",

                          whiteSpace:
                            "nowrap",
                        }}>
                          {
                            hasPartial
                              ? "Partial"
                              : "Unpaid"
                          }
                        </span>

                      </td>

                      {/* ACTION */}

                      <td style={styles.td}>

                        <button
                          onClick={() =>
                            markPaid(
                              customer
                            )
                          }

                          style={styles.payButton}
                        >
                          Mark Paid
                        </button>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>
      )}

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

    padding: "20px",

    boxSizing: "border-box",
  },

  header: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "16px",

    marginBottom: "24px",
  },

  title: {
    margin: 0,

    fontSize:
      "clamp(28px,5vw,34px)",
  },

  subtitle: {
    marginTop: "8px",

    fontSize: "15px",
  },

  totalCard: {
    background: "#dc2626",

    color: "#ffffff",

    padding: "16px 22px",

    borderRadius: "18px",

    minWidth: "180px",

    width: "100%",

    maxWidth: "250px",

    boxSizing: "border-box",
  },

  totalLabel: {
    fontSize: "13px",

    opacity: 0.9,

    marginBottom: "6px",
  },

  totalAmount: {
    fontSize:
      "clamp(24px,5vw,28px)",

    fontWeight: "bold",
  },

  searchWrapper: {
    marginBottom: "24px",
  },

  searchInput: {
    width: "100%",

    maxWidth: "420px",

    padding: "15px 18px",

    borderRadius: "16px",

    outline: "none",

    fontSize: "15px",

    boxSizing: "border-box",
  },

  emptyCard: {
    borderRadius: "24px",

    padding: "80px 20px",

    textAlign: "center",

    fontSize: "18px",
  },

  tableWrapper: {
    overflowX: "auto",

    borderRadius: "24px",
  },

  table: {
    width: "100%",

    borderCollapse: "collapse",

    minWidth: "900px",
  },

  th: {
    padding: "18px",

    textAlign: "left",

    whiteSpace: "nowrap",
  },

  td: {
    padding: "18px",

    whiteSpace: "nowrap",
  },

  payButton: {
    background: "#16a34a",

    color: "#ffffff",

    border: "none",

    padding: "12px 18px",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: "bold",

    whiteSpace: "nowrap",
  },
};

export default Debts;