import {
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Reports({
  sales,
  medicines,
  expenses,
  dark,
}) {

  /* =========================
     FILTER
  ========================= */

  const [filter] =
    useState("all");

  /* =========================
     TOTALS
  ========================= */

  const totalSales =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total || 0
        ),
      0
    );

  const totalExpenses =
    expenses.reduce(
      (
        sum,
        expense
      ) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  const totalProfit =
    sales.reduce(
      (sum, sale) => {

        const profit =
          Number(
            sale.total || 0
          ) -
          Number(
            sale.buyTotal ||
              0
          );

        return (
          sum + profit
        );
      },
      0
    );

  /* =========================
     CHART DATA
  ========================= */

  const salesChart =
    useMemo(() => {

      const grouped =
        {};

      sales.forEach(
        (sale) => {

          const customer =
            sale.customer ||
            "Unknown";

          if (
            !grouped[
              customer
            ]
          ) {

            grouped[
              customer
            ] = 0;
          }

          grouped[
            customer
          ] += Number(
            sale.total || 0
          );
        }
      );

      return Object.keys(
        grouped
      ).map((key) => ({
        customer: key,
        total:
          grouped[key],
      }));
    }, [sales]);

  /* =========================
     PIE DATA
  ========================= */

  const pieData = [
    {
      name: "Sales",
      value:
        totalSales,
    },

    {
      name: "Expenses",
      value:
        totalExpenses,
    },
  ];

  const COLORS = [
    "#16a34a",
    "#dc2626",
  ];

  return (
    <div
      style={{
        width: "100%",

        minHeight:
          "100vh",

        color:
          dark
            ? "#ffffff"
            : "#111827",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          marginBottom:
            "24px",
        }}
      >

        <h1
          style={{
            fontSize:
              "36px",

            fontWeight:
              "bold",

            marginBottom:
              "10px",
          }}
        >
          Reports 📈
        </h1>

        <p
          style={{
            color:
              dark
                ? "#94a3b8"
                : "#6b7280",
          }}
        >
          Pharmacy analytics
          and reports
        </p>
      </div>

      {/* CARDS */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",

          gap: "20px",

          marginBottom:
            "30px",
        }}
      >

        {/* SALES */}

        <div
          style={{
            background:
              dark
                ? "#111827"
                : "#ffffff",

            borderRadius:
              "24px",

            padding:
              "24px",

            border:
              dark
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",
          }}
        >

          <p
            style={{
              color:
                "#16a34a",

              marginBottom:
                "10px",
            }}
          >
            Total Sales
          </p>

          <h2
            style={{
              fontSize:
                "32px",

              fontWeight:
                "bold",
            }}
          >
            $
            {totalSales.toFixed(
              2
            )}
          </h2>
        </div>

        {/* EXPENSES */}

        <div
          style={{
            background:
              dark
                ? "#111827"
                : "#ffffff",

            borderRadius:
              "24px",

            padding:
              "24px",

            border:
              dark
                ? "1px solid #1f2937"
                : "#e5e7eb",
          }}
        >

          <p
            style={{
              color:
                "#dc2626",

              marginBottom:
                "10px",
            }}
          >
            Expenses
          </p>

          <h2
            style={{
              fontSize:
                "32px",

              fontWeight:
                "bold",
            }}
          >
            $
            {totalExpenses.toFixed(
              2
            )}
          </h2>
        </div>

        {/* PROFIT */}

        <div
          style={{
            background:
              dark
                ? "#111827"
                : "#ffffff",

            borderRadius:
              "24px",

            padding:
              "24px",

            border:
              dark
                ? "1px solid #1f2937"
                : "#e5e7eb",
          }}
        >

          <p
            style={{
              color:
                "#06b6d4",

              marginBottom:
                "10px",
            }}
          >
            Profit
          </p>

          <h2
            style={{
              fontSize:
                "32px",

              fontWeight:
                "bold",
            }}
          >
            $
            {totalProfit.toFixed(
              2
            )}
          </h2>
        </div>
      </div>

      {/* CHARTS */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "2fr 1fr",

          gap: "24px",

          marginBottom:
            "30px",
        }}
      >

        {/* BAR CHART */}

        <div
          style={{
            background:
              dark
                ? "#111827"
                : "#ffffff",

            borderRadius:
              "24px",

            padding:
              "20px",

            border:
              dark
                ? "1px solid #1f2937"
                : "#e5e7eb",

            overflowX:
              "auto",
          }}
        >

          <h3
            style={{
              marginBottom:
                "20px",

              fontSize:
                "20px",

              fontWeight:
                "bold",
            }}
          >
            Sales Analytics
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={
                salesChart
              }
            >

              <CartesianGrid
                strokeDasharray="3 3"

                stroke={
                  dark
                    ? "#334155"
                    : "#e5e7eb"
                }
              />

              <XAxis
                dataKey="customer"

                tick={{
                  fill:
                    dark
                      ? "#cbd5e1"
                      : "#374151",
                }}
              />

              <YAxis
                tick={{
                  fill:
                    dark
                      ? "#cbd5e1"
                      : "#374151",
                }}
              />

              <Tooltip />

              <Bar
                dataKey="total"

                fill="#16a34a"

                radius={[
                  10,
                  10,
                  0,
                  0,
                ]}
              />
            </BarChart>

          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}

        <div
          style={{
            background:
              dark
                ? "#111827"
                : "#ffffff",

            borderRadius:
              "24px",

            padding:
              "20px",

            border:
              dark
                ? "1px solid #1f2937"
                : "#e5e7eb",
          }}
        >

          <h3
            style={{
              marginBottom:
                "20px",

              fontSize:
                "20px",

              fontWeight:
                "bold",
            }}
          >
            Overview
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={pieData}

                cx="50%"

                cy="50%"

                outerRadius={
                  100
                }

                dataKey="value"

                label
              >

                {pieData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={`cell-${index}`}

                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

            </PieChart>

          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}

      <div
        style={{
          background:
            dark
              ? "#111827"
              : "#ffffff",

          borderRadius:
            "24px",

          padding:
            "24px",

          border:
            dark
              ? "1px solid #1f2937"
              : "#e5e7eb",

          overflowX:
            "auto",
        }}
      >

        <h3
          style={{
            marginBottom:
              "24px",

            fontSize:
              "22px",

            fontWeight:
              "bold",
          }}
        >
          Sales Analytics
        </h3>

        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",

            minWidth:
              "1100px",
          }}
        >

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
                "Invoice",
                "Date",
                "Customer",
                "Medicines",
                "Qty",
                "Buy",
                "Sell",
                "Total",
                "Profit",
                "Payment",
                "Status",
              ].map(
                (item) => (

                  <th
                    key={item}

                    style={{
                      textAlign:
                        "left",

                      padding:
                        "18px",

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

          <tbody>

            {sales.map(
              (sale) => {

                const profit =
                  Number(
                    sale.total || 0
                  ) -
                  Number(
                    sale.buyTotal ||
                      0
                  );

                return (

                  <tr
                    key={
                      sale.id
                    }

                    style={{
                      borderBottom:
                        dark
                          ? "1px solid #1f2937"
                          : "#e5e7eb",
                    }}
                  >

                    <td
                      style={{
                        padding:
                          "18px",

                        color:
                          "#2563eb",

                        fontWeight:
                          "bold",
                      }}
                    >
                     {
  sale.invoice
    ? sale.invoice
    : sale.id?.slice(
        0,
        8
      )
}
                    </td>

                  <td
  style={{
    padding:
      "18px",

    minWidth:
      "180px",

    whiteSpace:
      "nowrap",
  }}
>
  {new Date(
    sale.date
  ).toLocaleDateString()}
</td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >
                      {
                        sale.customer
                      }
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >
                      {sale.items?.[0]
                        ?.name || "-"}
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >
                      {sale.items?.[0]
                        ?.qty || 0}
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >
                      $
                      {sale.items?.[0]
                        ?.buyPrice || 0}
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >
                      $
                      {sale.items?.[0]
                        ?.price || 0}
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",

                        color:
                          "#16a34a",

                        fontWeight:
                          "bold",
                      }}
                    >
                      $
                      {Number(
                        sale.total || 0
                      ).toFixed(
                        2
                      )}
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",

                        color:
                          "#06b6d4",

                        fontWeight:
                          "bold",
                      }}
                    >
                      $
                      {profit.toFixed(
                        2
                      )}
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",
                      }}
                    >
                      {
                        sale.paymentMethod
                      }
                    </td>

                    <td
                      style={{
                        padding:
                          "18px",

                        color:
                          sale.status ===
                          "paid"
                            ? "#16a34a"
                            : "#ef4444",

                        fontWeight:
                          "bold",
                      }}
                    >
                      {
                        sale.status
                      }
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;