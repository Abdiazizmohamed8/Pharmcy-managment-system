import {
  useState,
} from "react";

import {
  doc,
  deleteDoc,
} from "firebase/firestore";

import {
  db,
} from "../firebase";

function SalesHistory({
  sales = [],
  setSales,
  toast,
  dark = false,
}) {

  /* =========================
     STATES
  ========================= */

  const [search, setSearch] =
    useState("");

  /* =========================
     SEARCH
  ========================= */

  const filteredSales =
    sales.filter(
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
            .includes(text)
        );
      }
    );

  /* =========================
     TOTAL SALES
  ========================= */

  const totalSales =
    sales
      .filter(
        (sale) =>

          sale.status
            ?.toLowerCase() ===
          "paid"
      )

      .reduce(
        (
          acc,
          sale
        ) =>

          acc +
          Number(
            sale.total || 0
          ),

        0
      );

  /* =========================
     DELETE SALE
  ========================= */

  const deleteSale =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this sale?"
        );

      if (
        !confirmDelete
      )
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
              sale.id !==
              id
          );

        setSales(
          updated
        );

        toast(
          "Sale deleted",
          "success"
        );

      } catch (error) {

        console.log(
          error
        );

        toast(
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

      alert(`
Invoice: ${sale.id}

Customer: ${sale.customer}

Date: ${sale.date}

Products:
${sale.items
  ?.map(
    (item) =>
      `${item.name} x${item.qty}`
  )
  .join("\n")}

Total: $${Number(
        sale.total
      ).toFixed(2)}

Paid: $${Number(
        sale.paid || 0
      ).toFixed(2)}

Debt: $${Number(
        sale.debt || 0
      ).toFixed(2)}

Payment: ${sale.method}

Status: ${sale.status}
      `);
    };

  /* =========================
     PRINT
  ========================= */

  const printInvoice =
    (sale) => {

      const win =
        window.open(
          "",
          "_blank"
        );

      win.document.write(`
<html>
<head>
<title>Invoice</title>

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

.total{
margin-top:20px;
font-size:22px;
font-weight:bold;
}

</style>
</head>

<body>

<h1>ANFAC PHARMACY</h1>

<p>
<strong>Invoice:</strong>
${sale.id}
</p>

<p>
<strong>Date:</strong>
${sale.date}
</p>

<p>
<strong>Customer:</strong>
${sale.customer}
</p>

<p>
<strong>Payment:</strong>
${sale.method}
</p>

<p>
<strong>Status:</strong>
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
<td>${item.name}</td>
<td>${item.qty}</td>
<td>$${item.sellPrice}</td>
<td>$${(
        item.qty *
        item.sellPrice
      ).toFixed(2)}</td>
</tr>
`
  )
  .join("")}

</tbody>
</table>

<div class="total">
Grand Total:
$${Number(
        sale.total
      ).toFixed(2)}
</div>

</body>
</html>
`);

      win.document.close();

      win.print();
    };

  return (
    <div
      style={{
        minHeight:
          "100vh",

        background:
          dark
            ? "#020617"
            : "#f3f4f6",

        color:
          dark
            ? "#ffffff"
            : "#111827",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          flexWrap:
            "wrap",

          gap: "16px",

          marginBottom:
            "30px",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,

              fontSize:
                "36px",

              color:
                dark
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            Sales History 📋
          </h1>

          <p
            style={{
              color:
                dark
                  ? "#d1d5db"
                  : "#6b7280",

              marginTop:
                "8px",
            }}
          >
            Pharmacy sales records
          </p>
        </div>

        {/* TOTAL */}

        <div
          style={{
            background:
              "#16a34a",

            color:
              "#ffffff",

            padding:
              "18px 26px",

            borderRadius:
              "20px",

            fontSize:
              "28px",

            fontWeight:
              "bold",

            boxShadow:
              dark
                ? "0 4px 18px rgba(0,0,0,0.35)"
                : "0 4px 18px rgba(22,163,74,0.2)",
          }}
        >
          $
          {totalSales.toFixed(
            2
          )}
        </div>
      </div>

      {/* SEARCH */}

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
          width: "100%",

          maxWidth:
            "420px",

          padding:
            "15px 18px",

          borderRadius:
            "16px",

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

          outline:
            "none",

          marginBottom:
            "24px",

          boxSizing:
            "border-box",
        }}
      />

      {/* TABLE */}

      <div
        style={{
          background:
            dark
              ? "#111827"
              : "#ffffff",

          borderRadius:
            "24px",

          overflowX:
            "auto",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",

          boxShadow:
            dark
              ? "0 4px 20px rgba(0,0,0,0.35)"
              : "0 4px 18px rgba(0,0,0,0.05)",
        }}
      >

        <table
          style={{
            width: "100%",

            minWidth:
              "1200px",

            borderCollapse:
              "collapse",
          }}
        >

          <thead
            style={{
              background:
                dark
                  ? "#0f172a"
                  : "#f9fafb",
            }}
          >

            <tr>

              {[
                "Invoice",
                "Date",
                "Customer",
                "Products",
                "Total",
                "Paid",
                "Debt",
                "Payment",
                "Status",
                "Action",
              ].map(
                (
                  item
                ) => (

                  <th
                    key={
                      item
                    }

                    style={th(
                      dark
                    )}
                  >
                    {item}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>

            {filteredSales.length ===
            0 ? (

              <tr>

                <td
                  colSpan="10"

                  style={{
                    padding:
                      "60px",

                    textAlign:
                      "center",

                    color:
                      dark
                        ? "#d1d5db"
                        : "#9ca3af",
                  }}
                >
                  No sales found
                </td>
              </tr>

            ) : (

              filteredSales.map(
                (
                  sale
                ) => (

                  <tr
                    key={
                      sale.id
                    }

                    style={{
                      borderTop:
                        dark

                          ? "1px solid #374151"

                          : "1px solid #f3f4f6",
                    }}
                  >

                    {/* INVOICE */}

                    <td
                      style={{
                        ...td(
                          dark
                        ),

                        color:
                          "#2563eb",

                        fontWeight:
                          "bold",
                      }}
                    >
                      {sale.id
                        ?.slice(
                          0,
                          8
                        )}
                    </td>

                    {/* DATE */}

                    <td
                      style={td(
                        dark
                      )}
                    >
                      {sale.date
                        ?.slice(
                          0,
                          10
                        )}
                    </td>

                    {/* CUSTOMER */}

                    <td
                      style={{
                        ...td(
                          dark
                        ),

                        fontWeight:
                          "bold",
                      }}
                    >
                      {
                        sale.customer
                      }
                    </td>

                    {/* PRODUCTS */}

                    <td
                      style={td(
                        dark
                      )}
                    >

                      <span
                        style={{
                          background:
                            dark
                              ? "#1e3a8a"
                              : "#dbeafe",

                          color:
                            "#2563eb",

                          padding:
                            "8px 14px",

                          borderRadius:
                            "999px",

                          fontWeight:
                            "bold",

                          fontSize:
                            "12px",
                        }}
                      >
                        {
                          sale.items
                            ?.length
                        }{" "}
                        Products
                      </span>
                    </td>

                    {/* TOTAL */}

                    <td
                      style={{
                        ...td(
                          dark
                        ),

                        color:
                          "#16a34a",

                        fontWeight:
                          "bold",
                      }}
                    >
                      $
                      {Number(
                        sale.total
                      ).toFixed(
                        2
                      )}
                    </td>

                    {/* PAID */}

                    <td
                      style={{
                        ...td(
                          dark
                        ),

                        color:
                          "#16a34a",

                        fontWeight:
                          "bold",
                      }}
                    >
                      $
                      {Number(
                        sale.paid ||
                        0
                      ).toFixed(
                        2
                      )}
                    </td>

                    {/* DEBT */}

                    <td
                      style={{
                        ...td(
                          dark
                        ),

                        color:
                          "#dc2626",

                        fontWeight:
                          "bold",
                      }}
                    >
                      $
                      {Number(
                        sale.debt ||
                        0
                      ).toFixed(
                        2
                      )}
                    </td>

                    {/* PAYMENT */}

                    <td
                      style={td(
                        dark
                      )}
                    >

                      <Badge
                        bg={
                          sale.method ===
                          "Debt"

                            ? dark
                              ? "#7f1d1d"
                              : "#fee2e2"

                            : dark
                              ? "#14532d"
                              : "#dcfce7"
                        }

                        color={
                          sale.method ===
                          "Debt"

                            ? "#dc2626"

                            : "#16a34a"
                        }

                        text={
                          sale.method
                        }
                      />
                    </td>

                    {/* STATUS */}

                    <td
                      style={td(
                        dark
                      )}
                    >

                      <Badge
                        bg={
                          sale.status
                            ?.toLowerCase() ===
                          "paid"

                            ? dark
                              ? "#14532d"
                              : "#dcfce7"

                            : dark
                              ? "#7f1d1d"
                              : "#fee2e2"
                        }

                        color={
                          sale.status
                            ?.toLowerCase() ===
                          "paid"

                            ? "#16a34a"

                            : "#dc2626"
                        }

                        text={
                          sale.status
                        }
                      />
                    </td>

                    {/* ACTION */}

                    <td
                      style={td(
                        dark
                      )}
                    >

                     <div
  style={{
    display:
      "flex",

    gap: "14px",

    flexWrap:
      "nowrap",

    alignItems:
      "center",
  }}
>

                        <button
                          onClick={() =>
                            viewInvoice(
                              sale
                            )
                          }

                          style={
                            viewBtn
                          }
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            printInvoice(
                              sale
                            )
                          }

                          style={
                            printBtn
                          }
                        >
                          Print
                        </button>

                        <button
                          onClick={() =>
                            deleteSale(
                              sale.id
                            )
                          }

                          style={
                            deleteBtn
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================
   BADGE
========================= */

function Badge({
  bg,
  color,
  text,
}) {

  return (
    <span
      style={{
        background:
          bg,

        color:
          color,

        padding:
          "8px 14px",

        borderRadius:
          "999px",

        fontWeight:
          "bold",

        fontSize:
          "12px",

        textTransform:
          "capitalize",
      }}
    >
      {text}
    </span>
  );
}

/* =========================
   STYLES
========================= */

const th = (
  dark
) => ({
  padding:
    "18px",

  textAlign:
    "left",

  color:
    dark
      ? "#ffffff"
      : "#374151",

  whiteSpace:
    "nowrap",
});

const td = (
  dark
) => ({
  padding:
    "18px",

  color:
    dark
      ? "#ffffff"
      : "#111827",

  whiteSpace:
    "nowrap",
});

const commonBtn = {

  border: "none",

  padding:
    "12px 18px",

  borderRadius:
    "14px",

  cursor:
    "pointer",

  fontWeight:
    "700",

  minWidth:
    "90px",

  transition:
    "0.3s",

  fontSize:
    "14px",
};

const viewBtn = {

  ...commonBtn,

  background:
    "#2563eb",

  color:
    "#ffffff",
};

const printBtn = {

  ...commonBtn,

  background:
    "#16a34a",

  color:
    "#ffffff",
};

const deleteBtn = {

  ...commonBtn,

  background:
    "#dc2626",

  color:
    "#ffffff",
};

export default SalesHistory;