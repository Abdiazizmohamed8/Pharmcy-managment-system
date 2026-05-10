import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { fmt } from "../utils/helpers";

function Dashboard({
  medicines,
  customers,
  sales,
}) {

  /* TOTAL REVENUE */
  const revenue =
    sales
      .filter(
        (sale) =>
          sale.status ===
          "Paid"
      )
      .reduce(
        (acc, sale) =>
          acc +
          Number(
            sale.total
          ),
        0
      );

  /* TOTAL DEBT */
  const totalDebt =
    customers.reduce(
      (acc, customer) =>

        acc +
        Number(
          customer.debt ||
            0
        ),

      0
    );

  /* LOW STOCK */
  const lowStock =
    medicines.filter(
      (medicine) =>
        Number(
          medicine.stock
        ) <= 10
    ).length;

  /* CHART */
  const salesData =
    sales.map((sale) => ({
      customer:
        sale.customer,

      total:
        sale.total,
    }));

  /* RECENT SALES */
  const recentSales =
    sales.slice(0, 5);

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
            fontSize: "40px",
          }}
        >
          Dashboard 📊
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "10px",
          }}
        >
          Welcome to ANFAC
          Pharmacy System
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
            "28px",
        }}
      >

        <Card
          title="Revenue"
          value={fmt(
            revenue
          )}
          icon="💰"
          color="#16a34a"
        />

        <Card
          title="Customers"
          value={
            customers.length
          }
          icon="👥"
          color="#2563eb"
        />

        <Card
          title="Low Stock"
          value={lowStock}
          icon="⚠️"
          color="#d97706"
        />

        <Card
          title="Debt"
          value={fmt(
            totalDebt
          )}
          icon="💳"
          color="#dc2626"
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "2fr 1fr",

          gap: "24px",

          marginBottom:
            "28px",
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
                  salesData
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

        {/* MEDICINES */}
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
            Medicines
          </h2>

          {medicines.length ===
          0 ? (

            <div
              style={{
                color:
                  "#9ca3af",
              }}
            >
              No medicines found
            </div>

          ) : (

            medicines
              .slice(0, 5)
              .map(
                (
                  medicine
                ) => (

                  <div
                    key={
                      medicine.id
                    }
                    style={{
                      border:
                        "1px solid #f3f4f6",

                      borderRadius:
                        "18px",

                      padding:
                        "16px",

                      marginBottom:
                        "14px",

                      background:
                        "#fafafa",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "center",
                      }}
                    >

                      <div>

                        <h3
                          style={{
                            margin:
                              "0 0 8px",
                          }}
                        >
                          {
                            medicine.name
                          }
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            color:
                              "#6b7280",
                          }}
                        >
                          {
                            medicine.category
                          }
                        </p>
                      </div>

                      <div
                        style={{
                          background:
                            Number(
                              medicine.stock
                            ) <=
                            10

                              ? "#fee2e2"

                              : "#dcfce7",

                          color:
                            Number(
                              medicine.stock
                            ) <=
                            10

                              ? "#dc2626"

                              : "#16a34a",

                          padding:
                            "8px 14px",

                          borderRadius:
                            "14px",

                          fontWeight:
                            "bold",
                        }}
                      >
                        {
                          medicine.stock
                        }
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop:
                          "12px",

                        display:
                          "flex",

                        justifyContent:
                          "space-between",
                      }}
                    >

                      <span
                        style={{
                          color:
                            "#16a34a",

                          fontWeight:
                            "bold",
                        }}
                      >
                        Buy:
                        {" "}
                        $
                        {
                          medicine.buyPrice
                        }
                      </span>

                      <span
                        style={{
                          color:
                            "#2563eb",

                          fontWeight:
                            "bold",
                        }}
                      >
                        Sell:
                        {" "}
                        $
                        {
                          medicine.sellPrice
                        }
                      </span>
                    </div>
                  </div>
                )
              )
          )}
        </div>
      </div>

      {/* RECENT SALES */}
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
          Recent Sales
        </h2>

        {recentSales.length ===
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
                  Customer
                </th>

                <th style={th}>
                  Amount
                </th>

                <th style={th}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>

              {recentSales.map(
                (sale) => (

                  <tr
                    key={
                      sale.id
                    }
                    style={{
                      borderBottom:
                        "1px solid #f3f4f6",
                    }}
                  >

                    <td style={td}>
                      {
                        sale.id
                      }
                    </td>

                    <td style={td}>
                      {
                        sale.customer
                      }
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
                      {fmt(
                        sale.total
                      )}
                    </td>

                    <td
                      style={{
                        ...td,

                        color:
                          sale.status ===
                          "Paid"

                            ? "#16a34a"

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
                )
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
  textAlign: "left",
  padding: "16px",
};

const td = {
  padding: "16px",
};

export default Dashboard;