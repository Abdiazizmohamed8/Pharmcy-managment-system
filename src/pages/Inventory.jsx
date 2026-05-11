import {
  useState,
  useEffect,
} from "react";

import Toast from "../components/Toast";

function Inventory({
  medicines = [],
  darkMode = false,
}) {

  /* =========================
     STATE
  ========================= */

  const [search, setSearch] =
    useState("");

  const [
    toasts,
    setToasts,
  ] = useState([]);
  useEffect(() => {

  if (
    toasts.length > 0
  ) {

    const timer =
      setTimeout(() => {

        setToasts([]);

      }, 5000);

    return () =>
      clearTimeout(
        timer
      );
  }

}, [toasts]);

  /* =========================
     FILTER MEDICINES
  ========================= */

  const filteredMedicines =
    medicines.filter(
      (medicine) =>
        medicine.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* =========================
     LOW STOCK
  ========================= */

  const lowStockMedicines =
    medicines.filter(
      (medicine) =>
        Number(
          medicine.stock
        ) <=
        Number(
          medicine.minStock ||
            5
        )
    );

  const lowStockCount =
    lowStockMedicines.length;

  /* =========================
     EXPIRING
  ========================= */

  const expiringMedicines =
    medicines.filter(
      (medicine) => {

        const expiryDate =
          medicine.expiryDate ||
          medicine.expiry;

        if (!expiryDate)
          return false;

        const today =
          new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );

        const expiry =
          new Date(
            `${expiryDate}T00:00:00`
          );

        const diff =
          expiry - today;

        const days =
          Math.ceil(
            diff /
              (1000 *
                60 *
                60 *
                24)
          );

        return (
          days >= 0 &&
          days <= 60
        );
      }
    );

  const expiringSoon =
    expiringMedicines.length;

  /* =========================
     TOASTS
  ========================= */

  useEffect(() => {

    const items = [];

    if (
      lowStockCount > 0
    ) {
items.push({
  id: Date.now(),

        message:
          `${lowStockCount} medicines low stock`,

        type:
          "error",
      });
    }

    if (
      expiringSoon > 0
    ) {

    items.push({
  id: Date.now() + 1,

        message:
          `${expiringSoon} medicines expiring soon`,

        type:
          "warning",
      });
    }

    setToasts(
      items
    );

  }, [
    lowStockCount,
    expiringSoon,
  ]);

  return (

    <>

      {/* TOASTS */}

      {toasts.map(
        (
          toast,
          index
        ) => (

          <div
            key={
              toast.id
            }

            style={{
              position:
                "fixed",

            top:
  `${20 + index * 120}px`,
              right:
                "20px",

              zIndex:
                9999,
            }}
          >

            <Toast
              message={
                toast.message
              }

              type={
                toast.type
              }
            />

          </div>
        )
      )}

      <div
        style={{
          width: "100%",

          minHeight:
            "100vh",

          background:
            darkMode
              ? "#020617"
              : "#f3f4f6",

          color:
            darkMode
              ? "#ffffff"
              : "#111827",

          padding:
            "24px",

          transition:
            "0.3s ease",

          boxSizing:
            "border-box",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            flexWrap:
              "wrap",

            gap: "20px",

            marginBottom:
              "30px",
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,

                fontSize:
                  "38px",

                color:
                  darkMode
                    ? "#ffffff"
                    : "#111827",
              }}
            >
              Inventory 📦
            </h1>

            <p
              style={{
                marginTop:
                  "8px",

                color:
                  darkMode
                    ? "#94a3b8"
                    : "#6b7280",
              }}
            >
              Manage pharmacy stock
            </p>

          </div>

          {/* CARDS */}

          <div
            style={{
              display:
                "flex",

              gap: "16px",

              flexWrap:
                "wrap",
            }}
          >

            {/* LOW STOCK */}

            <div
              style={{
                background:
                  darkMode
                    ? "#7f1d1d"
                    : "#dc2626",

                color:
                  "#ffffff",

                padding:
                  "18px 24px",

                borderRadius:
                  "22px",

                minWidth:
                  "180px",
              }}
            >

              <div
                style={{
                  fontSize:
                    "14px",

                  marginBottom:
                    "8px",
                }}
              >
                🔴 Low Stock
              </div>

              <div
                style={{
                  fontSize:
                    "34px",

                  fontWeight:
                    "bold",
                }}
              >
                {
                  lowStockCount
                }
              </div>

            </div>

            {/* EXPIRING */}

            <div
              style={{
                background:
                  darkMode
                    ? "#92400e"
                    : "#f59e0b",

                color:
                  "#ffffff",

                padding:
                  "18px 24px",

                borderRadius:
                  "22px",

                minWidth:
                  "180px",
              }}
            >

              <div
                style={{
                  fontSize:
                    "14px",

                  marginBottom:
                    "8px",
                }}
              >
                ⏰ Expiring Soon
              </div>

              <div
                style={{
                  fontSize:
                    "34px",

                  fontWeight:
                    "bold",
                }}
              >
                {
                  expiringSoon
                }
              </div>

            </div>

          </div>

        </div>

        {/* SEARCH */}

        <input
          type="text"

          placeholder="Search medicine..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          style={{
            width: "100%",

            maxWidth:
              "420px",

            padding:
              "16px 18px",

            borderRadius:
              "18px",

            border:
              darkMode
                ? "1px solid #334155"
                : "1px solid #d1d5db",

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            color:
              darkMode
                ? "#ffffff"
                : "#111827",

            outline:
              "none",

            fontSize:
              "15px",

            marginBottom:
              "24px",
          }}
        />

        {/* EMPTY */}

        {filteredMedicines.length ===
        0 ? (

          <div
            style={{
              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",

              borderRadius:
                "28px",

              padding:
                "90px 20px",

              textAlign:
                "center",

              color:
                darkMode
                  ? "#94a3b8"
                  : "#9ca3af",

              fontSize:
                "20px",
            }}
          >
            No inventory available
          </div>

        ) : (

          <div
            style={{
              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",

              borderRadius:
                "30px",

              overflowX:
                "auto",
            }}
          >

            {/* TABLE HEADER */}

            <div
              style={{
                minWidth:
                  "1100px",

                display:
                  "grid",

                gridTemplateColumns:
                  "2fr 1fr 1fr 1fr 1fr 1fr",

                padding:
                  "24px 28px",

                background:
                  darkMode
                    ? "#0f172a"
                    : "#f9fafb",

                fontWeight:
                  "bold",
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

                const expiryDate =
                  medicine.expiryDate ||
                  medicine.expiry;

                const expiring =
                  expiryDate

                    ? (() => {

                        const today =
                          new Date();

                        today.setHours(
                          0,
                          0,
                          0,
                          0
                        );

                        const expiry =
                          new Date(
                            `${expiryDate}T00:00:00`
                          );

                        const diff =
                          expiry - today;

                        const days =
                          Math.ceil(
                            diff /
                              (1000 *
                                60 *
                                60 *
                                24)
                          );

                        return (
                          days >= 0 &&
                          days <= 60
                        );

                      })()

                    : false;

                return (

                  <div
                    key={
                      medicine.id
                    }

                    style={{
                      minWidth:
                        "1100px",

                      display:
                        "grid",

                      gridTemplateColumns:
                        "2fr 1fr 1fr 1fr 1fr 1fr",

                      alignItems:
                        "center",

                      padding:
                        "24px 28px",

                      borderTop:
                        darkMode
                          ? "1px solid #1f2937"
                          : "1px solid #e5e7eb",
                    }}
                  >

                    {/* NAME */}

                    <div>

                      <h3
                        style={{
                          margin:
                            "0 0 8px",

                          fontSize:
                            "20px",
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
                            darkMode
                              ? "#94a3b8"
                              : "#9ca3af",
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
                            darkMode
                              ? "#14532d"
                              : "#dcfce7",

                          color:
                            "#16a34a",

                          padding:
                            "8px 16px",

                          borderRadius:
                            "999px",

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
                        fontSize:
                          "26px",

                        fontWeight:
                          "bold",

                        color:
                          low
                            ? "#dc2626"
                            : "#16a34a",
                      }}
                    >
                      {
                        medicine.stock
                      }
                    </div>

                    {/* MIN STOCK */}

                    <div>
                      {
                        medicine.minStock
                      }
                    </div>

                    {/* EXPIRY */}

                    <div
                      style={{
                        color:
                          expiring
                            ? "#f59e0b"
                            : darkMode
                            ? "#ffffff"
                            : "#111827",

                        fontWeight:
                          "600",
                      }}
                    >
                      {expiryDate ||
                        "N/A"}
                    </div>

                    {/* STATUS */}

                    <div>

                      {low ? (

                        <Badge
                          bg={
                            darkMode
                              ? "#7f1d1d"
                              : "#fee2e2"
                          }

                          color="#dc2626"

                          text="Low Stock"
                        />

                      ) : expiring ? (

                        <Badge
                          bg={
                            darkMode
                              ? "#78350f"
                              : "#fef3c7"
                          }

                          color="#f59e0b"

                          text="Expiring soon"
                        />

                      ) : (

                        <Badge
                          bg={
                            darkMode
                              ? "#14532d"
                              : "#dcfce7"
                          }

                          color="#16a34a"

                          text="In Stock"
                        />

                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </>
  );
}

/* =========================
   BADGE
========================= */

function Badge({
  bg,
  color,
  text,
}) {

  return (

    <span
      style={{
        background:
          bg,

        color:
          color,

        padding:
          "10px 16px",

        borderRadius:
          "999px",

        fontSize:
          "13px",

        fontWeight:
          "bold",
      }}
    >
      {text}
    </span>
  );
}

export default Inventory;