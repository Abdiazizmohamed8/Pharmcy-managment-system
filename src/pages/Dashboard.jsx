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
} from "recharts";

function Dashboard({
  medicines = [],
  customers = [],
  sales = [],
  dark = false,
}) {

  /* =========================
     FILTER
  ========================= */

  const [period, setPeriod] =
    useState("All");

  /* =========================
     FILTER SALES
  ========================= */

  const filteredSales =
    useMemo(() => {

      const now =
        new Date();

      return sales
        .filter(
          (sale) =>

            sale.status ===
            "paid"
        )

        .filter(
          (sale) => {

            if (!sale.date)
              return true;

            const saleDate =
              new Date(
                sale.date
              );

            const diff =
              now - saleDate;

            const days =
              diff /
              (1000 *
                60 *
                60 *
                24);

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

              return days <= 7;
            }

            if (
              period ===
              "Monthly"
            ) {

              return days <= 30;
            }

            if (
              period ===
              "Yearly"
            ) {

              return days <= 365;
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

  const revenue =
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

  const totalCustomers =
    customers.length;

  const totalMedicines =
    medicines.length;

  const totalDebt =
    customers.reduce(
      (
        acc,
        customer
      ) =>

        acc +
        Number(
          customer.debt || 0
        ),

      0
    );

  const lowStock =
    medicines.filter(
      (medicine) =>

        Number(
          medicine.stock
        ) <=
        Number(
          medicine.minStock || 0
        )
    );

  /* =========================
     CHART DATA
  ========================= */

  const chartData =
    filteredSales.map(
      (sale) => ({
        name:
          sale.customer ||
          "Sale",

        sales:
          Number(
            sale.total || 0
          ),
      })
    );

  /* =========================
     RECENT SALES
  ========================= */

  const recentSales =
    [...sales]
      .sort(
        (a, b) =>
          b.createdAt -
          a.createdAt
      )
      .slice(0, 5);

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
          marginBottom:
            "28px",
        }}
      >

        <h1
          style={{
            margin: 0,

            fontSize:
              "36px",

            fontWeight:
              "700",

            color:
              dark
                ? "#ffffff"
                : "#111827",
          }}
        >
          Dashboard 📊
        </h1>

        <p
          style={{
            marginTop:
              "8px",

            color:
              dark
                ? "#94a3b8"
                : "#6b7280",

            fontSize:
              "15px",
          }}
        >
          Pharmacy system overview
        </p>
      </div>

      {/* FILTERS */}

      <div
        style={{
          display: "flex",

          gap: "12px",

          flexWrap:
            "wrap",

          marginBottom:
            "28px",
        }}
      >

        {[
          "Today",
          "Weekly",
          "Monthly",
          "Yearly",
          "All",
        ].map(
          (item) => (

            <button
              key={item}

              onClick={() =>
                setPeriod(
                  item
                )
              }

              style={{
                background:
                  period ===
                  item

                    ? "#16a34a"

                    : dark

                    ? "#111827"

                    : "#ffffff",

                color:
                  period ===
                  item

                    ? "#ffffff"

                    : dark

                    ? "#ffffff"

                    : "#111827",

                border:
                  dark

                    ? "1px solid #1e293b"

                    : "1px solid #d1d5db",

                padding:
                  "12px 20px",

                borderRadius:
                  "14px",

                cursor:
                  "pointer",

                fontWeight:
                  "700",

                fontSize:
                  "14px",
              }}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* CARDS */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(230px,1fr))",

          gap: "20px",

          marginBottom:
            "28px",
        }}
      >

        <Card
          title="Revenue"
          value={`$${revenue.toFixed(
            2
          )}`}
          color="#16a34a"
          dark={dark}
        />

        <Card
          title="Customers"
          value={
            totalCustomers
          }
          color="#2563eb"
          dark={dark}
        />

        <Card
          title="Medicines"
          value={
            totalMedicines
          }
          color="#f59e0b"
          dark={dark}
        />

        <Card
          title="Debt"
          value={`$${totalDebt.toFixed(
            2
          )}`}
          color="#dc2626"
          dark={dark}
        />
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "2fr 1fr",

          gap: "20px",

          marginBottom:
            "24px",
        }}
      >

        {/* CHART */}

        <div
          style={box(dark)}
        >

          <h2
            style={title(
              dark
            )}
          >
            Sales Performance
          </h2>

          {chartData.length ===
          0 ? (

            <Empty dark={dark} />

          ) : (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <AreaChart
                data={
                  chartData
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
                  dataKey="name"

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

                <Tooltip
                  contentStyle={{
                    background:
                      dark
                        ? "#111827"
                        : "#ffffff",

                    border:
                      dark
                        ? "1px solid #334155"
                        : "1px solid #e5e7eb",

                    borderRadius:
                      "12px",

                    color:
                      dark
                        ? "#ffffff"
                        : "#111827",
                  }}
                />

                <Area
                  type="monotone"

                  dataKey="sales"

                  stroke="#16a34a"

                  fill="#16a34a"

                  fillOpacity={
                    0.2
                  }

                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* LOW STOCK */}

        <div
          style={box(dark)}
        >

          <h2
            style={title(
              dark
            )}
          >
            Low Stock ⚠️
          </h2>

          {lowStock.length ===
          0 ? (

            <div
              style={{
                color:
                  dark
                    ? "#94a3b8"
                    : "#6b7280",
              }}
            >
              No low stock
            </div>

          ) : (

            lowStock.map(
              (
                medicine
              ) => (

                <div
                  key={
                    medicine.id
                  }

                  style={{
                    padding:
                      "14px",

                    borderRadius:
                      "14px",

                    background:
                      dark
                        ? "#7f1d1d"
                        : "#fee2e2",

                    marginBottom:
                      "12px",
                  }}
                >

                  <div
                    style={{
                      fontWeight:
                        "700",

                      color:
                        dark
                          ? "#ffffff"
                          : "#991b1b",
                    }}
                  >
                    {
                      medicine.name
                    }
                  </div>

                  <div
                    style={{
                      marginTop:
                        "5px",

                      color:
                        dark
                          ? "#fecaca"
                          : "#7f1d1d",
                    }}
                  >
                    Stock:
                    {" "}
                    {
                      medicine.stock
                    }
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* RECENT SALES */}

      <div
        style={box(dark)}
      >

        <h2
          style={title(
            dark
          )}
        >
          Recent Sales 🧾
        </h2>

        {recentSales.length ===
        0 ? (

          <Empty dark={dark} />

        ) : (

          <div
            style={{
              overflowX:
                "auto",
            }}
          >

            <table
              style={{
                width: "100%",

                minWidth:
                  "700px",

                borderCollapse:
                  "collapse",
              }}
            >

              <thead>

                <tr>

                  {[
                    "Customer",
                    "Amount",
                    "Method",
                    "Status",
                    "Date",
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

                {recentSales.map(
                  (
                    sale,
                    index
                  ) => (

                    <tr
                      key={
                        index
                      }

                      style={{
                        borderTop:
                          dark

                            ? "1px solid #1f2937"

                            : "1px solid #f3f4f6",
                      }}
                    >

                      <td
                        style={td(
                          dark
                        )}
                      >
                        {
                          sale.customer
                        }
                      </td>

                      <td
                        style={{
                          ...td(
                            dark
                          ),

                          color:
                            "#16a34a",

                          fontWeight:
                            "700",
                        }}
                      >
                        $
                        {
                          sale.total
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >
                        {
                          sale.method
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >

                        <span
                          style={{
                            background:
                              sale.status ===
                              "paid"

                                ? "#dcfce7"

                                : "#fee2e2",

                            color:
                              sale.status ===
                              "paid"

                                ? "#166534"

                                : "#dc2626",

                            padding:
                              "6px 12px",

                            borderRadius:
                              "999px",

                            fontSize:
                              "12px",

                            fontWeight:
                              "bold",

                            textTransform:
                              "capitalize",
                          }}
                        >
                          {
                            sale.status
                          }
                        </span>
                      </td>

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
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
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
  dark,
}) {

  return (
    <div
      style={{
        background:
          dark
            ? "#111827"
            : "#ffffff",

        border:
          dark
            ? "1px solid #1e293b"
            : "1px solid #e5e7eb",

        borderRadius:
          "22px",

        padding:
          "22px",

        borderTop:
          `5px solid ${color}`,

        boxShadow:
          dark
            ? "0 4px 20px rgba(0,0,0,0.25)"
            : "0 4px 18px rgba(0,0,0,0.05)",
      }}
    >

      <p
        style={{
          margin:
            "0 0 12px",

          color:
            dark
              ? "#94a3b8"
              : "#6b7280",

          fontWeight:
            "700",

          fontSize:
            "15px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: 0,

          color:
            dark
              ? "#ffffff"
              : "#111827",

          fontSize:
            "30px",

          fontWeight:
            "700",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

/* =========================
   EMPTY
========================= */

function Empty({
  dark,
}) {

  return (
    <div
      style={{
        height:
          "300px",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        color:
          dark
            ? "#94a3b8"
            : "#6b7280",
      }}
    >
      No data available
    </div>
  );
}

/* =========================
   STYLES
========================= */

const box = (
  dark
) => ({
  background:
    dark
      ? "#111827"
      : "#ffffff",

  border:
    dark
      ? "1px solid #1e293b"
      : "1px solid #e5e7eb",

  borderRadius:
    "24px",

  padding:
    "24px",

  boxShadow:
    dark
      ? "0 4px 20px rgba(0,0,0,0.3)"
      : "0 4px 18px rgba(0,0,0,0.05)",
});

const title = (
  dark
) => ({
  marginTop: 0,

  marginBottom:
    "22px",

  color:
    dark
      ? "#ffffff"
      : "#111827",
});

const th = (
  dark
) => ({
  textAlign:
    "left",

  padding:
    "16px",

  color:
    dark
      ? "#ffffff"
      : "#374151",

  background:
    dark
      ? "#0f172a"
      : "#f9fafb",
});

const td = (
  dark
) => ({
  padding:
    "16px",

  color:
    dark
      ? "#e5e7eb"
      : "#111827",
});

export default Dashboard;