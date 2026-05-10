import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Reports({
  sales,
  expenses,
}) {

  /* TODAY */
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  /* DAILY SALES */
  const dailySales =
    sales
      .filter(
        (sale) =>
          sale.date ===
          today
      )
      .reduce(
        (acc, sale) =>
          acc +
          Number(
            sale.total || 0
          ),
        0
      );

  /* WEEKLY SALES */
  const weeklySales =
    sales.reduce(
      (acc, sale) =>
        acc +
        Number(
          sale.total || 0
        ),
      0
    );

  /* MONTHLY PROFIT */
  const monthlyProfit =
    sales.reduce(
      (acc, sale) => {

        const saleProfit =
          sale.items?.reduce(
            (
              itemAcc,
              item
            ) =>

              itemAcc +

              (
                item.sellPrice -
                item.buyPrice
              ) * item.qty,

            0
          ) || 0;

        return (
          acc +
          saleProfit
        );
      },

      0
    );

  /* YEARLY PROFIT */
  const yearlyProfit =
    monthlyProfit;

  /* EXPENSES */
  const totalExpenses =
    expenses.reduce(
      (
        acc,
        expense
      ) =>

        acc +
        Number(
          expense.amount ||
            0
        ),

      0
    );

  /* LOSS */
  const totalLoss =
    totalExpenses;

  /* NET PROFIT */
  const netProfit =
    monthlyProfit -
    totalLoss;

  /* CHART DATA */
  const salesChart =
    sales.map((sale) => ({
      customer:
        sale.customer,

      total:
        sale.total,
    }));

  /* PAYMENT STATUS */
  const paymentData = [
    {
      name: "Paid",
      value:
        sales.filter(
          (sale) =>
            sale.status ===
            "Paid"
        ).length,
    },

    {
      name: "Partial",
      value:
        sales.filter(
          (sale) =>
            sale.status ===
            "Partial"
        ).length,
    },

    {
      name: "Unpaid",
      value:
        sales.filter(
          (sale) =>
            sale.status ===
            "Unpaid"
        ).length,
    },
  ];

  const COLORS = [
    "#16a34a",
    "#f59e0b",
    "#dc2626",
  ];

  return (
    <div>

      {/* HEADER */}
      <div
        style={{
          marginBottom:
            "30px",
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: "42px",
          }}
        >
          Reports 📈
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "8px",
          }}
        >
          Business analytics
          and pharmacy reports
        </p>
      </div>

      {/* CARDS */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",

          gap: "22px",

          marginBottom:
            "30px",
        }}
      >

        <Card
          title="Daily Sales"
          value={`$${dailySales.toFixed(
            2
          )}`}
          icon="📅"
          color="#16a34a"
        />

        <Card
          title="Weekly Sales"
          value={`$${weeklySales.toFixed(
            2
          )}`}
          icon="🗓️"
          color="#2563eb"
        />

        <Card
          title="Monthly Profit"
          value={`$${monthlyProfit.toFixed(
            2
          )}`}
          icon="💰"
          color="#16a34a"
        />

        <Card
          title="Yearly Profit"
          value={`$${yearlyProfit.toFixed(
            2
          )}`}
          icon="🏆"
          color="#9333ea"
        />

        <Card
          title="Loss"
          value={`$${totalLoss.toFixed(
            2
          )}`}
          icon="📉"
          color="#dc2626"
        />

        <Card
          title="Expenses"
          value={`$${totalExpenses.toFixed(
            2
          )}`}
          icon="💸"
          color="#f59e0b"
        />

        <Card
          title="Net Profit"
          value={`$${netProfit.toFixed(
            2
          )}`}
          icon="📊"
          color="#14b8a6"
        />
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

        {/* SALES CHART */}
        <div
          style={{
            background:
              "#fff",

            borderRadius:
              "24px",

            padding:
              "24px",

            boxShadow:
              "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
            }}
          >
            Sales Overview
          </h2>

          {sales.length ===
          0 ? (

            <div
              style={{
                height:
                  "320px",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                color:
                  "#9ca3af",

                fontSize:
                  "22px",
              }}
            >
              No sales data
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={
                  salesChart
                }
              >

                <XAxis dataKey="customer" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="total"
                  fill="#16a34a"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PIE */}
        <div
          style={{
            background:
              "#fff",

            borderRadius:
              "24px",

            padding:
              "24px",

            boxShadow:
              "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              marginBottom:
                "20px",
            }}
          >
            Payment Status
          </h2>

          {sales.length ===
          0 ? (

            <div
              style={{
                height:
                  "320px",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                color:
                  "#9ca3af",
              }}
            >
              No report data
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={
                    paymentData
                  }
                  dataKey="value"
                  outerRadius={
                    110
                  }
                  label
                >

                  {paymentData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* SALES TABLE */}
      <div
        style={{
          background:
            "#fff",

          borderRadius:
            "24px",

          padding:
            "24px",

          boxShadow:
            "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >

        <h2
          style={{
            marginTop: 0,
            marginBottom:
              "20px",
          }}
        >
          Sales Analytics
        </h2>

        {sales.length ===
        0 ? (

          <div
            style={{
              color:
                "#9ca3af",
            }}
          >
            No sales found
          </div>

        ) : (

          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >

            <thead>
              <tr
                style={{
                  background:
                    "#f9fafb",
                }}
              >

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
                  Medicines
                </th>

                <th style={th}>
                  Qty
                </th>

                <th style={th}>
                  Buy Price
                </th>

                <th style={th}>
                  Sell Price
                </th>

                <th style={th}>
                  Total
                </th>

                <th style={th}>
                  Profit
                </th>

                <th style={th}>
                  Payment
                </th>

                <th style={th}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>

              {sales.map(
                (sale) => {

                  const totalQty =
                    sale.items?.reduce(
                      (
                        acc,
                        item
                      ) =>

                        acc +
                        item.qty,

                      0
                    );

                  const totalBuy =
                    sale.items?.reduce(
                      (
                        acc,
                        item
                      ) =>

                        acc +
                        item.buyPrice,

                      0
                    );

                  const totalSell =
                    sale.items?.reduce(
                      (
                        acc,
                        item
                      ) =>

                        acc +
                        item.sellPrice,

                      0
                    );

                  const profit =
                    sale.items?.reduce(
                      (
                        acc,
                        item
                      ) =>

                        acc +

                        (
                          item.sellPrice -
                          item.buyPrice
                        ) *
                          item.qty,

                      0
                    );

                  return (
                    <tr
                      key={
                        sale.id
                      }
                      style={{
                        borderBottom:
                          "1px solid #f3f4f6",
                      }}
                    >

                      <td
                        style={{
                          ...td,

                          color:
                            "#2563eb",

                          fontWeight:
                            "bold",
                        }}
                      >
                        {
                          sale.id
                        }
                      </td>

                      <td style={td}>
                        {
                          sale.date
                        }
                      </td>

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

                      <td style={td}>
                        {sale.items
                          ?.map(
                            (
                              item
                            ) =>
                              item.name
                          )
                          .join(
                            ", "
                          )}
                      </td>

                      <td style={td}>
                        {
                          totalQty
                        }
                      </td>

                      <td style={td}>
                        $
                        {Number(
                          totalBuy
                        ).toFixed(
                          2
                        )}
                      </td>

                      <td style={td}>
                        $
                        {Number(
                          totalSell
                        ).toFixed(
                          2
                        )}
                      </td>

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

                      <td
                        style={{
                          ...td,

                          color:
                            "#14b8a6",

                          fontWeight:
                            "bold",
                        }}
                      >
                        $
                        {Number(
                          profit
                        ).toFixed(
                          2
                        )}
                      </td>

                      <td style={td}>
                        {
                          sale.method
                        }
                      </td>

                      <td
                        style={{
                          ...td,

                          color:
                            sale.status ===
                            "Paid"

                              ? "#16a34a"

                              : sale.status ===
                                  "Partial"

                                ? "#f59e0b"

                                : "#dc2626",

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
        )}
      </div>
    </div>
  );
}

/* CARD */
function Card({
  title,
  value,
  icon,
  color,
}) {

  return (
    <div
      style={{
        background:
          "#fff",

        borderRadius:
          "24px",

        padding:
          "24px",

        display: "flex",

        justifyContent:
          "space-between",

        alignItems:
          "center",

        boxShadow:
          "0 8px 24px rgba(0,0,0,0.05)",
      }}
    >

      <div>

        <p
          style={{
            color:
              "#6b7280",

            marginBottom:
              "10px",
          }}
        >
          {title}
        </p>

        <h2
          style={{
            margin: 0,
          }}
        >
          {value}
        </h2>
      </div>

      <div
        style={{
          width: "64px",
          height: "64px",

          borderRadius:
            "20px",

          background:
            color + "20",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          fontSize:
            "30px",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

/* TABLE */
const th = {
  padding: "16px",
  textAlign: "left",
};

const td = {
  padding: "16px",
};

export default Reports;