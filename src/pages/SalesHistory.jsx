import {
  useState,
  useMemo,
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

function SalesHistory({
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
        FILTER SALES
  ========================= */

  const filteredSales =
    useMemo(() => {

      return sales.filter(
        (sale) => {

          const text =
            search
              .toLowerCase()
              .trim();

          return (

            sale.customer
              ?.toLowerCase()
              .includes(text) ||

            sale.method
              ?.toLowerCase()
              .includes(text) ||

            sale.status
              ?.toLowerCase()
              .includes(text) ||

            sale.id
              ?.toLowerCase()
              .includes(text)
          );
        }
      );

    }, [
      sales,
      search,
    ]);

  /* =========================
        DELETE SALE
  ========================= */

  const deleteSale =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this sale?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(
          doc(
            db,
            "sales",
            id
          )
        );

        const updated =
          sales.filter(
            (sale) =>
              sale.id !== id
          );

        setSales(updated);

        toast?.(
          "Sale deleted",
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

  /* =========================
        VIEW INVOICE
  ========================= */

  const viewInvoice =
    (sale) => {

      const products =
        sale.items
          ?.map(
            (item) =>

              `${item.name} x${item.qty}`
          )
          .join("\n");

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

      alert(`

Invoice: ${sale.id}

Customer: ${sale.customer}

Date: ${sale.date?.slice(0, 10)}

Products:
${products}

Total: $${total.toFixed(2)}

Paid: $${paid.toFixed(2)}

Debt: $${debt.toFixed(2)}

Payment: ${sale.method}

Status: ${sale.status}

      `);
    };

  /* =========================
        PRINT
  ========================= */

  const printInvoice =
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

      const printWindow =
        window.open(
          "",
          "_blank"
        );

      printWindow.document.write(`

<html>

<head>

<title>
Invoice
</title>

<style>

body{
font-family:Arial;
padding:20px;
}

h1{
color:#16a34a;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th,td{
border:1px solid #ddd;
padding:10px;
text-align:left;
}

th{
background:#f3f4f6;
}

</style>

</head>

<body>

<h1>
ANFAC PHARMACY
</h1>

<p>
Invoice:
${sale.id}
</p>

<p>
Customer:
${sale.customer}
</p>

<p>
Date:
${sale.date?.slice(0, 10)}
</p>

<p>
Payment:
${sale.method}
</p>

<p>
Status:
${sale.status}
</p>

<table>

<thead>

<tr>

<th>Medicine</th>

<th>Qty</th>

<th>Price</th>

<th>Total</th>

</tr>

</thead>

<tbody>

${sale.items
  ?.map(
    (
      item
    ) => `

<tr>

<td>
${item.name}
</td>

<td>
${item.qty}
</td>

<td>
$${item.sellPrice}
</td>

<td>
$${(
  item.sellPrice *
  item.qty
).toFixed(2)}
</td>

</tr>

`
  )
  .join("")}

</tbody>

</table>

<h2>
Total:
$${total.toFixed(2)}
</h2>

<h2>
Paid:
$${paid.toFixed(2)}
</h2>

<h2>
Debt:
$${debt.toFixed(2)}
</h2>

</body>

</html>

`);

      printWindow.document.close();

      printWindow.print();
    };

  return (

    <div
      style={{
        ...styles.container,

        background:
          darkMode
            ? "#020617"
            : "#ffffff",

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

          <h1 style={{
            ...styles.title,

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}>
            Sales History 📋
          </h1>

          <p style={styles.subtitle}>
            Pharmacy sales records
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div style={styles.topBar}>

        <input
          type="text"

          placeholder="Search sales..."

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

        <div style={{
          ...styles.tableHeader,

          background:
            darkMode
              ? "#0f172a"
              : "#f8fafc",

          color:
            darkMode
              ? "#ffffff"
              : "#111827",
        }}>

          <div>Invoice</div>

          <div>Date</div>

          <div>Customer</div>

          <div>Products</div>

          <div>Total</div>

          <div>Paid</div>

          <div>Debt</div>

          <div>Payment</div>

          <div>Status</div>

          <div>Actions</div>

        </div>

        {/* BODY */}

        {
          filteredSales.length === 0 ? (

            <div style={styles.empty}>
              No sales found
            </div>

          ) : (

            filteredSales.map(
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

                      color:
                        darkMode
                          ? "#ffffff"
                          : "#111827",
                    }}
                  >

                    {/* INVOICE */}

                    <div style={styles.invoiceText}>

                      {
                        sale.id?.slice(
                          0,
                          8
                        )
                      }

                    </div>

                    {/* DATE */}

                    <div>
                      {
                        sale.date?.slice(
                          0,
                          10
                        )
                      }
                    </div>

                    {/* CUSTOMER */}

                    <div style={styles.customerText}>
                      {sale.customer}
                    </div>

                    {/* PRODUCTS */}

                    <div>

                      <span style={styles.productBadge}>

                        {
                          sale.items
                            ?.length || 0
                        }{" "}
                        Products

                      </span>

                    </div>

                    {/* TOTAL */}

                    <div style={styles.greenText}>

                      $
                      {total.toFixed(2)}

                    </div>

                    {/* PAID */}

                    <div style={styles.greenText}>

                      $
                      {paid.toFixed(2)}

                    </div>

                    {/* DEBT */}

                    <div style={styles.redText}>

                      $
                      {debt.toFixed(2)}

                    </div>

                    {/* PAYMENT */}

                    <div>

                      <span
                        style={{
                          ...styles.paymentBadge,

                          background:

                            sale.method ===
                            "Cash"

                              ? "#166534"

                            : sale.method ===
                              "EVC PLUS"

                              ? "#14532d"

                            : sale.method ===
                              "EDAHAB"

                              ? "#1d4ed8"

                            : "#991b1b",
                        }}
                      >

                        {sale.method}

                      </span>

                    </div>

                    {/* STATUS */}

                    <div>

                      <span
                        style={{
                          ...styles.statusBadge,

                          background:

                            status ===
                            "Paid"

                              ? "#166534"

                            : status ===
                              "Partial"

                              ? "#ca8a04"

                              : "#991b1b",
                        }}
                      >

                        {status}

                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div style={styles.actions}>

                      <button
                        onClick={() =>
                          viewInvoice(
                            sale
                          )
                        }

                        style={styles.viewButton}
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          printInvoice(
                            sale
                          )
                        }

                        style={styles.printButton}
                      >
                        Print
                      </button>

                      <button
                        onClick={() =>
                          deleteSale(
                            sale.id
                          )
                        }

                        style={styles.deleteButton}
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
    padding: "14px",
    overflowX: "hidden",
    boxSizing: "border-box",
  },

  mobileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  menuButton: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },

  title: {
    margin: 0,
    fontSize:
      "clamp(28px,5vw,36px)",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "6px",
    fontSize: "14px",
    color: "#94a3b8",
  },

  topBar: {
    marginBottom: "22px",
  },

  searchInput: {
    width: "100%",
    maxWidth: "320px",
    padding: "14px",
    borderRadius: "14px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  tableWrapper: {
    width: "100%",
    borderRadius: "24px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",

    gridTemplateColumns:
      ".8fr .8fr 1.2fr .8fr .7fr .7fr .7fr .8fr .8fr 1.7fr",

    gap: "10px",

    padding: "16px",

    fontWeight: "700",

    fontSize: "12px",

    alignItems: "center",
  },

  tableRow: {
    display: "grid",

    gridTemplateColumns:
      ".8fr .8fr 1.2fr .8fr .7fr .7fr .7fr .8fr .8fr 1.7fr",

    gap: "10px",

    padding: "16px",

    alignItems: "center",

    fontSize: "12px",
  },

  invoiceText: {
    color: "#2563eb",
    fontWeight: "700",
  },

  customerText: {
    fontWeight: "700",
    lineHeight: "20px",
    wordBreak: "break-word",
  },

  productBadge: {
    background: "#1d4ed8",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    whiteSpace: "nowrap",
  },

  greenText: {
    color: "#22c55e",
    fontWeight: "700",
  },

  redText: {
    color: "#ef4444",
    fontWeight: "700",
  },

  paymentBadge: {
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    whiteSpace: "nowrap",
  },

  statusBadge: {
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    whiteSpace: "nowrap",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
  },

  viewButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "8px 10px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "65px",
    height: "38px",
  },

  printButton: {
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "8px 10px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "65px",
    height: "38px",
  },

  deleteButton: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "8px 10px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "65px",
    height: "38px",
  },

  empty: {
    padding: "60px",
    textAlign: "center",
    color: "#94a3af",
  },
};

export default SalesHistory;