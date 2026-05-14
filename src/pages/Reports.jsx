import {
  useMemo,
  useRef,
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
  LineChart,
  Line,
} from "recharts";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import {
  useReactToPrint,
} from "react-to-print";

import {
  useTheme,
} from "../context/ThemeContext";

function Reports({
  sales = [],
  medicines = [],
  expenses = [],
  openSidebar,
}) {

  const { darkMode } =
    useTheme();

  /* =========================================
        PRINT REF
  ========================================= */

  const reportRef =
    useRef(null);

  const handlePrint =
    useReactToPrint({

      contentRef:
        reportRef,
    });

  /* =========================================
        TOTALS
  ========================================= */

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
    totalSales -
    totalExpenses;

  /* =========================================
        DAILY SALES
  ========================================= */

  const dailySales =
    useMemo(() => {

      const grouped = {};

      sales.forEach(
        (sale) => {

          const date =
            sale.date?.split(
              "T"
            )[0] ||
            "Unknown";

          if (
            !grouped[date]
          ) {

            grouped[
              date
            ] = 0;
          }

          grouped[
            date
          ] += Number(
            sale.total || 0
          );
        }
      );

      return Object.keys(
        grouped
      ).map((key) => ({
        date: key,
        total:
          grouped[key],
      }));

    }, [sales]);

  /* =========================================
        MONTHLY SALES
  ========================================= */

  const monthlySales =
    useMemo(() => {

      const grouped = {};

      sales.forEach(
        (sale) => {

          const month =
            new Date(
              sale.date
            ).toLocaleString(
              "default",

              {
                month:
                  "short",
              }
            );

          if (
            !grouped[month]
          ) {

            grouped[
              month
            ] = 0;
          }

          grouped[
            month
          ] += Number(
            sale.total || 0
          );
        }
      );

      return Object.keys(
        grouped
      ).map((key) => ({
        month: key,
        total:
          grouped[key],
      }));

    }, [sales]);

  /* =========================================
        BEST CUSTOMERS
  ========================================= */

  const bestCustomers =
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

      return Object.entries(
        grouped
      )

        .map(
          ([
            name,
            total,
          ]) => ({
            name,
            total,
          })
        )

        .sort(
          (a, b) =>
            b.total -
            a.total
        )

        .slice(0, 5);

    }, [sales]);

  /* =========================================
        BEST MEDICINES
  ========================================= */

  const bestMedicines =
    useMemo(() => {

      const grouped = {};

      sales.forEach(
        (sale) => {

          sale.items?.forEach(
            (item) => {

              if (
                !grouped[
                  item.name
                ]
              ) {

                grouped[
                  item.name
                ] = 0;
              }

              grouped[
                item.name
              ] += Number(
                item.qty || 0
              );
            }
          );
        }
      );

      return Object.entries(
        grouped
      )

        .map(
          ([
            name,
            qty,
          ]) => ({
            name,
            qty,
          })
        )

        .sort(
          (a, b) =>
            b.qty -
            a.qty
        )

        .slice(0, 5);

    }, [sales]);

  /* =========================================
        PIE DATA
  ========================================= */

  const pieData = [

    {
      name: "Revenue",
      value:
        totalSales,
    },

    {
      name: "Expenses",
      value:
        totalExpenses,
    },
  ];

  /* =========================================
        EXPORT PDF
  ========================================= */

  const exportPDF =
    () => {

      const doc =
        new jsPDF();

      doc.text(
        "ANFAC PHARMACY REPORTS",
        14,
        15
      );

      autoTable(doc, {

        startY: 25,

        head: [[
          "Customer",
          "Total",
        ]],

        body:
          bestCustomers.map(
            (
              customer
            ) => [

              customer.name,

              `$${customer.total.toFixed(
                2
              )}`,
            ]
          ),
      });

      doc.save(
        "reports.pdf"
      );
    };

  /* =========================================
        EXPORT EXCEL
  ========================================= */

  const exportExcel =
    () => {

      const worksheet =
        XLSX.utils.json_to_sheet(
          sales
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Reports"
      );

      XLSX.writeFile(

        workbook,

        "reports.xlsx"
      );
    };

  return (

    <div
      style={{
        ...styles.container,

        background:
          darkMode
            ? "#020617"
            : "#f1f5f9",

        color:
          darkMode
            ? "#ffffff"
            : "#111827",
      }}
    >

      {/* HEADER */}

      <div
        style={
          styles.header
        }
      >

        <div
          style={
            styles.headerLeft
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
            }}
          >
            ☰
          </button>

          <div>

            <h1
              style={
                styles.title
              }
            >
              Reports 📊
            </h1>

            <p
              style={
                styles.subtitle
              }
            >
              Pharmacy
              analytics
              dashboard
            </p>

          </div>

        </div>

        {/* ACTIONS */}

        <div
          style={
            styles.exportActions
          }
        >

          <button
            onClick={
              exportPDF
            }

            style={{
              ...styles.actionButton,
              background:
                "#dc2626",
            }}
          >
            Export PDF
          </button>

          <button
            onClick={
              exportExcel
            }

            style={{
              ...styles.actionButton,
              background:
                "#16a34a",
            }}
          >
            Export Excel
          </button>

          <button
            onClick={
              handlePrint
            }

            style={{
              ...styles.actionButton,
              background:
                "#2563eb",
            }}
          >
            Print Report
          </button>

        </div>

      </div>

      {/* PRINT AREA */}

      <div ref={reportRef}>

        {/* CARDS */}

        <div
          style={
            styles.cardsGrid
          }
        >

          <div
            style={{
              ...styles.card,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",
            }}
          >

            <span
              style={
                styles.cardTitle
              }
            >
              Daily Sales
            </span>

            <h2
              style={{
                ...styles.cardValue,
                color:
                  "#22c55e",
              }}
            >
              $
              {
                totalSales.toFixed(
                  2
                )
              }
            </h2>

          </div>

          <div
            style={{
              ...styles.card,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",
            }}
          >

            <span
              style={
                styles.cardTitle
              }
            >
              Expenses
            </span>

            <h2
              style={{
                ...styles.cardValue,
                color:
                  "#ef4444",
              }}
            >
              $
              {
                totalExpenses.toFixed(
                  2
                )
              }
            </h2>

          </div>

          <div
            style={{
              ...styles.card,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",
            }}
          >

            <span
              style={
                styles.cardTitle
              }
            >
              Profit
            </span>

            <h2
              style={{
                ...styles.cardValue,
                color:
                  "#06b6d4",
              }}
            >
              $
              {
                totalProfit.toFixed(
                  2
                )
              }
            </h2>

          </div>

          <div
            style={{
              ...styles.card,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",
            }}
          >

            <span
              style={
                styles.cardTitle
              }
            >
              Medicines
            </span>

            <h2
              style={{
                ...styles.cardValue,
                color:
                  "#f59e0b",
              }}
            >
              {
                medicines.length
              }
            </h2>

          </div>

        </div>

        {/* CHARTS */}

        <div
          style={
            styles.chartGrid
          }
        >

          {/* DAILY */}

          <div
            style={{
              ...styles.chartCard,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",
            }}
          >

            <h3
              style={
                styles.chartTitle
              }
            >
              Daily Sales
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart
                data={
                  dailySales
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#22c55e"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {/* MONTHLY */}

          <div
            style={{
              ...styles.chartCard,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",
            }}
          >

            <h3
              style={
                styles.chartTitle
              }
            >
              Monthly Report
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={
                  monthlySales
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="total"
                  fill="#2563eb"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* PIE */}

          <div
            style={{
              ...styles.chartCard,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",
            }}
          >

            <h3
              style={
                styles.chartTitle
              }
            >
              Expense vs
              Revenue
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >

                  <Cell fill="#22c55e" />

                  <Cell fill="#ef4444" />

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* TABLES */}

        <div
          style={
            styles.tableGrid
          }
        >

          {/* CUSTOMERS */}

          <div
            style={{
              ...styles.tableCard,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",
            }}
          >

            <h3
              style={
                styles.chartTitle
              }
            >
              Best Customers
            </h3>

            {
              bestCustomers.map(
                (
                  customer,
                  index
                ) => (

                  <div
                    key={index}

                    style={
                      styles.tableRow
                    }
                  >

                    <span>
                      {
                        customer.name
                      }
                    </span>

                    <strong
                      style={{
                        color:
                          "#22c55e",
                      }}
                    >
                      $
                      {
                        customer.total.toFixed(
                          2
                        )
                      }
                    </strong>

                  </div>
                )
              )
            }

          </div>

          {/* MEDICINES */}

          <div
            style={{
              ...styles.tableCard,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",
            }}
          >

            <h3
              style={
                styles.chartTitle
              }
            >
              Best Selling
              Medicines
            </h3>

            {
              bestMedicines.map(
                (
                  medicine,
                  index
                ) => (

                  <div
                    key={index}

                    style={
                      styles.tableRow
                    }
                  >

                    <span>
                      {
                        medicine.name
                      }
                    </span>

                    <strong
                      style={{
                        color:
                          "#2563eb",
                      }}
                    >
                      {
                        medicine.qty
                      }
                    </strong>

                  </div>
                )
              )
            }

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================
      STYLES
========================================= */

const styles = {

  container: {
    width: "100%",
    minHeight: "100vh",
    padding: "24px",
    boxSizing:
      "border-box",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom:
      "30px",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  menuButton: {
    width: "50px",
    height: "50px",
    borderRadius:
      "14px",
    border: "none",
    cursor: "pointer",
    fontSize: "22px",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.08)",
  },

  title: {
    margin: 0,
    fontSize:
      "clamp(28px,4vw,40px)",
    fontWeight:
      "700",
  },

  subtitle: {
    marginTop: "6px",
    fontSize: "15px",
  },

  exportActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  actionButton: {
    border: "none",
    padding:
      "12px 18px",
    borderRadius:
      "12px",
    cursor: "pointer",
    fontWeight:
      "bold",
    color: "#ffffff",
    fontSize: "14px",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "20px",
    marginBottom:
      "30px",
  },

  card: {
    padding: "24px",
    borderRadius:
      "22px",
    boxShadow:
      "0 6px 20px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    fontSize: "15px",
    fontWeight:
      "600",
    color: "#64748b",
  },

  cardValue: {
    fontSize: "34px",
    fontWeight:
      "bold",
    marginTop: "10px",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "24px",
    marginBottom:
      "30px",
  },

  chartCard: {
    borderRadius:
      "24px",
    padding: "24px",
    minHeight:
      "380px",
    boxShadow:
      "0 6px 20px rgba(0,0,0,0.05)",
  },

  chartTitle: {
    marginBottom:
      "20px",
    fontSize: "18px",
    fontWeight:
      "bold",
  },

  tableGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "24px",
  },

  tableCard: {
    borderRadius:
      "24px",
    padding: "24px",
    boxShadow:
      "0 6px 20px rgba(0,0,0,0.05)",
  },

  tableRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom:
      "1px solid #e5e7eb",
  },
};

export default Reports;