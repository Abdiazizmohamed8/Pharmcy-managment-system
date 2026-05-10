import { useState } from "react";

function Inventory({
  medicines,
  toast,
}) {

  const [search,
    setSearch] =
    useState("");

  /* FILTER */
  const filteredMedicines =
    medicines.filter(
      (medicine) =>
        medicine.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* LOW STOCK */
  const lowStockCount =
    medicines.filter(
      (medicine) =>
        Number(
          medicine.stock
        ) <=
        Number(
          medicine.minStock ||
            5
        )
    ).length;

  return (
    <div>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom:
            "30px",
        }}
      >

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              color: "#111827",
            }}
          >
            Inventory 📦
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            Pharmacy stock management
          </p>
        </div>

        {/* LOW STOCK CARD */}
        <div
          style={{
            background:
              lowStockCount > 0
                ? "#dc2626"
                : "#16a34a",

            color: "#fff",

            padding:
              "18px 28px",

            borderRadius:
              "18px",

            fontWeight:
              "bold",

            fontSize:
              "18px",

            boxShadow:
              "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          Low Stock:
          {" "}
          {
            lowStockCount
          }
        </div>
      </div>

      {/* SEARCH */}
      <div
        style={{
          marginBottom:
            "24px",
        }}
      >
        <input
          type="text"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            width: "100%",
            maxWidth: "360px",
            padding:
              "14px",
            borderRadius:
              "14px",
            border:
              "1px solid #d1d5db",
            outline:
              "none",
            fontSize:
              "15px",
          }}
        />
      </div>

      {/* EMPTY */}
      {filteredMedicines.length ===
      0 ? (

        <div
          style={{
            background:
              "#fff",

            borderRadius:
              "24px",

            padding:
              "70px",

            textAlign:
              "center",

            color:
              "#9ca3af",

            fontSize:
              "18px",
          }}
        >
          No inventory available
        </div>

      ) : (

        /* TABLE */
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

          {/* HEADER */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "2fr 1fr 1fr 1fr 1fr 1fr",

              padding:
                "20px",

              background:
                "#f9fafb",

              fontWeight:
                "bold",

              color:
                "#111827",

              borderBottom:
                "1px solid #f3f4f6",
            }}
          >
            <div>
              Medicine
            </div>

            <div>
              Category
            </div>

            <div>
              Stock
            </div>

            <div>
              Min Stock
            </div>

            <div>
              Expiry
            </div>

            <div>
              Status
            </div>
          </div>

          {/* ROWS */}
          {filteredMedicines.map(
            (
              medicine
            ) => {

              const low =
                Number(
                  medicine.stock
                ) <=
                Number(
                  medicine.minStock ||
                    5
                );

              return (
                <div
                  key={
                    medicine.id
                  }
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "2fr 1fr 1fr 1fr 1fr 1fr",

                    padding:
                      "20px",

                    alignItems:
                      "center",

                    borderBottom:
                      "1px solid #f3f4f6",
                  }}
                >

                  {/* NAME */}
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color:
                          "#111827",
                        fontSize:
                          "18px",
                      }}
                    >
                      {
                        medicine.name
                      }
                    </h3>

                    <p
                      style={{
                        margin:
                          "6px 0 0",

                        color:
                          "#9ca3af",

                        fontSize:
                          "13px",
                      }}
                    >
                      Sell:
                      {" "}
                      $
                      {
                        medicine.sellPrice
                      }
                    </p>
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <span
                      style={{
                        background:
                          "#dcfce7",

                        color:
                          "#16a34a",

                        padding:
                          "7px 14px",

                        borderRadius:
                          "20px",

                        fontSize:
                          "13px",

                        fontWeight:
                          "bold",
                      }}
                    >
                      {
                        medicine.category
                      }
                    </span>
                  </div>

                  {/* STOCK */}
                  <div
                    style={{
                      fontWeight:
                        "bold",

                      color:
                        low
                          ? "#dc2626"
                          : "#16a34a",

                      fontSize:
                        "18px",
                    }}
                  >
                    {
                      medicine.stock
                    }
                  </div>

                  {/* MIN STOCK */}
                  <div
                    style={{
                      color:
                        "#6b7280",
                    }}
                  >
                    {
                      medicine.minStock
                    }
                  </div>

                  {/* EXPIRY */}
                  <div
                    style={{
                      color:
                        "#111827",
                    }}
                  >
                    {medicine.expiry ||
                      "N/A"}
                  </div>

                  {/* STATUS */}
                  <div>

                    {low ? (

                      <span
                        style={{
                          background:
                            "#fee2e2",

                          color:
                            "#dc2626",

                          padding:
                            "8px 14px",

                          borderRadius:
                            "20px",

                          fontSize:
                            "13px",

                          fontWeight:
                            "bold",
                        }}
                      >
                        Low Stock
                      </span>

                    ) : (

                      <span
                        style={{
                          background:
                            "#dcfce7",

                          color:
                            "#16a34a",

                          padding:
                            "8px 14px",

                          borderRadius:
                            "20px",

                          fontSize:
                            "13px",

                          fontWeight:
                            "bold",
                        }}
                      >
                        In Stock
                      </span>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default Inventory;