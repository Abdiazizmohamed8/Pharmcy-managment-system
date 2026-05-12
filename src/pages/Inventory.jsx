import {
  useState,
  useEffect,
} from "react";

function Inventory({
  medicines = [],
  darkMode = false,
  toast,
}) {

  /* =========================
        SEARCH
  ========================= */

  const [
    search,
    setSearch,
  ] = useState("");

  /* =========================
        FILTERED
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
        LOW STOCK COUNT
  ========================= */

  const lowStockCount =
    medicines.filter(
      (medicine) =>

        Number(
          medicine.stock
        ) <=

        Number(
          medicine.minStock || 5
        )
    ).length;

  /* =========================
        EXPIRING COUNT
  ========================= */

  const expiringSoon =
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
    ).length;

  /* =========================
        ALERT TOASTS
  ========================= */

  useEffect(() => {

    if (
      lowStockCount > 0
    ) {

      toast(
        `${lowStockCount} medicines low stock`,
        "error"
      );
    }

    const timer =
      setTimeout(() => {

        if (
          expiringSoon > 0
        ) {

          toast(
            `${expiringSoon} medicines expiring soon`,
            "warning"
          );
        }

      }, 3500);

    return () =>
      clearTimeout(timer);

  }, [
    lowStockCount,
    expiringSoon,
  ]);

  return (

    <div
      style={{
        ...styles.container,

        background:
          darkMode
            ? "#020617"
            : "#f3f4f6",

        color:
          darkMode
            ? "#ffffff"
            : "#111827",
      }}
    >

      {/* HEADER */}

      <div style={styles.header}>

        <div>

          <h1
            style={{
              ...styles.title,

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
              ...styles.subtitle,

              color:
                darkMode
                  ? "#94a3b8"
                  : "#6b7280",
            }}
          >
            Manage pharmacy stock
          </p>

        </div>

        {/* ALERT CARDS */}

        <div style={styles.cardsWrapper}>

          <div
            style={{
              ...styles.alertCard,

              background:
                darkMode
                  ? "#7f1d1d"
                  : "#dc2626",
            }}
          >

            <div style={styles.alertLabel}>
              🔴 Low Stock
            </div>

            <div style={styles.alertNumber}>
              {lowStockCount}
            </div>

          </div>

          <div
            style={{
              ...styles.alertCard,

              background:
                darkMode
                  ? "#92400e"
                  : "#f59e0b",
            }}
          >

            <div style={styles.alertLabel}>
              ⏰ Expiring Soon
            </div>

            <div style={styles.alertNumber}>
              {expiringSoon}
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
          ...styles.searchInput,

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
        }}
      />

      {/* EMPTY */}

      {filteredMedicines.length === 0 ? (

        <div
          style={{
            ...styles.emptyBox,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            color:
              darkMode
                ? "#94a3b8"
                : "#9ca3af",
          }}
        >
          No inventory available
        </div>

      ) : (

        <div
          style={{
            ...styles.tableWrapper,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",
          }}
        >

          {/* TABLE HEADER */}

          <div
            style={{
              ...styles.tableHeader,

              background:
                darkMode
                  ? "#0f172a"
                  : "#f9fafb",
            }}
          >

            <div>Medicine</div>

            <div>Category</div>

            <div>Stock</div>

            <div>Min Stock</div>

            <div>Expiry</div>

            <div>Status</div>

          </div>

          {/* ROWS */}

          {filteredMedicines.map(
            (medicine) => {

              const low =
                Number(
                  medicine.stock
                ) <=

                Number(
                  medicine.minStock || 5
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
                  key={medicine.id}

                  style={{
                    ...styles.row,

                    borderTop:
                      darkMode
                        ? "1px solid #1f2937"
                        : "1px solid #e5e7eb",
                  }}
                >

                  {/* NAME */}

                  <div>

                    <h3 style={styles.medicineName}>
                      {medicine.name}
                    </h3>

                    <p
                      style={{
                        ...styles.price,

                        color:
                          darkMode
                            ? "#94a3b8"
                            : "#9ca3af",
                      }}
                    >
                      Sell: $
                      {medicine.sellPrice}
                    </p>

                  </div>

                  {/* CATEGORY */}

                  <div>

                    <span
                      style={{
                        ...styles.categoryBadge,

                        background:
                          darkMode
                            ? "#14532d"
                            : "#dcfce7",
                      }}
                    >
                      {medicine.category}
                    </span>

                  </div>

                  {/* STOCK */}

                  <div
                    style={{
                      ...styles.stockText,

                      color:
                        low
                          ? "#dc2626"
                          : "#16a34a",
                    }}
                  >
                    {medicine.stock}
                  </div>

                  {/* MIN STOCK */}

                  <div>
                    {medicine.minStock}
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
                    {expiryDate || "N/A"}
                  </div>

                  {/* STATUS */}

                  <div>

                    <Badge
                      bg={
                        low
                          ? darkMode
                            ? "#7f1d1d"
                            : "#fee2e2"

                          : expiring
                          ? darkMode
                            ? "#78350f"
                            : "#fef3c7"

                          : darkMode
                          ? "#14532d"
                          : "#dcfce7"
                      }

                      color={
                        low
                          ? "#dc2626"

                          : expiring
                          ? "#f59e0b"

                          : "#16a34a"
                      }

                      text={
                        low
                          ? "Low Stock"

                          : expiring
                          ? "Expiring Soon"

                          : "In Stock"
                      }
                    />

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
        background: bg,

        color: color,

        padding: "10px 16px",

        borderRadius: "999px",

        fontSize: "13px",

        fontWeight: "bold",

        whiteSpace: "normal",

        wordBreak: "break-word",

        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
}

/* =========================
      STYLES
========================= */

const styles = {

  container: {
    width: "100%",

    minHeight: "100vh",

    padding: "24px",

    boxSizing:
      "border-box",

    overflowX:
      "hidden",
  },

  header: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    flexWrap: "wrap",

    gap: "20px",

    marginBottom: "30px",
  },

  title: {
    margin: 0,

    fontSize:
      "clamp(30px,6vw,38px)",
  },

  subtitle: {
    marginTop: "8px",

    fontSize: "15px",
  },

  cardsWrapper: {
    display: "flex",

    gap: "16px",

    flexWrap: "wrap",

    width: "100%",

    maxWidth: "500px",
  },

  alertCard: {
    color: "#ffffff",

    padding: "18px 24px",

    borderRadius: "22px",

    minWidth: "220px",

    flex: 1,

    boxSizing: "border-box",
  },

  alertLabel: {
    fontSize: "14px",

    marginBottom: "8px",
  },

  alertNumber: {
    fontSize:
      "clamp(28px,5vw,34px)",

    fontWeight: "bold",
  },

  searchInput: {
    width: "100%",

    maxWidth: "420px",

    padding: "16px 18px",

    borderRadius: "18px",

    outline: "none",

    fontSize: "15px",

    marginBottom: "24px",

    boxSizing: "border-box",
  },

  emptyBox: {
    borderRadius: "28px",

    padding: "90px 20px",

    textAlign: "center",

    fontSize: "20px",
  },

  tableWrapper: {
    borderRadius: "30px",

    overflowX: "auto",

    width: "100%",
  },

  tableHeader: {
    display: "grid",

    gridTemplateColumns:
      "repeat(6,minmax(140px,1fr))",

    padding: "20px",

    fontWeight: "bold",

    gap: "14px",

    minWidth: "850px",
  },

  row: {
    display: "grid",

    gridTemplateColumns:
      "repeat(6,minmax(140px,1fr))",

    alignItems: "center",

    padding: "20px",

    gap: "14px",

    minWidth: "850px",
  },

  medicineName: {
    margin: "0 0 8px",

    fontSize: "20px",
  },

  price: {
    margin: 0,
  },

  categoryBadge: {
    color: "#16a34a",

    padding: "8px 16px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "bold",

    display: "inline-block",
  },

  stockText: {
    fontSize: "26px",

    fontWeight: "bold",
  },
};

export default Inventory;