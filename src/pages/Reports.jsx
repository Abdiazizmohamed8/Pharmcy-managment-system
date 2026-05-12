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
            sale.buyTotal || 0
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

      const grouped = {};

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

    <div style={{
      ...styles.container,

      background:
        dark
          ? "#020617"
          : "#f3f4f6",

      color:
        dark
          ? "#ffffff"
          : "#111827",
    }}>

      {/* HEADER */}

      <div style={styles.header}>

        <h1 style={{
          ...styles.title,

          color:
            dark
              ? "#ffffff"
              : "#111827",
        }}>
          Reports 📈
        </h1>

        <p style={{
          ...styles.subtitle,

          color:
            dark
              ? "#94a3b8"
              : "#6b7280",
        }}>
          Pharmacy analytics
          and reports
        </p>

      </div>

      {/* CARDS */}

      <div style={styles.cardsGrid}>

        {/* SALES */}

        <div style={{
          ...styles.card,

          background:
            dark
              ? "#111827"
              : "#ffffff",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}>

          <p style={{
            ...styles.cardLabel,

            color:
              "#16a34a",
          }}>
            Total Sales
          </p>

          <h2 style={styles.cardAmount}>
            $
            {totalSales.toFixed(2)}
          </h2>

        </div>

        {/* EXPENSES */}

        <div style={{
          ...styles.card,

          background:
            dark
              ? "#111827"
              : "#ffffff",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}>

          <p style={{
            ...styles.cardLabel,

            color:
              "#dc2626",
          }}>
            Expenses
          </p>

          <h2 style={styles.cardAmount}>
            $
            {totalExpenses.toFixed(2)}
          </h2>

        </div>

        {/* PROFIT */}

        <div style={{
          ...styles.card,

          background:
            dark
              ? "#111827"
              : "#ffffff",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}>

          <p style={{
            ...styles.cardLabel,

            color:
              "#06b6d4",
          }}>
            Profit
          </p>

          <h2 style={styles.cardAmount}>
            $
            {totalProfit.toFixed(2)}
          </h2>

        </div>

      </div>

      {/* CHARTS */}

      <div style={styles.chartGrid}>

        {/* BAR CHART */}

        <div style={{
          ...styles.chartCard,

          background:
            dark
              ? "#111827"
              : "#ffffff",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}>

          <h3 style={styles.chartTitle}>
            Sales Analytics
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={salesChart}
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

        <div style={{
          ...styles.chartCard,

          background:
            dark
              ? "#111827"
              : "#ffffff",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}>

          <h3 style={styles.chartTitle}>
            Overview
          </h3>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <PieChart>

              <Pie
                data={pieData}

                cx="50%"

                cy="50%"

                outerRadius={100}

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

      <div style={{
        ...styles.tableCard,

        background:
          dark
            ? "#111827"
            : "#ffffff",

        border:
          dark
            ? "1px solid #1f2937"
            : "1px solid #e5e7eb",
      }}>

        <h3 style={styles.tableTitle}>
          Sales Analytics
        </h3>

        <div style={styles.tableWrapper}>

          <table style={styles.table}>

            <thead>

              <tr style={{
                borderBottom:
                  dark
                    ? "1px solid #1f2937"
                    : "1px solid #e5e7eb",
              }}>

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

            <tbody>

              {sales.map(
                (sale) => {

                  const profit =

                    Number(
                      sale.total || 0
                    ) -

                    Number(
                      sale.buyTotal || 0
                    );

                  return (

                    <tr
                      key={sale.id}

                      style={{
                        borderBottom:
                          dark
                            ? "1px solid #1f2937"
                            : "1px solid #e5e7eb",
                      }}
                    >

                      {/* INVOICE */}

                      <td style={{
                        ...styles.td,

                        color:
                          "#2563eb",

                        fontWeight:
                          "bold",
                      }}>

                        {
                          sale.invoice

                            ? sale.invoice

                            : sale.id?.slice(
                                0,
                                8
                              )
                        }

                      </td>

                      {/* DATE */}

                      <td style={{
                        ...styles.td,

                        minWidth:
                          "180px",

                        whiteSpace:
                          "nowrap",
                      }}>

                        {new Date(
                          sale.date
                        ).toLocaleDateString()}

                      </td>

                      {/* CUSTOMER */}

                      <td style={styles.td}>
                        {sale.customer}
                      </td>

                      {/* MEDICINE */}

                      <td style={styles.td}>
                        {
                          sale.items?.[0]
                            ?.name || "-"
                        }
                      </td>

                      {/* QTY */}

                      <td style={styles.td}>
                        {
                          sale.items?.[0]
                            ?.qty || 0
                        }
                      </td>

                      {/* BUY */}

                      <td style={styles.td}>
                        $
                        {
                          sale.items?.[0]
                            ?.buyPrice || 0
                        }
                      </td>

                      {/* SELL */}

                      <td style={styles.td}>
                        $
                        {
                          sale.items?.[0]
                            ?.price || 0
                        }
                      </td>

                      {/* TOTAL */}

                      <td style={{
                        ...styles.td,

                        color:
                          "#16a34a",

                        fontWeight:
                          "bold",
                      }}>

                        $
                        {Number(
                          sale.total || 0
                        ).toFixed(2)}

                      </td>

                      {/* PROFIT */}

                      <td style={{
                        ...styles.td,

                        color:
                          "#06b6d4",

                        fontWeight:
                          "bold",
                      }}>

                        $
                        {profit.toFixed(2)}

                      </td>

                      {/* PAYMENT */}

                      <td style={styles.td}>
                        {
                          sale.paymentMethod
                        }
                      </td>

                      {/* STATUS */}

                      <td style={{
                        ...styles.td,

                        color:
                          sale.status ===
                          "paid"

                            ? "#16a34a"

                            : "#ef4444",

                        fontWeight:
                          "bold",

                        textTransform:
                          "capitalize",
                      }}>

                        {sale.status}

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

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

    padding: "20px",

    boxSizing: "border-box",
  },

  header: {
    marginBottom: "24px",
  },

  title: {
    fontSize:
      "clamp(30px,6vw,36px)",

    fontWeight: "bold",

    marginBottom: "10px",

    marginTop: 0,
  },

  subtitle: {
    fontSize: "15px",
  },

  cardsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: "20px",

    marginBottom: "30px",
  },

  card: {
    borderRadius: "24px",

    padding: "24px",

    boxSizing: "border-box",
  },

  cardLabel: {
    marginBottom: "10px",

    fontWeight: "600",
  },

  cardAmount: {
    fontSize:
      "clamp(26px,5vw,32px)",

    fontWeight: "bold",

    margin: 0,
  },

  chartGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",

    gap: "24px",

    marginBottom: "30px",
  },

  chartCard: {
    borderRadius: "24px",

    padding: "20px",

    overflowX: "auto",

    boxSizing: "border-box",
  },

  chartTitle: {
    marginBottom: "20px",

    fontSize: "20px",

    fontWeight: "bold",
  },

  tableCard: {
    borderRadius: "24px",

    padding: "24px",

    overflow: "hidden",

    boxSizing: "border-box",
  },

  tableTitle: {
    marginBottom: "24px",

    fontSize: "22px",

    fontWeight: "bold",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",

    minWidth: "1100px",

    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",

    padding: "18px",

    whiteSpace: "nowrap",

    fontSize: "14px",
  },

  td: {
    padding: "18px",

    whiteSpace: "nowrap",

    fontSize: "14px",
  },
};

export default Reports;