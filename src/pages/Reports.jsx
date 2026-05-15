import {
  useEffect,
  useMemo,
  useRef,
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
  LineChart,
  Line,
} from "recharts";

import {
  collection,
  onSnapshot,
  query,
  limit,
  orderBy,
} from "firebase/firestore";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import {
  useReactToPrint,
} from "react-to-print";

import { db } from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

function Reports({
  medicines = [],
  openSidebar,
}) {
  const { darkMode } =
    useTheme();

  /* =========================
      States
  ========================= */

  const [sales, setSales] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  /* =========================
      Theme
  ========================= */

  const ui = {
    bg: darkMode
      ? "bg-[#020617] text-white"
      : "bg-slate-100 text-black",

    card: darkMode
      ? "bg-[#111827]"
      : "bg-white",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  /* =========================
      Load Firebase Data
  ========================= */

  useEffect(() => {
    const salesQuery =
      query(
        collection(
          db,
          "sales"
        ),
        orderBy(
          "date",
          "desc"
        ),
        limit(100)
      );

    const expensesQuery =
      query(
        collection(
          db,
          "expenses"
        ),
        orderBy(
          "date",
          "desc"
        ),
        limit(100)
      );

    const unsubSales =
      onSnapshot(
        salesQuery,
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

    const unsubExpenses =
      onSnapshot(
        expensesQuery,
        (snapshot) => {
          setExpenses(
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            )
          );
        }
      );

    return () => {
      unsubSales();
      unsubExpenses();
    };
  }, []);

  /* =========================
      Print
  ========================= */

  const reportRef =
    useRef(null);

  const print =
    useReactToPrint({
      contentRef:
        reportRef,
    });

  /* =========================
      Totals
  ========================= */

  const totalSales =
    sales.reduce(
      (a, b) =>
        a +
        Number(
          b.total || 0
        ),
      0
    );

  const totalExpenses =
    expenses.reduce(
      (a, b) =>
        a +
        Number(
          b.amount || 0
        ),
      0
    );

  const profit =
    totalSales -
    totalExpenses;

  /* =========================
      Daily Sales
  ========================= */

  const dailySales =
    useMemo(() => {
      const data = {};

      sales.forEach(
        (s) => {
          const d =
            s.date?.split(
              "T"
            )[0];

          data[d] =
            (data[d] || 0) +
            Number(
              s.total || 0
            );
        }
      );

      return Object.keys(
        data
      ).map((d) => ({
        date: d,
        total: data[d],
      }));
    }, [sales]);

  /* =========================
      Monthly Sales
  ========================= */

  const monthlySales =
    useMemo(() => {
      const data = {};

      sales.forEach(
        (s) => {
          const m =
            new Date(
              s.date
            ).toLocaleString(
              "default",
              {
                month:
                  "short",
              }
            );

          data[m] =
            (data[m] || 0) +
            Number(
              s.total || 0
            );
        }
      );

      return Object.keys(
        data
      ).map((m) => ({
        month: m,
        total: data[m],
      }));
    }, [sales]);

  /* =========================
      Best Customers
  ========================= */

  const bestCustomers =
    useMemo(() => {
      const data = {};

      sales.forEach(
        (s) => {
          data[s.customer] =
            (data[
              s.customer
            ] || 0) +
            Number(
              s.total || 0
            );
        }
      );

      return Object.entries(
        data
      )

        .map(
          ([name, total]) => ({
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

  /* =========================
      Best Medicines
  ========================= */

  const bestMedicines =
    useMemo(() => {
      const data = {};

      sales.forEach(
        (s) => {
          s.items?.forEach(
            (i) => {
              data[i.name] =
                (data[
                  i.name
                ] || 0) +
                Number(
                  i.qty || 0
                );
            }
          );
        }
      );

      return Object.entries(
        data
      )

        .map(
          ([name, qty]) => ({
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

  /* =========================
      Pie Chart
  ========================= */

  const pie = [
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

  /* =========================
      Export PDF
  ========================= */

  const exportPDF =
    () => {
      const doc =
        new jsPDF();

      doc.text(
        "ANFAC REPORT",
        14,
        15
      );

      autoTable(doc, {
        startY: 25,

        head: [[
          "Sales",
          "Expenses",
          "Profit",
        ]],

        body: [[
          `$${totalSales.toFixed(
            2
          )}`,

          `$${totalExpenses.toFixed(
            2
          )}`,

          `$${profit.toFixed(
            2
          )}`,
        ]],
      });

      doc.save(
        "reports.pdf"
      );
    };

  /* =========================
      Export Excel
  ========================= */

  const exportExcel =
    () => {
      const ws =
        XLSX.utils.json_to_sheet(
          sales
        );

      const wb =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Reports"
      );

      XLSX.writeFile(
        wb,
        "reports.xlsx"
      );
    };

  return (
    <div
      className={`
        min-h-screen
        p-4 md:p-6
        ${ui.bg}
      `}
    >
      {/* Header */}
      <div
        className="
        flex flex-col lg:flex-row
        justify-between gap-5
        mb-8
      "
      >
        <div
          className="
          flex items-center gap-4
        "
        >
          {/* Mobile Sidebar */}
          <button
            onClick={
              openSidebar
            }
            className={`
              md:hidden
              w-12 h-12
              rounded-2xl
              text-xl
              ${ui.card}
            `}
          >
            ☰
          </button>

          <div>
            <h1
              className="
              text-3xl md:text-5xl
              font-black
            "
            >
              Reports 📊
            </h1>

            <p className={ui.text}>
              Pharmacy analytics
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className="
          flex flex-wrap gap-3
        "
        >
          <Btn
            text="PDF"
            color="bg-red-600"
            click={exportPDF}
          />

          <Btn
            text="Excel"
            color="bg-green-600"
            click={exportExcel}
          />

          <Btn
            text="Print"
            color="bg-blue-600"
            click={print}
          />
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef}>
        {/* Cards */}
        <div
          className="
          grid grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5 mb-6
        "
        >
          <Card
            title="Sales"
            value={`$${totalSales.toFixed(
              2
            )}`}
            color="text-green-500"
            ui={ui}
          />

          <Card
            title="Expenses"
            value={`$${totalExpenses.toFixed(
              2
            )}`}
            color="text-red-500"
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
            title="Medicines"
            value={
              medicines.length
            }
            color="text-yellow-500"
            ui={ui}
          />
        </div>

        {/* Charts */}
        <div
          className="
          grid grid-cols-1
          xl:grid-cols-3
          gap-5 mb-6
        "
        >
          {/* Daily */}
          <ChartCard
            title="Daily Sales"
            ui={ui}
          >
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
                  dataKey="total"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Monthly */}
          <ChartCard
            title="Monthly Report"
            ui={ui}
          >
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
          </ChartCard>

          {/* Pie */}
          <ChartCard
            title="Expense vs Revenue"
            ui={ui}
          >
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={pie}
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
          </ChartCard>
        </div>

        {/* Bottom Lists */}
        <div
          className="
          grid grid-cols-1
          xl:grid-cols-2
          gap-5
        "
        >
          <ListCard
            title="Best Customers"
            ui={ui}
            data={bestCustomers}
            color="text-green-500"
            type="money"
          />

          <ListCard
            title="Best Medicines"
            ui={ui}
            data={bestMedicines}
            color="text-blue-500"
            type="qty"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================
    Button
========================= */

function Btn({
  text,
  color,
  click,
}) {
  return (
    <button
      onClick={click}
      className={`
        h-12 px-5
        rounded-2xl
        text-white font-bold
        ${color}
      `}
    >
      {text}
    </button>
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
        p-6 rounded-3xl
        ${ui.card}
      `}
    >
      <p className={ui.text}>
        {title}
      </p>

      <h2
        className={`
        text-5xl font-black
        mt-3 ${color}
      `}
      >
        {value}
      </h2>
    </div>
  );
}

/* =========================
    Chart Card
========================= */

function ChartCard({
  title,
  children,
  ui,
}) {
  return (
    <div
      className={`
        p-6 rounded-3xl
        ${ui.card}
      `}
    >
      <h2
        className="
        text-2xl font-black
        mb-5
      "
      >
        {title}
      </h2>

      {children}
    </div>
  );
}

/* =========================
    List Card
========================= */

function ListCard({
  title,
  data,
  color,
  type,
  ui,
}) {
  return (
    <div
      className={`
        p-6 rounded-3xl
        ${ui.card}
      `}
    >
      <h2
        className="
        text-2xl font-black
        mb-5
      "
      >
        {title}
      </h2>

      {!data.length ? (
        <p className={ui.text}>
          No data found
        </p>
      ) : (
        <div className="space-y-4">
          {data.map(
            (item, i) => (
              <div
                key={i}
                className="
                  flex items-center
                  justify-between
                  border-b border-slate-700
                  pb-3
                "
              >
                <h3 className="font-bold">
                  {item.name}
                </h3>

                <span
                  className={`
                    font-black
                    ${color}
                  `}
                >
                  {type ===
                  "money"
                    ? `$${item.total.toFixed(
                        2
                      )}`
                    : `${item.qty} Qty`}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;