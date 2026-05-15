import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

/* =========================
    Filters
========================= */

const filters = [
  "Today",
  "Weekly",
  "Monthly",
  "Yearly",
  "All",
];

function Dashboard({
  medicines = [],
  customers = [],
  openSidebar,
}) {
  const { darkMode } =
    useTheme();

  /* =========================
      States
  ========================= */

  const [period, setPeriod] =
    useState("All");

  const [sales, setSales] =
    useState([]);

  /* =========================
      Theme
  ========================= */

  const ui = {
    page: darkMode
      ? "bg-[#020617] text-white"
      : "bg-slate-100 text-black",

    card: darkMode
      ? "bg-[#111827] border-[#1f2937]"
      : "bg-white border-slate-200",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  /* =========================
      Load Sales
  ========================= */

  useEffect(() => {
    const q = query(
      collection(
        db,
        "sales"
      ),
      orderBy(
        "date",
        "desc"
      ),
      limit(20)
    );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {
          setSales(
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            )
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  /* =========================
      Filter Sales
  ========================= */

  const filteredSales =
    useMemo(() => {
      const now =
        new Date();

      return sales.filter(
        (s) => {
          if (!s.date)
            return false;

          const d =
            new Date(
              s.date
            );

          if (
            period ===
            "Today"
          ) {
            return (
              d.toDateString() ===
              now.toDateString()
            );
          }

          if (
            period ===
            "Weekly"
          ) {
            const week =
              new Date();

            week.setDate(
              now.getDate() -
                7
            );

            return d >= week;
          }

          if (
            period ===
            "Monthly"
          ) {
            return (
              d.getMonth() ===
                now.getMonth() &&
              d.getFullYear() ===
                now.getFullYear()
            );
          }

          if (
            period ===
            "Yearly"
          ) {
            return (
              d.getFullYear() ===
              now.getFullYear()
            );
          }

          return true;
        }
      );
    }, [sales, period]);

  /* =========================
      Revenue
  ========================= */

  const revenue =
    filteredSales

      .filter(
        (s) =>
          Number(
            s.total || 0
          ) <=
          Number(
            s.paid || 0
          )
      )

      .reduce(
        (a, b) =>
          a +
          Number(
            b.total || 0
          ),
        0
      );

  /* =========================
      Debt
  ========================= */

  const debt =
    filteredSales

      .filter(
        (s) =>
          Number(
            s.total || 0
          ) >
          Number(
            s.paid || 0
          )
      )

      .reduce(
        (a, b) =>
          a +
          (Number(
            b.total || 0
          ) -
            Number(
              b.paid || 0
            )),
        0
      );

  /* =========================
      Profit
  ========================= */

  const profit =
    revenue - debt;

  /* =========================
      Charts
  ========================= */

  const salesChart =
    filteredSales
      .slice(0, 10)
      .map((s) => ({
        name:
          s.customer ||
          "Sale",

        amount:
          Number(
            s.total || 0
          ),
      }));

  const paymentChart = [
    {
      name: "Paid",
      value: revenue,
    },

    {
      name: "Debt",
      value: debt,
    },
  ];

  const profitChart = [
    {
      name: "Revenue",
      value: revenue,
    },

    {
      name: "Profit",
      value: profit,
    },
  ];

  /* =========================
      Low Stock
  ========================= */

  const lowStock =
    medicines
      .filter(
        (m) =>
          Number(
            m.stock
          ) <=
          Number(
            m.minStock || 5
          )
      )
      .slice(0, 8);

  return (
    <div
      className={`
        min-h-screen
        p-4 md:p-6
        ${ui.page}
      `}
    >
      {/* Header */}
      <div
        className="
        flex items-center
        justify-between
        mb-6
      "
      >
        <div>
          <h1
            className="
            text-3xl md:text-5xl
            font-black
          "
          >
            Dashboard 📊
          </h1>

          <p className={ui.text}>
            Pharmacy analytics
          </p>
        </div>

        {/* Mobile Sidebar */}
        <button
          onClick={
            openSidebar
          }
          className={`
            md:hidden
            w-11 h-11
            rounded-xl border
            ${ui.card}
          `}
        >
          ☰
        </button>
      </div>

      {/* Filters */}
      <div
        className="
        flex flex-wrap
        gap-3 mb-6
      "
      >
        {filters.map(
          (item) => (
            <button
              key={item}
              onClick={() =>
                setPeriod(
                  item
                )
              }
              className={`
                px-4 py-2
                rounded-xl
                font-bold
                transition
                ${
                  period ===
                  item
                    ? "bg-green-600 text-white"
                    : ui.card
                }
              `}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Cards */}
      <div
        className="
        grid grid-cols-2
        lg:grid-cols-6
        gap-4 mb-6
      "
      >
        <Card
          title="Revenue"
          value={`$${revenue.toFixed(
            2
          )}`}
          color="text-green-400"
          ui={ui}
        />

        <Card
          title="Profit"
          value={`$${profit.toFixed(
            2
          )}`}
          color="text-cyan-400"
          ui={ui}
        />

        <Card
          title="Debt"
          value={`$${debt.toFixed(
            2
          )}`}
          color="text-red-400"
          ui={ui}
        />

        <Card
          title="Customers"
          value={
            customers.length
          }
          color="text-blue-400"
          ui={ui}
        />

        <Card
          title="Medicines"
          value={
            medicines.length
          }
          color="text-yellow-400"
          ui={ui}
        />

        <Card
          title="Sales"
          value={
            filteredSales.length
          }
          color="text-purple-400"
          ui={ui}
        />
      </div>

      {/* Charts */}
      <div
        className="
        grid lg:grid-cols-3
        gap-5 mb-6
      "
      >
        {/* Sales */}
        <Chart
          title="Sales 📈"
          ui={ui}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={
                salesChart
              }
            >
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Area
                dataKey="amount"
                stroke="#22c55e"
                fill="#22c55e33"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>

        {/* Payments */}
        <Chart
          title="Payments 💳"
          ui={ui}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={
                  paymentChart
                }
                dataKey="value"
                outerRadius={80}
              >
                <Cell fill="#22c55e" />

                <Cell fill="#ef4444" />
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        {/* Profit */}
        <Chart
          title="Profit 💰"
          ui={ui}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={
                profitChart
              }
            >
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      {/* Low Stock */}
      <div
        className={`
          p-5 rounded-3xl
          border ${ui.card}
        `}
      >
        <h2
          className="
          font-bold mb-4
        "
        >
          Low Stock ⚠️
        </h2>

        {!lowStock.length ? (
          <p className={ui.text}>
            No low stock medicines
          </p>
        ) : (
          <div
            className="
            grid sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          "
          >
            {lowStock.map(
              (m) => (
                <div
                  key={m.id}
                  className="
                    p-4 rounded-2xl
                    bg-red-500/10
                    border border-red-500/20
                  "
                >
                  <h3
                    className="
                    font-bold
                  "
                  >
                    {m.name}
                  </h3>

                  <p
                    className="
                    text-sm text-red-400
                  "
                  >
                    Stock:
                    {" "}
                    {m.stock}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
    Card
========================= */

function Card({
  title,
  value,
  color,
  ui,
}) {
  return (
    <div
      className={`
        p-5 rounded-3xl
        border ${ui.card}
      `}
    >
      <p
        className={`
        text-sm mb-2
        ${ui.text}
      `}
      >
        {title}
      </p>

      <h2
        className={`
        text-3xl font-black
        ${color}
      `}
      >
        {value}
      </h2>
    </div>
  );
}

/* =========================
    Chart
========================= */

function Chart({
  title,
  children,
  ui,
}) {
  return (
    <div
      className={`
        p-5 rounded-3xl
        border h-[340px]
        ${ui.card}
      `}
    >
      <h2
        className="
        font-bold mb-4
      "
      >
        {title}
      </h2>

      <div className="h-[260px]">
        {children}
      </div>
    </div>
  );
}

export default Dashboard;