import { useState } from "react";

function SalesHistory({
    sales,
    setSales,
    toast,
}) {

    const [search, setSearch] =
        useState("");

    /* SEARCH */
    const filteredSales =
        sales.filter((sale) =>

            sale.customer
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    /* TOTAL */
    const totalSales =
        sales.reduce(
            (acc, sale) =>

                acc +
                Number(
                    sale.total || 0
                ),

            0
        );

    /* DELETE */
    const deleteSale = (
        id
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this sale?"
            );

        if (
            !confirmDelete
        )
            return;

        const updated =
            sales.filter(
                (sale) =>
                    sale.id !== id
            );

        setSales(updated);

        toast(
            "Sale deleted"
        );
    };

    /* VIEW */
    const viewInvoice = (
        sale
    ) => {

        alert(`
Invoice: ${sale.id}

Customer: ${sale.customer}

Date: ${sale.date}

Products:
${sale.items
                .map(
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

    /* PRINT */
    const printInvoice = (
        sale
    ) => {

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
                .map(
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

          <h2>
            Grand Total:
            $${Number(
                    sale.total
                ).toFixed(2)}
          </h2>

        </body>
      </html>
    `);

        win.document.close();

        win.print();
    };

    return (
        <div>

            {/* HEADER */}
            <div
                style={{
                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems:
                        "center",

                    marginBottom:
                        "30px",
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "44px",
                        }}
                    >
                        Sales History 📋
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            marginTop: "8px",
                        }}
                    >
                        Pharmacy sales
                        transactions
                    </p>
                </div>

                <div
                    style={{
                        background:
                            "#16a34a",

                        color: "#fff",

                        padding:
                            "20px 28px",

                        borderRadius:
                            "20px",

                        fontSize:
                            "28px",

                        fontWeight:
                            "bold",
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
                placeholder="Search customer..."
                value={search}
                onChange={(e) =>
                    setSearch(
                        e.target.value
                    )
                }
                style={{
                    width: "320px",

                    padding: "16px",

                    borderRadius:
                        "14px",

                    border:
                        "1px solid #d1d5db",

                    marginBottom:
                        "24px",

                    fontSize:
                        "16px",
                }}
            />

            {/* TABLE */}
            <div
                style={{
                    background:
                        "#fff",

                    borderRadius:
                        "24px",

                    overflow:
                        "hidden",

                    boxShadow:
                        "0 8px 24px rgba(0,0,0,0.05)",
                }}
            >

                <table
                    style={{
                        width: "100%",

                        borderCollapse:
                            "collapse",
                    }}
                >

                    <thead
                        style={{
                            background:
                                "#f9fafb",
                        }}
                    >

                        <tr>

                            <th style={th}>
                                Invoice
                            </th>

                            <th style={th}>
                                Date
                            </th>

                            <th style={th}>
                                Customer
                            </th>

                            <th style={th}>
                                Products
                            </th>

                            <th style={th}>
                                Total
                            </th>

                            <th style={th}>
                                Paid
                            </th>

                            <th style={th}>
                                Debt
                            </th>

                            <th style={th}>
                                Payment
                            </th>

                            <th style={th}>
                                Status
                            </th>

                            <th style={th}>
                                Action
                            </th>
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
                                            "40px",

                                        textAlign:
                                            "center",

                                        color:
                                            "#9ca3af",
                                    }}
                                >
                                    No sales found
                                </td>
                            </tr>

                        ) : (

                            filteredSales.map(
                                (sale) => (

                                    <tr
                                        key={sale.id}
                                        style={{
                                            borderTop:
                                                "1px solid #f3f4f6",
                                        }}
                                    >

                                        {/* INVOICE */}
                                        <td
                                            style={{
                                                ...td,

                                                color:
                                                    "#2563eb",

                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            {sale.id}
                                        </td>

                                        {/* DATE */}
                                        <td style={td}>
                                            {sale.date}
                                        </td>

                                        {/* CUSTOMER */}
                                        <td
                                            style={{
                                                ...td,

                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            {
                                                sale.customer
                                            }
                                        </td>

                                        {/* PRODUCTS */}
                                        <td style={td}>

                                            <span
                                                style={{
                                                    background:
                                                        "#dbeafe",

                                                    color:
                                                        "#2563eb",

                                                    padding:
                                                        "8px 14px",

                                                    borderRadius:
                                                        "999px",

                                                    fontWeight:
                                                        "bold",
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
                                                ...td,

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
                                                ...td,

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
                                                ...td,

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
                                        <td style={td}>

                                            <span
                                                style={{
                                                    background:
                                                        sale.method ===
                                                            "Debt"

                                                            ? "#fee2e2"

                                                            : "#dcfce7",

                                                    color:
                                                        sale.method ===
                                                            "Debt"

                                                            ? "#dc2626"

                                                            : "#16a34a",

                                                    padding:
                                                        "8px 14px",

                                                    borderRadius:
                                                        "999px",

                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >
                                                {
                                                    sale.method
                                                }
                                            </span>
                                        </td>

                                        {/* STATUS */}
                                        <td style={td}>

                                            <span
                                                style={{
                                                    background:
                                                        sale.status ===
                                                            "Paid"

                                                            ? "#dcfce7"

                                                            : sale.status ===
                                                                "Partial"

                                                                ? "#fef3c7"

                                                                : "#fee2e2",

                                                    color:
                                                        sale.status ===
                                                            "Paid"

                                                            ? "#16a34a"

                                                            : sale.status ===
                                                                "Partial"

                                                                ? "#92400e"

                                                                : "#dc2626",

                                                    padding:
                                                        "8px 14px",

                                                    borderRadius:
                                                        "999px",

                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >
                                                {
                                                    sale.status
                                                }
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td style={td}>

                                            <div
                                                style={{
                                                    display:
                                                        "flex",

                                                    gap: "10px",
                                                }}
                                            >

                                                {/* VIEW */}
                                                <button
                                                    onClick={() =>
                                                        viewInvoice(
                                                            sale
                                                        )
                                                    }
                                                    style={{
                                                        background:
                                                            "#2563eb",

                                                        color:
                                                            "#fff",

                                                        border:
                                                            "none",

                                                        padding:
                                                            "10px 14px",

                                                        borderRadius:
                                                            "10px",

                                                        cursor:
                                                            "pointer",

                                                        fontWeight:
                                                            "bold",
                                                    }}
                                                >
                                                    View
                                                </button>

                                                {/* PRINT */}
                                                <button
                                                    onClick={() =>
                                                        window.print()

                                                    }
                                                    style={{
                                                        background:
                                                            "#16a34a",

                                                        color:
                                                            "#fff",

                                                        border:
                                                            "none",

                                                        padding:
                                                            "10px 14px",

                                                        borderRadius:
                                                            "10px",

                                                        cursor:
                                                            "pointer",

                                                        fontWeight:
                                                            "bold",
                                                    }}
                                                >
                                                    Print
                                                </button>

                                                {/* DELETE */}
                                                <button
                                                    onClick={() =>
                                                        deleteSale(
                                                            sale.id
                                                        )
                                                    }
                                                    style={{
                                                        background:
                                                            "#dc2626",

                                                        color:
                                                            "#fff",

                                                        border:
                                                            "none",

                                                        padding:
                                                            "10px 14px",

                                                        borderRadius:
                                                            "10px",

                                                        cursor:
                                                            "pointer",

                                                        fontWeight:
                                                            "bold",
                                                    }}
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

/* TABLE */
const th = {
    padding: "18px",
    textAlign: "left",
};

const td = {
    padding: "18px",
};

export default SalesHistory;