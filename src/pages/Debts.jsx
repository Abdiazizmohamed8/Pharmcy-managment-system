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

  const [search, setSearch] =
    useState("");

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
          customer.debt ||
            0
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

        /* =========================
           UPDATE CUSTOMER
        ========================= */

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

        /* =========================
           UPDATE LOCAL CUSTOMER
        ========================= */

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

        /* =========================
           UPDATE SALES
        ========================= */
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

          /* UPDATE FIREBASE */

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
    <div
      style={{
        width: "100%",

        minHeight:
          "100vh",

        background:
          dark
            ? "#020617"
            : "#f3f4f6",
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
            "24px",
        }}
      >

        {/* LEFT */}

        <div>

          <h1
            style={{
              margin: 0,

              fontSize:
                "34px",

              color:
                dark
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            Debts 💳
          </h1>

          <p
            style={{
              marginTop:
                "8px",

              color:
                dark
                  ? "#d1d5db"
                  : "#6b7280",

              fontSize:
                "15px",
            }}
          >
            Manage customer debts
          </p>
        </div>

        {/* TOTAL */}

        <div
          style={{
            background:
              "#dc2626",

            color: "#fff",

            padding:
              "16px 22px",

            borderRadius:
              "18px",

            minWidth:
              "180px",

            boxShadow:
              dark
                ? "0 4px 18px rgba(0,0,0,0.4)"
                : "0 4px 18px rgba(220,38,38,0.2)",
          }}
        >

          <div
            style={{
              fontSize:
                "13px",

              opacity: 0.9,

              marginBottom:
                "6px",
            }}
          >
            Total Debt
          </div>

          <div
            style={{
              fontSize:
                "28px",

              fontWeight:
                "bold",
            }}
          >
            $
            {totalDebt.toFixed(
              2
            )}
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div
        style={{
          marginBottom:
            "24px",
        }}
      >

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

            outline:
              "none",

            fontSize:
              "15px",

            background:
              dark
                ? "#111827"
                : "#ffffff",

            color:
              dark
                ? "#ffffff"
                : "#111827",

            boxSizing:
              "border-box",
          }}
        />
      </div>

      {/* EMPTY */}

      {filteredCustomers.length ===
      0 ? (

        <div
          style={{
            background:
              dark
                ? "#111827"
                : "#ffffff",

            borderRadius:
              "24px",

            padding:
              "80px 20px",

            textAlign:
              "center",

            color:
              dark
                ? "#d1d5db"
                : "#9ca3af",

            fontSize:
              "18px",

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
          No debts found
        </div>

      ) : (

      <div
  style={{
    overflowX:
      "auto",

    borderRadius:
      "24px",

    background:
      dark
        ? "#111827"
        : "#ffffff",

    border:
      dark
        ? "1px solid #1f2937"
        : "1px solid #e5e7eb",
  }}
>

  <table
    style={{
      width: "100%",

      borderCollapse:
        "collapse",

      minWidth:
        "900px",
    }}
  >

    {/* HEAD */}

    <thead>

      <tr
        style={{
          borderBottom:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}
      >

        {[
          "Customer",
          "Phone",
          "Address",
          "Debt",
          "Status",
          "Action",
        ].map(
          (item) => (

            <th
              key={item}

              style={{
                padding:
                  "18px",

                textAlign:
                  "left",

                color:
                  dark
                    ? "#ffffff"
                    : "#111827",
              }}
            >
              {item}
            </th>
          )
        )}
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
              key={
                customer.id
              }

              style={{
                borderBottom:
                  dark
                    ? "1px solid #1f2937"
                    : "1px solid #e5e7eb",
              }}
            >

              <td
                style={{
                  padding:
                    "18px",

                  color:
                    dark
                      ? "#ffffff"
                      : "#111827",

                  fontWeight:
                    "600",
                }}
              >
                {
                  customer.name
                }
              </td>

              <td
                style={{
                  padding:
                    "18px",

                  color:
                    dark
                      ? "#d1d5db"
                      : "#6b7280",
                }}
              >
                {
                  customer.phone
                }
              </td>

              <td
                style={{
                  padding:
                    "18px",

                  color:
                    dark
                      ? "#d1d5db"
                      : "#6b7280",
                }}
              >
                {
                  customer.address
                }
              </td>

              <td
                style={{
                  padding:
                    "18px",

                  color:
                    "#ef4444",

                  fontWeight:
                    "bold",
                }}
              >
                $
                {Number(
                  customer.debt
                ).toFixed(
                  2
                )}
              </td>

              <td
                style={{
                  padding:
                    "18px",
                }}
              >

                <span
                  style={{
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
                  }}
                >
                  {hasPartial
                    ? "Partial"
                    : "Unpaid"}
                </span>
              </td>

              <td
                style={{
                  padding:
                    "18px",
                }}
              >

                <button
                  onClick={() =>
                    markPaid(
                      customer
                    )
                  }

                  style={{
                    background:
                      "#16a34a",

                    color:
                      "#ffffff",

                    border:
                      "none",

                    padding:
                      "12px 18px",

                    borderRadius:
                      "14px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "bold",
                  }}
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

export default Debts;