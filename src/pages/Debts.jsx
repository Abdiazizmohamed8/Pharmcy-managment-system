import { useState } from "react";

function Debts({
  customers,
  setCustomers,
  sales,
  setSales,
  toast,
}) {

  const [search, setSearch] =
    useState("");

  /* ONLY CUSTOMERS WITH DEBT */
  const debtCustomers =
    customers.filter(
      (customer) =>
        Number(
          customer.debt
        ) > 0
    );

  /* SEARCH */
  const filteredCustomers =
    debtCustomers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* TOTAL DEBT */
  const totalDebt =
    debtCustomers.reduce(
      (acc, customer) =>

        acc +
        Number(
          customer.debt ||
            0
        ),

      0
    );

  /* MARK PAID */
  const markPaid = (
    customerName
  ) => {

    /* UPDATE CUSTOMERS */
    const updatedCustomers =
      customers.map(
        (customer) => {

          if (
            customer.name ===
            customerName
          ) {

            return {
              ...customer,
              debt: 0,
            };
          }

          return customer;
        }
      );

    setCustomers(
      updatedCustomers
    );

    /* UPDATE SALES */
    const updatedSales =
      sales.map((sale) => {

        if (
          sale.customer ===
            customerName &&
          sale.status !==
            "Paid"
        ) {

          return {
            ...sale,

            status:
              "Paid",

            paid:
              sale.total,

            debt: 0,
          };
        }

        return sale;
      });

    setSales(updatedSales);

    toast(
      `${customerName} debt paid`
    );
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
            "24px",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
            }}
          >
            Debts 💳
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
            }}
          >
            Manage unpaid and
            partial payments
          </p>
        </div>

        <div
          style={{
            background:
              "#dc2626",

            color: "#fff",

            padding:
              "20px",

            borderRadius:
              "20px",

            fontWeight:
              "bold",

            fontSize:
              "28px",
          }}
        >
          Total Debt:
          {" "}
          $
          {totalDebt.toFixed(
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
                Customer
              </th>

              <th style={th}>
                Phone
              </th>

              <th style={th}>
                Address
              </th>

              <th style={th}>
                Debt
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

            {filteredCustomers.length ===
            0 ? (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    padding:
                      "40px",

                    textAlign:
                      "center",

                    color:
                      "#9ca3af",
                  }}
                >
                  No debts found
                </td>
              </tr>

            ) : (

              filteredCustomers.map(
                (
                  customer
                ) => {

                  const customerSales =
                    sales.filter(
                      (
                        sale
                      ) =>

                        sale.customer ===
                        customer.name
                    );

                  const hasPartial =
                    customerSales.some(
                      (
                        sale
                      ) =>

                        sale.status ===
                        "Partial"
                    );

                  return (
                    <tr
                      key={
                        customer.id
                      }
                      style={{
                        borderTop:
                          "1px solid #f3f4f6",
                      }}
                    >

                      <td style={td}>
                        {
                          customer.name
                        }
                      </td>

                      <td style={td}>
                        {
                          customer.phone ||
                          "N/A"
                        }
                      </td>

                      <td style={td}>
                        {
                          customer.address ||
                          "N/A"
                        }
                      </td>

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
                          customer.debt
                        ).toFixed(
                          2
                        )}
                      </td>

                      <td style={td}>

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

                            fontWeight:
                              "bold",

                            fontSize:
                              "14px",
                          }}
                        >
                          {hasPartial
                            ? "Partial"
                            : "Unpaid"}
                        </span>
                      </td>

                      <td style={td}>

                        <button
                          onClick={() =>
                            markPaid(
                              customer.name
                            )
                          }
                          style={{
                            background:
                              "#16a34a",

                            color:
                              "#fff",

                            border:
                              "none",

                            padding:
                              "12px 18px",

                            borderRadius:
                              "12px",

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

export default Debts;