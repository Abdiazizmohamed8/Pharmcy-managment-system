import {
  useState,
  useMemo,
} from "react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  db,
} from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

function Debts({
  sales = [],
  setSales,
  toast,
  openSidebar,
}) {

  const {
    darkMode,
  } = useTheme();

  const [
    search,
    setSearch,
  ] = useState("");

  /* =========================
        FILTER DEBTS
  ========================= */

  const debtSales =
    useMemo(() => {

      return sales.filter(
        (sale) => {

          const total =
            Number(
              sale.total || 0
            );

          const paid =
            Number(
              sale.paid || 0
            );

          const debt =
            total - paid;

          const matchesSearch =

            sale.customer
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            debt > 0 &&
            matchesSearch
          );
        }
      );

    }, [
      sales,
      search,
    ]);

  /* =========================
        TOTAL DEBT
  ========================= */

  const totalDebt =
    debtSales.reduce(
      (
        total,
        sale
      ) => {

        const debt =
          Number(
            sale.total || 0
          ) -
          Number(
            sale.paid || 0
          );

        return (
          total + debt
        );

      },
      0
    );

  /* =========================
        MARK PAID
  ========================= */

  const markPaid =
    async (sale) => {

      try {

        const total =
          Number(
            sale.total || 0
          );

        /* SALES */

        await updateDoc(

          doc(
            db,
            "sales",
            sale.id
          ),

          {
            paid: total,
            status: "Paid",
          }
        );

        /* CUSTOMERS */

      await updateDoc(

  doc(

    db,

    "customers",

    sale.phone ||
    sale.customer
  ),

  {

    debt: 0,

    status: "Paid",
  }
);

        /* LOCAL UPDATE */

        const updated =
          sales.map(
            (item) => {

              if (
                item.id ===
                sale.id
              ) {

                return {

                  ...item,

                  paid: total,

                  status:
                    "Paid",
                };
              }

              return item;
            }
          );

        setSales(updated);

        toast?.(
          "Debt paid successfully",
          "success"
        );

      } catch (error) {

        console.log(error);

        toast?.(
          "Failed to update debt",
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

      <div style={styles.mobileHeader}>

        <button
          onClick={openSidebar}

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
            Debts 💳
          </h1>

          <p style={styles.subtitle}>
            Customer debts management
          </p>

        </div>

      </div>

      {/* TOP BAR */}

      <div style={styles.topBar}>

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

        <div style={styles.totalCard}>

          <p style={styles.totalLabel}>
            Total Debt
          </p>

          <h2 style={styles.totalAmount}>

            $
            {totalDebt.toFixed(2)}

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

        {/* HEADER */}

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

          <div>Invoice</div>

          <div>Total</div>

          <div>Paid</div>

          <div>Debt</div>

          <div>Status</div>

          <div>Action</div>

        </div>

        {/* BODY */}

        {
          debtSales.length === 0 ? (

            <div style={styles.empty}>
              No debts found
            </div>

          ) : (

            debtSales.map(
              (sale) => {

                const total =
                  Number(
                    sale.total || 0
                  );

                const paid =
                  Number(
                    sale.paid || 0
                  );

                const debt =
                  total - paid;

                let status =
                  "Paid";

                if (
                  paid === 0
                ) {

                  status =
                    "Unpaid";
                }

                else if (
                  debt > 0
                ) {

                  status =
                    "Partial";
                }

                return (

                  <div
                    key={sale.id}

                    style={{
                      ...styles.tableRow,

                      borderTop:
                        darkMode
                          ? "1px solid #1f2937"
                          : "1px solid #e5e7eb",
                    }}
                  >

                    {/* CUSTOMER */}

                    <div style={styles.customerText}>
                      {sale.customer}
                    </div>

                    {/* INVOICE */}

                    <div style={styles.invoiceText}>

                      #
                      {
                        sale.id?.slice(
                          0,
                          8
                        )
                      }

                    </div>

                    {/* TOTAL */}

                    <div style={styles.greenText}>

                      $
                      {total.toFixed(2)}

                    </div>

                    {/* PAID */}

                    <div style={styles.blueText}>

                      $
                      {paid.toFixed(2)}

                    </div>

                    {/* DEBT */}

                    <div style={styles.redText}>

                      $
                      {debt.toFixed(2)}

                    </div>

                    {/* STATUS */}

                    <div>

                      <span
                        style={{
                          ...styles.statusBadge,

                          background:

                            status ===
                            "Paid"

                              ? "#16a34a"

                            : status ===
                              "Partial"

                              ? "#ca8a04"

                            : "#dc2626",
                        }}
                      >

                        {status}

                      </span>

                    </div>

                    {/* ACTION */}

                    <div>

                      <button
                        onClick={() =>
                          markPaid(
                            sale
                          )
                        }

                        style={styles.payButton}
                      >
                        Mark Paid
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
    background: "#dc2626",
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
      "1.5fr 1fr 1fr 1fr 1fr 1fr 1fr",

    gap: "14px",

    padding: "18px",

    fontWeight: "700",

    minWidth: "900px",
  },

  tableRow: {
    display: "grid",

    gridTemplateColumns:
      "1.5fr 1fr 1fr 1fr 1fr 1fr 1fr",

    gap: "14px",

    padding: "18px",

    alignItems: "center",

    minWidth: "900px",
  },

  customerText: {
    fontWeight: "700",
    wordBreak: "break-word",
  },

  invoiceText: {
    color: "#3b82f6",
    fontWeight: "700",
  },

  greenText: {
    color: "#22c55e",
    fontWeight: "700",
  },

  blueText: {
    color: "#06b6d4",
    fontWeight: "700",
  },

  redText: {
    color: "#ef4444",
    fontWeight: "700",
  },

  statusBadge: {
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-block",
  },

  payButton: {
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
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

export default Debts;