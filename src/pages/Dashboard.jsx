import {
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  useTheme,
} from "../context/ThemeContext";

function Dashboard({
  medicines = [],
  customers = [],
  sales = [],
  openSidebar,
}) {

  const {
    darkMode,
  } = useTheme();

  const [
    period,
    setPeriod,
  ] = useState("All");

  /* =========================
        FILTER SALES
  ========================= */

  const filteredSales =
    useMemo(() => {

      const now =
        new Date();

      return sales.filter(
        (sale) => {

          if (!sale.date)
            return false;

          const saleDate =
            new Date(
              sale.date
            );

          if (
            period ===
            "Today"
          ) {

            return (
              saleDate.toDateString() ===
              now.toDateString()
            );
          }

          if (
            period ===
            "Weekly"
          ) {

            const weekAgo =
              new Date();

            weekAgo.setDate(
              now.getDate() - 7
            );

            return (
              saleDate >= weekAgo
            );
          }

          if (
            period ===
            "Monthly"
          ) {

            return (

              saleDate.getMonth() ===
                now.getMonth() &&

              saleDate.getFullYear() ===
                now.getFullYear()
            );
          }

          if (
            period ===
            "Yearly"
          ) {

            return (
              saleDate.getFullYear() ===
              now.getFullYear()
            );
          }

          return true;
        }
      );

    }, [
      sales,
      period,
    ]);

  /* =========================
        STATS
  ========================= */

  const totalRevenue =
    filteredSales.reduce(
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

  const totalPaid =
    filteredSales.reduce(
      (
        acc,
        sale
      ) =>

        acc +
        Number(
          sale.paid || 0
        ),

      0
    );

  const totalDebt =
    filteredSales

      .filter(
        (sale) =>

          sale.status !==
          "Paid"
      )

      .reduce(
        (
          acc,
          sale
        ) => {

          const debt =

            Number(
              sale.total || 0
            )

            -

            Number(
              sale.paid || 0
            );

          return (
            acc + debt
          );

        },

        0
      );

  const totalProfit =
    filteredSales.reduce(
      (
        acc,
        sale
      ) =>

        acc +

        (
          Number(
            sale.total || 0
          ) -

          Number(
            sale.cost || 0
          )
        ),

      0
    );

  /* =========================
        LOW STOCK
  ========================= */

  const lowStock =
    medicines.filter(
      (medicine) =>

        Number(
          medicine.stock
        ) <=
        Number(
          medicine.minStock || 5
        )
    );

  /* =========================
        CHART DATA
  ========================= */

  const salesChart =
    filteredSales.map(
      (sale) => ({
        name:
          sale.customer ||
          "Sale",

        amount:
          Number(
            sale.total || 0
          ),
      })
    );

  const paymentData = [

    {
      name: "Paid",
      value: totalPaid,
    },

    {
      name: "Debt",
      value: totalDebt,
    },
  ];

  const monthlyData = [

    {
      name: "Revenue",
      value: totalRevenue,
    },

    {
      name: "Profit",
      value: totalProfit,
    },
  ];

  /* =========================
        RECENT SALES
  ========================= */

  const recentSales =
    [...filteredSales]
      .sort(
        (a, b) =>
          b.createdAt -
          a.createdAt
      )
      .slice(0, 5);

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

      {/* MOBILE TOP */}

      <div style={styles.mobileTop}>

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
          }}
        >
          ☰
        </button>

        <h1
          style={{
            ...styles.mobileTitle,

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}
        >
          Dashboard
        </h1>

      </div>

      {/* HEADER */}

      <div style={styles.header}>

        <h1
          style={{
            ...styles.mainTitle,

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}
        >
          Dashboard 📊
        </h1>

        <p
          style={{
            ...styles.subtitle,

            color:
              darkMode
                ? "#94a3b8"
                : "#64748b",
          }}
        >
          Pharmacy analytics overview
        </p>

      </div>

      {/* FILTERS */}

      <div style={styles.filterWrapper}>

        {[
          "Today",
          "Weekly",
          "Monthly",
          "Yearly",
          "All",
        ].map((item) => (

          <button
            key={item}

            onClick={() =>
              setPeriod(item)
            }

            style={{
              ...styles.filterButton,

              background:
                period === item

                  ? "#16a34a"

                  : darkMode
                  ? "#111827"
                  : "#ffffff",

              color:
                period === item

                  ? "#ffffff"

                  : darkMode
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            {item}
          </button>
        ))}

      </div>

      {/* STATS */}

      <div style={styles.cardGrid}>

        <Card
          title="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          color="#16a34a"
          darkMode={darkMode}
        />

        <Card
          title="Profit"
          value={`$${totalProfit.toFixed(2)}`}
          color="#06b6d4"
          darkMode={darkMode}
        />

        <Card
          title="Debt"
          value={`$${totalDebt.toFixed(2)}`}
          color="#dc2626"
          darkMode={darkMode}
        />

        <Card
          title="Customers"
          value={customers.length}
          color="#2563eb"
          darkMode={darkMode}
        />

        <Card
          title="Medicines"
          value={medicines.length}
          color="#f59e0b"
          darkMode={darkMode}
        />

        <Card
          title="Sales"
          value={filteredSales.length}
          color="#8b5cf6"
          darkMode={darkMode}
        />

      </div>

      {/* CHARTS */}

      <div style={styles.chartGrid}>

        {/* SALES */}

        <div style={box(darkMode)}>

          <h2 style={title(darkMode)}>
            Sales Overview 📈
          </h2>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <AreaChart
              data={salesChart}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#16a34a"
                fill="#16a34a"
                fillOpacity={0.2}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        {/* PAYMENT */}

        <div style={box(darkMode)}>

          <h2 style={title(darkMode)}>
            Payment Report 💳
          </h2>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <PieChart>

              <Pie
                data={paymentData}
                dataKey="value"
                outerRadius={90}
                label
              >

                <Cell fill="#16a34a" />

                <Cell fill="#dc2626" />

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* PROFIT */}

        <div style={box(darkMode)}>

          <h2 style={title(darkMode)}>
            Profit Report 💰
          </h2>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <BarChart
              data={monthlyData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#2563eb"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* LOW STOCK */}

      <div style={box(darkMode)}>

        <h2 style={title(darkMode)}>
          Low Stock ⚠️
        </h2>

        {
          lowStock.length === 0 ? (

            <div style={styles.empty}>
              No low stock medicines
            </div>

          ) : (

            <div style={styles.lowGrid}>

              {
                lowStock.map(
                  (medicine) => (

                    <div
                      key={medicine.id}

                      style={{
                        ...styles.lowCard,

                        background:
                          darkMode
                            ? "#7f1d1d"
                            : "#fee2e2",
                      }}
                    >

                      <h3>
                        {medicine.name}
                      </h3>

                      <p>
                        Stock:
                        {" "}
                        {
                          medicine.stock
                        }
                      </p>

                    </div>
                  )
                )
              }

            </div>
          )
        }

      </div>

      {/* RECENT SALES */}

      <div style={box(darkMode)}>

        <h2 style={title(darkMode)}>
          Recent Sales 🧾
        </h2>

        {
          recentSales.length === 0 ? (

            <div style={styles.empty}>
              No recent sales
            </div>

          ) : (

            <div
              style={{
                ...styles.tableWrapper,

                background:
                  darkMode
                    ? "#0f172a"
                    : "#ffffff",
              }}
            >

              <table style={styles.table}>

                <thead>

                  <tr
                    style={{
                      background:
                        darkMode
                          ? "#111827"
                          : "#f1f5f9",
                    }}
                  >

                    <th style={styles.th}>
                      Customer
                    </th>

                    <th style={styles.th}>
                      Amount
                    </th>

                    <th style={styles.th}>
                      Payment
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th style={styles.th}>
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    recentSales.map(
                      (sale) => (

                        <tr
                          key={sale.id}

                          style={{
                            borderBottom:
                              darkMode
                                ? "1px solid #1e293b"
                                : "1px solid #e2e8f0",
                          }}
                        >

                          <td
                            style={{
                              ...styles.td,
                              fontWeight: "700",
                            }}
                          >
                            {sale.customer}
                          </td>

                          <td
                            style={{
                              ...styles.td,
                              color: "#16a34a",
                              fontWeight: "700",
                            }}
                          >

                            $
                            {
                              Number(
                                sale.total || 0
                              ).toFixed(2)
                            }

                          </td>

                          <td style={styles.td}>

                            <span
                              style={{
                                ...styles.badge,

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
                              }}
                            >

                              {sale.method}

                            </span>

                          </td>

                          <td style={styles.td}>

                            <span
                              style={{
                                ...styles.badge,

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

                                    ? "#d97706"

                                    : "#dc2626",
                              }}
                            >

                              {sale.status}

                            </span>

                          </td>

                          <td
                            style={{
                              ...styles.td,

                              color:
                                darkMode
                                  ? "#94a3b8"
                                  : "#64748b",
                            }}
                          >

                            {
                              sale.date?.slice(0, 10)
                            }

                          </td>

                        </tr>
                      )
                    )
                  }

                </tbody>

              </table>

            </div>
          )
        }

      </div>

    </div>
  );
}

/* =========================
      CARD
========================= */

function Card({
  title,
  value,
  color,
  darkMode,
}) {

  return (

    <div
      style={{
        ...styles.card,

        background:
          darkMode
            ? "#111827"
            : "#ffffff",

        borderTop:
          `5px solid ${color}`,
      }}
    >

      <p
        style={{
          color:
            darkMode
              ? "#94a3b8"
              : "#64748b",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: 0,

          color:
            darkMode
              ? "#ffffff"
              : "#111827",
        }}
      >
        {value}
      </h2>

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

  mobileTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  menuButton: {
    width: "46px",
    height: "46px",
    border: "none",
    borderRadius: "12px",
    fontSize: "20px",
    cursor: "pointer",
  },

  mobileTitle: {
    margin: 0,
    fontSize: "24px",
  },

  header: {
    marginBottom: "24px",
  },

  mainTitle: {
    margin: 0,
    fontSize:
      "clamp(28px,6vw,38px)",
  },

  subtitle: {
    marginTop: "8px",
    fontSize: "15px",
  },

  filterWrapper: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(120px,1fr))",

    gap: "12px",

    marginBottom: "24px",
  },

  filterButton: {
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  cardGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: "16px",

    marginBottom: "24px",
  },

  card: {
    padding: "20px",
    borderRadius: "22px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.05)",
  },

  chartGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",

    gap: "18px",

    marginBottom: "24px",
  },

  lowGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: "14px",
  },

  lowCard: {
    padding: "18px",
    borderRadius: "16px",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },

  th: {
    padding: "16px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "16px",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  badge: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    whiteSpace: "nowrap",
  },

  empty: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
  },
};

const box = (darkMode) => ({
  background:
    darkMode
      ? "#111827"
      : "#ffffff",

  borderRadius: "24px",

  padding: "20px",

  boxShadow:
    "0 4px 18px rgba(0,0,0,0.05)",
});

const title = (darkMode) => ({
  marginTop: 0,
  marginBottom: "20px",

  color:
    darkMode
      ? "#ffffff"
      : "#111827",
});

export default Dashboard;